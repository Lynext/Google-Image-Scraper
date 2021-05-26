const express = require('express');
const app = express()

const port = 25565

const Helper = require('./helper');
const google = require('./google');
var util = require("util");

var http = require('http').Server(app);

http.listen(port, () => {
  Helper.logInfo("Running on HTTP *:" + port.toString() + " port.");
});

app.get('/', (req, res) => 
{
    if (req["query"]["search"] == undefined)
    {
      res.send("Invalid request");
      return;
    }
    var search = req["query"]["search"];
    Helper.logInfo("Searching for : " + search);
    Helper.logInfo("URI Encoded : " + encodeURIComponent(search));
    (async () => {
      var ans = await google.getImageSrcs(search);
      res.send(JSON.stringify(ans, null, 4));
    })();
    
});

(async () => {

    //  var search = "Mercedes";
    //  Helper.logInfo("Searching : " + search);
    //  Helper.logInfo("URI Encoded : " + encodeURIComponent(search));
    //  await google.getImageSrcs(encodeURIComponent(search));

})();
