<template>
    <div>
        <Modal
            v-model="showTopicUpload"
            title="Add"
            okText="Ok"
            cancelText="Cancel"
            :styles="{top: '210px'}"
            :mask-closable="false" width="600"
            :transfer="true"
            style="z-index: 1500; position: absolute;">
            <div class="kloudsync-upload-topic">
              <div class="kloudsync-space-upload" @click="showSpaceFile">
                <div class="upload-new-file-with-tag" v-show="filesSpaceShow">
                  <img src="/static/images/icon-space-file.svg" width="35" height="35" alt="">
                  <p style="margin-top: 7px;">Select from space files</p>
                </div>
                <div class="upload-new-file-with-tag" style="background: #fff;border: 1px dashed #dddee1;border-radius: 4px;" v-show="!filesSpaceShow">
                    <div class="fileIconParent">
                        <div class="fileIconShow">
                            <span class="file-icon"></span>
                            <p style="overflow: hidden; max-width:100px;text-overflow: ellipsis;white-space: nowrap;">{{filesObj.fileName}}</p>
                        </div>
                        <div class="deleteFileIcon">
                            <Icon type="ios-trash-outline" :title="$t('AssignmentList.DeleteFile')" size="26" style="color:white;cursor: pointer;" @click.native="handleRemoveFile"></Icon>
                        </div>
                    </div>
                </div>
              </div>
              <div class="kloudsync-mysaved-upload" @click="showFavList">
                <div class="upload-new-file-with-tag" v-show="filesSavedShow">
                  <img src="/static/images/icon-saved-file.svg" width="35" height="35" alt="">
                  <p style="margin-top: 7px;">Select from my saved files</p>
                </div>
                <div class="upload-new-file-with-tag" style="background: #fff;border: 1px dashed #dddee1;border-radius: 4px;" v-show="!filesSavedShow">
                    <div class="fileIconParent">
                        <div class="fileIconShow">
                            <span class="file-icon"></span>
                            <p style="overflow: hidden; max-width:100px;text-overflow: ellipsis;white-space: nowrap;">{{filesObj.fileName}}</p>
                        </div>
                        <div class="deleteFileIcon">
                            <Icon type="ios-trash-outline" :title="$t('AssignmentList.DeleteFile')" size="26" style="color:white;cursor: pointer;" @click.native="handleRemoveFile"></Icon>
                        </div>
                    </div>
                </div>
              </div>
              <div class="kloudsync-local-upload">
                <div class="upload-new-file-with-tag" v-show="filesShow">
                  <Upload
                      multiple
                      type="drag"
                      action="">
                      <div style="padding: 20px 10px">
                          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                          <p>{{$t('UploadFileWithTag.ClickUpload')}}</p>
                      </div>
                  </Upload>
                  <input
                      id="uploadNewTopicFile"
                      ref="kDocuploadNewFileWithTag"
                      type="file"
                      @change="schoolFileChange(this)"
                      accept="audio/wav, audio/mp4a-latm, audio/aac, audio/3gpp, audio/mpeg, video/mp4, image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                </div>
                <div class="upload-new-file-with-tag" style="background: #fff;border: 1px dashed #dddee1;border-radius: 4px;" v-show="!filesShow">
                    <div class="fileIconParent">
                        <div class="fileIconShow">
                            <span class="file-icon"></span>
                            <p style="overflow: hidden; max-width:100px;text-overflow: ellipsis;white-space: nowrap;">{{filesObj.fileName}}</p>
                        </div>
                        <div class="deleteFileIcon">
                            <Icon type="ios-trash-outline" :title="$t('AssignmentList.DeleteFile')" size="26" style="color:white;cursor: pointer;" @click.native="handleRemoveFile"></Icon>
                        </div>
                    </div>
                </div>
              </div>
              <div class="kloudsync-drive-upload">
                <div class="upload-new-file-with-tag" v-show="filesDriveShow" @click="handleDropBox">
                  <img src="/static/images/icon-dropbox.svg" width="35" height="35" alt="">
                  <p style="margin-top: 7px;">Select from my DropBox</p>
                </div>
                <div class="upload-new-file-with-tag" style="background: #fff;border: 1px dashed #dddee1;border-radius: 4px;" v-show="!filesDriveShow">
                    <div class="fileIconParent">
                        <div class="fileIconShow">
                            <span class="file-icon"></span>
                            <p style="overflow: hidden; max-width:100px;text-overflow: ellipsis;white-space: nowrap;">{{filesObj.fileName}}</p>
                        </div>
                        <div class="deleteFileIcon">
                            <Icon type="ios-trash-outline" :title="$t('AssignmentList.DeleteFile')" size="26" style="color:white;cursor: pointer;" @click.native="handleRemoveFile"></Icon>
                        </div>
                    </div>
                </div>
              </div>
              <div class="kloudsync-google-upload">
                <div class="upload-new-file-with-tag" v-show="filesGoogleShow" @click="handleGoogle">
                  <img src="/static/images/icon-google-drive.svg" width="35" height="35" alt="">
                  <p style="margin-top: 7px;">Select from my Google Drive</p>
                </div>
                <div class="upload-new-file-with-tag" style="background: #fff;border: 1px dashed #dddee1;border-radius: 4px;" v-show="!filesGoogleShow">
                    <div class="fileIconParent">
                        <div class="fileIconShow">
                            <span class="file-icon"></span>
                            <p style="overflow: hidden; max-width:100px;text-overflow: ellipsis;white-space: nowrap;">{{filesObj.fileName}}</p>
                        </div>
                        <div class="deleteFileIcon">
                            <Icon type="ios-trash-outline" :title="$t('AssignmentList.DeleteFile')" size="26" style="color:white;cursor: pointer;" @click.native="handleRemoveFile"></Icon>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <Select v-model="selecetTopicId" style="width:100%; margin-top:20px;" v-show="!canUpload" placeholder="Please select a Topic">
              <Option v-for="item in topicList" :value="item.ItemID" :key="item.ItemID">{{ item.Name }}</Option>
            </Select>
            <div slot="close" v-show="false"></div>
            <div slot="footer">
              <Button @click="cancelUpload">{{$t('Base.Cancel')}}</Button>
              <Button type="primary" @click="upLoadTopicFileOk">{{$t('Base.OK')}}</Button>
            </div>
        </Modal>
        <upload-file preid="live" ref="uploadfile"></upload-file>

        <Modal
            v-model="selectFav"
            title="Select document add to syncroom"
            width="800"
            :closable="false"
            :mask-closable="false"
            @on-ok="selectFavOK"
            @on-cancel="selectFavCancel"
            style="z-index:40000;position: absolute;"
            class-name="hideModalFooter"
        >
            <div slot="header" style=" height:30px;">
                <span
                    style="font-size:16px; font-weight:bold;"
                >Select document add to syncroom</span>
                <span style="float:right;">
                    <Button type="primary" @click="selectFavOK">{{$t("Base.OK")}}</Button>
                    <Button type="text" @click="selectFavCancel">{{$t("Base.Cancel")}}</Button>
                </span>
            </div>
            <select-from-my-saved-file ref="SelectFromMySavedFile" :inPutId="'topicFavList'" @getSelectFileList="getSelectFileList"></select-from-my-saved-file>
            <div slot="footer" style="display:none;"></div>
        </Modal>

        <select-file-from-space ref="selectfilefromspace" @onOK="selectSpaceOK"></select-file-from-space>

        <Modal title="Converting"
           v-model="showUploadCover"
           :closable="false"
           :mask-closable="false"
           width="500" style="z-index:50000;position: absolute;">
          <div style="font-size:16px;text-align:center;">
            <Icon type="ios-videocam"></Icon>
            <span style="padding-left:5px;">{{uploadingInfo.name}}</span>
          </div>
          <div style="height:160px; padding-top:20px; text-align:center;">
            <i-circle :percent="uploadingInfo.process">
              <Icon v-if="uploadingInfo.process == 100" type="ios-checkmark-empty" size="60" style="color:#5cb85c"></Icon>
              <span v-else style="font-size:24px">{{ uploadingInfo.process }}%</span>
            </i-circle>
          </div>
          <div slot="footer" v-show="false"></div>
        </Modal>
    </div>
</template>

<style lang="scss">
$images-root: "../../../static/images/";
.kloudsync-upload-topic {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  margin-bottom: 20px;

  .kloudsync-space-upload {
    width: 18%;
    display: inline-block;
    height: 130px;
    .upload-new-file-with-tag {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      padding: 25px 6px;
      background: #fff;
      border: 1px dashed #dddee1;
      border-radius: 4px;
      cursor: pointer;
      #uploadSavedFileWithTag {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 130px;
        opacity: 0;
      }
      .file-icon {
        display: inline-block;
        width: 70px;
        height: 70px;
        background-image: url($images-root+"file.svg");
        background-size: 70px 70px;
      }
      .fileIconParent {
        .fileIconShow {
          text-align: center;
          padding-top: 0px;
        }
        .deleteFileIcon {
          text-align: center;
          position: absolute;
          left: 0px;
          top: 0px;
          height: 100%;
          line-height: 130px;
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: none;
        }
        &:hover {
          .deleteFileIcon {
            display: block;
          }
        }
      }
    }
  }
  .kloudsync-local-upload {
    width: 18%;
    height: 130px;
    display: inline-block;

    .ivu-upload-drag{
      height: 130px;
    }

    .upload-new-file-with-tag {
      position: relative;
      width: 100%;
      height: 100%;
      #uploadNewTopicFile {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 130px;
        opacity: 0;
      }
      .file-icon {
        display: inline-block;
        width: 70px;
        height: 70px;
        background-image: url($images-root+"file.svg");
        background-size: 70px 70px;
      }
      .fileIconParent {
        .fileIconShow {
          text-align: center;
          padding-top: 25px;
        }
        .deleteFileIcon {
          text-align: center;
          position: absolute;
          left: 0px;
          top: 0px;
          height: 100%;
          line-height: 130px;
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: none;
        }
        &:hover {
          .deleteFileIcon {
            display: block;
          }
        }
      }
    }
  }
  .kloudsync-mysaved-upload {
    width: 18%;
    display: inline-block;
    height: 130px;
    .upload-new-file-with-tag {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      padding: 25px 6px;
      background: #fff;
      border: 1px dashed #dddee1;
      border-radius: 4px;
      cursor: pointer;
      #uploadSavedFileWithTag {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 130px;
        opacity: 0;
      }
      .file-icon {
        display: inline-block;
        width: 70px;
        height: 70px;
        background-image: url($images-root+"file.svg");
        background-size: 70px 70px;
      }
      .fileIconParent {
        .fileIconShow {
          text-align: center;
          padding-top: 0px;
        }
        .deleteFileIcon {
          text-align: center;
          position: absolute;
          left: 0px;
          top: 0px;
          height: 100%;
          line-height: 130px;
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: none;
        }
        &:hover {
          .deleteFileIcon {
            display: block;
          }
        }
      }
    }
  }
  .kloudsync-drive-upload {
    display: inline-block;
    width: 18%;
    height: 130px;
    .upload-new-file-with-tag {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      padding: 25px 6px;
      background: #fff;
      border: 1px dashed #dddee1;
      border-radius: 4px;
      cursor: pointer;
      #uploadDriveboxFileWithTag{
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 130px;
        opacity: 0;
      }
      .file-icon {
        display: inline-block;
        width: 70px;
        height: 70px;
        background-image: url($images-root+"file.svg");
        background-size: 70px 70px;
      }
      .fileIconParent {
        .fileIconShow {
          text-align: center;
          padding-top: 0px;
        }
        .deleteFileIcon {
          text-align: center;
          position: absolute;
          left: 0px;
          top: 0px;
          height: 100%;
          line-height: 130px;
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: none;
        }
        &:hover {
          .deleteFileIcon {
            display: block;
          }
        }
      }
    }
  }
  .kloudsync-google-upload {
    display: inline-block;
    width: 18%;
    height: 130px;
    .upload-new-file-with-tag {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      padding: 25px 6px;
      background: #fff;
      border: 1px dashed #dddee1;
      border-radius: 4px;
      cursor: pointer;
      #uploadGoogleFileWithTag {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 130px;
        opacity: 0;
      }
      .file-icon {
        display: inline-block;
        width: 70px;
        height: 70px;
        background-image: url($images-root+"file.svg");
        background-size: 70px 70px;
      }
      .fileIconParent {
        .fileIconShow {
          text-align: center;
          padding-top: 0px;
        }
        .deleteFileIcon {
          text-align: center;
          position: absolute;
          left: 0px;
          top: 0px;
          height: 100%;
          line-height: 130px;
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: none;
        }
        &:hover {
          .deleteFileIcon {
            display: block;
          }
        }
      }
    }
  }
}
</style>

<script>
import auth from "../../authenticator";
import webapi from "../../webapi/webapi.js";
import util from "../../common/util.js";
import UploadFile from "../livelesson/UploadFile";
import SelectFileFromSpace from "../livelesson/SelectFileFromSpace";

export default {
  components: {
    UploadFile,
    SelectFileFromSpace
  },
  props: {
    schoolId: {
      type: Number,
      required: true
    },
    folderId: {
      type: Number,
      default: -1
    },
    topicID: {
      type: Number,
      default: -1
    },
    canUpload:{
      type: Boolean,
      default: false
    },
    teamId:{
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      selecetTopicId:-1,
      filesObj: {
        fileName: ""
      },
      filesShow: true,
      filesSpaceShow: true,
      filesSavedShow: true,
      filesDriveShow: true,
      filesGoogleShow: true,
      title: "",
      showTopicUpload: false,
      topicList:[],
      selectFav:false,
      selectedFav:[],
      
      showUploadCover:false,
      uploadingInfo: { ready: true, name: '', process: 0 },
      updateProcessTimer: null
    };
  },
  beforeDestroy()
  {
    if (this.updateProcessTimer)
    {
      clearTimeout(this.updateProcessTimer);
      this.updateProcessTimer = null;
    }
  },
  mounted() {
  },
  methods: {
    initialTopicData(){
      this.selecetTopicId=this.topicID;
      if(this.teamId!=-1 && !this.canUpload){
        let url = GetAPIUrl() + "Topic/List?type=2";
        url += "&companyID=" + this.schoolId;
        url += "&parentID=" + this.teamId;
        this._getData(url, null, data => {
         this.topicList=data;
        }, null);
      }
    },
    handleRemoveFile() {
      this.filesObj = { fileName: "" };
      $("#uploadNewTopicFile").val("");
      this.filesShow = true;
    },
    //清空上次填入的内容
    cancelUpload() {
      this.showTopicUpload = false;
      this.filesObj = { fileName: "" };
      $("#uploadNewTopicFile").val("");
      this.filesShow = true;
      this.title = "";
      this.selecetTopicId=-1;
    },
    schoolFileChange() {
      var input = $("#uploadNewTopicFile")[0];
      this.filesShow = false;
      this.filesObj = input.files[0];
      this.filesObj.fileName = this.filesObj.name;
    },
    handleEventVideoBeforeUpload: function(file) {
      let accept = [".mp4",".jpg",".jpeg",".jpe",".png",".doc",".docx",".xls",".xlsx",".ppt",".pptx",".pdf"];
      var ext = file.name.substr(file.name.lastIndexOf("."));
      ext = ext.toLowerCase();
      if (!IsExistInArr(accept, ext)) {
        alert(this.$t("Common.FileNotSupport"));
        return false;
      }
      return true;
    },
    upLoadTopicFileOk() {
      var input = $("#uploadNewTopicFile")[0];
      if (input.files.length == 0 ||this.handleEventVideoBeforeUpload(input.files[0]) == false) {
        alert(this.$t("UploadFileWithTag.PleaseSelectUploadFile"));
        return;
      }
      if (!this.uploadingInfo.ready)
      {
        alert(this.$t("Common.WaitForFileUploading"));
        $("#uploadNewTopicFile").val("");
        return;
      }
      if (input.files[0].size >= 1024 * 1024 * 100) {
        alert(this.$t("Common.FileTooBig"));
        return;
      }
      this.uploadVideoInputChange();
    },
    uploadVideoInputChange() {
      //判断是否重复上传
      let upfile = this.filesObj;
      let filename = upfile.name;
      let self = this;
      let topicID;
      if(!this.canUpload){
        if(this.selecetTopicId==-1){
          alert("Please select a topic");
          return;
        }else{
          topicID=this.selecetTopicId;
        }
      }else{
          topicID= this.topicID;
      }
      
      let folder = this.folderId;
      util.GetMD5(upfile).then(hash => {
        webapi
          .kloudsyncUploadTopicFileWithHash(topicID, folder, filename, hash)
          .then(result => {
            if (result.RetCode == 0) {
              //返回上传的数据
              self.$Message.info({
                content: "File uploaded successfully",
                duration: 3
              });
              self.cancelUpload();
              self.$nextTick(() => {
                self.$parent.initialize();
              });
            } else if (result.RetCode == -6002) {
              //此哈希值对应的文件不存在，请直接上传
              self.$refs.uploadfile.Upload(
                upfile,
                GetAPIUrl() +
                  "TopicAttachment/AddNewTopicDocumentMultipart?Description=description&Hash=" +
                  hash +
                  "&topicID=" +
                  topicID +
                  "&folderID=" +
                  folder,
                result => {
                  self.cancelUpload();
                  var lineItem = result.RetData;
                  if (lineItem.FileType == 4 || lineItem.FileType == 5)
                  {
                    self.updateEnd(true);
                    return;
                  }
                  self.showUploadCover=true;
                  self.uploadingInfo.name = filename;
                  self.uploadingInfo.process = 0;
                  self.$nextTick(()=>{
                    self.$parent.initialize();
                  })
                  self.updateProcessTimer = setInterval(() =>
                  {
                    self.updateProcess(lineItem.AttachmentID);
                  }, 1000);
                },
                () => {
                  self.cancelUpload();
                }
              );
            } else if (result.RetCode == -6003) {
              //文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
              self.$Message.warning({
                content: this.$t("Common.FileAlreadyinList"),
                duration: 3
              });
              self.cancelUpload();
            } else {
              self.cancelUpload();
            }
          });
      });
    },
    updateEnd(success)
    {
      let self=this;
      clearTimeout(this.updateProcessTimer);
      this.updateProcessTimer = null;
      this.showUploadCover=false;
      this.uploadingInfo.ready = true;
      this.uploadingInfo.name = "";
      this.uploadingInfo.process = 0;
      if (success)
      {
        this.$Message.info({content:"File uploaded successfully",duration: 3});
      }
    },
     updateProcess(guid)
    {
      webapi.getAttachmentConvertingPercentage([guid]).then((res) =>
      {
        //[{AttachmentID: 21808, Status: 0, Percentage: 0}]
        for (var i = 0; i < res.length; i++)
        {
          if (guid == res[i].AttachmentID)
            {
              //10: 转换中 0:转换成功 其他:转换失败
              if (res[i].Status == 10)
              {
                this.uploadingInfo.process = res[i].Percentage;
                if (this.uploadingInfo.process == 100)
                {
                  this.updateEnd(true);
                  return false;
                }
                return true;
              }
              else if (res[i].Status == 0)
              {
                this.updateEnd(true);
                return false;
              }
              else
              {
                this.updateEnd(false);

                this.$Notice.error({
                  title:this.$t("Common.ConvertError"),
                  desc: '',
                  duration: 4,
                  bottom: 60,
                  left: true
                });

                return false;
              }
            }
        }
        return false;
      });
      return false;        
    },
    initial() {
      this.showTopicUpload = true;
      this.initialTopicData();
    },
    handleDropBox() {
      let self = this;

      util.LoadDropboxChooser(() => {
        Dropbox.choose({
          success: function (files) {
            console.log(files);

            for (let i = 0; i < files.length; i++) {
              self._uploadRemoteFile(files[i].name, files[i].name, files[i].name, files[i].link)
            }
          },
          cancel: function () {
          },
          linkType: "direct", // or preview"
          multiselect: false, // or true
          // Optional. This is a list of file extensions. If specified, the user will
          // only be able to select files with these extensions. You may also specify
          // file types, such as "video" or "images" in the list. For more information,
          // see File types below. By default, all extensions are allowed.
          extensions: ['.pdf', '.doc', '.docx']
        });
      });
    },
    handleGoogle() {
      util.LoadGooglePicker(() => {
        if (!googleAuthApiLoaded) {
          this.$Message.error({content: "Google Authentication API is NOT ready!",duration: 0,closable: true})
        }
        if (!googlePickerApiLoaded) {
          this.$Message.error({content: "Google Picker API is NOT ready!",duration: 0,closable: true})
        }
        if (!googleClientApiLoaded) {
          this.$Message.error({content: "Google Client API is NOT ready!",duration: 0,closable: true})
        }

        //this.createGooglePicker();
        if (googleAuthToken) {
          this.createGooglePicker();
        }
        else {
          gapi.auth2.authorize({
            client_id: GOOGLECLIENTID,
            scope: GOOGLEACCESSSCOPE
          }, this.handleGoogleAuthResult);
        }
      });
    },
    handleGoogleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        googleAuthToken = authResult.access_token;
        this.createGooglePicker();
      }
    },
    createGooglePicker() {
      var picker = new google.picker.PickerBuilder().
        addView(google.picker.ViewId.DOCS).
        setOAuthToken(googleAuthToken).
        setDeveloperKey(GOOGLEDEVELOPERKEY).
        setCallback(this.pickerCallback).
        build();
      picker.setVisible(true);
    },
    pickerCallback(data) {
      let self = this;
      if (data.action == google.picker.Action.PICKED) {
        var fileId = data.docs[0].id;
        var request = gapi.client.drive.files.get({
          'fileId': doc.id
        });

        request.execute(function(resp) {
          let link = resp.downloadUrl;
          let n = link.lastIndexOf("?");
          if (n > 0)
            link = resp.downloadUrl.substr(0, n);
          
          self._uploadRemoteFile(resp.originalFilename, resp.title, resp.title, link);
        });
      }
    },
    _uploadRemoteFile(fileName, fileTitle, fileDesc, fileLink) {
      /* The whole function need be review
      let self = this;
      let url = GetAPIUrl() + "KWEventAttachment/UploadRemoteFile";

      let data = {
        'IssueID': this.assignmentId,
        'Title': fileTitle,
        'Description': fileDesc,
        'Url': fileLink,
        'FileName': fileName
      };

      this._postData(url, data, null, (result) => {
        let attachment = result;
        if (attachment.AttachmentID) {
        }
      }, null);*/
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
            // error
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
    showSpaceFile() {
      this.$refs.selectfilefromspace.ShowSpaceFiles();
    },
    showFavList(){
      this.selectFav = true;
      this.$refs['SelectFromMySavedFile'].reset();
      this.$refs['SelectFromMySavedFile'].initialFileList();
    },
    getSelectFileList(val){
      if(val){
        this.selectedFav = val;
      }
    },
    selectFavOK() {
        if (this.selectedFav.length < 1) {
            return;
        }     
         let topicID;
        if(!this.canUpload){
          if(this.selecetTopicId==-1){
            alert("Please select a topic");
            return;
          }else{
            topicID=this.selecetTopicId;
          }
        }else{
            topicID= this.topicID;
        }   
        webapi.addFav2Topic(topicID, this.selectedFav).then(
            () => {
                this.selectedFav = [];
                $("#topicFavList").find("INPUT[type=checkbox]:checked").prop("checked", false);
                this.$parent.initialize();
            }
        );
        this.selectFav = false;
        this.showTopicUpload=false;
    },
    selectFavCancel() {
        this.selectFav = false;
    },
    selectSpaceOK(selectedSpaceAttachment){
        if (selectedSpaceAttachment.length < 1) {
            return;
        }

        let topicID;
        if(!this.canUpload){
          if(this.selecetTopicId==-1){
            alert("Please select a topic");
            return;
          }else{
            topicID=this.selecetTopicId;
          }
        }else{
            topicID= this.topicID;
        } 
        
        webapi.addSpace2Topic(topicID, selectedSpaceAttachment).then(
            () => {
                $("#spaceAttachmentList").find("INPUT[type=checkbox]:checked").prop("checked", false);
                this.$parent.initialize();
            }
        );

        this.selectSpace = false;
        this.showTopicUpload=false;
    },
  }
};
</script>
