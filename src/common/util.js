import SparkMD5 from 'spark-md5';
import loger from '../common/log.js';
import webapi from "../webapi/webapi.js";
// var S3 = require('aws-sdk/clients/s3');
// const OSS = require('ali-oss');

export default {
  _loadFiles: [],
  _isLoadKendo: false,
  _loadKenoCallback: [],
  _bucketInfo: null,
  _downloadProcessTimer: null,
  _downloadProcessPercent: 0,
  _cancelQueryDocument:null,
  _isLoaded(url)
  { 
    for (var i = 0; i < this._loadFiles.length; i++)
    {
      if (this._loadFiles[i] == url)
      {
        return true;
      }
    }
    return false;
  },
  _add2Loaded(url)
  { 
    this._loadFiles.push(url);
  },
  GetMD5(file)
  {
    return new Promise((resolve, reject) =>
    {
      var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        chunkSize = 2097152,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

      fileReader.onload = function (e)
      {
        spark.append(e.target.result);
        currentChunk++;

        if (currentChunk < chunks)
        {
          loadNext();
        } else
        {
          var md5 = spark.end();
          //loger.info('MD5:', md5);
          resolve(md5);
        }
      };

      fileReader.onerror = function ()
      {
        resolve("");
      };

      function loadNext()
      {
        var start = currentChunk * chunkSize,
          end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }

      loadNext();
    });
  },
  GetMD5String(str)
  { 
    return SparkMD5.hash(str);
  },
  FormatMediaTime(time,showHour=0)
  {
    var hour = Math.floor(time / 3600);
    var min = Math.floor((time % 3600) / 60);
    var sec = Math.round(time % 60);
    if (hour > 0 || showHour==1)
    {
      return hour + ":" + min + ":" + (sec < 10 ? "0" + sec : sec + "");
    }
    else
    {
      return min + ":" + (sec < 10 ? "0" + sec : sec + "");
    }
  },
  Clone(json){
    return JSON.parse(JSON.stringify(json));
  },
  GetCovertType(filename){
    var accept = [".jpg",".jpeg",".jpe",".png",".doc",".docx",".xls",".xlsx",".ppt",".pptx",".pdf"];
    var ext = filename.substr(filename.lastIndexOf("."));
    ext = ext.toLowerCase();
    if (IsExistInArr(accept, ext)) {
        return ext.substr(1);
    }
    else
    {
        return "";
    }
  },
  LoadKendoFiles()
  {
    return new Promise((resolve, reject) =>
    {
      if (window.kendo)
      {
        resolve(true);
        return;
      }
      if (this._isLoadKendo)
      {
        this._loadKenoCallback.push(() =>
        { 
          resolve(true);
        });
        return;
      }
      this._isLoadKendo = true;      
      this.LoadCssFiles(["/static/kendoui/styles/kendo.common-bootstrap.min.css?v=201810011501",
        "/static/kendoui/styles/kendo.bootstrap.min.css?v=201810011501"]);
      this.LoadJsFiles(["/static/kendoui/js/kendo.all.min.js?v=201810011501",
        "/static/kendoui/js/kendo.timezones.min.js?v=201810011501",
        "/static/kendoui/kendo.scheduler.view.js?v=201810011501",
        "/static/kendoui/kendo.scheduler.dayview.js?v=201810011501",
        "/static/kendoui/kendo.scheduler.js?v=201810011501",
        "/static/kendoui/js/cultures/kendo.culture.zh-CN.min.js?v=201810011501"
      ]).then(() =>
      {
        for (var callback of this._loadKenoCallback)
        {
          callback();
        }
        this._loadKenoCallback = [];
        resolve(true);
      });      
    });
  },
  async LoadKendoFilesEx()
  {
    if (window.kendo)
    {
      return true;
    }
    await this.LoadCssFiles(["/static/kendoui/styles/kendo.common-bootstrap.min.css?v=201810011501",
      "/static/kendoui/styles/kendo.bootstrap.min.css?v=201810011501"]);
    var result = await this.LoadJsFiles(["/static/kendoui/js/kendo.all.min.js?v=201810011501",
      "/static/kendoui/js/kendo.timezones.min.js?v=201810011501",
      "/static/kendoui/kendo.scheduler.view.js?v=201810011501",
      "/static/kendoui/kendo.scheduler.dayview.js?v=201810011501",
      "/static/kendoui/kendo.scheduler.js?v=201810011501",
      "/static/kendoui/js/cultures/kendo.culture.zh-CN.min.js?v=201810011501"
    ]);

    return result;
  },
  async LoadJsFiles(arr){
    var result = 0;
    for(var i=0;i<arr.length;i++)
    {
      result+= (await this.LoadJsFile(arr[i]))?1:0;
    }
    return arr.length==result;
  },
  async LoadCssFiles(arr)
  {
    for (var i = 0; i < arr.length; i++)
    {
      await this.LoadCssFile(arr[i]);
    }
    return true;
  },
  LoadJsFile(url)
  {
    return new Promise((resolve, reject) =>
    {
      if (this._isLoaded(url))
      {
        resolve(true);
        return;
      }
      // $.ajaxSetup({ cache: true });

      // $.getScript(url).done((script, textStatus)=>
      // {
      //   this._add2Loaded(url);
      //   resolve(true);
      // }).fail((jqxhr, settings, exception)=>
      //   {
      //     resolve(false);
      // });
      
      $.ajax({
        url: url,
        dataType: "script",
        cache: true
      }).done(()=> {
        this._add2Loaded(url);
        resolve(true);
      });
      
    });
  },
  LoadCssFile2(url)
  {
    if (this._isLoaded(url))
    {
      return;
    }
    $(document.head).append('<link rel="stylesheet" href="' + url + '" />');
    this._add2Loaded(url);

  },
  LoadCssFile(url)
  {
    return new Promise((resolve, reject) =>
    {
      if (this._isLoaded(url))
      {
        resolve(true);
        return;
      }
      var script = document.createElement('link');
      script.setAttribute("rel","stylesheet");
      
      if (script.readyState)
      {
        script.onreadystatechange = ()=>
        {
          if (script.readyState == "loaded" || script.readyState == "complete")
          {
            script.onreadystatechange = null;
            this._add2Loaded(url);
            resolve(true);
          }
        }
      } else
      {
        script.onload = ()=>
        {
          this._add2Loaded(url);
          resolve(true);
        }
      }
      script.setAttribute("href",url);
      document.body.appendChild(script);
      
    });
  },
  LoadDropboxChooser(callback)
  {
    /*Dropbox (https://www.dropbox.com/developers/chooser)*/
    var element = document.getElementById("dropboxjs");
    if (element != null) {
      if (typeof (callback) != "undefined") {
        callback();
      }

      return;
    }

    var url = "https://www.dropbox.com/static/api/2/dropins.js";
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.id = "dropboxjs";
    script.setAttribute("data-app-key","i1kq6lxm4hf0v9c");
    if (typeof (callback) != "undefined")
    {
      if (script.readyState)
      {
        script.onreadystatechange = function ()
        {
          if (script.readyState == "loaded" || script.readyState == "complete")
          {
            script.onreadystatechange = null;
            callback();
          }
        }
      } else
      {
        script.onload = function ()
        {
          callback();
        }
      }
    }
    script.src = url;
    document.body.appendChild(script);
  },
  LoadGooglePicker(callback) {
    if (googleAuthApiLoaded && googlePickerApiLoaded && googleClientApiLoaded) {
      if (callback) {
        callback();
      }
      return;
    }

    this.LoadJsFiles(["https://apis.google.com/js/api.js"]).then(()=>{
      gapi.load('auth2', () => {
        googleAuthApiLoaded = true;

        if (googleAuthApiLoaded && googlePickerApiLoaded && googleClientApiLoaded) {
          if (callback) {
            callback();
          }
        }
      });

      gapi.load('picker', () => {
        googlePickerApiLoaded = true;

        if (googleAuthApiLoaded && googlePickerApiLoaded && googleClientApiLoaded) {
          if (callback) {
            callback();
          }
        }
      });

      gapi.load('client', () => {
        gapi.client.init({
          'apiKey': GOOGLEDEVELOPERKEY,
          'clientId': GOOGLECLIENTID,
          'scope': GOOGLEACCESSSCOPE,
        }).then(function() {
          console.log("client initialized");
        }).then(function(response) {
          console.log(response.result);
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        });
    
        gapi.client.load('drive', 'v2', () => {
          googleClientApiLoaded = true;

          if (googleAuthApiLoaded && googlePickerApiLoaded && googleClientApiLoaded) {
            if (callback) {
              callback();
            }
          }
        });
      });
    });
  },
  MoveTitle(newtitle,icon="")
  { 
    newtitle =" "+newtitle+ "   ";
    var oldTitle = document.title;
    var oldIcon = gid("basetoolbaricon").href;
    var count = newtitle.length;
    var index = 0;
    var move = function ()
    {
      var titleArr = newtitle.split('');
      titleArr.push(titleArr.shift());
      newtitle = titleArr.join('');
      document.title = newtitle;
      index++;
      if (icon != "")
      {
        if (index % 4 == 0)
        {
          gid("basetoolbaricon").href = oldIcon;
        }
        else if (index % 2 == 0)
        {
          gid("basetoolbaricon").href = icon;
        }
      }

      if (index >= count)
      {
        document.title = oldTitle;
        gid("basetoolbaricon").href = oldIcon;
      } else
      {
        setTimeout(() => {
          move();
        }, 200);
      }
    }
    setTimeout(() => {
      move();
    }, 200);
    
    
  },
  ShowBadNetwork(isshow)
  { 
    //console.log("ShowBadNetwork:" + isshow);
    var ishost = true;
    if (!isshow)
    {
      $("#BadNetworkTip_text").stop();
      $("#BadNetworkTip").remove();
      return;
    }
    var tip = $("#BadNetworkTip");
    if (tip.length == 0)
    {
      var html = `<div id="BadNetworkTip" title="Poor network connection!" style="position:absolute; left:5px; top:5px;z-index:99999;" >
                <div style="width: 30px;display: inline-block;z-index: 99999;position: absolute;left: 5px;top: 5px;background-color:#d30015;border-radius:50%;vertical-align:top;height:30px;"><span style="font-size:23px;color:white;padding-left:4px" class="icon icon-poor-net"></span></div>
                <div id="BadNetworkTip_text" style="${ishost?"":"display:none;"}color:white;font-size:16px;background-color: black;border-radius: 20px;padding: 5px 10px;position: absolute;left: 6px;top: 5px;width: 222px;text-align: right;z-index: 99998;height: 30px;line-height: 20px;">Poor network connection</div>
                </div>`;
      $(document.body).append(html);
    }
    else
    {
     
      return;
    }
    if (ishost)
    {
      setTimeout(() =>
      {
        $("#BadNetworkTip_text").animate({
          left: "-500px",
          opacity: 0
        }, 1000, function ()
        {
          $("#BadNetworkTip_text").hide();
        });
      }, 2500);
    }

  },
  ShowGlobalBlockMsg(msg, show = true) {
    if (show == true) {
        if ($("#GlobalBlockMsg").length > 0) {
            $("#GlobalBlockMsg").html(msg).show();
        } else {
            var hei = $(document.body).height();
            var html ="<div id='GlobalBlockMsg' style='position:absolute; top:0px; left:0px;z-index:50002; width:100%; height:" +
                hei +"px;line-height:" +hei +
                "px; vertical-align:middle;text-align:center; font-size:20px;background-color:rgba(55,55,55,.6);color:#ffffff;'>" +
                msg +"</div>";
            $(document.body).append(html);
        }
    } else {
        $("#GlobalBlockMsg").remove();
    }
},
  ShowDownload(isshow)
  {
    if (!isshow)
    {
      $("#DownloadFileTip").hide();
      return;
    }
    var tip = $("#DownloadFileTip");
    if (tip.length == 0)
    {
      var html = `<div id="DownloadFileTip" title="DownloadFile!" style="position:absolute; left:5px; top:5px;z-index:99999;" >
                <div id="DownloadFileTip_text" style="color:white;font-size:14px;background-color: black;border-radius: 20px;padding: 5px 10px;position: absolute;left: 6px;top: 5px;width: 110px;text-align: left;z-index: 99998;height: 30px;line-height: 20px;">文件下载中...</div>
                </div>`;
      $(document.body).append(html);
    }
    else
    {
      $("#DownloadFileTip").show();
    }
  },
  /**
   * setInterval扩展,前一次完成后,间隔一定时间在调用第二次
   * @param {()=>boolean}  asyncFunction - 必须是async;返回true继续下一次,false终止
   * @param {integer}  timeout - 间隔时间
   */
  async setIntervalEx(asyncFunction, timeout)
  {
    //loger.log("setIntervalEx:436");
    var result = await asyncFunction();
    if (result)
    {
      setTimeout(() => { this.setIntervalEx(asyncFunction, timeout); },timeout);  
    }
  },
  async GetCanUseMic()
  { 
    if (navigator.mediaDevices &&navigator.mediaDevices.enumerateDevices) 
    {
      var devices = await navigator.mediaDevices.enumerateDevices();
      var micList = [];
      devices.forEach(device =>
      {
        if (device.kind == "audioinput")
        {
          micList.push(device.deviceId);
        }
      });
      var mic = localStorage.getItem("DefaultMic");
      var canuse = false;
      if (mic && mic != null && mic != "")
      {
        if (IsExistInArr(micList, mic)) 
        {
          canuse = await this.IsMicCanUse(mic);
          if (canuse)
          {
            return mic;
          }
          return "";
        }
      }
      for(var micid of micList)
      {
        if(mic && micid==mic)
        {
          continue;
        }
        canuse = await this.IsMicCanUse(micid);
        if(canuse)
        {
          return micid;
        }
      }
      return "";
    }
    else
    {
      return "";
    }
  },
  async GetCanUseCamera()
  { 
    if (navigator.mediaDevices &&navigator.mediaDevices.enumerateDevices) 
    {
      var devices = await navigator.mediaDevices.enumerateDevices();
      var micList = [];
      devices.forEach(device =>
      {
        if (device.kind == "videoinput")
        {
          micList.push(device.deviceId);
        }
      });
      
      var camera = localStorage.getItem("DefaultCamera");
      var cameraSecond = localStorage.getItem("DefaultSecondCamera");
      var canuse = false;
      if (camera && camera != null && camera != "")
      {
        var camexist = false;
        if (IsExistInArr(micList, camera)) 
        {
          canuse = await this.IsCamCanUse(camera);
          if (canuse)
          {
            return camera;
          }
          camexist = true;
        }
        else if (IsExistInArr(micList, cameraSecond)) 
        {
          canuse = await this.IsCamCanUse(cameraSecond);
          if (canuse)
          {
            return cameraSecond;
          }
          camexist = true;
        }
        if (camexist)
        {
          return "";  
        }
      }
      for(var micid of micList)
      {
        if(camera && micid==camera)
        {
          continue;
        }
        canuse = await this.IsCamCanUse(micid);
        if(canuse)
        {
          return micid;
        }
      }
      return "";
    }
    else
    {
      return "";
    }
  },
  IsMicCanUse(id)
  {     
    return new Promise((resolve, reject) =>
    {
      //console.log("IsMicCanUse:"+id);
      //var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      //console.log(getUserMedia);
      navigator.getUserMedia({audio:{deviceId:id}},(stream)=>
      {
        if (stream && stream.getTracks)
        {
          try
          {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
          }
          catch (ex) { }
        }
        resolve(true);

      }, (error) =>
        {
          resolve(false);
        });
    });    
  },
  IsCamCanUse(id)
  { 
    return new Promise((resolve, reject) => {
      //var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      navigator.getUserMedia({ video: { deviceId: id } }, (stream) =>
      {
        if (stream && stream.getTracks)
        {
          try
          {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
          }
          catch (ex) { }
        }
        resolve(true);

      },(error) =>
      { 
        resolve(false);
      });
    });
    
  },
  GetBucketInfo(all=false)
  { 
    if (this._bucketInfo != null && (new Date() - this._bucketInfo.Time) < 20*60000)
    {
      //return this._bucketInfo.Info;
      if (all)
      {
        return this._bucketInfo.Info;
      }
      else
      {
        return {ServiceProviderId:this._bucketInfo.Info.ServiceProviderId,RegionName:this._bucketInfo.Info.RegionName,BucketName:this._bucketInfo.Info.BucketName};
      }
    }
    var uploadparam = webapi.prepareUploading(navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? "47.254.218.88" : "");//202.102.3.141  4.4.4.4
    //var uploadparam = webapi.prepareUploading("");
    while(!uploadparam || uploadparam.Success!=true)
    {
      uploadparam = webapi.prepareUploading(navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? "4.4.4.4" : "");//202.102.3.141  4.4.4.4
    }
    var convertParam = {
      ServiceProviderId: uploadparam.Data.ServiceProviderId,
      RegionName: uploadparam.Data.RegionName,
      BucketName: uploadparam.Data.BucketName,
      AccessKeyId:uploadparam.Data.AccessKeyId,
      AccessKeySecret:uploadparam.Data.AccessKeySecret,
      SecurityToken:uploadparam.Data.SecurityToken,
    }
    this._bucketInfo = { Info: convertParam, Time: new Date() };
    if (all)
    {
      return convertParam;
    }
    else
    {
      return {ServiceProviderId:convertParam.ServiceProviderId,RegionName:convertParam.RegionName,BucketName:convertParam.BucketName};
    }
  },
  GetSignedUrl(key,bucket)
  {     
    var uploadparam = null;
    if (bucket)
    {
      uploadparam = bucket;
    }
    else
    {
      uploadparam = this.GetBucketInfo(true);
    }
    //console.log(uploadparam);
    var url = "";
    if(uploadparam.ServiceProviderId==1)
    {
      // var s3 = new S3({
      //   apiVersion: '2006-03-01',
      //   params: {Bucket: uploadparam.BucketName},
      //   accessKeyId:uploadparam.AccessKeyId,
      //   secretAccessKey:uploadparam.AccessKeySecret,
      //   sessionToken:uploadparam.SecurityToken,
      //   region:uploadparam.RegionName,
      // });
      ////s3.getSignedUrl('getObject', { Bucket: uploadparam.BucketName, Key: key, Expires: 60 }, function (err, data) { });
      //var params = {Bucket: uploadparam.BucketName, Key: key};
      //url = s3.getSignedUrl('getObject', params);
      url = `https://s3-${uploadparam.RegionName}.amazonaws.com/${uploadparam.BucketName}/${key}`;
    }
    else 
    {
      // var client = new OSS({
      //   region: uploadparam.RegionName,
      //   accessKeyId: uploadparam.AccessKeyId,
      //   accessKeySecret: uploadparam.AccessKeySecret,
      //   bucket: uploadparam.BucketName,
      //   stsToken: uploadparam.SecurityToken
      // });
      //https://peertime.oss-cn-shanghai.aliyuncs.com/P49/Attachment/D39714/73297715-db81-417e-996b-e306c2f8564d_<12>.jpg
      //url = client.generateObjectUrl(key);
      url = `https://${uploadparam.BucketName}.${uploadparam.RegionName}.aliyuncs.com/${key}`;
      
    }
    //url = url.replace("%3C", "<").replace("%3E", ">");
    //console.log("GetSignedUrl:", key, url);
    return url;
  },
  Sleep(time)
  {
      return new Promise((resolve, reject) => {
          setTimeout(()=>{resolve(true)},time);
      });
  },
  ConvertToNewUrl(Url,callback,cancelbefore=true)
  { 
    //console.log("ConvertToNewUrl:" + Url);
    return new Promise((resolve, reject) =>
    {
      // if (callback)
      // {
      //   callback(Url, true, false);
      // }
      // resolve(Url);
      // return;

      if (cancelbefore)
      {
        if (this._cancelQueryDocument && this._cancelQueryDocument.Cancel)
        {
          this._cancelQueryDocument.Cancel();
        }
        else
        {
          this._cancelQueryDocument = {};
        }
      }
      Url = Url.substr(9);
      Url = Url.substr(Url.indexOf("/P49") + 1);
      var path = Url.substr(0, Url.lastIndexOf("/") + 1);
      var name = Url.substr(Url.lastIndexOf("/") + 1);
      this.queryDocument(path, (info) =>
      {
        if (info && info.Success)
        {
          var newUrl = this.GetSignedUrl(path + name, info.Data.Bucket);
           if(callback)callback(newUrl, true,info.Data.IsTemporary);
          resolve(newUrl);
        }
        else
        {
          var newUrl = this.GetSignedUrl(path + name);
          if(callback)callback(newUrl, false,false);
          resolve(newUrl);
        }
        
      },this._cancelQueryDocument);
      // this.QueryDownloading(path, (isSuccess) =>
      // {
      //   var newUrl = this.GetSignedUrl(path + name);
      //   if(callback)callback(newUrl, isSuccess);
      //   resolve(newUrl);
      // });

      
    });
  },
  ConvertToNewUrlEx(Url,callback,cancelbefore=true)
  { 
    //console.log("ConvertToNewUrl:" + Url);
    return new Promise((resolve, reject) =>
    {
      // if (callback)
      // {
      //   callback(Url, true, false);
      // }
      // resolve(Url);
      // return;

      if (cancelbefore)
      {
        if (this._cancelQueryDocument && this._cancelQueryDocument.Cancel)
        {
          this._cancelQueryDocument.Cancel();
        }
        else
        {
          this._cancelQueryDocument = {};
        }
      }
      Url = Url.substr(9);
      Url = Url.substr(Url.indexOf("/P49") + 1);
      var path = Url.substr(0, Url.lastIndexOf("/") + 1);
      var name = Url.substr(Url.lastIndexOf("/") + 1);
      this.queryDocumentEx(path, (info) =>
      {
        if (info && info.Success)
        {
          var newUrl = this.GetSignedUrl(path + name, info.Data.Bucket);
           if(callback)callback(newUrl, true,info.Data.IsTemporary);
          resolve(newUrl);
        }
        else
        {
          var newUrl = this.GetSignedUrl(path + name);
          if(callback)callback(newUrl, false,false);
          resolve(newUrl);
        }
        
      },this._cancelQueryDocument);
      
    });
  },
  SwitchDocServer(Url)
  { 
    //https://s3-us-west-1.amazonaws.com/txlivedoc1b2/P49/Attachment/D26681/2b3426ca-672d-4567-86c5-835aa799b3b8_4_4K.jpg
    //https://peertime-test.oss-cn-shanghai.aliyuncs.com/P49/Attachment/D22133/09d3a18a-9600-4755-944a-6f863319e8be_1_4K.jpg
    //https://s3-us-west-1.amazonaws.com/txlivedoc2b1/P49/Attachment/D58377/72e9b5e2-8d6f-4eea-b89a-e53da5bacdc9_3_4K.jpg 正式服
    //https://peertime.oss-cn-shanghai.aliyuncs.com/P49/Attachment/D58699/d8525ee3-b180-4920-a0f9-cd892858bd0e_1_4K.jpg 正式服
    var newurl = Url.substr(9);
    newurl = newurl.substr(newurl.indexOf("/P49") + 1);
    var path = newurl.substr(0, newurl.lastIndexOf("/") + 1);
    var name = newurl.substr(newurl.lastIndexOf("/") + 1);
    if (Url.indexOf("s3-us-west-1.amazonaws.com/txlivedoc1b2") > -1)
    {
      return "https://peertime-test.oss-cn-shanghai.aliyuncs.com/" + path + name;
    }
    else if(Url.indexOf("peertime-test.oss-cn-shanghai.aliyuncs.com") > -1)
    {
      return "https://s3-us-west-1.amazonaws.com/txlivedoc1b2/" + path + name;
    }
    else if(Url.indexOf("s3-us-west-1.amazonaws.com/txlivedoc2b1") > -1)
    {
      return "https://s3-us-west-1.amazonaws.com/txlivedoc2b1" + path + name;
    }
    else if(Url.indexOf("peertime.oss-cn-shanghai.aliyuncs.com") > -1)
    {
      return "https://peertime.oss-cn-shanghai.aliyuncs.com/" + path + name;
    }
    return Url;
  },
  async queryDocument(path, callback,cancel)
  {
    var result = null;
    var trycount = 0;
    while (trycount<3 && (result == null || !result.Success))
    {
      try
      {
        result = await webapi.queryDocument({ Key: { "Option": 1, "Key": path } }, cancel);
        trycount++;
      }
      catch (ex)
      {
        return "abort";
      }
    }
    if (callback) callback(result);
    return result;
  },
  async queryDocumentEx(path, callback,cancel)
  {
    var result = null;
    var trycount = 0;
    while (trycount<3 &&(result == null || !result.Success))
    {
      try
      {
        result = await webapi.queryDocumentEx({ Key: { "Option": 1, "Key": path } }, cancel);
        trycount++;
      }
      catch (ex)
      {
        return "abort";
      }
    }
    if (callback) callback(result);
    return result;
  },
  async QueryDownloading(path,callback)
  {
    //console.log("QueryDownloading:"+path);
    if(!path || path=="")
    {
      callback(false);
      return false;
    }
    var bucket = this.GetBucketInfo();
    // var ptresult = await webapi.queryDownloadingFromPT(this.getFileIDFromPath(path))
    // if (ptresult && ptresult.RetData==1)
    // {
    //   $("#livePdfProgress").hide();
    //   this._downloadProcessPercent=0;
    //   if(callback)callback(true);        
    //   return true;
    // }

    var firstresult = await this.downloadProcess({Bucket:bucket,Path:path});
    if(firstresult.Code ==-1)
    {
      $("#QueryDownloadingTip").hide();
      if(callback)callback(false);
      return false;
    }
    else if(firstresult.Code ==100)
    {
        $("#QueryDownloadingTip").hide();
        this._downloadProcessPercent = 0;
        //webapi.CreateDocumentProviderCache(this.getFileIDFromPath(path),bucket.ServiceProviderId);
        if(callback)callback(true);
        
      return true;
    }
    var tip = $("#QueryDownloadingTip");
    if (tip.length == 0)
    {
      //var html = '<div id="QueryDownloadingTip" title="Downloading file" style="position:absolute; left:10px; top:10px;color:red;display:none; z-index:99999;font-size:16px;" ></div>';
      //$(document.body).append(html);
      var html = `<div id="QueryDownloadingTip" title="Syncing file!" style="position:absolute; left:5px; top:5px;z-index:99999;" >
            <div style="width: 30px;display: inline-block;z-index: 99999;position: absolute;left: 5px;top: 5px;background-color:##0081ff;border-radius:50%;vertical-align:top;height:30px;text-align:center;">
            <span id="QueryDownloadingTip_percent" style="font-size:12px;color:white;line-height:30px;"></span></div>
            <div id="QueryDownloadingTip_text" style="display:none;color:white;font-size:16px;background-color: black;border-radius: 20px;padding: 5px 10px;position: absolute;left: 6px;top: 5px;width: 222px;text-align: right;z-index: 99998;height: 30px;line-height: 20px;"></div>
            </div>`;
      $(document.body).append(html);
      tip = $("#QueryDownloadingTip");
    }
    else
    {
      $("#QueryDownloadingTip_percent").html("0%");
      tip.show();
    }
    if (firstresult.From && firstresult.To)
    {
      var title = `Syncing from ${this.getDownloadServerName(firstresult.From.ServiceProviderId)} to ${this.getDownloadServerName(firstresult.To.ServiceProviderId)}!`;
      $("#QueryDownloadingTip_text").html(title).show();
    }
    else
    {
      $("#QueryDownloadingTip_text").hide();
    }
    
    var self = this;
    if (self._downloadProcessTimer)
    {
      clearInterval(self._downloadProcessTimer);
      self._downloadProcessTimer = null;
    }
    this._downloadProcessPercent=0;
    self._downloadProcessTimer = setInterval(async () =>
    { 
      console.log("setInterval:491");
      var result = await this.downloadProcess({ Bucket: bucket, Path: path });
      if(result.Code ==-1)
      {
        clearInterval(self._downloadProcessTimer);
        self._downloadProcessTimer = null;
        tip.hide();
        if (callback) callback(false);
        return false;
      }
      else if(result.Code ==100)
      {
        clearInterval(self._downloadProcessTimer);
        self._downloadProcessTimer = null;
        tip.hide();
        this._downloadProcessPercent = 0;
        //webapi.savestat(); //todo...
        //webapi.CreateDocumentProviderCache(this.getFileIDFromPath(path),bucket.ServiceProviderId);

        if (callback) callback(true);
        return false;
      }
      else
      {
        if (result.From && result.To && !$("#QueryDownloadingTip_text").is(":visible"))
        {
          var title = `Syncing from ${this.getDownloadServerName(firstresult.From.ServiceProviderId)} to ${this.getDownloadServerName(firstresult.To.ServiceProviderId)}!`;
          $("#QueryDownloadingTip_text").html(title).show();
        }
        $("#QueryDownloadingTip_percent").html(this._downloadProcessPercent + "%");
        return true;
      }

    },3500);
  },
  async downloadProcess(info)
  {
      var path=info.Path;
      var res =await webapi.queryDownloading({ Keys: [{ "Option": 1, "Key": path }], "Bucket": info.Bucket });
      if(res==null)
      {
        return {Code:this._downloadProcessPercent};
      }
      else if (res.Success == false)
      {
          clearInterval(this._downloadProcessTimer);
          this._downloadProcessTimer = null;
          return {Code:-1};
      }
    
      if(res.Data[path].Status==1)
      {        
        clearInterval(this._downloadProcessTimer);
        this._downloadProcessTimer = null;
        this._downloadProcessPercent = 100;
        return {Code:100};
      }
      else if(res.Data[path].Status==2)
      {
        this._downloadProcessPercent = res.Data[path].SyncProgress;
        //return { Code: this._downloadProcessPercent, From: { ServiceProviderId: 1 }, To: { ServiceProviderId: 2 } };
        return { Code: this._downloadProcessPercent, From: {ServiceProviderId:res.Data[path].SyncDetail.From.StorageServiceProvider},To:{ServiceProviderId:res.Data[path].SyncDetail.To.StorageServiceProvider}};
      }
      else if(res.Data[path].Status==3)
      {
          clearInterval(this._downloadProcessTimer);
          this._downloadProcessTimer = null;
          return {Code:-1};
      }    
    

      if(this._downloadProcessPercent==100)
      {
          clearInterval(this._downloadProcessTimer);
          this._downloadProcessTimer = null;
          return {Code:100};
      }
      return {Code:-1};
  },
  async getSourceFileUrl(Url)
  { 
    Url = Url.substr(9);
    Url = Url.substr(Url.indexOf("/P49") + 1);
    var path = Url.substr(0, Url.lastIndexOf("/") + 1);
    var name = Url.substr(Url.lastIndexOf("/") + 1);
    var info = await webapi.queryDocument({ Key: { "Option": 0, "Key": path + name } });
    if (info && info.Success)
    {
      var newUrl = this.GetSignedUrl(path + name, info.Data.Bucket);
      return newUrl;
    }
    else
    {
      return "";
    }
    
  },
  getDownloadServerName(id)
  { 
    if (id == 1) return "S3";
    else if (id == 2) return "OSS";
  },
  getFileIDFromPath(path)
  { 
    //"P49/Attachment/D48301/"
    var fileid = path.substr(0, path.lastIndexOf("/"));
    fileid = fileid.substr(fileid.lastIndexOf("/") + 1);
    fileid = fileid.replace("D","");
    //console.log("getFileIDFromPath:"+path+"=>"+fileid);
    return fileid;
  }
}
