import util from "../../common/util.js";
let speakMoudle = {
    speakMsg:function(msg,callback){
        let appid=IFLYAPPID;
        let apikey=IFLYHCAPIKEY;
        let param="eyJhdWYiOiAiYXVkaW8vTDE2O3JhdGU9MTYwMDAiLCJhdWUiOiAicmF3Iiwidm9pY2VfbmFtZSI6ICJ4aWFveWFuIiwic3BlZWQiOiAiNTAiLCJ2b2x1bWUiOiAiNTAiLCJwaXRjaCI6ICI1MCIsImVuZ2luZV90eXBlIjogImludHA2NSIsInRleHRfdHlwZSI6ICJ0ZXh0In0=";
        let curTime = Math.round(new Date() / 1000);//当前UTC时间戳，从1970年1月1日0点0 分0 秒开始到现在的秒数
        util.LoadJsFiles(["https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.min.js"]).then(() =>
        { 
            let checkSum = md5(apikey+curTime+param);
            // console.log(apikey,"这是APIKEY");
            // console.log(curTime,"curTime");
            // console.log(checkSum,"checkSum");
            let sendObj={
                text:encodeURIComponent(msg)
            }
            $.ajax({
                type: "POST",
                url: "https://api.xfyun.cn/v1/service/v1/tts",
                data: {
                    text:JSON.stringify(sendObj)
                },
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                headers: {
                'X-Appid':appid,
                'X-CurTime':curTime,
                'X-Param':param,
                'X-CheckSum':checkSum,
                // "Access-Control-Allow-Origin": "*"
                },
                responseType: 'arraybuffer',
                responseEncoding: 'utf8',
                success: function(data){
                callback(data);
                },
                error: function(err){
                console.log(err)
                }
            });
        });
    }
}
export  default speakMoudle;
