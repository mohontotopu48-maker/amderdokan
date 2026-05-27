#!/bin/bash
cd /home/z/my-project
echo "[$(date)] Keep-alive script started" >> keep-alive.log
while true; do
  echo "[$(date)] Starting server..." >> keep-alive.log
  NODE_OPTIONS="--max-old-space-size=512" node ./node_modules/.bin/next dev -p 3000 >> dev.log 2>&1
  EXIT=$?
  echo "[$(date)] Server exited ($EXIT), restarting in 5s..." >> keep-alive.log
  sleep 5
done
