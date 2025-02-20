package io.bitken.tts.controllers;

import io.bitken.tts.model.entity.EmailSubscriber;
import io.bitken.tts.model.entity.Feedback;
import io.bitken.tts.repo.EmailSubRepo;
import io.bitken.tts.repo.FeedbackRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
public class FeedbackSaveController {

    private static final Logger LOG = LoggerFactory.getLogger(FeedbackSaveController.class);

    @Autowired
    FeedbackRepo repo;

    @PostMapping(path = "/api/save-feedback", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map subscribe(@RequestBody Map<String, Object> body) {
        String data = (String) body.get("data");

        if (data == null || data.isEmpty() || data.length() > 5000) {
            Map<String, String> invalid = new HashMap<>();
            invalid.put("status", "fail");
            invalid.put("reason", "Invalid input");
            return Collections.singletonMap("resp", invalid);
        }

        repo.save(new Feedback().setData(data).setCreateTime(new java.sql.Timestamp(System.currentTimeMillis())));

        Map<String, String> success = new HashMap<>();
        success.put("status", "success");

        return Collections.singletonMap("resp", success);
    }
}
