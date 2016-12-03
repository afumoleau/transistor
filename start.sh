# Clean up
sudo forever stopall

# InfluxDB container
arch=$(uname -m)
sudo docker stop transistor-influxdb
sudo docker rm transistor-influxdb
mkdir $PWD/data
mkdir $PWD/data/influxdb
if $arch=="x86_64"
    sudo docker run -d --name transistor-influxdb -v %cd%/data/influxdb:/var/lib/influxdb -p 8083:8083 -p 8086:8086 influxdb
elif $arch=="armv7l"
    sudo docker run -d --name transistor-influxdb --volume=/var/influxdb:$PWD/data/influxdb -p 8083:8083 -p 8086:8086 solderra/armhf-influxdb
fi

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
