<template>
  <div :id="preid+'-uploadfilectl'" class="uploadfilectl">
    <Modal title="UploadProcess"
           v-model="showUploadProcess"
           :closable="false"
           class-name="hideModalFooter hideModalHead"
           :mask-closable="false"
           width="500" style="z-index:50000;position: absolute;">
      <div style="font-size:16px; font-weight:bold;text-align:center;">Uploading</div>
      <div style="font-size:16px; margin-top:20px;text-align:center;">
        <Icon type="ios-videocam"></Icon>
        <span style="padding-left:5px;">{{uploadFileName}}</span>
      </div>
      <div style="height:160px; padding-top:20px; text-align:center;">
        <i-circle :percent="uploadPercent">
          <Icon v-if="uploadPercent == 100" type="ios-checkmark-empty" size="60" style="color:#5cb85c"></Icon>
          <span v-else style="font-size:24px">{{ uploadPercent }}%</span>
        </i-circle>
      </div>
      <div style="text-align:center;padding:20px 0px 10px;">
        <Button type="ghost" size="large" style="width:30%;" :disabled="uploadCanceled" @click="onCancelUpload">Cancel</Button>
      </div>
    </Modal>
  </div>
</template>
<style lang="scss">
  $images-root: "../../../static/images/";

  .hideModalFooter {
  }

  .hideModalFooter .ivu-modal-footer {
    display: none;
  }

  .hideModalHead {
  }

    .hideModalHead .ivu-modal-header {
      display: none;
    }
  .uploadfilectl {

  }
</style>
<script>
  import auth from '../../authenticator';
  import loger from '../../common/log.js';
  import util from '../../common/util.js';
  import webapi from "../../webapi/webapi.js";
  //var AWS = require('aws-sdk/dist/aws-sdk-react-native');
  //var S3 = require('aws-sdk/clients/s3');
  //var uuid = require('uuid');
  //const OSS = require('ali-oss');
export default {
    data: function ()
    {
      return {
        showUploadProcess: false,
        isUploading:false,
        uploadFileName: "",
        uploadUrl:"",
        uploadPercent: 0,
        uploadCanceled: false,
        uploadTimer: null,
        sizePerPiece: 1024,
        sleep:1000,
        client:null,
        s3:null,
        // client:new OSS({
        //   region: 'oss-cn-shanghai',
        //   accessKeyId: 'LTAIcw5JmsTiae9F',
        //   accessKeySecret: 'J0b1dc9RBwteROJoTiEMHr8w57SsyH',
        //   bucket: 'ptfiles'//,endpoint:"oss-cn-shanghai.aliyuncs.com"
        // }),
      }
    },
    props: ["preid"],
    components: {

    },
    mounted: function ()
    {

    },
    watch: {
      
    },
    methods: {
      async UploadCloud(File, name, onSuccess, onCancel,onProcess,onError)
      {
        this.isUploading = true;
        if(!onProcess)
        {
          this.showUploadProcess = true;
        }
         var uploadparam=util.GetBucketInfo(true);
         //var uploadparam= webapi.prepareUploading("4.4.4.4");//202.102.3.141
          //console.log(uploadparam);
          if(uploadparam==null)
          {
            this.$Notice.error({
                title:"Upload file error!",
                desc: "",
                duration: 4,
                bottom: 60,
                left: true
            });
            this.isUploading = false;
            this.showUploadProcess = false;
            onCancel();
            return;
          }
          var convertParam = {
            ServiceProviderId: uploadparam.ServiceProviderId,
            RegionName: uploadparam.RegionName,
            BucketName: uploadparam.BucketName
          }
          //console.log(convertParam);
          if(uploadparam.ServiceProviderId==1)
          {
            //await util.LoadJsFiles(["https://sdk.amazonaws.com/js/aws-sdk-2.454.0.min.js"]);
            await util.LoadJsFiles(["/static/aws-sdk-2.492.0.min.js"]);
            this.s3 = new AWS.S3({
              apiVersion: '2006-03-01',
              params: {Bucket: uploadparam.BucketName},
              accessKeyId:uploadparam.AccessKeyId,
              secretAccessKey:uploadparam.AccessKeySecret,
              sessionToken:uploadparam.SecurityToken,
              region:uploadparam.RegionName,
              maxRetries:0,//5
              retryDelayOptions:{customBackoff:(retrycount)=>{
                //console.log("customBackoff");
                if(retrycount==4 && onError)
                {
                  onError(1);
                }
                return 3000;
              }},
              httpOptions:{timeout:600000}
            });
            //this.UploadAWS(File, name, onSuccess, onCancel,onProcess,onError,convertParam); 
            this.UploadAWSEx(File, name, onSuccess, onCancel,onProcess,onError,convertParam);           
          }
          else 
          {
            await util.LoadJsFiles(["https://gosspublic.alicdn.com/aliyun-oss-sdk-6.0.2.min.js"]);
            this.client=new OSS({
              region: uploadparam.RegionName,
              accessKeyId: uploadparam.AccessKeyId,
              accessKeySecret: uploadparam.AccessKeySecret,
              bucket: uploadparam.BucketName,
              stsToken:uploadparam.SecurityToken,
              timeout:120000//ms
            }),
            this.UploadOss(File, name, onSuccess, onCancel,onProcess,onError,convertParam);
          }
          return true;
      },
      async UploadAWS(File, name, onSuccess, onCancel,onProcess,onError,convertParam)
      {
        this.uploadCanceled = false;
        var upload = new AWS.S3.ManagedUpload({
            params: {Bucket: this.s3.config.params.Bucket, Key: name, Body: File,ACL:"public-read"},
            service:this.s3,
            partSize: 5*1024 * 1024,//min:5242880
            queueSize: 2
          });
        this.isUploading = true;
        this.uploadPercent = 0;
        const guid = GUID();
        if (onProcess)
        {
          onProcess(-1, guid);
        }
        else
        {
          this.showUploadProcess = true;
        }
        upload.on("httpUploadProgress",(res)=>{
          //console.log(res);
          if (onProcess)
          {
            this.uploadPercent = Math.max(this.uploadPercent,Math.floor(res.loaded*100 / res.total));
            onProcess(this.uploadPercent, guid);
          }
            if (this.uploadCanceled == true)
            {
              upload.abort();
              this.showUploadProcess = false;
              this.isUploading = false;
              this.uploadCanceled = false;
              this.uploadPercent = 0;
              if (onCancel) onCancel();
            }           
        });
        upload.send((err, data)=> {
          if(err)
          {
            this.showUploadProcess = false;
            this.isUploading = false;
            this.uploadPercent = 0;
            if(onError) onError(2);
            else if(onCancel) onCancel();
          }
          else
          {
            this.showUploadProcess = false;
            this.isUploading = false;
            this.uploadPercent = 0;
            if (onSuccess) onSuccess(guid,convertParam);
          }
        });


        return true;
        console.log(bucketName)
        var params = {
          Bucket: this.s3.config.params.Bucket, /* required */
          Key: name, /* required */
        }
        const result = await this._S3createMultipartUpload(params); 
        console.log(result)      
      },
      async UploadAWSEx(File, name, onSuccess, onCancel,onProcess,onError,convertParam)
      {
        //abortMultipartUpload(params = {}, callback)
        //completeMultipartUpload(params = {}, callback)
        //createMultipartUpload(params = {}, callback) 
        //uploadPart(params = {}, callback)
        var createparams={
          Bucket: this.s3.config.params.Bucket,
          Key: name,
          ACL: "public-read"
        };

        this.uploadCanceled = false;
        const result = await this._S3createMultipartUpload(createparams);
        //console.log(result);
        if(result==null)
        {
          if(onError)onError(1,"createMultipartUpload error");
          this.isUploading = false;
          this.uploadPercent = 0;
          this.showUploadProcess = false;
          return false;
        }
        const uploadId = result.UploadId;
        let partSize = 1024 * 1024 * 5;
        let fileobj = File;
        this.isUploading = true;
        this.uploadPercent = 0;
        const fileSize = File.size;
        const dones = [];
        const total = Math.ceil(fileSize / partSize);
        const guid = GUID();
        if (onProcess)
        {
          onProcess(-1, guid);
        }
        else
        {
          this.showUploadProcess = true;
        }
        for (let i = 1; i <= total; i++)
        {
            
            const start = partSize * (i -1);
            const end = Math.min(start + partSize, fileSize);
            var uploadparams = {
              Bucket: this.s3.config.params.Bucket,
              Key: name,
              PartNumber: i,
              UploadId: uploadId,
              Body: File.slice(start, end)
            }
            var part =null;
            let trycount=0;
            while(part==null)
            {
              //console.log("while");
              if (this.uploadCanceled == true)
              {
                if (this.uploadTimer)
                {
                  clearTimeout(this.uploadTimer);
                  this.uploadTimer = null;
                }
                var abortparams = {
                  Bucket: this.s3.config.params.Bucket,
                  Key: name,
                  UploadId: uploadId
                }
                await this._S3abortMultipartUpload(abortparams);
                this.showUploadProcess = false;
                this.isUploading = false;
                this.uploadCanceled = false;
                this.uploadPercent = 0;
                if (onCancel) onCancel();
                return false;
              }
              part = await this._S3uploadPart(uploadparams);
              if(part==null)
              {
                await util.Sleep(3000);
              }
              trycount++;
              if(trycount>=5)
              {
                if(onError) onError(4,"try too many times error");
                this.isUploading = false;
                this.uploadPercent = 0;
                this.showUploadProcess = false;
                return false;
              }
            }
            dones.push({PartNumber: i,ETag: part.ETag });
            //console.log(part);
            this.uploadPercent = Math.floor(start * 100 / fileSize);
            if(onProcess) onProcess(this.uploadPercent,guid);
        }
        var completeparams = {
          Bucket: this.s3.config.params.Bucket, 
          Key: name, 
          MultipartUpload: {
          Parts: dones
          }, 
          UploadId: uploadId
        };
        let endResult = await this._S3completeMultipartUpload(completeparams);
        //console.log(endResult);
        if(endResult==null)
        {
          if(onError) onError(2,"completeMultipartUpload error");
          this.isUploading = false;
          this.uploadPercent = 0;
          this.showUploadProcess = false;
          return false;
        }
        if(onProcess) onProcess(100,guid);
        if(onSuccess) onSuccess(guid,convertParam);
        this.isUploading = false;
        this.showUploadProcess = false;
        return true;

      },
      async _S3createMultipartUpload(params){
        return new Promise((resolve, reject) =>
        {
          this.s3.createMultipartUpload(params, (err, data)=>{
            if (err)
            {
              console.log(err, err.stack);
              resolve(null);
            }
            else
            { 
              resolve(data);
            }
          });
        });
      },
      async _S3uploadPart(params){
        return new Promise((resolve, reject) =>
        {
          this.s3.uploadPart(params, (err, data)=>{
            if (err)
            {
              console.log(err, err.stack);
              resolve(null);
            }
            else
            { 
              resolve(data);
            }
          });
        });
      },
      async _S3completeMultipartUpload(params){
        return new Promise((resolve, reject) =>
        {
          this.s3.completeMultipartUpload(params, (err, data)=>{
            if (err)
            {
              console.log(err, err.stack);
              resolve(null);
            }
            else
            { 
              resolve(data);
            }
          });
        });
      },
      async _S3abortMultipartUpload(params){
        return new Promise((resolve, reject) =>
        {
          this.s3.abortMultipartUpload(params, (err, data)=>{
            if (err)
            {
              console.log(err, err.stack);
              resolve(null);
            }
            else
            { 
              resolve(data);
            }
          });
        });
      },
      async UploadOss(File, name, onSuccess, onCancel,onProcess,onError,convertParam)
      {
        //name="temp/"+name;
        //http://gosspublic.alicdn.com/aliyun-oss-sdk-6.0.2.min.js
        
        try
        {
          this.uploadCanceled = false;
          const result = await this.client.initMultipartUpload(name);
          //console.log(result);
          if(!result || !result.uploadId)
          {
            if(onError)onError(1,"initMultipartUpload error");
            this.isUploading = false;
            this.uploadPercent = 0;
            this.showUploadProcess = false;
            return false;
          }
          const uploadId = result.uploadId;
          let partSize = 0;
          let fileobj = File;

          if (fileobj.size >= 1024 * 1024 * 10)
          {
              partSize = 1024 * 1024 * 1;
          }
          else
          {
              partSize = 1024 * 512;
          }
          this.isUploading = true;
          this.uploadPercent = 0;
          const fileSize = File.size;
          const dones = [];
          const total = Math.ceil(fileSize / partSize);
          const guid = GUID();
          if (onProcess)
          {
            onProcess(-1, guid);
          }
          else
          {
            this.showUploadProcess = true;
          }
          for (let i = 1; i <= total; i++)
          {
              const start = partSize * (i -1);
              const end = Math.min(start + partSize, fileSize);
              let part = null;
              let trycount=0;
              //console.log(part);
              while(!part || !part.etag)
              {
                try
                {
                  if (this.uploadCanceled == true)
                  {
                    if (this.uploadTimer)
                    {
                      clearTimeout(this.uploadTimer);
                      this.uploadTimer = null;
                    }
                    this.client.abortMultipartUpload(name, uploadId);
                    this.showUploadProcess = false;
                    this.isUploading = false;
                    this.uploadCanceled = false;
                    this.uploadPercent = 0;
                    if (onCancel) onCancel();
                    return false;
                  }
                  part = await this.client.uploadPart(name, uploadId, i, File, start, end);
                }
                catch(uploadPartExp)
                {
                  part=null;
                }
                if(part==null)
                {
                  await util.Sleep(3000);
                }
                trycount++;
                if(trycount>=5)
                {
                  if(onError) onError(4,"try too many times error");
                  this.isUploading = false;
                  this.uploadPercent = 0;
                  this.showUploadProcess = false;
                  return false;
                }
                //console.log(part);
              }
              dones.push({number: i,etag: part.etag });
              //console.log(part);
              this.uploadPercent = Math.floor(start * 100 / fileSize);
              if(onProcess) onProcess(this.uploadPercent,guid);
          }
          let endResult = await this.client.completeMultipartUpload(name, uploadId, dones);
          //console.log(endResult);
          if(!endResult || !endResult.res)
          {
            if(onError) onError(2,"completeMultipartUpload error");
            this.isUploading = false;
            this.uploadPercent = 0;
            this.showUploadProcess = false;
            return false;
          }        
          if(onProcess) onProcess(100,guid);
          if(onSuccess) onSuccess(guid,convertParam);
          this.isUploading = false;
          this.showUploadProcess = false;
        }
        catch(exp)
        {
          if(onError) onError(3,"error");
          this.isUploading = false;
          this.uploadPercent = 0;
          this.showUploadProcess = false;
          return false;
        }
        return true;
      },
      Upload(File, Url, onSuccess, onCancel,onProcess)
      {
        if (this.uploadTimer)
        {
          clearTimeout(this.uploadTimer);
          this.uploadTimer = null;
        }
        if (Url.indexOf("?") > -1)
        {
          this.uploadUrl = Url + "&";
        }
        else
        {
          this.uploadUrl = Url + "?";
        }
        //this.GetMD5(File);
        var fileobj = File;
        var start = 0, end = 0;
        var index = 1, total = 1;
        var guid = GUID();
        if (fileobj.size >= 1024 * 1024 * 10)
        {
          this.sizePerPiece = 1024 * 256 * 1;
          this.sleep = 400;
        }
        else if (fileobj.size < 1024 * 1024 * 10 && fileobj.size > 1024 * 1024 * 1)
        {
          this.sizePerPiece = 1024 * 64;
          this.sleep = 300;
        }
        else
        {
          this.sizePerPiece = Math.round(fileobj.size / 10);
          this.sleep = 200;
        }

        total = Math.ceil(fileobj.size / this.sizePerPiece);
        var uploadfileself = (issuccess,res) =>
        {
          if(res && res.RetCode == -6004)//md5 error
          {
            this.showUploadProcess = false;
            this.isUploading = false;
            this.uploadCanceled = false;
            this.uploadPercent = 0;
            this.$Message.error({content: "Upload File Error!",duration: 0,closable: true})
            if (onCancel) onCancel();
            return;
          }
          else if (this.uploadCanceled == true)
          {
            if (this.uploadTimer)
            {
              clearTimeout(this.uploadTimer);
              this.uploadTimer = null;
            }
            this.showUploadProcess = false;
            this.isUploading = false;
            this.uploadCanceled = false;
            this.uploadPercent = 0;
            if (onCancel) onCancel();
            return;
          }
          if (issuccess)
          {
            start = end;
            index++;
          }
          this.uploadPercent = Math.floor(start * 100 / fileobj.size);
          if (onProcess) onProcess(this.uploadPercent, guid);
          if (start < fileobj.size)
          {

            end = Math.min(start + this.sizePerPiece, fileobj.size);
            var subdata = fileobj.slice(start, end);
            this.postFormData2SaveFile(start, end, subdata, fileobj.size, fileobj.name, guid, index, total, uploadfileself);
            subdata = null;
          }
          else
          {
            this.showUploadProcess = false;
            this.isUploading = false;
            if (onSuccess) onSuccess(res, guid);
          }
        };
        this.uploadPercent = 0;
        this.uploadFileName = fileobj.name;
        this.uploadCanceled = false;
        if (onProcess)
        {
          onProcess(-1, guid);
        }
        else{
          this.showUploadProcess = true;
        }
        this.isUploading = true;
        uploadfileself(false);
      },
      IsUploading()
      {
        return this.isUploading;
      },
      postFormData2SaveFile(start, end, data, total, filename, guid, index, totalpage, callback)
      {
        var xhr = new XMLHttpRequest();
        var clearxhr = function ()
        {
          xhr.onload = null;
          xhr.onerror = null;
          xhr.onabort = null;
          xhr.ontimeout = null;
          xhr = null;
        };
        xhr.onload = (event) =>
        {
          var issuccess = false;
          var res = null;
          try
          {
            res = JSON.parse(xhr.responseText);
            if (res && res.RetCode == 0)
            {
              if (res.RetData !== null && res.RetData !== "")
              {
                let result = JSON.stringify(res);
                sessionStorage.setItem("resultInfo", result);
              }
              issuccess = true;
            }
          }
          catch (ex) { }

          data = null;
          clearxhr();
          if (callback)
          {
            setTimeout(() =>
            {
              callback(issuccess, res);
            }, this.sleep);
          }
        };
        xhr.onerror = () =>
        {
          clearxhr();
          if (callback)
          {
            setTimeout(() =>
            {
              callback(false);
            }, this.sleep);
          }
        };
        xhr.onabort = () =>
        {
          clearxhr();
          if (callback)
          {
            setTimeout(() =>
            {
              callback(false);
            }, this.sleep);
          }
        };
        xhr.ontimeout = () =>
        {
          clearxhr();
          if (callback)
          {
            setTimeout(() =>
            {
              callback(false);
            }, this.sleep);
          }
        };
        var formdata = new FormData();
        formdata.append("file", data);
        xhr.open('POST', this.uploadUrl + "Title=" +encodeURIComponent(base64encode(utf16to8(filename))) + "&Guid=" + guid + "&Total=" + totalpage + "&Index=" + index, true);
        xhr.setRequestHeader("UserToken", auth.getUserToken());
        xhr.send(formdata);
      },
      onCancelUpload()
      {
        this.uploadCanceled = true;
        if (this.uploadPercent > 0)
        {
          this.uploadTimer = setInterval(() =>
          {
            this.uploadPercent = Math.max(Math.round(this.uploadPercent - this.uploadPercent * 0.1), 0);
          }, 500);
        }
      }
    },
    computed: {
      
    }
  }
</script>
