package io.bitken.tts.controllers;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.Map;

@RestController
public class WarmupReqController {

    @GetMapping(path = "/_ah/warmup", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map req() {
        return Collections.singletonMap("resp", "OK");
    }

}
