#!/bin/bash
meteor build . && ansible-playbook ansible/site.yml
