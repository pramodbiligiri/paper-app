package io.bitken.tts.controllers;

import io.bitken.tts.model.entity.EmailSubscriber;
import io.bitken.tts.repo.EmailSubRepo;
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
public class EmailSubController {

    private static final Logger LOG = LoggerFactory.getLogger(EmailSubController.class);

    @Autowired
    EmailSubRepo repo;

    @PostMapping(path = "/api/save-email", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map subscribe(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");

        if (email == null || email.isEmpty() || !email.contains("@")) {
            Map<String, String> invalid = new HashMap<>();
            invalid.put("status", "fail");
            invalid.put("reason", "Invalid email address");
            return Collections.singletonMap("resp", invalid);
        }

        repo.save(new EmailSubscriber().setEmailId(email).setCreateTime(new java.sql.Timestamp(System.currentTimeMillis())));

        Map<String, String> success = new HashMap<>();
        success.put("status", "success");

        return Collections.singletonMap("resp", success);
    }

}
