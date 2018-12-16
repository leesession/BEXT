git checkout master
git pull
git checkout ubuntu-16.04
git rebase master
export GENERATE_SOURCEMAP=false && yarn build
yarn global add serve
pm2 stop serve
pm2 start serve -- -s build
pm2 list
