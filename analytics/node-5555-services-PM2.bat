@echo off
start cmd.exe @cmd /k "cd C:\ecc-uat-node-api\analytics&pm2 start index.js&pm2 monit"