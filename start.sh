# Clean up
sudo forever stopall

# InfluxDB container
arch=$(uname -m)
sudo docker stop transistor-influxdb
sudo docker rm transistor-influxdb
mkdir $PWD/data
mkdir $PWD/data/influxdb
sudo docker run -d --name transistor-influxdb --volume=/var/influxdb:$PWD/data/influxdb -p 8083:8083 -p 8086:8086 solderra/armhf-influxdb

# internet-status module
cd internet-status
npm install
sudo forever start update-internet-status.js
cd ..

# web-api module
cd web-api
npm install
sudo forever start server.js
cd ..

# web-front module
cd web-front
npm install
npm run build
sudo forever start server.js
cd ..
