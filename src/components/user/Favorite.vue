<template>
  <div  id="myfavorite">
    <div class="fav-header" id="liveHead">
      <div class="left-logo">
        <span class="peertime-logo"></span>
      </div>
      <div class="main-router">
        <Button type="text" :class="{'current': currentViewId === 'schedule'}" @click="goSchedule">Schedule</Button>
        <Button type="text" :class="{'current': currentViewId === 'history'}" @click="goHistory">Lessons</Button>
        <Button type="text" :class="{'current': currentViewId === 'courses'}" @click="goCourse">Course</Button>
      </div>
      <user-info></user-info>
    </div>
    <div class="favtoolbar">
      <div style="height:50px; width:40px; display:inline-block; margin:4px; padding:0px;float:left;">
        <div style="" v-on:click="deleteFav();"><Icon type="close-circled" size="40" style="cursor:pointer;" ></Icon></div>
      </div>
      <Upload v-if="showUploadFile" ref="eventFileUpload"
              type="drag"
              :action="uploadAction"
              :headers="uploadHeaders"
              :show-upload-list="false"
              :default-file-list="editingEventFiles"
              :before-upload="handleEventFileBeforeUpload"
              :on-progress="handleEventFileProgress"
              :on-success="handleEventFileSuccess"
              :on-error="handleEventFileError"
              style="display: inline-block; width: 100px; float:left; height: 50px; margin: 4px; overflow: hidden; "
              accept="image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
        <div style="align-items: center;justify-content: center; display:-webkit-flex;">
          <Icon type="plus-circled" size="40"></Icon>&nbsp;Upload
        </div>
      </Upload>
      <div style="height:50px; width:200px; display:inline-block; margin:4px; padding:0px;float:left; padding-top:10px;">
        <Progress v-show="fileUploading" :percent="uploadPercentage" hide-info></Progress>
      </div>
    </div>
    <div style="clear:both;">
      <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
        <Col span="2">&nbsp;</Col>        
        <Col span="9">文件名</Col>
        <Col span="9">标题</Col>
        <Col span="4">收藏时间</Col>
      </Row>
      <div id="favList" class="favList" v-for="item in favList">
        <Row style="height:26px;" type="flex" align="middle" justify="start">
          <Col span="1"><input type="checkbox" :value=item.id v-model="selectedFav"></Col>
          <Col span="9" style="text-align:left;">{{item.filename}}</Col>
          <Col span="10" style="text-align:left;">{{item.title}}</Col>
          <Col span="4" style="text-align:left;">{{item.date}}</Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  $header-height: 50px; 
  $images-root: "../../../static/images/"; 
  .header {
    height: $header-height;
    max-height: $header-height;
    background-color: #0D62C6;
    //#091e37;
    color: white;
    width: 100%;
    div, span

  {
    display: inline-block;
  }

  .left-logo {
    position: relative;
    float: left;
    height: $header-height;
    .peertime

  {
    font-family: Chalkduster, Magneto;
    font-size: 36px;
    font-weight: bold;
    vertical-align: top;
    padding-left: 10px;
  }

  }

  .middle-router {
    font-size: 24px;
    font-weight: bold;
    line-height: $header-height;
    position: relative;
    #headerCurrentRouterIcon

  {
    background-repeat: no-repeat;
    display: inline-block;
    width: 24px;
    height: 24px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    text-align: center;
    vertical-align: middle;
    background-image: url($images-root + "thumbnails.svg");
  }

  }
  }
  .favtoolbar {
    text-align: left;
    height:50px;
  }
  .fav-header {
    height: $header-height;
    max-height: $header-height;
    background-color: #0061BB;
    background: linear-gradient(to right, #0780AB, #46BDB5);
    color: white;
    width: 100%;
    text-align: left;
    vertical-align: middle;
    position: relative;
    div, span

  {
    display: inline-block;
  }

  .left-logo {
    position: relative;
    float: left;
    height: $header-height;
    .peertime-logo

  {
    background-image: url($images-root + 'peertime_white.png');
    background-size: 138px 24px;
    background-repeat: no-repeat;
    background-position: center;
    width: 138px;
    height: $header-height;
    margin-left: 24px;
  }

  }

  .main-router {
    padding: 9px 0 0 30px;
    button

  {
    color: white;
    font-size: 18px;
    padding-bottom: 4px;
    border-radius: 0;
    border-bottom: 3px solid transparent;
  }

  button.current {
    border-bottom: 3px solid lightgrey;
  }

  }
  }
</style>
<script>
  import authenticator from '../../authenticator'
  import UserInfo from '../user/UserInfo.vue';

  export default {
    data: function () {
      return {
        showUploadFile: true,
        favList: [],
        selectedFav: [],
        uploadHeaders: {},
        editingEvent: { title: "" },
        editingEventFiles: [],
        uploadAction: GetAPIUrl(),
        fileUploading: false,
        uploadPercentage: 0,
        uploadTimer: null
      }
    },
    props: ["currentViewId"],
    components: {
      UserInfo
    },
    mounted: function ()
    {
      this.getMyFavorite().then((d) =>
      {
        this.favList = [];
        for (let item of d.DocumentList)
        {
          this.favList.push(this.favList2ShowList(item));
        }
      });

      let uploadurl = GetAPIUrl() + "FavoriteAttachment/AddNewFavorite?Title=&Description=Attachment";
      uploadurl += "&FileName=";
      this.uploadAction = uploadurl;
      this.uploadHeaders = { "UserToken": authenticator.getUserToken() };
    },
    methods: {
      goSchedule()
      {
        this.$router.push({ name: 'schedule' });
      },
      goCourse()
      {
        this.$router.push({ name: 'courses' });
      },
      goHistory()
      {
        this.$router.push({ name: 'history' });
      },
      getMyFavorite()
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = auth.getUserToken();
          var url = GetAPIUrl() + "FavoriteAttachment/MyFavoriteAttachments";
          $.ajax({
            type: 'GET',
            url: url,
            beforeSend: function (request)
            {
              request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
              resolve(data.RetData);
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
              console.log(xhr);
              resolve(null);
            }
          });
        });
      },
      favList2ShowList(item)
      {
        var ct = new Date();
        ct.setTime(item.CreatedDate);
        let showCT = ct.Format("yyyy-MM-dd hh:mm:ss");
        return {
          id: item.AttachmentID,
          title: item.Title,
          filename: item.FileName,
          date: showCT
        };
      },
      deleteFav()
      {
        //alert(this.selectedFav.join(","));
        this.deleteMyFav(this.selectedFav.join(",")).then(d =>
        {
          if (d == null)
          {
            this.$Message.error({content: "Delete failed!",duration: 0,closable: true})
            return;
          }
          for (let i = this.favList.length-1; i >= 0;i--)
          {
            if (IsExistInArr(this.selectedFav, this.favList[i].id))
            {
              this.favList.splice(i,1);
            }
          }
          this.selectedFav = [];
        });
      },
      deleteMyFav(ids)
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = auth.getUserToken();
          var url = GetAPIUrl() + "FavoriteAttachment/RemoveFavorite?itemID=" + ids;
          $.ajax({
            type: 'Delete',
            url: url,
            beforeSend: function (request)
            {
              request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
              resolve(data.RetData);
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
              console.log(xhr);
              resolve(null);
            }
          });
        });
      },
      handleViewEventFile: function (file)
      {
        //console.log(file);
      },
      handleRemoveEventFile: function (file)
      {
        let r = confirm("Do you want to remove this file: '" + file.name + "'");
        if (r !== true)
        {
          return;
        }

        let self = this;
        let url = GetAPIUrl() + "EventAttachment?ProjectID=211";
        url += "&AttachmentID=" + file.id;

        $.ajax({
          type: 'DELETE',
          url: url,
          beforeSend: function (request)
          {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (res)
          {
            if (res.RetCode === 0)
            {
              let list = self.editingEventFiles;
              list.splice(list.indexOf(file), 1);
              list = self.editingEvent.detail.LineItems;
              list.splice(list.indexOf(file.detail), 1);
            }
            else
            {
              console.log(res);
            }
          },
          error: function (xhr, ajaxOptions, thrownError)
          {
            console.log(xhr);
          }
        });
      },
      handleUpdateEventFile: function (file)
      {

      },
      handleDownloadEventFile: function (file)
      {

      },
      handleEventFileBeforeUpload: function (file)
      {
        var accept = [".jpg", ".jpeg", ".jpe", ".png", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"];
        var ext = file.name.substr(file.name.lastIndexOf("."));
        ext = ext.toLowerCase();
        if (!IsExistInArr(accept, ext))
        {
          this.$Message.error({content:"This file not support!",duration:0,closable:true});
          return false;
        }
        this.fileUploading = true;
        this.uploadPercentage = 0;

        let self = this;
        this.uploadTimer = setInterval(function ()
        {
          self.uploadPercentage += Math.round((100 - self.uploadPercentage) * 0.1);
        }, 100);
      },
      handleEventFileProgress: function (event, file, fileList)
      {
        //this.uploadPercentage = file.percentage;
      },
      handleEventFileSuccess: function (res, file)
      {
        this.fileUploading = false;
        if (this.uploadTimer)
          clearInterval(this.uploadTimer);

        if (res.RetCode === 0)
        {
          if (res.RetData !== null)
          {
            let lineItem = res.RetData;
            if (lineItem.AttachmentID)
            {
              this.favList.push(this.favList2ShowList(lineItem));
            }
          }

        }
        else
        {
          console.log(res);
        }
      },
      handleEventFileError: function (error, file, fileList)
      {
        this.fileUploading = false;
        if (this.uploadTimer)
          clearInterval(this.uploadTimer);

        console.log(error);
      }
    }
  }
</script>
