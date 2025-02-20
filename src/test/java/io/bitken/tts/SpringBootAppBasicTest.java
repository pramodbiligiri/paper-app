package io.bitken.tts;

import io.bitken.tts.config.AppConfig;
import io.bitken.tts.main.AppTtsApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest (classes = {AppConfig.class, AppTtsApplication.class})
public class SpringBootAppBasicTest {

	@Test
	public void contextLoads() {
	}

}
