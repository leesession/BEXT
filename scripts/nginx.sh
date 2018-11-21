# back up existing file
cp -f /etc/nginx/sites-available/default /etc/nginx/sites-available/bak_default

[ -f ./scripts/config-nginx ] && echo "Found ./scripts/config-nginx" || echo "Not found config-nginx under ./scripts, are you at betx-fe root?"

# Copy config-nginx over
cp -f ./scripts/config-nginx /etc/nginx/sites-available/default

sudo nginx -t 
sudo service nginx restart
sudo service nginx status