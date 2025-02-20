package io.bitken.tts.controllers;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.Map;

@RestController
class DummyController {

	@RequestMapping(value = "/dummy", produces = MediaType.APPLICATION_JSON_VALUE)
	public Map hello() {
		return Collections.singletonMap("response", "dummy Endpoint");
	}

}
