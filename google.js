var Helper = require("./helper");
var JSSoup = require('jssoup').default;
var Timeout = require('await-timeout');

module.exports = {

    imageSrcs : [],

    changeUserAgent : async function ()
    {
        Helper.userAgentChanger++;
        Helper.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0." + Helper.userAgentChanger.toString() + ".150 Safari/537.36";
    },

    getImageSrcs : async function (searchRequest)
    {
        var search = encodeURIComponent(searchRequest);

        this.imageSrcs = [];
        var cookies = 'SID=9wcAuKFs8888fpaI8zzNmIl04x2mwCqZyx_XRboLVOCuVDNA3UuaokGp5PR3tRe66pjYfA.; __Secure-3PSID=9wcAuKFs8888fpaI8zzNmIl04x2mwCqZyx_XRboLVOCuVDNAiM4Y5u7Yy66L9QPbm9ceCA.; HSID=AguMIdjG9_uUJgKMs; SSID=AtIp6pMDP8wS-8I3K; APISID=LrAB-qkP72vbiZun/AI5lAtIss9TiRqoqD; SAPISID=zm7kp7_oW3ndTvE0/Ah4ZZ43e8VgKoo4b-; __Secure-3PAPISID=zm7kp7_oW3ndTvE0/Ah4ZZ43e8VgKoo4b-; SEARCH_SAMESITE=CgQI1ZIB; NID=216=H7I2x3h8rFOph-R3W2fmUqlF_Y3aOJ8gISvv7wVOudUkfLs7sm_4_3rWHDMs2cvWfq-toCfUZWitVW_N-dA77WQpLVfa5UB9Padd-RV5tq7WRTFJctoMFRbZTOgSSy1Gtx6_9AsM8RxvAWqvRqssTQiK444m_kp1tJB2_e3Y-rkgu48uKXfeFdd2Ih2H; OGPC=19022519-1:; 1P_JAR=2021-5-26-17; OTZ=5995748_44_48_123900_44_436380';
        var response = "";
        var url = "https://www.google.com/search?q=" + search + "&gl=us&hl=en&tbm=isch"
        try
        {
            response = await Timeout.wrap(Helper.getHTMLCookies(url, cookies), 30000, "A timeout occured with Google.");
        }
        catch (error)
        {
            Helper.logError(error);
            await module.exports.changeUserAgent();
            return -1;
        }

        var soup = new JSSoup(response);

        var collectionMain = soup.findAll("script");

        var foundNumber = 0;

        for (var i = 0; i < collectionMain.length; i++)
        {
            if ((collectionMain[i] + "").includes("www.") == true)
            {
                //Helper.logInfo(i + "");
                foundNumber = i;
            }
        }

        var str = (collectionMain[foundNumber] + "")
        var importantData = str.substring(str.search("data:") + 5, str.search(", sideChannel:"));
        var parsed = JSON.parse(importantData)

        for (var i = 0; i < parsed[31][0][12][2].length; i++)
        {
            if (parsed[31][0][12][2][i][1] != null)
            {
                this.imageSrcs.push(parsed[31][0][12][2][i][1][3][0]);
            }
        }

        // for (var i = 0; i < this.imageSrcs.length; i++)
        // {
        //     Helper.logInfo(this.imageSrcs[i] + "\n")
        // }

        //Helper.logInfo(this.imageSrcs + "");
        Helper.logInfo("Found " + this.imageSrcs.length + " results for " + searchRequest);

        return this.imageSrcs;
    }
}