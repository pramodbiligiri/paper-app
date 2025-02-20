package io.bitken.tts.controllers;

import io.bitken.tts.repo.PaperCategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.Map;

@RestController
public class CategoriesController {

    @Autowired
    PaperCategoryRepo categoryRepo;

    @GetMapping(path = "/api/categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map categories() {
        return Collections.singletonMap("categories", categoryRepo.getAllCsCategories());
    }
}
