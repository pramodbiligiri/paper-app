package io.bitken.tts.config;

import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

//@SpringBootConfiguration
//@EnableJpaRepositories("io.bitken.tts.repo")
//@EntityScan (basePackages = {"io.bitken.tts.model.entity", "io.bitken.tts.entity"})
//@ComponentScan (
//    basePackages = {"io.bitken.tts"},
//    excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "io.bitken.tts.main.*")
//)
//@EnableAutoConfiguration
public class AppConfig {
}
