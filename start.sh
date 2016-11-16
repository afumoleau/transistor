forever stopall

# internet-status module
cd internet-status
npm install
forever start update-internet-status.js
cd ..

# web-interface module
cd web-interface
npm install
webpack
forever start server.js
cd ..