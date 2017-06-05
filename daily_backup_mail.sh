MONGO_BACKUP_DIR=/root/cfcalendar/mongo/data/cfcalendar-admin-db-backup
BACKUP_ARCHIVE=cftb_daily_DB_backup
BACKUP_MAIL=shiftux@gmail.com

cd $MONGO_BACKUP_DIR
echo "deleting old backups"
rm -rf *.tar.gz

echo "creating backup archive of latest backup"
LATEST_BACKUP=$(ls -Art | tail -n 1)
tar -czvf $BACKUP_ARCHIVE.tar.gz $LATEST_BACKUP

echo "sending backup"
echo "Daily backup of the database." | mail -s "Daily DB backup" $BACKUP_MAIL -A $MONGO_BACKUP_DIR/$BACKUP_ARCHIVE.tar.gz