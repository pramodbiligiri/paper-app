package io.bitken.tts.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.session.web.http.SessionRepositoryFilter;
import org.springframework.stereotype.Component;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Order(SessionRepositoryFilter.DEFAULT_ORDER + 1)
@Component
public class InternalAccessLogger implements Filter {

    private static final Logger LOG = LoggerFactory.getLogger(InternalAccessLogger.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (!(request instanceof HttpServletRequest)) {
            chain.doFilter(request, response);
            return;
        }

        HttpServletRequest req = (HttpServletRequest) request;
        String s = req.getRequestURL().toString();

        if (s.contains("internal")) {
            handleInternalReq(req);
        }

        handleBotReq(req);

        chain.doFilter(request, response);
    }

    private void handleBotReq(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session == null) {
            return;
        }

        String userAgent = request.getHeader("User-Agent");
        if (userAgent == null) {
            return;
        }

        String userAgentLowerCase = userAgent.toLowerCase();
        if (!userAgentLowerCase.contains("bot") && !userAgentLowerCase.contains("crawler")) {
            return;
        }

        Object botAttr = session.getAttribute("bot");
        if (botAttr != null) {
            // Already logged
            return;
        }

        if (LOG.isDebugEnabled()) {
            LOG.debug("Logging bot request");
        }

        session.setAttribute("bot", "true");
        session.setAttribute("user_agent", userAgent);

        if (LOG.isDebugEnabled()) {
            LOG.debug("Logged bot request");
        }
    }

    private void handleInternalReq(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session == null) {
            return;
        }

        Object internalObj = session.getAttribute("internal");
        if (internalObj != null) {
            // Already logged
            return;
        }

        if (LOG.isDebugEnabled()) {
            LOG.debug("Logging internal request");
        }

        session.setAttribute("internal", "true");

        if (LOG.isDebugEnabled()) {
            LOG.debug("Logged internal request");
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void destroy() {

    }
}
