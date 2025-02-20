package io.bitken.tts.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class ReactIndexController {

    private static final Logger LOG = LoggerFactory.getLogger(ReactIndexController.class);

    @GetMapping(value = {"/reactIndex"})
    public String getIndex(HttpServletRequest request) {
        LOG.info("ReactIndexController.getIndex(): Returning view name");
        return "index.html";
    }
}
