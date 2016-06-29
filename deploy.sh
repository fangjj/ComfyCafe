#!/bin/bash
set -e
if [ "$1" != "--no-build" ]
  then
    mkdir -p ../meteor-bundles/ComfyCafé
    meteor build --directory ../meteor-bundles/ComfyCafé
    rsync -azP 'ssh -p 22 -i ~/.ssh/id_rsa' --delete ../meteor-bundles/ComfyCafé/bundle root@git.comfy.cafe:/srv/ComfyCafé
fi
ansible-playbook ansible/site.yml
