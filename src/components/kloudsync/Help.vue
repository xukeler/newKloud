<template>
  <div class="kloudsync-help">
    <div class="help-header-part">
      <span style="font-size:32px; margin-right:30px;">Help Center</span>
      <Button type="ghost" size="large" style="margin-right: 64px;" v-if="isSysMember" @click="manageSysSpace">Manage</Button>
      <div style="width:40%; display:inline-block;">
        <Input v-model="helpSearch" size="large" @on-keyup="searchSystemFile" placeholder="Enter the title of the file">
          <Button slot="append" type="primary" size="large" icon="ios-search" @click="searchSystemFile">Search</Button>
        </Input>
      </div>
    </div>
    <div class="help-content-part">
      <div class="help-doc-list" v-for="(item,index) in fileList" :key="index" @click="handleViewFile(item)">
        <img :src="item.viewUrl" width="100%" style="border-radius: 10px;"/>
        <p>{{item.title}}</p>
      </div>
    </div>
    <Modal v-model="modalViewFile" class="kloudsync-file-view" width="90%" :mask-closable="false" :title="modalViewFileTitle">
      <div slot="footer" style="display:none"></div>
      <div class="kloudsync-file-view-body">
        <iframe style="width:100%; height:100%;" frameborder="0" width="100%" height="100%" :src="modalViewFileUrl"></iframe>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss">
.kloudsync-help {
  width: 100%;
  min-height: calc(100% - 68px);
  background: white;

  .help-header-part {
    text-align: center;
    padding: 16px;
    border-bottom: 1px solid #dddee1;
    color: #1c2438;
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-input-group-append {
      background-color: #2d8cf0;
      color: white;
      border: none;
    }
  }
  .help-content-part{
    width: 1100px;
    height: 100%;
    margin: 0 auto;
    display:  flex;
    flex-direction: row;
    flex-wrap:wrap;
    justify-content: flex-start;
    .help-doc-list{
      width: 50%;
      padding: 50px 2%;
      cursor: pointer;
      text-align: center;
      word-break: break-all;
      font-size: 15px;
      img{
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-height: 700px;
      }
    }
  }
}
.kloudsync-file-view
{
  .kloudsync-file-view-body
  {
    width: 100%;
    height: 100%;
  }
  .ivu-modal
  {
    height: 90%;
    top:5%;
  }
  .ivu-modal-content
  {
    height: 100%;
  }
  .ivu-modal-header
  {
    border-bottom: 0px;
    padding: 10px 16px 0px 16px;
  }
  .ivu-modal-body
  {
    padding: 6px 6px 6px 6px;
    height: calc(100% - 30px);
  }
  .ivu-modal-footer {
    display: none;
  }
}
</style>

<script>
import auth from "../../authenticator";
var MyStorage = sessionStorage;
export default {
  data() {
    return {
      helpSearch: '',
      fileList:[],
      allFileList:[],
      modalViewFile:false,
      modalViewFileUrl:"",
      modalViewFileTitle:"",
      isSysMember:false,
    };
  },
  inject:['reloadHeader'],
  computed: {
    language(){
      return this.$i18n.locale;
    }
  },
  watch: {
    language(val){
      this.getSystemDoc();
      this.getSystemMemberList();
    }
  },
  mounted () {
    this.getSystemDoc();
    this.getSystemMemberList();
  },
  methods: {
    manageSysSpace(){
      let schoolId;
      let typeUrl = location.origin;
      if(typeUrl.indexOf('https://kloudsync.peertime.cn')>=0){
        schoolId = 4132;//正式服 系统默认Help center
      }else{
        schoolId = 3693;//测试服  系统默认Help center
      }

      //刷新改变user Info为Help center的机构
      auth.setChosenSchoolId(schoolId);

      //teamId为-1,代表没记住team,仅仅记住机构
      let self = this;
      auth.MemorizeOrganization(10001,schoolId,-1,"Help center","",null,null).then((res)=>{
        MyStorage.setItem("KloudsyncOrganizationName", "Help center");
        self.reloadHeader();
        self.$nextTick(()=>{
          self.$router.push({name:'kloudsync-documents'});
        })
      });
    },
    getSystemMemberList(){
      let TeamSpaceID;
      let typeUrl = location.origin;
      if(typeUrl.indexOf('https://kloudsync.peertime.cn')>=0 && this.$i18n.locale=="cn"){
        TeamSpaceID = 280;//正式服 系统默认Help center space中的英文文档。
      }else if(typeUrl.indexOf('https://kloudsync.peertime.cn')>=0 && this.$i18n.locale=="en"){
        TeamSpaceID = 726;//正式服 系统默认Help center space中的中文文档。
      }else{
        TeamSpaceID = 68;//测试服  系统默认Help center space中的文档。
      }
      let url = GetAPIUrl() + "TeamSpace/MemberList?TeamSpaceID=" + TeamSpaceID;

      this._getData(url,null,data => {
          for(let item of data){
            if(auth.getUserID()==item.MemberID){
              this.isSysMember=true;
              break;
            }
          }
        },
        null
      );

    },
    searchSystemFile(){

      if(!this.helpSearch){
        this.fileList=this.allFileList;
        return;
      }

      let searchStr = new RegExp(this.helpSearch,'i')
      this.fileList=this.allFileList.filter(item=>{
        return item.title.search(searchStr)>=0;
      })
    },
    handleViewFile(params){

      if(params.detail.FileType==5 || params.detail.FileType==4)
      {
          this.$Message.error("Can't view this file!");
          return;
      }

      var url=location.origin.toLowerCase();
      url+="/document/"+params.detail.ItemID+"?t="+Math.random();
      this.modalViewFile=true;
      this.modalViewFileUrl=url;
      this.modalViewFileTitle=params.detail.Title;
    },
    getSystemDoc(){
      let self = this;
      let spaceID;
 
      //测试服和生产服的系统space
      let typeUrl = location.origin;
      if(typeUrl.indexOf('https://kloudsync.peertime.cn')>=0 && this.$i18n.locale=="cn"){
        spaceID = 280;//正式服 系统默认Help center space中的中文文档。
      }else if(typeUrl.indexOf('https://kloudsync.peertime.cn')>=0 && this.$i18n.locale=="en"){
        spaceID = 726;//正式服 系统默认Help center space中的英文文档。
      }else{
        spaceID = 68;//测试服  系统默认Help center space中的文档。
      }
      
      let url = GetAPIUrl() + "SpaceAttachment/List?spaceID="+spaceID+"&type=0"+"&searchText=";//type 1普通  2 Video 0是全部

      this._getData(url,null,data => {
          self.fileList=[];
          self.allFileList=[];
          let list = data.DocumentList;
          for (let attachment of list) {
            let file = self._attachment2File(attachment);
            self.fileList.push(file);
            self.allFileList.push(file);
          }
        },
        null
      );
    },
    _attachment2File: function(attachment) {

      let date = new Date(parseInt(attachment.CreatedDate));

      //获取文档封面
      let src;
      let str=attachment.AttachmentUrl;
      let index=str.lastIndexOf("/");
      let cstr=str.substring(index + 1, str .length);
      let index2=cstr.lastIndexOf(".");
      let str2=cstr.substring(0,index2);
      let index3=str2.lastIndexOf("_");
      let str3=str2.substring(index3+1,str2.length);
      str=str.substring(0,index+1)+cstr.replace(eval("/"+str3+"/g"),'1_2K');
      src=str;

      return {
        id: attachment.ItemID,
        title: attachment.Title,
        date: date.Format("yyyy-MM-dd hh:mm:ss"),
        syncs: attachment.SyncCount,
        viewUrl: src,
        detail: attachment
      };
    },
    _getData(url, before, success, error) {
      this.$Loading.start();

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
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            self.$Loading.error();
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
  },
}
</script>