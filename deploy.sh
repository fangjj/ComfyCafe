#!/bin/bash
set -e
#meteor build .
ansible-playbook ansible/site.yml
