var format = require('date-format');
var _ = require("lodash"); 

var log = function(req){  
    var date = format('dd/MM/yy hh:mm:ss', new Date());
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    var toLog = date + " ["+ip+"] | " + req.method + " -> " + req.baseUrl + req.url;
    if(!_.isEmpty(req.params)){
        toLog += " [ params: " + JSON.stringify(req.params) + " ] ";
    }
    if(!_.isEmpty(req.body)){
        toLog += " [ body: " + JSON.stringify(req.body) + " ] ";
    }
    console.log(toLog);
  
}

module.exports = log;
