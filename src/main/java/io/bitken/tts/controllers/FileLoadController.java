package io.bitken.tts.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Controller
@ConditionalOnProperty(name="file.load.controller", havingValue="true")
public class FileLoadController {

    private static final Logger LOG = LoggerFactory.getLogger(FileLoadController.class);

    private static final Path basePath = Path.of(System.getProperty("java.io.tmpdir"), "paper-audio");

    @GetMapping(path = "/file/{filename:.+}")
    public void downloadPDFResource(HttpServletRequest request,
                                    HttpServletResponse response,
                                    @PathVariable("filename") String filename) {
        Path filePath = basePath.resolve(filename);
        if (Files.exists(filePath)) {
            response.setContentType("audio/mpeg");
            response.addHeader("Content-Disposition", "attachment; filename=" + filename);
            try {
                ServletOutputStream os = response.getOutputStream();
                Files.copy(filePath, os);
                os.flush();
            } catch (IOException e) {
                LOG.error("Error serving file", e);
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        }

        response.setStatus(HttpServletResponse.SC_NOT_FOUND);

    }
}
