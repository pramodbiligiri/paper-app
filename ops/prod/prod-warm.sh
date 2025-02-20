#!/bin/bash

# Warm up the app by hitting the main page and the API endpoint for AI papers
while true; do
echo $(date) >> warm.log;
curl https://papertime.app 1>/dev/null 2>>warm.log;
curl "https://internal.papertime.app/api/paper-data?from=2&count=5&category=cs.AI" 1>/dev/null 2>>warm.log;
# sleep 240;
done

