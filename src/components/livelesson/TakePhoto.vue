<template>
  <div class="takephoto">
    <Modal title="Take a photo"
           v-model="showTakePhoto"
           :closable="false"
           class-name="hideModalFooter hideModalHead"
           :mask-closable="false"
           :styles="{top: '20px'}"
           width="800" style="z-index:40000;position: absolute;">
      <div>
        <span style=" text-align:right; float:right;">
          <Button type="success" style="width:170px;" icon="ios-camera-outline" @click="onTakePhotoAndUpload">Take photo and upload</Button><span style="padding-left:10px;"></span>
          <Button type="primary" style="width:90px;" icon="close" @click="onClose">Cancel</Button>
        </span>
        <RadioGroup v-model="selectCamera" @on-change="onCameraChange" style="height:30px; line-height:30px; vertical-align:middle;">
          <span style="padding-right:10px;">Select camera:</span>
          <Radio v-for="item in listCamera" :key="item.deviceId" :label="item.label" :value="item.deviceId"></Radio>
        </RadioGroup>

      </div>
      <div style="padding-top:10px;">
        <video id="takephoto-video" width="768" height="576"></video>
        <canvas id="takephoto-canvas" style="display:none;"></canvas>
      </div>
      
    </Modal>    
  </div>
</template>
<style lang="scss" scoped>

 
</style>
<script>
  import auth from '../../authenticator';
  export default {
    data: function ()
    {
      return {
        listCamera: [],
        selectCamera: "",
        showTakePhoto: false,
        mediaStream:null
      };
    },
    props: {
      show:
      {
        type:Boolean
      },
      LessonID:
      {
        
      }
    },
    mounted: function () {
    },
    methods: {
      Init()
      {
        this.showTakePhoto = true;
        this.getCameraList();
        //console.log("Init");
      },
      Close()
      {
        if (this.mediaStream)
        {
          this.mediaStream.getTracks().forEach(track => track.stop());
        }
        this.showTakePhoto = false;
        this.listCamera = [];
        //console.log("Close");
      },
      onTakePhotoAndUpload()
      {
        var video = $("#takephoto-video")[0];
        var w = video.videoWidth;
        var h = video.videoHeight;
        //console.log(video.videoWidth + "," + video.videoHeight);
        $("#takephoto-canvas").attr("width", w).attr("height", h);
        gid("takephoto-canvas").getContext('2d').drawImage(video, 0, 0);
        //var pic = gid("takephoto-canvas").toDataURL('image/png');
        //console.log(pic);
        this.upload();
        this.onClose();
      },
      upload()
      {
        var xhr = new XMLHttpRequest();
        xhr.onload = (event) =>
        {
          var issuccess = false;
          try
          {
            var res = JSON.parse(xhr.responseText);
            if (res && res.RetCode == 0)
            {
              issuccess = true;
            }
          }
          catch (ex) { }
          xhr.onload = null;
          xhr = null;

        }
        var title = auth.getUserName() +" "+ (new Date()).Format("yyyy-MM-dd hh:mm:ss")+".png";
        var url = GetAPIUrl() + "EventAttachment/UploadCameraShot?Title=" + title+"&Description=TakePhoto&Hash=";
        url += "&LessonID=" + this.LessonID;
        url+= "&FileName=";

        var formdata = new FormData();
        formdata.append("file", gid("takephoto-canvas").toDataURL('image/png'));
        xhr.open('POST', url, true);
        xhr.setRequestHeader("UserToken", auth.getUserToken());
        xhr.send(formdata);
      },
      getCameraList()
      {
        navigator.mediaDevices.enumerateDevices().then((devices) =>
        {
          devices.forEach((device) =>
          {
            if (device.kind == "videoinput")
            {
              this.listCamera.push(device);
            }
          });
          this.selectCamera = "";
          if (this.listCamera.length > 0)
          {
            let defaultCamera = window.localStorage.getItem('DefaultCamera');
            if (defaultCamera && defaultCamera != "")
            {
              for (var d of this.listCamera)
              {
                if (d.deviceId == defaultCamera)
                {
                  this.selectCamera = d.label;
                  this.showCamera(d.deviceId);
                }
              }
            }
            if (this.selectCamera == "")
            {
              this.selectCamera = this.listCamera[0].label;
              this.showCamera(this.getDeviceId(this.selectCamera));
            }
          }

        });
      },
      showCamera(deviceId)
      {
        if (this.mediaStream)
        {
          this.mediaStream.getTracks().forEach(track => track.stop());
        }
        //console.log("showCamera:" + deviceId);
        //width: { min: 1024, ideal: 1280, max: 1920 },
        //height: { min: 776, ideal: 720, max: 1080 }
        navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: deviceId
          },
          audio: false
        }).then((stream)=>
        {          
          //console.log(stream);
          this.mediaStream = stream;
          var video = $("#takephoto-video")[0];
          //var windowURL = window.URL || window.webkitURL;
          //video.src = window.URL.createObjectURL(stream);
          video.srcObject=stream;
          video.play();
        }).catch((err)=>
        {
          console.log(err);
        });
      },
      getDeviceId(label)
      {
        for (var d of this.listCamera)
        {
          if (d.label == label)
          {
            return d.deviceId;
          }
        }
        return "";
      },
      onClose()
      {
        this.Close();
        this.$emit("onTakePhotoFinish", this.selectCamera);
      },
      onCameraChange()
      {
        console.log("onCameraChange:" + this.getDeviceId(this.selectCamera));
        this.showCamera(this.getDeviceId(this.selectCamera));
      }
    },
    watch: {
      show(ishow)
      {
        if (ishow)
        {
          this.Init();
        }
        else
        {
          this.Close();
        }
      }
    }
  }
</script>
