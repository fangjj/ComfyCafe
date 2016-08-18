#!/bin/bash
set -e
if [ "$1" != "--just-do-it" ]
  then
  if [ "$1" != "--no-build" ]
    then
      mkdir -p ../meteor-bundles/ComfyCafé
      meteor build --directory ../meteor-bundles/ComfyCafé
  fi
  if [ "$1" != "--no-sync" ]
    then
      rsync -azPAXvH -e 'ssh -p 22 -i ~/.ssh/id_rsa' --delete ../meteor-bundles/ComfyCafé/bundle root@git.comfy.cafe:/srv/ComfyCafe
  fi
fi
ansible-playbook ansible/site.yml
