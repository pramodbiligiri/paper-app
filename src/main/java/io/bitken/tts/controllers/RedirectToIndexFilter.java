package io.bitken.tts.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
public class RedirectToIndexFilter implements Filter {
    private static final Logger LOG = LoggerFactory.getLogger(RedirectToIndexFilter.class);

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String requestURI = req.getRequestURI();

        if (requestURI.startsWith("/react")) {
            LOG.info("/react url. Will be forwarded to /reactIndex.");
            request.getRequestDispatcher("/reactIndex").forward(request, response);
            return;
        }

        chain.doFilter(request, response);

    }

}
