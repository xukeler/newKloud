<template>
  <div class="kloudsync-topic-files">
    <div style="padding: 24px;">
      <!-- <div class="topic-action-header">
        Documents
      </div> -->
      
      <div>
        <Button type="ghost" size="large" long @click="handAddNew">{{$t('TopicHomePage.AddNew')}}</Button>
      </div>
    </div>
    
    <div class="document-list">
      <div class="document-item" v-for="item in fileList" :key="item.id">
        <div class="document-item-left">
          <span style="display:inline-block;cursor: pointer;width:100%" @click="changeFile(item)">
            <img :src="item.coverUrl" width="100%" height="120px" style="border-radius: 10px;"/>
          </span>
        </div>
        <div class="document-item-right">
          <div class="document-title">
            <span style="padding-top:3px; font-weight:bold;flex:1 1 120px;word-break:break-all;" @click="changeFile(item)">{{item.title}}</span>
            <Dropdown placement="bottom-end" style="margin-left: 8px;">
              <Icon type="more" size="24"></Icon>
              <DropdownMenu slot="list">
                <DropdownItem name="open">
                  <div style="padding: 3px 0px 3px 20px;;text-algin:left;" @click.stop="handOpen(item)">
                    <Icon type="android-open" size="16"></Icon>
                    <span style="display:inline-block;margin-left:5px">{{$t('TopicHomePage.Open')}}</span>
                  </div>
                </DropdownItem>
                <DropdownItem name="view" v-show="!inSyncRoomMeeting">
                  <div style="padding:3px 0px 3px 20px;text-algin:left;" @click.stop="handView(item)">
                    <Icon type="eye" size="16"></Icon>
                    <span style="display:inline-block;margin-left:5px">{{$t('TopicHomePage.View')}}</span>
                  </div>
                </DropdownItem>
                <DropdownItem name="share">
                  <div style="padding:3px 0px 3px 20px;text-algin:left;" @click.stop="handShare(item)">
                    <Icon type="android-share-alt" size="16"></Icon>
                    <span style="display:inline-block;margin-left:5px">{{$t('TopicHomePage.Share')}}</span>
                  </div>
                </DropdownItem>
                <DropdownItem name="copy">
                  <div style="padding:3px 0px 3px 20px;text-algin:left;" @click.stop="handEdit(item)">
                    <Icon type="ios-compose-outline" size="16"></Icon>
                    <span style="display:inline-block;margin-left:5px">{{$t('TopicHomePage.Edit')}}</span>
                  </div>
                </DropdownItem>
                <DropdownItem name="delete">
                  <div style="padding:3px 0px 3px 20px;text-algin:left;" @click.stop="handDelete(item)">
                    <Icon type="ios-trash-outline" size="16"></Icon>
                    <span style="display:inline-block;margin-left:5px">{{$t('TopicHomePage.Delete')}}</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="document-owner">
            <span style="margin-right:5px;">From</span>Terry-j
          </div>
          <div class="document-detail">
            <p v-if="item.syncs==0"></p>
            <p v-else @click="openSyncList(item)">
              <span style="margin-right:5px;color:#2b85e4;display:inline-block;cursor: pointer;">
                <span class="icon icon-yinxiang" style="font-size:20px;color:#2b85e4"></span>
                {{$t('TopicHomePage.Syncs')}}
              </span>
              <a>{{item.syncs}}</a>
            </p>
            <!-- <p><span style="margin-right:5px;">Last modified:</span>{{item.date}}</p> -->
          </div>
        </div>
         <div class="document-item-syncs" v-if="docSyncShow==item.id">
            <div class="doc-sync-item" v-for="item in syncsList" :key="item.id">
              <p style="margin-bottom:5px;font-weight: bold;font-size: 14px;" @click="playSync(item)">{{item.title}}</p>
              <div class="doc-sync-item-content">
                <span @click="playSync(item)" style="word-break:break-all;flex:1 1 200px">
                  <Avatar :src="item.avatarUrl"></Avatar>
                  <span style="margin-left:5px;overflow: hidden; width:80px;text-overflow: ellipsis;white-space: nowrap;margin-bottom: -5px;">{{item.detail.UserName}}</span>
                  <span style="margin-left:15px">{{item.date}}</span>
                  <!-- <span style="margin-left:15px">{{item.duration}}</span> -->
                </span>
                <Dropdown placement="bottom-end" @on-click="handleSyncs($event,item)">
                  <a href="javascript:void(0)" style="margin-bottom: -7px;">
                      <Icon type="more" size="20" color='black'></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="play">
                      <span style="color:#2b85e4">{{$t('TopicHomePage.Play')}}</span>
                    </DropdownItem>
                    <DropdownItem name="share">
                      <span>{{$t('TopicHomePage.Share')}}</span>
                    </DropdownItem>
                    <DropdownItem name="copy-share-link">
                      <span>{{$t('TopicHomePage.CopyShareLink')}}</span>
                    </DropdownItem>
                    <DropdownItem name="edit-name">
                      <span>{{$t('TopicHomePage.EditName')}}</span>
                    </DropdownItem>
                    <DropdownItem name="delete">
                      <span>{{$t('TopicHomePage.Delete')}}</span>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
      </div>
    </div>
    <upload-topic-file ref="topicUploadModal" :schoolId="schoolId" :folderId="folderId" :topicID="topicID" :team-id="teamId" :canUpload="canUpload"></upload-topic-file>
    <Modal v-model="modalViewFile" class="kloudsync-file-view" width="90%" :mask-closable="false" :title="modalViewFileTitle">
      <div slot="footer" style="display:none"></div>
      <div class="kloudsync-file-view-body">
        <iframe style="width:100%; height:100%;" frameborder="0" width="100%" height="100%" :src="modalViewFileUrl"></iframe>
      </div>
    </Modal>
    <Modal v-model="modalShareFile" class="kloudsync-topic-file-share">
      <div slot="close" style="display:none"></div>
      <div slot="header" style="display:none"></div>
      <div slot="footer" style="display:none"></div>
      <div class="kloudsync-topic-file-share-body">
        <div class="file-share-item" @click="handleShareCopy">
          <div class="file-share-icon" style="background: #2facf7">
            <img src="/static/images/file-share-link.svg" width="32" height="32" alt="">
          </div>
          <p style="margin-top: 16px;">{{$t('TopicHomePage.CopyLink')}}</p>
        </div>
        <div class="file-share-item" @click="handleShareWechat">
          <div class="file-share-icon" style="background: #01d105">
            <img src="/static/images/file-share-wechat.svg" width="32" height="32" alt="">
          </div>
          <p style="margin-top: 16px;">{{$t('TopicHomePage.Wechat')}}</p>
        </div>
        <div class="file-share-item" @click="handleShareMoment">
          <div class="file-share-icon" style="background: #7049ff">
            <img src="/static/images/file-share-moment.svg" width="32" height="32" alt="">
          </div>
          <p style="margin-top: 16px;">{{$t('TopicHomePage.Moment')}}</p>
        </div>
        <div class="file-share-item" @click="handleShareContact">
          <div class="file-share-icon" style="background: #f5545b">
            <Icon type="android-people" size="32" color="#ffffff"></Icon>
          </div>
          <p style="margin-top: 16px;">{{$t('TopicHomePage.Contact')}}</p>
        </div>
      </div>
    </Modal>
    <Modal v-model="modalEditFile" :mask-closable="false" :title="$t('Files.EditFile')" width="500" style="z-index: 2000; position: absolute;">
      <Form :model="editingFile" label-position="right" :label-width="120">
        <FormItem :label="$t('Files.EditTitle')">
          <Input v-model="editingFile.title" placeholder="name" style="width: 300px"></Input>
        </FormItem>
        <FormItem :label="$t('Files.EditFileName')">
          <span>{{editingFile.file}}</span>
        </FormItem>
        <FormItem :label="$t('Files.UploadDate')">
          <span>{{editingFile.date}}</span>
        </FormItem>
      </Form>
      <div slot="close" style="display:none"></div>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handleEditFileOK">{{$t('Base.OK')}}</Button>
        <Button @click="handleEditFileCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
    <Modal v-model="modalEditFileSync" :mask-closable="false" title="Edit sync" width="500" style="z-index: 2000; position: absolute;">
      <div class="topic-files-modal-file-sync">
        <div class="header">
          <Avatar :src="fileInfo.avatarUrl"></Avatar>
          <span style="font-weight: bold;color: #1c2438;margin-left:5px;">{{fileInfo.userName}}</span>
          <span style="margin-left:15px">{{fileInfo.date}}</span>
          <span style="margin-left:15px">{{fileInfo.duration}}</span>
        </div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="table-info-space">
          <tr>
            <td>{{$t('TopicHomePage.FileTitle')}}</td>
            <td>{{fileInfo.fileTitle}}</td>
          </tr>
          <tr>
            <td>{{$t('TopicHomePage.SyncSubtitle')}}</td>
            <td><Input v-model="fileInfo.syncTitle" placeholder="Enter sync title..." style="width: 100%"></Input></td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handleEditFileSyncOK">{{$t('Base.OK')}}</Button>
        <Button @click="handleEditFileSyncCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
    <share-doc-modal></share-doc-modal>
  </div>  
</template>

<style lang="scss">
.kloudsync-topic-files {
  .document-list {
    height: calc(100vh - 360px);
    overflow: auto;
    .document-item {
      padding: 0.5em 24px;
      border-bottom: 1px solid #dddee1;
      display:flex;
      flex-direction: row;
      flex-wrap:wrap;
      .document-item-left{
        -webkit-flex: 0 0 120px;
        -moz-flex: 0 0 120px;
        -ms-flex: 0 0 120px;
        flex:0 0 120px;
      }
      .document-item-right{
        -webkit-flex: 1 1 200px;
        -moz-flex: 1 1 200px;
        -ms-flex: 1 1 200px;
        flex:1 1 200px;
        padding-left:15px;
        .document-title {
          padding: 0.75em 0 0 0;
          display:flex;
          align-items: flex-start;
          cursor: pointer;
          .ivu-dropdown-item{
            padding:0px;
          }
        }

        .document-detail {
          padding: 0.75em 0;
          p {
            span {
              display:inline-block;
              color:#80848f;
            }
          }
        }
      }
      .document-item-syncs{
        width: 100%;
        .doc-sync-item{
          padding:5px 10px 5px 5px;
          border-bottom:1px solid #ddd;
          cursor: pointer;
          background-color: rgb(246,249,253);
          span{
            display: inline-block;
          }
          .doc-sync-item-content{
            display:flex;
            flex-direction: row;
            align-items: center;
          }
        }
      }
    }
  }
}
.kloudsync-file-view{
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
.kloudsync-topic-file-share {
  .kloudsync-topic-file-share-body {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: stretch;
    text-align: center;
    padding: 20px 0;

    .file-share-item {
      width: 20%;
      display: inline-block;
      cursor: pointer;
    }

    .file-share-icon {
      width: 56px;
      height: 56px;
      display: inline-block;
      padding: 12px;
      border-radius: 50%;
    }
  }

  .ivu-modal{
    top: calc(50% - 80px);
  }

  .ivu-modal-header, .ivu-modal-close, .ivu-modal-footer {
    display: none;
  }
}
.topic-files-modal-file-sync{
  padding: 20px;
  font-size: 14px;
  .header{
    text-align: left;
    color:#80848f;
    padding-bottom: 10px;
  }
  .table-info-space tr td:nth-child(1){
    text-align: right;
    width: 30%;
    padding-right: 10px;
    height: 50px;
    font-weight: bold;
    color: #1c2438;
  }
  .table-info-space tr td:nth-child(2){
    text-align: left;
    width: 70%;
  }
}
</style>

<script>
import auth from "../../authenticator";
import UploadTopicFile from './UploadTopicFile'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import webapi from "../../webapi/webapi.js";
import ShareDocModal from "./ShareDocModal.vue";

export default {
  components: {
    UploadTopicFile,
    ShareDocModal
  },
  props:["catalogId", "catalogTypeName", "catalogName", "canUpload"],
  data() {
    return {
      folderId:-1,
      loading: false,
      dataTotal: 0,
      pageIndex: 1,
      pageSize: 5,
      fileList: [],
      modalViewFile:false,
      modalViewFileTitle:'',
      modalViewFileUrl:'',
      modalShareFile:false,
      shareFileDetail:null,
      editingFile: { title: "", file: "", date: "",filesId:0},
      modalEditFile:false,
      syncsList:[],
      modalEditFileSync:false,
      fileInfo:{
        fileTitle:"",
        syncTitle:"",
        avatarUrl:"",
        date:"",
        duration:"",
        userName:"",
        soundtrackID:-1,
      },
      docSyncShow:-1,
      onlyRefresh:false,
      onlyOneToloadliveFile:true,
    }
  },
  computed: {
    ...mapState(['kloudsyncTopic']),

    schoolId() {
      return auth.getChosenSchoolId();
    },
    currentTeam() {
      return this.kloudsyncTopic.currentTeam;
    },
    currentTopic() {
      return this.kloudsyncTopic.currentTopic;
    },
    topicID(){
      return this.kloudsyncTopic.currentTopic.id;
    },
    teamId(){
      return this.kloudsyncTopic.currentTeam.id;
    },
    inSyncRoomMeeting(){
      if(this.$parent.inList){
        return false
      }
      return true;
    },
  },
  watch: {
    modalViewFile(val){
      if(val==false){
        this.modalViewFileUrl = "";
      }
    }
  },
  mounted() {
  },
  methods: {
    handleSyncs(name,item){
      event.stopPropagation()
      switch (name) {
        case "play":
          this.playSync(item);
          break;
        case "share":
          this.shareSync(item);
          break;
        case "copy-share-link":
          this.shareUrl(item);
          break;
        case "edit-name":
          this.showEditFileSyncModal(item);
          break;
        case "delete":
          this.delSync(item);
          break;
        default:
          break;
      }
    },
    shareUrl(item){
      let id=item.id;
      var url=location.origin.toLowerCase();
      url+="/sync/"+id;
        navigator.clipboard.writeText(url).then(()=>{
            this.$Message.info({content: this.$t("Live.CopySyncUrlSuccess"), duration: 3});
      },()=>{
          this.$Message.error({content: this.$t("Live.CopySyncUrlFailed"+"\n\n"+url),duration: 0,closable: true})
      });
    },
    delSync(item){
      this.$Modal.confirm({
        render: (h) => {
            return h('div', {
                style: {
                        "font-size": '16px'
                    }
                },"Are you sure you want to delete it?")
        },
        onOk:()=>{
            webapi.DelSoundtrack(item.id).then((res)=>{
                for(var i=0,j=this.syncsList.length;i<j;i++)
                {
                    if(this.syncsList[i].id==item.id)
                    {
                        this.syncsList.splice(i, 1);
                        break;
                    }
                }
            });
        }
      });
    },
    showEditFileSyncModal(item){
      this.modalEditFileSync=true;
      this.fileInfo.fileTitle=item.fileTitle;
      this.fileInfo.syncTitle=item.title;
      this.fileInfo.avatarUrl=item.avatarUrl;
      this.fileInfo.date=item.date;
      this.fileInfo.duration=item.duration;
      this.fileInfo.userName=item.detail.UserName;
      this.fileInfo.soundtrackID=item.id;
    },
    handleEditFileSyncOK(){
    let url=GetAPIUrl()+"Soundtrack/UpdateTitleAndVisibility";
    let data={
      SoundtrackID:this.fileInfo.soundtrackID,
      Title:this.fileInfo.syncTitle,
      IsPublic:1   //1为公开的音响
    };
    let self=this; 
    $.ajax({
        type: "POST",
        url: url,
        data:data,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            for(let item of self.syncsList){
              if(self.fileInfo.soundtrackID==item.id){
                self.$set(item,'title',self.fileInfo.syncTitle)
                break;
              }
            }
            self.handleEditFileSyncCancel();
          }
        },
      });
     
    },
    handleEditFileSyncCancel(){
      this.modalEditFileSync=false;
      this.fileInfo.fileTitle="";
      this.fileInfo.syncTitle="";
      this.fileInfo.avatarUrl="";
      this.fileInfo.date="";
      this.fileInfo.duration="";
      this.fileInfo.userName="";
      this.fileInfo.soundtrackID=-1;
    },
    openSyncList(item){
      if(item.id == this.docSyncShow){
        this.docSyncShow = -1;
        return;
      }
      this.docSyncShow = item.id;
      this.syncsList=[];
      let url=GetAPIUrl()+"Soundtrack/List?attachmentID="+item.detail.AttachmentID+"&isPublic=0" //isPublic:0 获取所有的音响
      let self=this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.syncsList=self._synclist(result.RetData,item);
          }
        },
      });
    },
    _synclist: function(list,fileDetail) {
      let syncsList=[];
      for(let attachment of list){
        let date = new Date(parseInt(attachment.CreatedDate));
        let item={
          id: attachment.SoundtrackID,
          userId:attachment.UserID,
          avatarUrl:attachment.AvatarUrl!=""?attachment.AvatarUrl:"../../../static/images/user.svg",
          title: attachment.Title,
          date: date.Format("yyyy-MM-dd hh:mm:ss"),
          duration: attachment.Duration,
          detail: attachment,
          fileTitle:fileDetail.title,
          docDetail:fileDetail.detail
        }
        syncsList.push(item);
      }
      return syncsList;
    },
    playSync(item){
      if (!this.inSyncRoomMeeting) {
        let id= item.id;
        let url = location.origin.toLowerCase();
        url+="/sync/"+id;
        this.modalViewFile=true;
        this.modalViewFileUrl=url;
        this.modalViewFileTitle=item.docDetail.Title;
        return;
      }
      this.$parent.$parent.playThinkAction(item.id);
    },
    shareSync(item){
      let shareFile={attachmentId:item.docDetail.AttachmentID,attachmentName:item.docDetail.Title,attachmentUrl:item.docDetail.AttachmentUrl};
      this.changeKloudsyncShareDoc(shareFile);
    },
    changeFile(item){
      if (!this.inSyncRoomMeeting) {
        if(item.detail.FileType==5 || item.detail.FileType==4)
        {
            this.$Message.error({content: this.$t('KloudSyncDocuments.CantView'),duration: 0,closable: true});
            return;
        }
        var url=location.origin.toLowerCase();
        url+="/document/"+item.detail.ItemID+"?t="+Math.random();
        this.modalViewFile=true;
        this.modalViewFileUrl=url;
        this.modalViewFileTitle=item.detail.Title;
        return;
      }
      this.$parent.$parent.displayAttachment(item.detail.AttachmentID,item.detail.Title,item.detail.AttachmentUrl,item.detail.ItemID);
    },
    handOpen(params){
      if (!this.inSyncRoomMeeting){
        if(params.detail.FileType==5 || params.detail.FileType==4){
            this.$Message.error({content: this.$t('KloudSyncDocuments.CantView'),duration: 0,closable: true});
            return;
        }
        // this.$router.push({ name: "view", params: { id: params.detail.AttachmentID,type:3} });//type:3代表传AttachmentID
        // return;
        // this.$router.push({ name: "docview", params: { id: params.detail.ItemID } });
        // return;
        webapi.AddTempLessonWithOriginalDoc(params.detail.AttachmentID,params.detail.Title).then(res=>{
            //res.RetData
            this.$router.push({ name: "docview", params: { id: res.RetData.ItemID } });
        });
      }else{
        this.$parent.$parent.displayAttachment(params.detail.AttachmentID,params.detail.Title,params.detail.AttachmentUrl,params.detail.ItemID);
      }
    },
    handView(params){
      if(params.detail.FileType==5 || params.detail.FileType==4)
      {
          this.$Message.error({content: this.$t('KloudSyncDocuments.CantView'),duration: 0,closable: true});
          return;
      }
      var url=location.origin.toLowerCase();
      url+="/attachment/"+params.detail.AttachmentID+"?t="+Math.random();
      this.modalViewFile=true;
      this.modalViewFileUrl=url;
      this.modalViewFileTitle=params.detail.Title;
    },
    handShare(params){
      this.modalShareFile = true;
      this.shareFileDetail = params.detail;
    },
    handleShareCopy() {
      this.modalShareFile = false;
      var url=location.origin.toLowerCase();
      url+="/attachment/"+this.shareFileDetail.AttachmentID;
      navigator.clipboard.writeText(url).then(()=>{
        this.$Message.info({content: this.$t("Live.CopySyncUrlSuccess"), duration: 3});
      },()=>{
        this.$Message.error({content: this.$t("Live.CopySyncUrlFailed"), duration: 3});
      });
    },
    handleShareWechat() {
      this.modalShareFile = false;
    },
    handleShareMoment() {
      this.modalShareFile = false;
    },
    handleShareContact() {
      this.modalShareFile = false;
    },
    handEdit(params){
      this.editingFile.title = params.title;
      this.editingFile.file = params.title;
      this.editingFile.date = params.date;
      this.editingFile.tagList = params.tagList;
      this.editingFile.filesId = params.id;
      this.modalEditFile = true;
    },
    handleEditFileOK(){
      let self = this;
      let editTitle = encodeURIComponent(base64encode(utf16to8(this.editingFile.title)));
      if (this.editingFile.filesId != 0) {
        let url = GetAPIUrl() + "TopicAttachment/RenameAttachment";
        url += "?itemID=" + this.editingFile.filesId
        url += "&title=" + editTitle;
        this._postData(url,{},() => {self.loading = false;},
          result => {
            self.modalEditFile = false;
            self.$nextTick(()=>{
              self.initialize();
            })
          },
          null
        );
      }
    },
    handleEditFileCancel() {
      this.modalEditFile = false;
    },
    handDelete(params){
      let self = this;
      this.$Modal.confirm({
        title: "Delete Document",
        content: "Are you sure you want to delete the selected document?",
        okText: self.$t("Common.Delete"),
        cancelText: self.$t("Base.Cancel"),
        onOk: () => {
          let url = GetAPIUrl() + "TopicAttachment/RemoveDocument?";
          url += "itemID=" + params.id;

          self._deleteData(url, null, data => {
            self.initialize();
          });
        }
      });
    },
    handAddNew(){
      this.$refs.topicUploadModal.initial();
    },
    refreshSycnRoom(){
      if (!this.inSyncRoomMeeting) {
        return;
      }else{
        this.$nextTick(()=>{
          this.$parent.$parent.refreshAttachmentsList();
        })
      }
    },
    initialize() {
      this.readData();
      this.refreshSycnRoom();
    },
    refreshFileList(){
      this.onlyRefresh = true;
      this.readData();
    },
    readData() {
      let self = this;
      let url = GetAPIUrl() + "TopicAttachment/";
      if(this.canUpload){
        url += "List?topicID=" + this.catalogId + "&type=0" + "&searchText=";
      }
      else {
        url += "TeamDocumentList?companyID=" + this.schoolId + "&teamID=" + this.catalogId + "&type=0"
      }
      // url += "&pageIndex=" + (this.pageIndex - 1);
      // url += "&pageSize=" + this.pageSize;
      this.fileList = [];
      this._getData(url, () => {
          self.fileList = [];
        },data => {
          self.fileList = [];
          self.dataTotal = data.length;
          let list = data;
          for (let i = 0; i < list.length; i++) {
            let attachment = list[i];
            let file = self._attachment2File(attachment);
            self.fileList.push(file);
          }
          
          //进入syncroom,默认的文档,且删除文档
          if(self.fileList.length>0 && !self.onlyRefresh && self.onlyOneToloadliveFile){
            self.onlyOneToloadliveFile = false;
            self.onlyRefresh = false;
            self.getDefaultDoc(self.fileList[0]);
          }
        },
        null
      );
    },
    getDefaultDoc(item){
      if (!this.inSyncRoomMeeting) {
        return;
      }
      this.$nextTick(()=>{
        this.$parent.$parent.displayAttachment(item.detail.AttachmentID,item.detail.Title,item.detail.AttachmentUrl,item.detail.ItemID);
      })
    },
    _attachment2File(attachment) {
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
        tagList:attachment.TagList,
        coverUrl:src,
        file: attachment.Title,
        date: date.Format("yyyy-MM-dd hh:mm:ss"),
        syncs: attachment.SyncCount,
        download: attachment.SourceFileUrl,
        detail: attachment
      };
    },
    _getData(url, before, success, error) {
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    },
    _postData(url, data, before, success, error) {
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        data: JSON.stringify(data),
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (resultString) {
          let result = JSON.parse(resultString);
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    },
    _deleteData(url, before, success, error) {
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'DELETE',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    },
    ...mapMutations([ "changeKloudsyncShareDoc",])
  }
}
</script>
