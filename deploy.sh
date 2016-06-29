#!/bin/bash
set -e
if [ "$1" != "--no-build" ]
  then
    meteor build .
fi
ansible-playbook ansible/site.yml
