<template>
  <div id="headuserinfo" class="headuserinfo">
    <div class="headuserinfo-notice" v-if="shownoticeicon">
      <span class="headuserinfo-noticeicon" @click="shownotice(false)"></span>
      <span class="klassroomText" @click="shownotice(false)">{{ $t("UserInfo.Join") }}</span>
      <span class="headuserinfo-num" v-if="shownoticenum">{{noticeNum}}</span>
      <span style="border-right:1px solid #4cdbee;margin: 0px 5px;height: 15px;"></span>
     <span class="klassroomText" @click="shownotice(true)">{{ $t("UserInfo.MyKlassroom") }}</span>
    </div>
    <!--<div class="right-tools">
    <span id="headerIconUser" class="userinfoicon" @mouseover="usermouseOver();" @mouseout="usermouseOut();" :title="userName">{{userInitial}}</span>
  </div>
  <div style="display:none; width:120px;" id="usersetmenu" class="usersetmenu" @mouseover="usermouseOver();" @mouseout="usermouseOut();">
    <ul>
      <li @click="tomyfavorite();">我的收藏</li>
      <li @click="tomyschedule();">我的账户</li>
      <li @click="tomysetting();">我的设置</li>
      <li @click="logout();">退出登录</li>
    </ul>
  </div>-->
    <div class="right-tools">
      <Dropdown placement="bottom-end" @on-click="userClick">
        <img :src="file" id="headerIconUser" class="userinfoicon">
        <DropdownMenu slot="list" style="min-width:150px;">
          <DropdownItem name="personalName" :title="userName" style="color:green">{{userName}}</DropdownItem>
          <DropdownItem name="kloudsyncOrganization" v-show="isKloudsyncFlag">
             <div>
                <p style="font-size:12px;color:#c0c0c0;padding-bottom:4px;">{{$t("UserInfoKloudSyc.CurrentOrganization")}}</p>
                <div style="display:inline-block;display:flex; align-items:center">
                  <div style="flex:1 1 120px;font-size:13px;">
                    {{organizationName}}
                  </div>
                  <Icon type="arrow-swap" size="16" style="margin-left:8px"></Icon>
                </div>
             </div>
          </DropdownItem>
          <DropdownItem name="adminSettings" v-show="isKloudsyncFlag">Admin Settings</DropdownItem>
          <DropdownItem name="personal" class="line_down"></DropdownItem>
          <DropdownItem name="personalInformation">{{ $t("UserInfo.PersonalInformation") }}</DropdownItem>
          <DropdownItem name="paymentSetting">{{ $t("UserInfo.PaymentSetting") }}</DropdownItem>
          <DropdownItem name="myKlassroom">{{ $t("UserInfo.MyKlassroom") }}</DropdownItem>
          <!-- <DropdownItem name="teacherProfile">Teacher Profile</DropdownItem> -->
          <DropdownItem name="myFiles">{{ $t("UserInfo.MyFiles") }}</DropdownItem>
          <!--<DropdownItem name="favorites">{{ $t("UserInfo.Favorites") }}</DropdownItem>-->
          <!-- <DropdownItem name="help">{{ $t("UserInfo.Help") }}</DropdownItem> -->
          <DropdownItem name="personal" class="line_down"></DropdownItem>
          <DropdownItem name="userGuide">{{ $t("UserInfo.UserGuide") }}</DropdownItem>
          <Dropdown placement="right-start" style="min-width:172px;line-height:28px;padding:0px;display:block;">
              <DropdownItem style="min-width:200px;line-height:28px;padding:0px 14px;">
                  {{$t("UserInfo.Language")}}<Icon type="ios-arrow-right" style="float:right;margin:6px 0px 0px;"></Icon>
              </DropdownItem>
              <DropdownMenu slot="list">
                  <DropdownItem name="languageCn">中文</DropdownItem>
                  <DropdownItem name="languageEn">English</DropdownItem>
              </DropdownMenu>
          </Dropdown>          
          <DropdownItem name="logout">{{ $t("UserInfo.Logout") }}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="headuserinfo-noticeinfo" v-if="showNoticeInfo" tabindex="1">
      <div class="headuserinfo-enterclassroom" tabindex="3" v-show="isShowMyClassInfo">
        <div style="font-size:14px;font-weight:bold;line-height: 2em;">{{ $t("UserInfo.MyKlassroomID") }}</div><br/>
        <div style="color:#2d8cf0; line-height: 2em;">{{myClassroomID}}</div><br/>
        <div style="margin-top: 8px;width: 316px;">
          <Button type="primary"  @click="enterKlassroom" style="margin-right: 16px;padding:6px 45px;">{{ $t("UserInfo.Enter") }}</Button>
          <Button disabled style="margin-left:20px;float:right;padding:6px 30px;">{{ $t("UserInfo.SendInvite") }}</Button>
          <!-- <Button @click="editKlassroom" style="margin-right: 16px">{{ $t("UserInfo.Edit") }}</Button> -->
        </div>
      </div>
      <div class="headuserinfo-footer" tabindex="3" v-show="!isShowMyClassInfo">
        <div tabindex="3" style="font-size:14px;font-weight:bold;">{{ $t("UserInfo.JoinOtherKlassroom") }}</div>
        <div tabindex="3" style="padding:5px 0; ">
            <Input v-model="joinLessonID" @on-keyup.enter="joinLesson" :placeholder="$t('UserInfo.TypeinKlassroomID')" style="width: 240px; margin-right: 16px"></Input>
            <Button type="primary" @click="joinLesson">{{ $t("UserInfo.Join") }}</Button></div>
      </div>
      <div class="headuserinfo-noticeinfolist" tabindex="2" v-if="showlessonlist">
        <div tabindex="3" style="height:30px;font-size:16px;font-weight:bold;">{{ $t("UserInfo.OngoingLessons") }}</div>
        <div class="headuserinfo-item" v-for="item in noticeList" :key="item.id">
          <ul>
            <!--<li style="width:80px;">
            <div style=" text-align:center;"><Avatar :src="item.teachericon" /></div>
            <div style=" text-align:center;">{{item.teachername}}</div>
          </li>-->
            <li style="width:250px; padding-right:5px; position:relative;" :lessionid="item.id">
              <p v-html="item.title"></p>
            </li>
            <li>
              <Button type="success" @click.stop.native="clickNoticeTitle($event)" :lessionid="item.id">{{ $t("UserInfo.Join") }}</Button>
              <!--<Button type="warning" style="margin-top:5px;" size="small" @click.stop.native="removeNotice(item.id)">Clear</Button>-->
            </li>
          </ul>
        </div>
      </div>
      <!--<div class="headuserinfo-cancel" tabindex="3"><Button @click="closeNoticeInfo" icon="ios-close-empty">Cancel</Button></div>-->
    </div>
    <Modal title="标准课程正在进行中，是否加入？"
           v-model="startLessonDlg"
           okText="加入"
           cancelText="取消"
           :closable="false"
           @on-ok="lessonOK"
           @on-cancel="lessonCancel"
           :mask-closable="false" width="400">
      <div style="padding:5px;display:none;">提示:为了更好的沟通效果,请尽量开启摄像头和麦克风.</div>
      <div style="padding:5px;text-align:center;">
        <Tooltip content="Turn On/Off Microphone" placement="bottom">
          <a class="headuserinfo-ctl-btn" id="headuserinfo-ctl-toggle-audio" @click="ToggleLoaclAudio();"><span class="headuserinfo-ctl-icon headuserinfo-ctl-icon-mic"></span></a>
        </Tooltip>
        <span style=" padding-left:100px;"></span>
        <Tooltip content="Turn On/Off Camera" placement="bottom">
          <a class="headuserinfo-ctl-btn disable" id="headuserinfo-ctl-toggle-video" @click="ToggleLoaclVideo();"><span class="headuserinfo-ctl-icon headuserinfo-ctl-icon-camera"></span></a>
        </Tooltip>
      </div>
      <div style="padding:5px;"></div>
    </Modal>
    <Modal title="标准课程正在进行中，是否加入？"
           v-model="startLessonDlgEx"
           okText="加入"
           cancelText="取消"
           :closable="false"
           @on-ok="lessonOK"
           @on-cancel="lessonCancel"
           :mask-closable="false" width="600">
      <media-setting preid="userinfo" ref="mediasetting"></media-setting>
    </Modal>
    <Modal
        v-model="showOrganizationModal"
        title="Swith Organization"
        okText="Ok"
        cancelText="Cancel"
        :styles="{top: '210px'}"
        :mask-closable="false" width="500"
        :transfer="true"
        style="z-index: 999; position: absolute;">
        <div style="width:100%;height:20px;"></div>
        <div class="kloudsync-choose-organization" style="width:100%">
          <Dropdown placement="bottom-start" trigger="hover" style="width:100%" @on-click="selectOrganization">
            <Input v-model="searchOrganization" icon="ios-search" placeholder="Search..." style="width: 100%" @on-keyup="searchOrganationList"></Input>
            <DropdownMenu slot="list" class="select-school">
              <DropdownItem :name="item.SchoolName+'-'+item.SchoolID" v-for="item in organizationList" :key="item.SchoolID" :value="item.SchoolID">
                {{item.SchoolName}}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        
        <div style="width:100%;height:20px;"></div>
        <div slot="close" v-show="false"></div>
        <div slot="footer">
          <Button @click="selectOrganizationCancel">{{$t('Base.Cancel')}}</Button>
          <Button type="primary" @click="selectOrganizationOk">{{$t('Base.OK')}}</Button>
        </div>
    </Modal>
  </div>
</template>
<style lang="scss">
  $header-height: 50px; $images-root: "../../../static/images/";
  .kloudsync-choose-organization{
    .ivu-select-dropdown{
      width: 90%;
    }
    .select-school {
      max-height: 200px;
      overflow: auto;
      font-size: 12px;
      color: #495060;
    }
  }
  .line_down{
    border-bottom: 1px solid #c0c0c0;
  }
  .headuserinfo-ctl-btn {
    display: inline-block;
    background-color: #8c98ae;
    height: 32px;
    width: 32px;
    margin: 3px;
    border-radius: 50%;
    line-height: 32px;
    font-size: 32px;
    text-align: center;
    padding: 7px;
    color: #fff;
    box-sizing: content-box !important;
  }

  .headuserinfo-ctl-btn.disable {
    filter: grayscale(100%);
    background-color: #bdbdbd;
    opacity: 0.5;
  }

  .headuserinfo-ctl-icon {
    background-repeat: no-repeat;
    display: inline-block;
    width: 32px;
    height: 32px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    text-align: center;
    vertical-align: middle;
    background-size: 32px 32px;
    margin-top: -2px;
    box-sizing: content-box !important;
  }

  .headuserinfo-ctl-icon-mic {
    background-image: url($images-root + "microphone.png");
  }

  .headuserinfo-ctl-icon-camera {
    background-image: url($images-root + "camera.png");
  }

  .headuserinfo {
    float: right;
    color:#4cdbee;
    div:focus
    {
      outline: none;
    }
   .headuserinfo-notice
  {
    display: inline-block;
    line-height: $header-height;
    height: $header-height;
    //width: 56px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .headuserinfo-item {
    width:100%;
     margin-top:5px;
     display:inline-block;
  }

  .headuserinfo-item ul {
    padding:0px;
    margin:0px;
    list-style:none;
  }
    .headuserinfo-item ul li {
      padding: 0px;
      margin: 0px;
      list-style: none;
      float:left;
      border:0px;
      //height:52px;
       overflow:hidden;
    }
    div, span {
      display: inline-block;
    }  
.headuserinfo-noticeicon
{
  background-image: url($images-root + "icon-enter-classroom.svg");
  background-size: 16px 16px; background-repeat: no-repeat;
  line-height: $header-height; width: 25px; height: 34px;
  display: inline-block; background-position: center bottom;

}
.klassroomText{
  font-size:12x;
  height: 20px;
  display: inline-block;
  line-height: 20px;
  text-align: center;
  position: relative;
  top: -2px;
  left: -2px;
} 
  .headuserinfo-num {
    background-color: red;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: inline-block;
    line-height: 20px;
    text-align: center;
    position: relative;
    top: -14px;
    left: -15px;

    animation-name: headuserinfo-numanimation;
    animation-duration: 0.6s;
    animation-timing-function: linear;
    animation-delay: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-play-state: running;
  }
  @keyframes headuserinfo-numanimation {
    from {
      background: red;
      top: -14px;
    }
    to {
      background: #ff6700;
      top: -16px;
      vertical-align:middle;
    }
  }
  .right-tools {
    float: right;
    display: inline;
    line-height: $header-height;
    font-size: 12px;
    font-weight: bold;
    margin: 0 12px;
  }
  .headuserinfo-noticeinfo {
    width: 360px;
    position: absolute;
    z-index: 30005;
    top: 49px;
    right: 2px;
    //height: 500px;
    border: 1px solid #ccc;
    background-color: #fbfbfb;
    color: #495060;
    padding:20px;
  }
  .headuserinfo-noticeinfolist {
    //height:265px;
    overflow:auto;
    padding:16px 0 0;
  }
  .headuserinfo-footer {
    padding: 0px 0 16px;
    //height: 115px;
    border-bottom: solid 1px #ccc;
  }
  .headuserinfo-enterclassroom {
    padding-bottom: 16px;
    border-bottom:solid 1px #ccc;
  }
  .headuserinfo-cancel {
    text-align:right;
    height:30px;
  }
  .userinfoicon {
    margin: 0;
    vertical-align: middle;
    background-repeat: no-repeat;
    display: inline-block;
    width: 30px;
    height: 30px;
    overflow: hidden;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    // background-image: url($images-root + "user.svg");
    // background-size: 32px 32px;
    background-color: #fff;
    color: #4a4a4a;
    cursor: pointer;
    font-weight: normal;
    border-radius: 50%;
  }
    .usersetmenu {
      position: absolute;
      top: 50px;
      right: 2px;
      z-index: 30004;
      background-color: #0D62C6;
    }

      .usersetmenu ul {
        list-style: none;
        width: 100%;
      }

        .usersetmenu ul li {
          float: left;
          height: 30px;
          width: 100%;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          display: -webkit-flex;
        }

          .usersetmenu ul li:hover {
            background-color: #62a0e9;
            color:black;
          }
  }
</style>
<script>
  import authenticator from '../../authenticator'
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
  import MediaSetting from '../user/MediaSetting.vue';
  import util from "../../common/util.js";
  var MyStorage = sessionStorage;
  export default {
    data: function () {
      return {
        file:"",
        userName: authenticator.getUserName(),
        userInitial: authenticator.getUserInitial(),
        userClassroomID: authenticator.getClassroomID(),
        noticeNum: 0,
        showNoticeInfo: false,
        shownoticeicon: true,
        noticeList: [],
        joinLessonID: "",
        newClassroomID: "",
        startLessonDlg: false,
        startLessonDlgEx:false,
        selectLessonID: "",
        isShowMyClassInfo:false,
        showTimmer:null,
        isKloudsyncFlag:false,
        organizationName:authenticator.getKloudsyncOrganizationName()?authenticator.getKloudsyncOrganizationName():'My School',
        showOrganizationModal:false,
        selectOrganizationId:-1,
        searchOrganization:'',
        organizationList:[],
        allLisOrganizationList:[],
      }
    },
    inject: ["reload"],
    components: {
      MediaSetting,
    },
    mounted: function ()
    {
      var list = this.getInviteLesson;
      this.noticeInfoChange(list);
      //console.log(location.hash.toLowerCase());
      this.shownoticeicon = location.href.toLowerCase().indexOf("/live") == -1;
      this.readData();

      if(IsKloudSync()){
        this.isKloudsyncFlag = true;
      }else{
        this.isKloudsyncFlag = false;
      }
    },
    computed:
    {
      myClassroomID() {
        if (this.userClassroomID === 0 || this.userClassroomID === '0' || this.userClassroomID === '') {
          return '(No Klassroom ID yet)';
        }
        else
        {
          var showID = this.userClassroomID;
          if (showID.indexOf("-") == 0)
          {
            showID = showID.substr(1);
          }
          return showID;
        }
      },
      shownoticenum()
      {
        return this.noticeNum > 0;
      },
      showlessonlist()
      {
        return this.noticeList.length > 0;
      },
      ...mapState(['inviteLesson',"Connected","myMeetingRoomID"]),
      ...mapGetters(['getInviteLesson','getLessonID'])
    },
    watch: {
      myMeetingRoomID(val){
        this.userClassroomID=val;
      },
      inviteLesson(list)
      {
        this.noticeInfoChange(list);
      }
    },
    methods: {
      //搜索机构名称的功能;
      searchOrganationList(){
        let searchStr = this.searchOrganization.toUpperCase();
        if (searchStr == "") {
          this.initOrganizationList();
          return;
        }
        let array = [];
        let SchoolName;
        for (let i = 0; i < this.allLisOrganizationList.length; i++) {
          SchoolName = this.allLisOrganizationList[i].SchoolName.toUpperCase();
          if (SchoolName.indexOf(searchStr) != -1) {
            array.push(this.allLisOrganizationList[i]);
          }
        }
        this.organizationList = array;
      },
      initOrganizationList(){
        let url = GetAPIUrl() + "School/UserSchoolList?userID=" + authenticator.getUserID();
        this._getData(url, null, (list) => {
          this.organizationList=list;
          this.allLisOrganizationList=list;
        },null);
      },
      changeOrganization(){
        this.searchOrganization="";
        this.showOrganizationModal=true;
        this.initOrganizationList();
      },
      selectOrganization(name){
        let selectOrganizationName=name.split("-")[0];
        this.selectOrganizationId = name.split("-")[1];
        this.searchOrganization=selectOrganizationName;
      },
      selectOrganizationOk(){
        if(this.selectOrganizationId==-1){//没有选择一个机构，则提示
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('UserInfo.PleaseSelectOrganization'), top: 24,duration: 4, left:true });
          return;
        }
        this.showOrganizationModal=false;
        this.organizationName=this.searchOrganization;
        authenticator.setChosenSchoolId(this.selectOrganizationId);
        this.reload();
        authenticator.MemorizeOrganization(10001,this.selectOrganizationId,-1,this.organizationName,"",null,null);//teamId为-1,代表没记住team,仅仅记住机构
        this.selectOrganizationId=-1;
      },
      selectOrganizationCancel(){
        this.showOrganizationModal=false;
        this.selectOrganizationId=-1;
      },
      readData() {
        let self = this;

        let url = GetAPIUrl() + "User/UserProfile";
        this._getData(url, null, (user) => {
          if (user) {
            if(user.AvatarUrl!='' && user.AvatarUrl!=null){
                self.file = user.AvatarUrl;
            }
          }
          if(user.AvatarUrl=='' || user.AvatarUrl==null){
              self.file="../../../static/images/user.svg";
          }
        });
      },
      _getData(url, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'GET',
          url: url,
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", authenticator.getUserToken());
          },
          success: function (result) {
            if (result.RetCode === 0) {
              if (success && typeof success === 'function') {
                success(result.RetData);
              }

              self.$Loading.finish();
            }
            else { // error
              if (error && typeof error === 'function') {
                error(result);
              }

              self.$Loading.error();
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);
          }
        });
      },
      shownotice(ismy)
      {
        //console.log("shownotice:"+ismy);
        //console.log("this.isShowMyClassInfo:"+this.isShowMyClassInfo);
          
        //if (this.noticeNum == 0)
        //{
        //  this.showNoticeInfo = false;
        //  return;
        //}
        if(this.isShowMyClassInfo==ismy)
        {          
            this.showNoticeInfo = !this.showNoticeInfo;
            //console.log("474:"+this.showNoticeInfo);
        }
        else
        {
            this.showNoticeInfo = true;
            //console.log("479:"+this.showNoticeInfo);
        }
        this.isShowMyClassInfo=ismy;
        
        this.setAllReaded();
        setTimeout(() =>
        {
          if (this.showNoticeInfo == true)
          {          
            $("div.headuserinfo-noticeinfo").find("div,input,button").bind("focus", () =>
            {
              //console.log("focus");
              if (this.showTimmer) clearTimeout(this.showTimmer);
            }).bind("blur", () =>
            {
              //console.log("blur");
              this.showTimmer = setTimeout(() =>
              {
                this.showNoticeInfo = false;
              }, 200);
            });

            if(ismy)
            {
              $("div.headuserinfo-enterclassroom").focus();
            }
            else
            {
              $("div.headuserinfo-footer").find("input").focus();
            }
          }
          else
          {
            $("div.headuserinfo-noticeinfo").children().unbind();
          }
        }, 50);
      },
      showRommID()
      {
        var showID = this.userClassroomID;
        if (showID.indexOf("-") == 0)
        {
          showID = showID.substr(1);
        }
        return showID;
      },
      async joinLesson()
      {
        //console.log("joinLesson:" + this.getLessonID);
        // var mic = await util.GetCanUseMic();
        // var cam = await util.GetCanUseCamera();
        // console.log("GetCanUseMic:"+mic);
        // console.log("GetCanUseCamera:"+cam);

        this.joinLessonID = Trim(this.joinLessonID).toUpperCase();
        var res =await this.checkClassRoomExist(""+this.joinLessonID);
        if (res == 0)
        {
          this.$Message.error(
            {
              content: 'Room ID 不存在 或者 网络故障!',
              duration: 0,closable: true
            });
        }
        else
        {
          this.showNoticeInfo = false;
          this.changeLessonID(0);
          
          let trycount=1;
          while(trycount<=5 && !this.getSocket().isopen())//
          {
            util.ShowGlobalBlockMsg(this.$t("Live.ConnectingToServer"), true);
            await util.Sleep(4000);
            trycount++;
          }
          util.ShowGlobalBlockMsg("", false);
          if(!this.getSocket().isopen())
          {
            this.$Message.error(
              {
                content: 'Connecting to Kloud Sync server unsuccessful.   Please contact your system admin!',
                duration: 0,
                closable: true
              });
            return;
          }          
          localStorage.setItem("Setting.LastJoinRoomID",this.joinLessonID)
          this.$router.push({ name: 'live', params: { id: "" + this.joinLessonID } });
        }
      },
      joinLessonEx()
      {
        var mid = this.getLessonID;

        this.getMeetingID(this.joinLessonID).then((res) =>
        {
          if (res == 0)
          {
            this.$Message.error(
              {
                content: '没找到或者课堂还没有开始!',
                duration: 0,
                closable: true
              });
          }
          else
          {
            this.showNoticeInfo = false;
            this.$router.push({ name: 'live', params: { incidentid: res } });
          }
        });
      },
      enterKlassroom()
      {
        //alert("enterKlassroom");
        this.showNoticeInfo = false;
        var classRoomID = authenticator.getClassroomID();
        if (classRoomID == "0" || classRoomID == "")
        {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('UserInfo.NoClassRoomID'), top: 24,duration: 4, left:true });
          return;
        }
        this.changeLessonID(0);
        //this.$router.push({ name: 'live', params: { incidentid: classRoomID, type: 1 } });
        //this.$router.push({ name: 'live', params: { incidentid: classRoomID } });
        //this.$router.push('/live/' + classRoomID);
        if (!this.getSocket().isopen())
        {
          this.$Message.error(
            {
              content: 'Connecting to Klassroom Server is unsuccessful.   Please contact your system admin!',
              duration: 0,
              closable: true
            });
          return;
        }
        this.$router.push({ name: 'live', params: { id: classRoomID } });
        return;

        this.getClassRoomLessonID(classRoomID).then(lessonid =>
        {
          if (lessonid < 1)
          {
            this.addInstantLesson(classRoomID).then(newLessonid =>
            {
              if (newLessonid > 0)
              {
                this.changeLessonID(newLessonid);
                //this.noticeKlassromm(classRoomID,newLessonid);
                this.$router.push({ name: 'live', params: { incidentid: classRoomID, type: 1 } });
              }
            });
          }
          else
          {
            this.changeLessonID(lessonid);
            //this.noticeKlassromm(classRoomID,lessonid);
            this.$router.push({ name: 'live', params: { incidentid: classRoomID, type: 1 } });
          }
        });
      },
      editKlassroom()
      {
        this.showNoticeInfo = false;
        this.$Modal.confirm({
          title:"Edit your Klassroom ID:",
          render: (h) =>
          {
            return h('Input', {
              props: {
                value: this.showRommID(),
                autofocus: true,
                placeholder: 'Please input your Klassroom ID...'
              },
              on: {
                input: (val) =>
                {
                  this.newClassroomID = Trim(val);
                }
              }
            })
          },
          onOk: () =>
          {
            //alert("onOk" + this.newClassroomID);
            // if (this.newClassroomID.indexOf("-") > -1)
            // {
            //   this.$Message.error(
            //     {
            //       content: 'Can not use this Klassroom ID, Please use another one!',
            //       duration: 3
            //     });
            //   return;
            // }
            if (this.newClassroomID == this.showRommID())
            {
              return;
            }
            this.updateClassRoomID("" +this.newClassroomID).then((succ) =>
            {
              if (succ)
              {
                this.userClassroomID = ""+this.newClassroomID;
                MyStorage.setItem('UserData.ClassRoomID', "" +this.newClassroomID);
                this.$Message.success(
                  {
                    content: 'Saved successfully!',
                    duration: 3
                  });
              }
              else
              {
                this.$Message.error(
                  {
                    content: 'This Klassroom ID is exist, Please use another one!',
                    duration: 0,
                    closable: true
                  });
              }
            });
          }
        });
      },
      noticeKlassromm(roomid,lessonid)
      {
        var userid = authenticator.getUserIDEx();
        var senddata = new Object();
        senddata.roleType = "1";
        senddata.actionType = "11";
        senddata.targetID = "";
        senddata.meetingID = roomid;
        senddata.incidentID = lessonid;
        senddata.sourceID = userid;
        senddata.isH5 = false;
        senddata.attachmentUrl = "";
        senddata.blankPageNumber = "";
        senddata.attachmentID = "";
        this.getSocket().sendmessage("", base64encode(utf16to8(JSON.stringify(senddata))));
      },
      closeNoticeInfo()
      {
        this.showNoticeInfo = false;
      },
      ToggleLoaclAudio()
      {
        var tar = $("#headuserinfo-ctl-toggle-audio");
        if ($(tar).hasClass("disable"))
        {
          this.changeEnableAudio(true);
          $(tar).removeClass("disable");
        }
        else
        {
          $(tar).addClass("disable");
          this.changeEnableAudio(false);
        }
      },
      ToggleLoaclVideo()
      {
        var tar = $("#headuserinfo-ctl-toggle-video");
        if ($(tar).hasClass("disable"))
        {
          $(tar).removeClass("disable");
          this.changeEnableVideo(true);
        }
        else
        {
          $(tar).addClass("disable");
          this.changeEnableVideo(false);
        }
      },
      setVideoAudioValue()
      {
        var tar = $("#headuserinfo-ctl-toggle-audio");
        if ($(tar).hasClass("disable"))
        {
          this.changeEnableAudio(false);
        }
        else
        {
          this.changeEnableAudio(true);
        }

        var tar = $("#headuserinfo-ctl-toggle-video");
        if ($(tar).hasClass("disable"))
        {
          this.changeEnableVideo(false);
        }
        else
        {
          this.changeEnableVideo(true);
        }
      },
      lessonOK()
      {
        this.showNoticeInfo = false;
        this.startLessonDlgEx = false;
        this.$refs.mediasetting.saveUserSetting();
        this.$refs.mediasetting.end();
        //this.setVideoAudioValue();
        //this.$router.push('/live/' + this.selectLessonID);
        this.$router.push({ name: 'live', params: { id: this.selectLessonID } });
      },
      lessonCancel()
      {
        this.startLessonDlgEx = false;
        this.$refs.mediasetting.end();
      },
      getSocket()
      {
        return this.$root.$children[0].$refs.noticemsg.obj;
      },
      removeNotice(meetingid)
      {
        var arrNotice = this.getInviteLesson;
        var index = this.findMeetingID(arrNotice, meetingid + "");
        if (index > -1)
        {
          arrNotice.splice(index, 1);
          if (arrNotice.length == 0)
          {
            this.showNoticeInfo = false;
          }
          this.changeInviteLesson(arrNotice);
          this.getSocket().setremovenotice(meetingid);
        }
      },
      setAllReaded()
      {
        //this.noticeNum = 0;
        var arrNotice = this.getInviteLesson;
        var result = new Array();
        var readlist = new Array();
        for (var obj of arrNotice)
        {
          var list = obj.split("&");
          if (list[1]=="0")
          {
            readlist.push(list[0]);
            result.push(list[0]+"&1");
          }
          else
          {
            result.push(obj);
          }
        }
        if (readlist.length > 0)
        {
          this.changeInviteLesson(result);
          //console.log(arrNotice);
          this.getSocket().updatemeetingstatus(readlist.join(","));
          //this.noticeNum = 0;
        }
      },
      findMeetingID(arr, str)
      {
        var j = arr.length;
        if (j == 0) return -1;
        for (var i = 0; i < j; i++)
        {
          if (arr[i].indexOf(str + "&") == 0) return i;
        }
        return -1;
      },
      noticeInfoChange(list)
      {
        //console.log("noticeInfoChange" + list.length);
        if (!list || list.length == 0)
        {
          this.noticeNum = 0;
          //return;
        }
        this.noticeNum = this.getNoticeNum(list);
        this.noticeList = new Array();

        this.getRoomLessonArr(list).then((listlesson) =>
        {
          var lessonarr = this.getLessonIDs(listlesson);
          if (lessonarr.length < 1)
          {
            return;
          }
          this.getLessonsInfo(lessonarr).then((info) =>
          {
            //console.log(info);
            if (!info || info.length == 0)
            {
              return;
            }
            var useids = new Array();
            for (let i = 0; i < info.length; i++)
            {
              useids.push(info[i].TeacherID);
            }
            this.getUsersInfo(useids).then(userinfo =>
            {
              for (let i = 0; i < info.length; i++)
              {
                let noticeitem = {
                  id: this.getRoomID(listlesson,info[i].ID),
                  teachername: this.getusername(userinfo, info[i].TeacherID),
                  teachericon: this.getusericon(userinfo, info[i].TeacherID),
                  title: info[i].Name + "<br />" + info[i].Description
                };
                this.noticeList.push(noticeitem);
              }
            });

          });

        });
        var normalarr = this.getLessonArr(list);
        if (normalarr.length > 0)
        {
          this.getLessonsInfo(normalarr).then((info) =>
          {
            //console.log(info);
            if (!info || info.length == 0)
            {
              return;
            }
            var useids = new Array();
            for (let i = 0; i < info.length; i++)
            {
              useids.push(info[i].TeacherID);
            }
            this.getUsersInfo(useids).then(userinfo =>
            {
              for (let i = 0; i < info.length; i++)
              {
                let noticeitem = {
                  id: info[i].ID,
                  teachername: this.getusername(userinfo, info[i].TeacherID),
                  teachericon: this.getusericon(userinfo, info[i].TeacherID),
                  title: info[i].Name + "<br />" + info[i].Description
                };
                this.noticeList.push(noticeitem);
              }
            });

          });
        }
      },
      getLessonArr(arr)
      {
        var result = new Array();
        for (var obj of arr)
        {
          var list = obj.split("&");
          if (list[0].indexOf("-") == -1)
          {
            result.push(list[0]);
          }
        }
        return result;
      },
      getRoomLessonArr(arr)
      {
        var that = this;
        return new Promise(function (resolve, reject)
        {
          var result = new Array();
          var total = 0, current = 0;
          for (var i=0, j = arr.length; i < j;i++)
          {
            var list = arr[i].split("&");
            if (list[0].indexOf("-") == 0)
            {
              total++;
              that.getClassRoomLessonIDEx(list[0]).then((info) =>
              {
                current++;
                if (info !="")
                {
                  var lessonarr=info.split(",")
                  result.push({ LessonID: lessonarr[1], RoomID: lessonarr[0]});
                }
                if (current == total)
                {
                  resolve(result);
                }
              });
            }
          }
        });
      },
      getLessonIDs(arr)
      {
        var result = new Array();
        for (var obj of arr)
        {
          result.push(obj.LessonID);
        }
        return result;
      },
      getRoomID(arr,lessonid)
      {
        for (var obj of arr)
        {
          if (obj.LessonID + "" == lessonid + "")
          {
            return obj.RoomID;
          }
        }
        return "";
      },
      getNoticeNum(arr)
      {
        var result =0;
        for (var obj of arr)
        {
          var list = obj.split("&");
          if (list[1] == "0")
          {
            result++;
          }
        }
        return result;
      },
      getusericon(userinfo, userid)
      {
        if (!userinfo) return "";
        for (var user of userinfo)
        {
          if (user.UserID + "" == userid + "")
          {
            return user.AvatarUrl;
          }
        }
        return "";
      },
      getusername(userinfo, userid)
      {
        if (!userinfo) return "";
        for (var user of userinfo)
        {
          if (user.UserID + "" == userid + "")
          {
            return user.UserName;
          }
        }
        return "";
      },
      getMeetingID(id)
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = MyStorage.getItem('UserToken');
          var url = GetAPIUrl() + "Lesson/ActiveLesson?userNumber=" + id;
          $.ajax({
            type: 'GET',
            url: url,
            beforeSend: function (request)
            {
              request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
              if (data.RetData == "")
              {
                resolve(0);
              }
              else
              {
                resolve(parseInt(data.RetData));
              }
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
              console.log(xhr);
              resolve(0);
            }
          });
        });
      },
      isInstantMeeting(id){
          return (/^(?=[0-9]*[a-zA-Z])[a-zA-Z0-9]{3,12}$/ig).test(id);
      },
      checkClassRoomExist(id)
      {
        return new Promise((resolve, reject)=>
        {
          if(!this.isInstantMeeting(id))
          {
            resolve(0);
            return;
          }
          var sessionid = MyStorage.getItem('UserToken');
          var url = GetAPIUrl() + "Lesson/CheckClassRoomExist?classroomID=" + id;
          $.ajax({
            type: 'GET',
            url: url,
            beforeSend: function (request)
            {
              request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
              if (data.RetData == "")
              {
                resolve(0);
              }
              else
              {
                resolve(parseInt(data.RetData));
              }
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
              console.log(xhr);
              resolve(0);
            }
          });
        });
      },
      getClassRoomLessonID(id)
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = MyStorage.getItem('UserToken');
          var url = GetAPIUrl() + "Lesson/GetClassRoomLessonID?classroomID=" + id;
          $.ajax({
            type: 'GET',
            url: url,
            beforeSend: function (request)
            {
              request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
              if (data.RetData == "")
              {
                resolve(0);
              }
              else
              {
                resolve(parseInt(data.RetData));
              }
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
              console.log(xhr);
              resolve(0);
            }
          });
        });
      },
      getClassRoomLessonIDEx(id)
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = MyStorage.getItem('UserToken');
          var url = GetAPIUrl() + "Lesson/GetClassRoomLessonID?classroomID=" + id;
          $.ajax({
            type: 'GET',
            url: url,
            beforeSend: function (request)
            {
              request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
              if (data.RetData == "")
              {
                resolve("");
              }
              else
              {
                resolve(id+","+data.RetData);
              }
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
              console.log(xhr);
              resolve("");
            }
          });
        });
      },
      addInstantLesson(id)
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = MyStorage.getItem('UserToken');
          var url = GetAPIUrl() + "Lesson/AddInstantLesson?classroomID=" + id;
          $.ajax({
            type: 'POST',
            url: url,
            beforeSend: function (request)
            {
              request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
              if (data.RetData == "")
              {
                resolve(0);
              }
              else
              {
                resolve(parseInt(data.RetData));
              }
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
              console.log(xhr);
              resolve(0);
            }
          });
        });
      },
      updateClassRoomID(id)
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = MyStorage.getItem('UserToken');
          var url = GetAPIUrl() + "Lesson/UpdateClassRoomID?classroomID=" + id;
          $.ajax({
            type: 'POST',
            url: url,
            beforeSend: function (request)
            {
              request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
              if (data.RetCode == -1)
              {
                resolve(false);
              }
              else
              {
                resolve(true);
              }
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
              console.log(xhr);
              resolve(false);
            }
          });
        });
      },
      clickNoticeTitle(evt)
      {
        this.showNoticeInfo = false;
        this.startLessonDlgEx = true;
        this.$refs.mediasetting.init();
        var tar = evt.currentTarget;
        this.selectLessonID = $(tar).attr("lessionid");
        return;

        if (!window.confirm("确定加入所选课堂?"))
        {
          return;
        }
        //this.$router.push('/live/' + lessonid);
        this.$router.push({ name: 'live', params: { id: lessonid } });
        this.showNoticeInfo = false;
      },
      getLessonsInfo(ids)
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = MyStorage.getItem('UserToken');
          var url = GetAPIUrl() + "Lesson/Items?lessonIDs=" + ids.join(",");
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
              resolve(null);
            }
          });
        });
      },
      getUsersInfo(userlist)
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = MyStorage.getItem('UserToken');
          var url = GetAPIUrl() + "User/UserListBasicInfo?userIds=" + userlist.join(",");
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
      usermouseOver()
      {
        if (this._timer) clearTimeout(this._timer);

        setTimeout(() =>
        {
          $("#usersetmenu").show();
        }, 200);
      },
      usermouseOut()
      {
        this._timer = setTimeout(() =>
        {
          $("#usersetmenu").hide();
        }, 200);

      },
      userClick(name) {
        console.log(name);
        if (name === 'logout') {
          this.logout();
        }else if(name === 'personalInformation'){
          this.changeCurrentMenuType("personal");
          this.$router.push({name:routerPrefix() + 'profile'});
        }else if(name === 'paymentSetting'){
          this.changeCurrentMenuType("account");
          this.$router.push({name:routerPrefix() + 'profile'});
        }else if(name === 'myKlassroom'){
          this.changeCurrentMenuType("classroom");
          this.$router.push({name:routerPrefix() + 'profile'});
        }else if(name === 'teacherProfile'){
          this.changeCurrentMenuType("teacher");
          this.$router.push({name:routerPrefix() + 'profile'});
        }else if(name === 'myFiles'){
          this.changeCurrentMenuType("files");
          this.$router.push({name:routerPrefix() + 'profile'});
        }else if(name === 'favorites'){
          this.changeCurrentMenuType("favorites");
          this.$router.push({name:routerPrefix() + 'profile'});
        }else if(name === 'help'){
          this.changeCurrentMenuType("help");
          this.$router.push({name:routerPrefix() + 'profile'});
        }else if(name === 'userGuide'){
          this.download();
        }else if(name === 'kloudsyncOrganization'){
          this.changeOrganization();
        }else if(name === 'adminSettings') {
          this.adminSettings();
        }
        else if(name === 'languageCn') {
          this.changeLanguage("cn");
        }
        else if(name === 'languageEn') {
          this.changeLanguage("en");
        }
      },
      changeLanguage(lan)
      {
        this.$i18n.locale = lan;
        localStorage.setItem("Language", lan);
      },
      adminSettings() {
        this.$router.push({name: routerPrefix() + 'admin-settings'});
      },
      download(){
        window.open('https://peertime-test.oss-cn-shanghai.aliyuncs.com/Peertime%20user%20guide.pdf');
      },
      tomyschedule()
      {
        this.$router.push('/schedule');
      },
      tomyfavorite()
      {
        this.$router.push('/user/favorite');
      },
      tomysetting()
      {
        this.$router.push({name: 'user-profile'});
        //this.$router.push('/user/setting');
      },
      logout()
      {
        util.LoadJsFiles(["https://cdn.ronghub.com/RongIMLib-2.4.0.min.js","https://cdn.ronghub.com/RongEmoji-2.2.7.min.js"]).then(()=>{
          if(this.Connected=="CONNECTED" && RongIMClient.getInstance()!=null){
            RongIMClient.getInstance().clearCache();//清除融云缓存，切换账号后，两个账号获取的会话的列表会叠加。
            RongIMClient.getInstance().logout();
          }
        })
        
        authenticator.logout(this);
        //this.$parent.$parent.$refs.noticemsg.logout();
        //this.$root.$children[0].$children[0].logout();
        this.$root.$children[0].$refs.noticemsg.logout();
        this.$router.push('/login');
      },
      ...mapMutations(['changeInviteLesson', 'changeLessonID', 'changeEnableVideo','changeEnableAudio','changeCurrentMenuType'])
    }
  }
</script>
