@echo off
start cmd.exe @cmd /k "C:&cd C:\ecc-uat-node-api\rulesengine&pm2 start index.js&pm2 monit"