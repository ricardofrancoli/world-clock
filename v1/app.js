const express = require('express'),
      app = express(),
      geoTz = require('geo-tz');

const getTime = require('./script/gettime')

app.listen(3000, function(){
    console.log("App has started!")
});
