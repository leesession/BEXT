git checkout master
git pull
git checkout ubuntu-16.04
git rebase master
export GENERATE_SOURCEMAP=false && yarn build
yarn global add serve
pm2 stop BETX-FE
pm2 start serve --name BETX-FE -- -s build
pm2 list
