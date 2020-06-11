#!/bin/bash -e

deploy_dist_branch=master

cd "${JEKYLL_BUILD_DESTINATION_PATH}"

touch .nojekyll

git init
cp ../.git/config .git/config

git remote set-url origin "https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

git config --local user.name "${GITHUB_ACTOR}"
git config --local user.email "${GITHUB_ACTOR}@users.noreply.github.com"

git fetch --no-tags --no-recurse-submodules origin "+${deploy_dist_branch}:refs/remotes/origin/${deploy_dist_branch}"
git add -A .
git commit -m "Update github pages build from ${GITHUB_SHA}"
git push -f "$(git config --get remote.origin.url)" "${deploy_dist_branch}:${deploy_dist_branch}" > /dev/null 2>&1

cd -
