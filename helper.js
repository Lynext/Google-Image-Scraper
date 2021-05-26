var originalFetch = require('node-fetch');
var fetch = require('fetch-retry')(originalFetch, {
    retries: 500,
    retryDelay: function(attempt, error, response) 
    {
        module.exports.logError("Retrying fetch... " + attempt);
        module.exports.logError("Error : " + error);
        module.exports.logError("Response : " + response);
        return 2000;
      }
  });

var JSSoup = require('jssoup').default;
var Timeout = require('await-timeout');
const HttpsProxyAgent = require('https-proxy-agent');

const fs = require('fs');

module.exports = {

    userAgentChanger : 1,
    userAgent : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",

    replaceAll : function (str, find, replace) 
    {
        var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(escapedFind, 'g'), replace);
    },

    getKeyByValue(object, value) 
    {
        return Object.keys(object).find(key => object[key] === value);
    },

    logInfo (info)
    {
        this.createFolderIfNotExists("./logs");
        var str = "[INFO] [" + this.getTimeString() + "] " + info;
        console.log(str);
        this.appendToFile("./logs/" + this.getDateStringBasic() + ".txt", str + "\n");
    },

    logError (info)
    {
        this.createFolderIfNotExists("./logs");
        this.createFolderIfNotExists("./errors");
        var str = "[ERROR] [" + this.getTimeString() + "] " + info;
        console.log(str);
        this.appendToFile("./logs/" + this.getDateStringBasic() + ".txt", str + "\n");
        this.appendToFile("./errors/" + this.getDateStringBasic() + ".txt", str + "\n");
    },

    createFolderIfNotExists (dir)
    {
        if (!fs.existsSync(dir))
        {
            fs.mkdirSync(dir);
        }
    },

    appendToFile (dir, data)
    {
        fs.appendFileSync(dir, data);
    },

    writeToFile (dir, data)
    {
        fs.writeFileSync(dir, data);
    },

    checkIfValueExists (object, value)
    {
        var exists = Object.keys(object).some(function(k) {
            return object[k] === value;
        });
        return exists;
    },

    getHTML : async function (link)
    {
        try
        {
            const response = await fetch(link);
            const text = await response.text();
            return text;
        } 
        catch (error) 
        {
            Helper.logError("Helper.getHTML Hatası : " + error);
        }
    },

    getHTMLCookies : async function (link, cookies)
    {
        //const proxyAgent = new HttpsProxyAgent('http://51.158.119.88:8811');
        try
        {
            const opts = 
            {
                headers:
                {
                    "accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    "accept-encoding": 'gzip, deflate, br',
                    "accept-language": 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                    "cache-control": 'max-age=0',
                    "cookie": cookies,
                    "referer": "https://www.google.com/",
                    "sec-fetch-dest": 'document',
                    "sec-fetch-mode": 'navigate',
                    "sec-fetch-site": 'same-origin',
                    "sec-fetch-user": '?1',
                    "sec-gpc": '1',
                    "upgrade-insecure-requests": '1',
                    "user-agent": this.userAgent
                    
                }//,
                //agent: proxyAgent
            };

            const response = await fetch(link, opts);
            const text = await response.text();
            return text;
        } 
        catch (error) 
        {
            Helper.logError("Helper.getHTMLCookies Hatası : " + error);
        }
    },

    getTimeString ()
    {
        return new Date().toLocaleTimeString();
    },

    getDateStringBasic ()
    {
        return new Date().toLocaleDateString('en-CA');
    },

    getTime : function()
    {
        return new Date().getTime();
    },
    
    prettyJson : function (json)
    {
        return JSON.stringify(json, null, 4);
    },

    syncWait : function (ms)
    {
        var start = Date.now(),
                now = start;
        while (now - start < ms) 
        {
            now = Date.now();
        }
    }
  };