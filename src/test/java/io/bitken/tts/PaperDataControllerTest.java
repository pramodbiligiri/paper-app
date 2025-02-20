package io.bitken.tts;

import io.bitken.tts.controllers.PaperDataController;
import io.bitken.tts.main.AppTtsApplication;
import io.bitken.tts.model.entity.PaperAudio;
import io.bitken.tts.model.entity.PaperCategory;
import io.bitken.tts.model.entity.PaperData;
import io.bitken.tts.model.entity.converter.BlobStorageHandler;
import io.bitken.tts.repo.PaperAudioRepo;
import io.bitken.tts.repo.PaperDataRepo;
import io.bitken.tts.view.PaperInfo;
import io.bitken.tts.view.PaperListResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@Transactional
@SpringBootTest(classes = {AppTtsApplication.class})
public class PaperDataControllerTest {

    private static final Logger LOG = LoggerFactory.getLogger(PaperDataControllerTest.class);

    private static final byte[] BYTES = {65, 66, 67, 68};

    @Autowired
    PaperDataController pdc;

    @Autowired
    PaperDataRepo paperDataRepo;

    @Autowired
    PaperAudioRepo paperAudioRepo;

    @Autowired
    BlobStorageHandler storageHandler;

    @Autowired
    MockHttpSession sessionMock;

    @AfterEach
    public void afterEach() {
        paperAudioRepo.deleteAll();
        paperDataRepo.deleteAll();
    }

    @Test
    public void emptyTest() throws IOException {
        Map map = pdc.papers(0, 2, "cs.AI", sessionMock);
        assertEquals(1, map.size());
        PaperListResponse resp = (PaperListResponse) map.get("paperData");

        assertEquals(0, resp.getTotal());
        assertEquals(0, resp.getFrom());
        assertEquals(2, resp.getCount());
        assertEquals(0, resp.getPInfos().size());
    }

    @Test
    public void paperDataGetTest() throws IOException {
        List<PaperInfo> expectedPInfos = initTest1();

        Map map = pdc.papers(0, 2, "cs.AI", sessionMock);
        assertEquals(1, map.size());

        PaperListResponse resp = (PaperListResponse) map.get("paperData");
        assertEquals(3, resp.getTotal());
        assertEquals(0, resp.getFrom());
        assertEquals(2, resp.getCount());

        List<PaperInfo> actualPInfos = resp.getPInfos();
        assertEquals(2, actualPInfos.size());

        PaperInfo p1 = actualPInfos.get(0);
        PaperInfo p2 = actualPInfos.get(1);

        assertEquals(expectedPInfos.get(2), p1);
        assertEquals(expectedPInfos.get(1), p2);

        map = pdc.papers(2, 1, "cs.AI", sessionMock);
        assertEquals(1, map.size());

        resp = (PaperListResponse) map.get("paperData");
        assertEquals(3, resp.getTotal());
        assertEquals(2, resp.getFrom());
        assertEquals(1, resp.getCount());

        actualPInfos = resp.getPInfos();
        assertEquals(1, actualPInfos.size());

        p1 = actualPInfos.get(0);
        assertEquals(expectedPInfos.get(0), p1);
    }

    private List<PaperInfo> initTest1() throws IOException {
        // First PaperData
        PaperData pd1 = new PaperData();
        pd1.setTitle("Paper 1");
        pd1.setLink("http://paper-link-2.com");
        pd1.setArxivId("arxiv-id-1");
        pd1.setAuthors("author-1.1, author-1.2");
        pd1.setAbstractt("This is the abstract 1");
        pd1.setPubDate(new Timestamp(new Date().getTime()));
        pd1.addCategory(new PaperCategory().setCategory("cs.AI"));

        pd1 = paperDataRepo.save(pd1);

        PaperAudio pa1 = new PaperAudio();
        pa1.setPaper(pd1);
        pa1.setAudio(storageHandler.newFile(BYTES));
        pa1 = paperAudioRepo.save(pa1);
        pd1.setAudio(pa1);

        // Second PaperData
        PaperData pd2 = new PaperData();
        pd2.setTitle("Paper 2");
        pd2.setLink("http://paper-link-2.com");
        pd2.setArxivId("arxiv-id-2");
        pd2.setAuthors("author-2.1, author-2.2");
        pd2.setAbstractt("This is the abstract 2");
        pd2.setPubDate(new Timestamp(new Date().getTime()));
        pd2.addCategory(new PaperCategory().setCategory("cs.AI"));

        pd2 = paperDataRepo.save(pd2);

        PaperAudio pa2 = new PaperAudio();
        pa2.setPaper(pd2);
        pa2.setAudio(storageHandler.newFile(BYTES));
        pa2 = paperAudioRepo.save(pa2);
        pd2.setAudio(pa2);

        // Third PaperData
        PaperData pd3 = new PaperData();
        pd3.setTitle("Paper 3");
        pd3.setLink("http://paper-link.com");
        pd3.setArxivId("arxiv-id-3");
        pd3.setAuthors("author-3.1, author-3.2");
        pd3.setAbstractt("This is the abstract 3");
        pd3.setPubDate(new Timestamp(new Date().getTime()));
        pd3.addCategory(new PaperCategory().setCategory("cs.AI"));

        pd3 = paperDataRepo.save(pd3);

        PaperAudio pa3 = new PaperAudio();
        pa3.setPaper(pd3);
        pa3.setAudio(storageHandler.newFile(BYTES));
        pa3 = paperAudioRepo.save(pa3);
        pd3.setAudio(pa3);

        return Arrays.asList(PaperInfo.from(pd1), PaperInfo.from(pd2), PaperInfo.from(pd3));
    }

}
