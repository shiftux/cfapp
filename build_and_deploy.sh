#!/bin/bash

if [ $# -ne 1 ]; then
    echo $0: specify the environment {prod/test}!
    echo 'default environment test is chosen!'
    ENVIRONMENT='test'
else
    ENVIRONMENT=$1
    echo "environment ${ENVIRONMENT} is chosen"
fi

echo "You are about to deploy branch ''$(git rev-parse --abbrev-ref HEAD)'' to the ''${ENVIRONMENT}'' environment."
read -p "Continue (y/n)?" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Continueing..."
else
    echo "Aborted by user"
    exit 1
fi

case "$ENVIRONMENT" in
    "test")
        echo "-STEP- starting docker-machine"
        docker-machine start default
        docker-machine env
        eval $(docker-machine env)
        CFCDIR=/home/docker/cfcalendar
        ssh_command="docker-machine ssh default"
        scp_command="docker-machine scp"
        SCP_TARGET="default"
        eval '$ssh_command "cp ${CFCDIR}/meteor/bundle/docker-compose.yml ${CFCDIR}"'
    ;;
    "prod")
        CFCDIR=/root/cfcalendar
        ssh_command="ssh root@51.15.40.6"
        scp_command="scp"
        SCP_TARGET="root@51.15.40.6"
        scp ../cfcalendar-ansible/roles/build_and_deploy/files/prod_docker-compose.yml $SCP_TARGET:$CFCDIR/docker-compose.yml
    ;;
    *)
        echo "Not a valid environment, specify 'test' or 'prod'."
        exit 1
    ;;
esac

echo "-STEP- building meteor package"
mkdir .build
meteor build .build --server-only
echo "-STEP- cleaning up and backing up old versions"
eval '$ssh_command "mv ${CFCDIR}/meteor/cfcalendar.tar.gz ${CFCDIR}/cfcalendar.tar.gz.$(date +%F.%T)"'
eval '$ssh_command "docker stop meteor_server"'
eval '$ssh_command "docker rm meteor_server"'
# eval '$ssh_command "docker stop mongodb_server"'
# !!!!!!! DANGER !!!!!!! eval '$ssh_command "docker rm mongodb_server"'
# !!!!!!! DANGER !!!!!!! eval '$ssh_command "docker rm $(docker ps -a -q)"'
eval '$ssh_command "rm -rf ${CFCDIR}/meteor/*"'
echo "-STEP- pushing to docker-machine"
eval '$scp_command .build/cfcalendar.tar.gz $SCP_TARGET:$CFCDIR/meteor/cfcalendar.tar.gz'
eval '$ssh_command "tar -xzvf ${CFCDIR}/meteor/cfcalendar.tar.gz -C ${CFCDIR}/meteor/"'
eval '$scp_command Dockerfile $SCP_TARGET:$CFCDIR/meteor/bundle'
echo "-STEP- building and starting the containers"
eval '$ssh_command "mv ${CFCDIR}/docker-compose.yml ${CFCDIR}/meteor/bundle"'
eval '$ssh_command "cd ${CFCDIR}/meteor/bundle; docker-compose build --no-cache meteor_server"'
eval '$ssh_command "cd ${CFCDIR}/meteor/bundle; docker-compose up -d"'
echo "-STEP- cleaning up"
rm -rf .build
echo "DONE! service is up and running on: http://192.168.99.100/ or https://login.crossfittb.ch"
echo "NOTE: the docker-compose.yml file needs to be managed manually on the test environment!!!"



####################################################################
# old version


# echo "building meteor app"
# mkdir .build
# meteor build .build --server-only
# echo "cleaning up old version"
# ssh root@51.15.40.6 'mv /root/cfcalendar/meteor/cfcalendar.tar.gz /root/cfcalendar/cfcalendar.tar.gz.$(date +%F.%T)'
# ssh root@51.15.40.6 'docker stop meteor_server'
# # ssh root@51.15.40.6 'docker stop mongodb_server'
# # !!!!!!! DANGER !!!!!!! ssh root@51.15.40.6 'docker rm mongodb_server'
# # ssh root@51.15.40.6 'docker rm $(docker ps -a -q)'
# ssh root@51.15.40.6 'docker rm meteor_server'
# ssh root@51.15.40.6 'rm -rf /root/cfcalendar/meteor/*'
# echo "transmitting to docker-machine"
# scp .build/cfcalendar.tar.gz root@51.15.40.6:/root/cfcalendar/meteor/cfcalendar.tar.gz
# ssh root@51.15.40.6 'tar -xzvf /root/cfcalendar/meteor/cfcalendar.tar.gz -C /root/cfcalendar/meteor/'
# scp Dockerfile root@51.15.40.6:/root/cfcalendar/meteor/bundle/
# scp docker-compose.yml root@51.15.40.6:/root/cfcalendar/meteor/bundle/
# echo "starting containers"
# ssh root@51.15.40.6 'cd /root/cfcalendar/meteor/bundle; docker-compose build --no-cache meteor_server'
# ssh root@51.15.40.6 'cd /root/cfcalendar/meteor/bundle; docker-compose up -d'
# echo "cleaning up"
# rm -rf .build
