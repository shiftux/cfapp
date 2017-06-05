echo "building meteor app"
mkdir .build
meteor build .build --server-only
echo "cleaning up old version"
ssh root@51.15.40.6 'mv /root/cfcalendar/meteor/cfcalendar.tar.gz /root/cfcalendar/cfcalendar.tar.gz.$(date +%F.%T)'
ssh root@51.15.40.6 'docker stop meteor_server'
# ssh root@51.15.40.6 'docker stop mongodb_server'
# !!!!!!! DANGER !!!!!!! ssh root@51.15.40.6 'docker rm mongodb_server'
# ssh root@51.15.40.6 'docker rm $(docker ps -a -q)'
ssh root@51.15.40.6 'docker rm meteor_server'
ssh root@51.15.40.6 'rm -rf /root/cfcalendar/meteor/*'
echo "transmitting to docker-machine"
scp .build/cfcalendar.tar.gz root@51.15.40.6:/root/cfcalendar/meteor/cfcalendar.tar.gz
ssh root@51.15.40.6 'tar -xzvf /root/cfcalendar/meteor/cfcalendar.tar.gz -C /root/cfcalendar/meteor/'
scp Dockerfile root@51.15.40.6:/root/cfcalendar/meteor/bundle/
scp docker-compose.yml root@51.15.40.6:/root/cfcalendar/meteor/bundle/
echo "starting containers"
ssh root@51.15.40.6 'cd /root/cfcalendar/meteor/bundle; docker-compose build --no-cache meteor_server'
ssh root@51.15.40.6 'cd /root/cfcalendar/meteor/bundle; docker-compose up -d'
echo "cleaning up"
rm -rf .build
