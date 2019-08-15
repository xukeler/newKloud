<template>
    <div class="kloudsync-share-modal">
      <Modal
          v-model="liveLessonShareSelect"
          :title="$t('ChatFloating.ShareSyncTo')"
          @on-cancel="cancelLiveLessonShareSelect"
          :styles="{top: '110px'}"
          :mask-closable="false" width="300"
          :transfer="true"
          style="z-index: 4000; position: absolute;">
          <div class="share-select-person">
            <ul v-for="users in friendList " :key="users.Index">
              <li style="padding:0px 16px;">{{users.Index}}</li>
              <li class="friend" v-for="friend in users.Users" :key="friend.RongCloudUserID" @mousedown="ShareToFriend(friend.UserID,friend.RongCloudUserID,friend.Name,friend.AvatarUrl)">
                <div class="friend-head">
                    <Avatar v-if="friend.AvatarUrl==''" src="../../../static/images/user.svg"></Avatar>
                    <Avatar v-else  :src="friend.AvatarUrl"></Avatar>
                </div>
                <div class="user-name">{{friend.Name}}</div>
                <div style="clear: both;"></div>
              </li>
            </ul>
          </div>
          <div slot="footer" style="display:none">
          </div>
      </Modal>
      <Modal
        v-model="shareDocModal"
        :title="$t('ChatFloating.ShareSyncTo')"
        :styles="{top: '210px'}"
        :mask-closable="false" width="300"
        :transfer="true"
        style="z-index: 4000; position: absolute;">
        <div class="share-Doc-Modal">
          <Row>
            <Col span="4"><Avatar style="border: 1px solid #ccc;" :src="shareAvatarUrl"></Avatar></Col>
            <Col span="16"><span class="sharName">{{sharePeople.peopleName}}</span></Col>
            <Col span="4"><span class="share-change-people"><Icon type="chevron-right" size="16" @click.stop="changeShareTo"></Icon></span></Col>
          </Row>
          <div style="width:100%;height:25px;"></div>
          <Row>
            <Col span="16">
              <Row>
                <Col span="24">
                   <div style="width:180px;"><Input v-model="shareTitle" :placeholder="$t('ChatFloating.PlaceholderEnterTitle')"></Input></div>
                </Col>
              </Row>
              <div style="width:100%;height:10px;"></div>
              <Row>
                <Col span="6">
                   <Avatar :src="myHead" style="border: 1px solid #ccc;"></Avatar>
                </Col>
                <Col span="18">
                  <Row><Col span="24">{{currentUser}}</Col></Row>
                  <Row><Col span="24"><span  style="display:inline-block;">{{$t('ChatFloating.SharedAt')}}</span><span style="display:inline-block;margin-left:5px;">{{shareTime}}</span></Col></Row>
                </Col>
              </Row>
            </Col>
            <Col span="8">
              <span class="share-pciture">
                  <img id="kloudsyncSharePicImage" src="../../../static/images/upload-pic.png" width="80" height="80" alt=""/>
                  <input  style="cursor: pointer;position: absolute;left: 0px;top: 0px;width: 80px;height: 80px;opacity: 0;" id="kloudsyncSharePic"  type="file" @change="changeSharePic();"  accept="image/jpeg,image/png"/>
              </span>
            </Col>
          </Row>
        </div>
        <div slot="close" style="diplay:none"></div>
        <div slot="footer">
          <Button  @click.stop="shareCancel">{{$t('Base.Cancel')}}</Button>
          <Button type="primary" @click.stop="shareOk">{{$t('Base.OK')}}</Button>
        </div>
    </Modal>
    </div>
</template>

<style lang="scss">
.kloudsync-share-modal{
  .share-select-person{
    height:400px;
    overflow: auto;
    ul {
      list-style-type: none;
    }
    .friend {
      padding: 8px 0px 8px 16px;
      position: relative;
      cursor: pointer;
      .friend-head {
        float: left;
        padding-left: 2em;
      }
      .user-name {
        float: left;
        padding-left: 1em;
        padding-top: 9px;
      }
    }
  }
  .share-Doc-Modal{
    span{
      display: inline-block;
    }
    .sharName{
      padding-top: 8px;
    }
    .share-change-people{
      cursor: pointer;
      float:right;
      padding-top: 8px;
    }
    .share-pciture{
      cursor: pointer;
      float:right;
      // border: 1px dashed #dddee1;
      border-radius: 4px;
      position: relative;
      width: 80px;
      height: 80px;
    }
  }
}

</style>

<script>
import auth from "../../authenticator";
import friends from "../../friends";
import webapi from "../../webapi/webapi.js";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      myHead: "",
      liveLessonShareSelect:false,
      friendList: [],
      shareDocModal:false,
      shareAvatarUrl:'',
      shareTitle:"",
      shareTime:'',
      currentUser: auth.getUserName(),
      sharePeople:{ptUserId:'',RongCloudUserID:'',peopleName:''},
      liveShareFile:{attachmentId:'',attachmentName:'',docUrl:""},
    }
  },
  watch: {
    kloudsyncShareDoc: {
      deep: true,
      handler: function (newVal){
        let obj=newVal;
        if(obj.attachmentId!=""){
          this.$nextTick(function(){
            this.liveLessonShareSelect=true;
            this.liveShareFile.attachmentId=obj.attachmentId;
            this.liveShareFile.attachmentName=obj.attachmentName;
            
            //获取自动分享封面
            let str=obj.attachmentUrl;
            let index=str.lastIndexOf("/");
            let cstr=str.substring(index + 1, str .length);
            let index2=cstr.lastIndexOf(".");
            let str2=cstr.substring(0,index2);
            let index3=str2.lastIndexOf("_");
            let str3=str2.substring(index3+1,str2.length);
            str=str.substring(0,index+1)+cstr.replace(eval("/"+str3+"/g"),'1_2K');
            this.liveShareFile.docUrl=str;
          });
        }
      }
    },
    liveLessonShareSelect(newVal){
      if(newVal){
        friends.getFriendsSortList((friends)=>{
          let result = friends;
          this.friendList = result;
        });
        this.readData();
      }
    },
  },
  computed: {
    ...mapState(["kloudsyncShareDoc"])
  },
  mounted () {},
  methods: {
    //获取本人头像
    readData() {
      let self = this;
      let url = GetAPIUrl() + "User/UserProfile";
      this._getData(url, null, user => {
        if (user) {
          if (user.AvatarUrl != "" && user.AvatarUrl != null) {
            this.myHead = user.AvatarUrl;
          }
        }
        if (user.AvatarUrl == "" || user.AvatarUrl == null) {
          this.myHead = "../../../static/images/user.svg";
        }
      });
    },
    cancelLiveLessonShareSelect(){
      let shareFile={attachmentId:"",attachmentName:"",attachmentUrl:""};
      this.changeKloudsyncShareDoc(shareFile);
    },
    ShareToFriend(ptUserId,id, groupName,avatarUrl){
      this.sharePeople.ptUserId=ptUserId;
      this.sharePeople.RongCloudUserID=id;
      this.sharePeople.peopleName=groupName;
      this.shareAvatarUrl=avatarUrl!=""?avatarUrl:"../../../static/images/user.svg",
      this.liveLessonShareSelect=false;
      this.shareDocModal=true;
      this.shareTime=this.formatShareTime();
      this.shareTitle=this.liveShareFile.attachmentName;

      //判断缩略图是否有效
      let ajaxUrl=this.liveShareFile.docUrl
      $.ajax({
        type: "GET",
        cache: false,
        url: ajaxUrl,
        data: "",
        success: function() {
          $("#kloudsyncSharePicImage").attr("src",ajaxUrl);
        },
        error: function() {
        }
      });
    },
    changeShareTo(){
      this.liveLessonShareSelect=true;
      this.shareDocModal=false;
    },
    shareCancel(){
      this.shareDocModal=false;
      let shareFile={attachmentId:"",attachmentName:"",attachmentUrl:""};
      this.changeKloudsyncShareDoc(shareFile);
      $("#kloudsyncSharePic").val("");
      $("#kloudsyncSharePicImage").attr("src","../../../static/images/upload-pic.png");
    },
    shareOk(){
      webapi.GetShareDocumentKey(this.liveShareFile.attachmentId,this.sharePeople.ptUserId,this.liveShareFile.attachmentName).then((result)=>{
        this.shareDocModal=false;
        this.selectFromCollection=false;
        let href=window.location.href.split("//")[0]+window.location.href.split("//")[1].split("/")[0];
        let shareDocThumbnailUrl=this.liveShareFile.docUrl;//自定义上传图片的缩略图Url,默认文档第一页
        let shareDocAvatarUrl=this.myHead;//分享人头像
        let shareDocUsername=this.currentUser;//分享人的姓名
        let shareDocTime=this.shareTime;//分享时间
        let attachmentID=this.liveShareFile.attachmentId;//文档的attachmentID
        let shareParam={
          shareTitle:this.shareTitle,
          href:(href+"/attachment/"+attachmentID),
          shareDocThumbnailUrl:shareDocThumbnailUrl,
          shareDocAvatarUrl:shareDocAvatarUrl,
          shareDocUsername:shareDocUsername,
          shareDocTime:shareDocTime,
          attachmentID:attachmentID,
          toUserId:this.sharePeople.ptUserId,
          toRongCloudUserID:this.sharePeople.RongCloudUserID,
          toUserName:this.sharePeople.peopleName,
          type:'shareDocModal'
        }
        window.CheckQuit=null;
        this.$router.push({name: "kloudsync-chat",params:{shareDocToPerson:shareParam}});
      });
    },
    formatShareTime(){
      let date=new Date();
      return date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate();
    },
    //分享预览
    changeSharePic(){
      let self = this;
      var shareFile = document.getElementById("kloudsyncSharePic").files[0];
      let reader=new FileReader();
      reader.onload=function(e){
        let dataUrl=this.result;
        $("#kloudsyncSharePicImage").attr("src",dataUrl);
      }
      reader.readAsDataURL(shareFile);
    },
    _getData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }
      let self = this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            if (error && typeof error === "function") {
              error(result);
            }
            console.log(result);
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          if (error && typeof error === "function") {
            error();
          }
          console.log(xhr);
        }
      });
    },
    _postData(url, data, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }
      this.$Loading.start();
      let self = this;
      $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: JSON.stringify(data),
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(resultString) {
          let result = JSON.parse(resultString);
          if (result.RetCode === 0) {
            self.$Loading.finish();
            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            self.$Loading.error();
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);
            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);
          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    ...mapMutations(["changeKloudsyncShareDoc"])
  },
};
</script>
