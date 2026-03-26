#!/bin/bash

# run once immediately
node --loader ts-node/esm --experimental-specifier-resolution=node /app/scripts/cleanOrphanExams.ts


# เริ่ม cron daemon (จะโหลด crontab จาก /etc/cron.d/* โดยอัตโนมัติ)
echo "▶️ Starting cron service..."
cron

# รอสักครู่ให้ cron ทำงาน
sleep 1

# แสดง log cron แบบ real-time
echo "📜 Tailing /var/log/cron.log..."
touch /var/log/cron.log
tail -f /var/log/cron.log
