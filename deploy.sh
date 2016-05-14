#!/bin/bash
set -e
#mkdir -p ../meteor-bundles/TeruImages
#meteor build --directory ../meteor-bundles/TeruImages
#rsync -azPAXvH -e 'ssh -p 222 -i ~/.ssh/id_rsa' --delete ../meteor-bundles/TeruImages/bundle root@git.teru.sexy:/srv/TeruImages
ansible-playbook ansible/site.yml
