package io.bitken.tts.controllers;

import io.bitken.tts.repo.PaperDataRepo;
import io.bitken.tts.service.StatsService;
import io.bitken.tts.view.StatInput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
public class StatsController {

    private static final Logger LOG = LoggerFactory.getLogger(StatsController.class);

    @Autowired
    StatsService stats;

    @Autowired
    PaperDataRepo pdr;

    @PostMapping(path = "/api/stat", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map stat(@RequestBody StatInput input, HttpSession session, HttpServletRequest request,
                    HttpServletResponse response) {

        if (request.getRequestURL().toString().contains("internal")) {
            return DEFAULT_NOOP_SUCCESS_RESPONSE;
        }

        if (input.paper <= 0 || input.at < 0 || input.of <= 0) {
            return defaultBadRequest(response);
        }

        if (!pdr.checkExists(input.paper)) {
            return defaultBadRequest(response);
        }

        stats.logPaperListen(session.getId(), input.paper, input.src, input.at, input.of);

        Map<String, String> m = new HashMap<>();
        m.put("status", "success");

        return Collections.singletonMap("resp", m);
    }

    private Map<String, Map<String, String>> defaultBadRequest(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

        return DEFAULT_BAD_REQUEST_RESPONSE;
    }

    private static final Map<String, Map<String, String>> DEFAULT_BAD_REQUEST_RESPONSE =
        Collections.singletonMap(
            "resp",
            new HashMap<>() {{
                put("status", "failure");
                put("reason", "Bad request");
            }}
        );

    private static final Map<String, Map<String, String>> DEFAULT_NOOP_SUCCESS_RESPONSE =
        Collections.singletonMap(
            "resp",
            new HashMap<>() {{
                put("status", "success");
                put("reason", "No Op");
            }}
        );
}
