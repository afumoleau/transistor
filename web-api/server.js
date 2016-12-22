var express = require('express');

var app = express();
app.use(require('cors')());
app.use(require('body-parser').text());
require('./routes/lights').init(app);
require('./routes/internetStatus').init(app);
require('./routes/devices').init(app);
require('./routes/power').init(app);
app.listen(24601);