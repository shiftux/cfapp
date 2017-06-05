d="$(date +"%d-%m-%Y_%Hh%M")"
mkdir "/data/cfcalendar-admin-db-backup/$d"
mongodump --db admin --out /data/cfcalendar-admin-db-backup/$d
exit 0