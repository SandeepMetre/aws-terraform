#!/bin/bash
apt update 
apt install -y apache2


#get the instance id using the instance metadata service 
INSTANCE_ID=$(curl -s ).