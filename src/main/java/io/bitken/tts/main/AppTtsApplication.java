package io.bitken.tts.main;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;

import java.util.Collections;

@SpringBootApplication
@EnableJpaRepositories("io.bitken.tts.repo")
@EntityScan(basePackages = {"io.bitken.tts.model.entity", "io.bitken.tts.entity"})
@ComponentScan(
	basePackages = {"io.bitken.tts"},
	excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "io.bitken.tts.main.*")
)
@EnableJdbcHttpSession(cleanupCron = "-")
public class AppTtsApplication {

	private static final Logger LOG = LoggerFactory.getLogger(AppTtsApplication.class);

	public static void main(String[] args) {
		int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8082"));
		SpringApplication app = new SpringApplication(AppTtsApplication.class);
		app.setDefaultProperties(Collections.singletonMap("server.port", port));
		app.run(args);
	}

}
