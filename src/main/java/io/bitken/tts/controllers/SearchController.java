package io.bitken.tts.controllers;

import io.bitken.tts.model.entity.PaperData;
import io.bitken.tts.repo.PaperDataRepo;
import io.bitken.tts.view.PaperInfo;
import io.bitken.tts.view.PaperListResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.math.BigInteger;
import java.util.*;

@RestController
public class SearchController {
    private static final Logger LOG = LoggerFactory.getLogger(SearchController.class);

    private static final int MAX_PAGE_SIZE = 100;

    @Autowired
    PaperDataRepo pdRepo;

    @GetMapping(path = "/api/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map papers(@RequestParam(defaultValue = "0") int from,
                      @RequestParam(defaultValue = "10") int count,
                      @RequestParam(name="q") String queryOrig) {

        PaperListResponse resp = new PaperListResponse();

        if (!isValid(from, count)) {
            return Collections.singletonMap("paperData", resp);
        }

        if (queryOrig == null || queryOrig.isEmpty() || queryOrig.isBlank()) {
            return Collections.singletonMap("paperData", resp);
        }

        String query = preprocess(queryOrig);

        List<PaperData> papers = pdRepo.searchPapers(query, count, from);

        List<PaperInfo> pInfos = convertToPInfos(papers);

        fillResponseObject(resp, from, count, query, pInfos);

        return Collections.singletonMap("paperData", resp);
    }

    private String preprocess(String queryOrig) {
        if (queryOrig.startsWith("\"") && queryOrig.endsWith("\"")) {
            return "'" + queryOrig.substring(1, queryOrig.length()-1) + "'";
        }

        return queryOrig.replaceAll("\\s+", "<->");
    }

    private List<PaperInfo> convertToPInfos(List<PaperData> papers) {
        List<PaperInfo> pInfos = new ArrayList<>();

        for (PaperData paper : papers) {
            PaperInfo pi = PaperInfo.from(paper);
            pInfos.add(pi);
        }

        return pInfos;
    }

    private void fillResponseObject(PaperListResponse resp, int from, int count,
                                    String query, List<PaperInfo> pInfos) {
        resp.addPaperInfos(pInfos);
        resp.setTotal(getTotalCount(query));
        resp.setFrom(from);
        resp.setCount(count);
    }

    private int getTotalCount(String query) {
        BigInteger dbCount = (BigInteger) pdRepo.searchPapersCount(query).get(0)[0];
        return dbCount.intValue();
    }

    private boolean isValid(int from, int count) {
        if (from < 0 || count <= 0 || count > MAX_PAGE_SIZE) {
            return false;
        }

        return true;
    }
}
