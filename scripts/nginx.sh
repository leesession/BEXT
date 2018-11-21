# back up existing file
cp -f /etc/nginx/sites-available/default /etc/nginx/sites-available/bak_default

# Copy config-nginx over
cp -f ./config-nginx /etc/nginx/sites-available/default

sudo nginx -t 
sudo service nginx restart
sudo service nginx status