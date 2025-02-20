#!/bin/bash

# Deploy a new version of the app to the production server
newdir=`ssh -i ~/.ssh/id_het webapp@new.papertime.app 'bin/new-build-dir'`;

echo "New build dir: $newdir";

scp -i ~/.ssh/id_het target/paper-app-0.0.1-SNAPSHOT.jar webapp@new.papertime.app:$newdir

remote_cmd="bin/update-build $newdir";

ssh -i ~/.ssh/id_het webapp@new.papertime.app "$remote_cmd"
