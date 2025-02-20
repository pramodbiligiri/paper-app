package io.bitken.tts.controllers;

import io.bitken.tts.model.entity.PaperData;
import io.bitken.tts.repo.PaperCategoryRepo;
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
import javax.servlet.http.HttpSession;
import java.math.BigInteger;
import java.util.*;

@RestController
public class PaperDataController {

	private static final Logger LOG = LoggerFactory.getLogger(PaperDataController.class);

	private static final int MAX_PAGE_SIZE = 100;

	public static final String ALL_CATEGORIES = "all";
	public static final List<String> ALL_CATEGORIES_ARRAY = Arrays.asList(ALL_CATEGORIES);

	@Autowired
	PaperDataRepo pdRepo;

	@Autowired
	PaperCategoryRepo categoryRepo;

	@GetMapping(path = "/api/paper-data", produces = MediaType.APPLICATION_JSON_VALUE)
	public Map papers(@RequestParam(defaultValue = "0") int from,
					  @RequestParam(defaultValue = "10") int count,
					  @RequestParam String category,
					  HttpSession session) {

		PaperListResponse resp = new PaperListResponse();

		if (!isValid(from, count)) {
			return Collections.singletonMap("paperData", resp);
		}

		List<String> categories = validateCategory(category);
		List<PaperData> papers = getPapersForCategory(from, count, categories);

		List<PaperInfo> pInfos = convertToPInfos(papers);

		fillResponseObject(resp, from, count, categories, pInfos);

		return Collections.singletonMap("paperData", resp);
	}

	private List<PaperData> getPapersForCategory(
			@RequestParam(defaultValue = "0") int from,
		 	@RequestParam(defaultValue = "10") int count,
		    List<String> validCats) {

		if (validCats.size() == 1) {
			String cat = validCats.get(0);
			if ("all".equals(cat)) {
				return pdRepo.findLatestPapersWithAudioAcrossAllCategories(count, from);
			}
			return pdRepo.findLatestPapersWithAudioInCategory(cat, count, from);
		}

		return pdRepo.findLatestPapersWithAudioInCategories(validCats, count, from);

	}

	private void fillResponseObject(PaperListResponse resp, int from, int count,
									List<String> categories, List<PaperInfo> pInfos) {
		resp.addPaperInfos(pInfos);
		resp.setTotal(getTotalCount(categories));
		resp.setFrom(from);
		resp.setCount(count);
		resp.setCategories(categories);
	}

	private List<String> validateCategory(String category) {
		if (category == null || category.isBlank()) {
			return ALL_CATEGORIES_ARRAY;
		}

		String[] cats = category.split(",");
		for (String cat : cats) {
			if (ALL_CATEGORIES.equals(cat)) {
				return ALL_CATEGORIES_ARRAY;
			}
		}

		List<String> allCsCats = categoryRepo.getAllCsCategories();
		List<String> validCats = new ArrayList<>();
		for (String cat : cats) {
			if (allCsCats.contains(cat)) {
				validCats.add(cat);
			}
		}

		if (validCats.isEmpty()) {
			return ALL_CATEGORIES_ARRAY;
		}

		return validCats;
	}

	private int getTotalCount(List<String> categories) {
		if (categories.size() == 1) {
			String cat = categories.get(0);

			if (ALL_CATEGORIES.equals(cat)) {
				BigInteger dbCount = (BigInteger) pdRepo.findCountPapersWithAudioAcrossAllCategories().get(0)[0];
				return dbCount.intValue();
			}

			BigInteger dbCount = (BigInteger) pdRepo.findCountLatestPapersWithAudioInCategory(cat)
					.get(0)[0];
			return dbCount.intValue();
		}

		BigInteger dbCount = (BigInteger) pdRepo.findCountLatestPapersWithAudioInCategories(categories)
				.get(0)[0];
		return dbCount.intValue();

	}

	private List<PaperInfo> convertToPInfos(List<PaperData> papers) {
		List<PaperInfo> pInfos = new ArrayList<>();

		for (PaperData paper : papers) {
			PaperInfo pi = PaperInfo.from(paper);
			pInfos.add(pi);
		}

		return pInfos;
	}

	private boolean isValid(int from, int count) {
		if (from < 0 || count <= 0 || count > MAX_PAGE_SIZE) {
			return false;
		}

		return true;
	}

}
