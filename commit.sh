# This script git-commits all files and uploads them to the dev branch, whilst also minifying them and uploading them to the master branch.
git checkout dev
git commit -a -m "This commit message is the default used by my script."
git checkout master
git commit -a -m "This commit message is the default used by my script."
git merge dev
git push
