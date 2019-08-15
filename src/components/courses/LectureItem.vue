<template>
  <div class="lecture-item">
    <table class="lecture-info-table">
      <tr>
        <td colspan="2">
          <Input id="lectureTitle" ref="title" v-model="editingLecture.title" :placeholder="$t('LectureList.PlaceholderAnewlecture')" />
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <Input id="lectureDesc" v-model="editingLecture.desc" type="textarea" :autosize="true" :placeholder="$t('LectureList.placeholderDescription')"/>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          Default Lesson Count: 
          <InputNumber style="margin-left:1em" :min="0" :max="100" v-model="editingLecture.lessonCount"></InputNumber>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <Tabs v-model="currentUpload">
              <TabPane :label="$t('LectureList.UploadDocument')" name="file"></TabPane>
              <TabPane :label="$t('LectureList.UploadVideo')" name="video"></TabPane>
          </Tabs>

          <div v-show="currentUpload == 'file'">
            <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :loading="loading"
                  :data="editingFiles" :columns="tableColumnFiles">
            </Table>
          </div>
          <div v-show="currentUpload == 'video'">
            <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :loading="loading"
                  :data="editingVideos" :columns="tableColumnVideos">
            </Table>
          </div>
        </td>
      </tr>
      <tr v-show="currentUpload == 'file'">
        <td style="width:50%">
          <!-- <Upload
            ref="newFileUpload"
            type="drag"
            :action="newFileUploadAction"
            :headers="uploadHeaders"
            :show-upload-list="false"
            :default-file-list="editingFiles"
            :before-upload="handleFileBeforeUpload"
            :on-progress="handleFileProgress"
            :on-success="handleNewFileSuccess"
            :on-error="handleFileError">
            <Button type="dashed" style="width: 100%;"><Icon type="ios-cloud-upload-outline" size="20" style="margin-right:0.5em;"></Icon>Click or drag file here to upload.</Button>
          </Upload> -->
          <div class="liveUploadDocParent">
             <Button type="dashed" style="width: 100%;"><Icon type="ios-cloud-upload-outline" size="20" style="margin-right:0.5em;"></Icon>{{$t('LectureList.ClickHereUpload')}}</Button>
             <input id="liveUploadDocInput" type="file" @change="uploadDocInputChange(this);"  accept="image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          </div>
          <upload-file preid="live" ref="uploadfile"></upload-file>
          <Upload
            ref="updateFileUpload"
            type="drag"
            :action="updateFileUploadAction"
            :headers="uploadHeaders"
            :show-upload-list="false"
            :default-file-list="editingFiles"
            :before-upload="handleFileBeforeUpload"
            :on-progress="handleFileProgress"
            :on-success="handleUpdateFileSuccess"
            :on-error="handleFileError"
            style="display: none;">
          </Upload>
        </td>
        <td>
          <Button style="width:100%" @click="handleSelectFile"><Icon type="document" size="20" style="margin-right:0.5em;"></Icon>{{$t('LectureList.SelectFromSavedFiles')}}</Button>
        </td>
      </tr>
      <tr v-show="currentUpload == 'video'">
        <td style="width:50%">
          <!-- <Upload
            ref="newVideoUpload"
            type="drag"
            :action="newVideoUploadAction"
            :headers="uploadHeaders"
            :show-upload-list="false"
            :default-file-list="editingVideos"
            :before-upload="handleVideoBeforeUpload"
            :on-progress="handleVideoProgress"
            :on-success="handleNewVideoSuccess"
            :on-error="handleVideoError">
            <Button type="dashed" style="width: 100%;"><Icon type="ios-cloud-upload-outline" size="20" style="margin-right:0.5em;"></Icon>Click or drag file here to upload.</Button>
          </Upload> -->
          <div class="liveUploadDocParent">
             <Button type="dashed" style="width: 100%;"><Icon type="ios-cloud-upload-outline" size="20" style="margin-right:0.5em;"></Icon>{{$t('LectureList.ClickHereUpload')}}</Button>
             <input id="liveUploadVideoInput" type="file" @change="uploadVideoInputChange(this);"  accept="video/mp4">
          </div>
          <upload-file preid="live" ref="uploadfile"></upload-file>
          <Upload
            ref="updateVideoUpload"
            type="drag"
            :action="updateVideoUploadAction"
            :headers="uploadHeaders"
            :show-upload-list="false"
            :default-file-list="editingVideos"
            :before-upload="handleVideoBeforeUpload"
            :on-progress="handleVideoProgress"
            :on-success="handleUpdateVideoSuccess"
            :on-error="handleVideoError"
            style="display: none;">
          </Upload>
        </td>
        <td>
          <Button style="width:100%" @click="handleSelectVideo"><Icon type="document" size="20" style="margin-right:0.5em;"></Icon>{{$t('LectureList.SelectFromSavedVideos')}}</Button>
        </td>
      </tr>

      <tr>
        <td colspan="2">
          <Progress v-show="uploading" :percent="uploadPercentage" hide-info></Progress>
        </td>
      </tr>
    </table>

    <div>
      <Modal v-model="modalSelectFile" :title="$t('LectureList.SelectFromSavedFiles')" :mask-closable="false" :transfer="false" width="800">
        <select-file-list ref="fileList" :school-id="schoolId"></select-file-list>

        <div slot="footer" style="height:35px;">
          <div style="float: right">
            <button type="button" class="k-button k-primary" @click="handleSelectFileOK">{{$t('Base.OK')}}</button>
            <button type="button" class="k-button" @click="handleSelectFileCancel">{{$t('Base.Cancel')}}</button>
          </div>
        </div>
      </Modal>

      <Modal v-model="modalSelectVideo" :title="$t('LectureList.SelectFromSavedVideos')" :mask-closable="false" :transfer="false" width="800">
        <select-file-list ref="videoList" :school-id="schoolId" :is-video="true"></select-file-list>

        <div slot="footer" style="height:35px;">
          <div style="float: right">
            <button type="button" class="k-button k-primary" @click="handleSelectVideoOK">{{$t('Base.OK')}}</button>
            <button type="button" class="k-button" @click="handleSelectVideoCancel">{{$t('Base.Cancel')}}</button>
          </div>
        </div>
      </Modal>
      <Modal :title="$t('KloudSyncDocuments.Converting')"
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
  </div>
</template>

<style lang="scss">
  .lecture-item {
    $images-root: "../../../static/images/";

    $lecture-file-width: 90px;
    $lecture-file-height: 90px;

    .lecture-info-table{
      font-size: 14px;
      text-align: left;
      width: 100%;
      .replaceInputFile{
        position: absolute;
        opacity: 0;
        left: 16px;
        top:7px;
        overflow: hidden;
        width: 68px;
        height: 18px;
      }
      .liveUploadDocParent{
        position: relative;
        #liveUploadDocInput{
          position: absolute;
          right: 0px;
          top: 0px;
          width: 100%;
          height: calc(50px - 1em);
          opacity: 0;
        };
        #liveUploadVideoInput{
           position: absolute;
          right: 0px;
          top: 0px;
          width: 100%;
          height: calc(50px - 1em);
          opacity: 0;
        }
      }
      td {
        padding: .5em;
      }

      #lectureTitle {
        input {
          width: 100%;
          padding: 0.25em;
          border-radius: 0.25em;
          border: 1px solid transparent;        
          //font-weight: bold;
          font-size: large;
          //color: darkblue;
          color: #1c2438;
          //text-align: center;
        }

        input:read-write:hover, input:read-write:focus{
          border: 1px solid #80848f;
        }
      }

      #lectureDesc {
        textarea {
          width: 100%;
          resize: none;
          padding: 0.5em;
          //font-weight: bold;
          border-radius: 0.25em;
          border: 1px solid transparent;
          //color: #80848f;
          color: #495060;
          overflow: hidden;
        }

        textarea:read-write:hover, textarea:read-write:focus{
          border: 1px solid #80848f;
        }
      }

      .ivu-table th {
        background-color: #495060;
        color: white;
        text-align: center;
      }

      .ivu-table td {
        text-align: center;
      }

      .ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td {
        background-color: #aad5ff;
        //color: white;
      }

      .ivu-table .bought-row td{
        background-color: #ff9900;
        color: #fff;
      }

      .table-action-icon {
        opacity: 0;
        cursor: pointer;
      }

      .ivu-table tr:hover .table-action-icon, .ivu-table .ivu-table-row-highlight .table-action-icon {
        opacity: 1;
      }
    }
  }
</style>

<script>
import auth from '../../authenticator';
import SelectFileList from './SelectFileList';
import UploadFile from '../livelesson/UploadFile';
import webapi from '../../webapi/webapi.js';
import util from '../../common/util.js';

export default {
  components: {
    SelectFileList,
    UploadFile
  },
  data() {
    return {
      initialized: false,
      loading: false,
      lectureId: 0,
      isCreating: false,
      uploadHeaders: {},
      editingLecture: {title: ""},
      editingFiles: [],
      editingVideos: [],
      currentUpload: 'file',
      tableColumnFiles: [
        {
          title: this.$t('Files.FileName'),
          key: 'name',
          width: 300,
        },
        {
          title: this.$t('Common.Type'),
          key: 'type',
        },
        {
          title: this.$t('Files.Size'),
          key: 'size',
        },
        {
          title: this.$t('Files.Date'),
          key: 'date',
          width: 170,
        },
        {
          title: ' ',
          key: 'action',
          width: 50,
          render: (h, params) => {
            return h('Dropdown', {
              props: {
                trigger: 'click',
                placement: 'bottom-end'
              },
              class: 'table-action-icon',
              on: {
                'on-click': (name) => {
                  this.handleFileActionClick(name, params.row)
                }
              }
            }, [
              h('Icon', {
                props: {
                  type: 'more' //'android-more-vertical'
                },
                style: {
                  padding: '0 8px'
                },
              }),
              h('Dropdown-menu', {
                slot: 'list'
              }, [
                h('Dropdown-item', {
                  props: {
                    name: "upload",
                  }
                },[h("div",{
                      class: 'replaceInputFile'
                    }, 
                    [h("input", 
                      {
                        attrs: {
                        id: 'upload-docment'+params.row.id, 
                        type:"file",
                        accept:"image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                        on: {
                          change: (val) => {
                            this.uploadReaplaceDocInputChange(params.row);
          　　　　　　　　　}
          　　　　　　　 },
                      }
                    )]
                  ),h("div",this.$t('Files.Replace'))]),
                h('Dropdown-item', {
                  props: {
                    name: "download"
                  }
                }, [h("a", {attrs: {download: 'download'}},this.$t('Files.Download'))]),
                h('Dropdown-item', {
                  props: {
                    name: "delete"
                  }
                }, this.$t('Common.Delete'))
              ])
            ]);
          }
        }
      ],
      tableColumnVideos: [
        {
          title: this.$t('Files.FileName'),
          key: 'name',
          width: 300
        },
        {
          title: this.$t('Files.Length'),
          key: 'duration'
        },
        {
          title: this.$t('Files.Size'),
          key: 'size',
        },
        {
          title: this.$t('Files.Date'),
          key: 'date',
          width: 170,
        },
        {
          title: ' ',
          key: 'action',
          width: 50,
          render: (h, params) => {
            return h('Dropdown', {
              props: {
                trigger: 'click',
                placement: 'bottom-end'
              },
              class: 'table-action-icon',
              on: {
                'on-click': (name) => {
                  this.handleVideoActionClick(name, params.row)
                }
              }
            }, [
              h('Icon', {
                props: {
                  type: 'more' //'android-more-vertical'
                },
                style: {
                  padding: '0 8px'
                },
              }),
              h('Dropdown-menu', {
                slot: 'list'
              }, [
                h('Dropdown-item', {
                  props: {
                    name: "upload"
                  }
                },[h("div",{
                      class: 'replaceInputFile'
                    }, 
                    [h("input", 
                      {
                        attrs: {
                        id: 'upload-video'+params.row.id, 
                        type:"file",
                        accept:"video/mp4"},
                        on: {
                          change: (val) => {
                            this.uploadVideoUpdateInputChange(params.row);
          　　　　　　　　　}
          　　　　　　　 },
                      }
                    )]
                  ),h("div",this.$t('Files.Replace'))]),
                h('Dropdown-item', {
                  props: {
                    name: "download"
                  }
                }, [h("a", {attrs: {download: 'download'}}, this.$t('Files.Download'))]),
                h('Dropdown-item', {
                  props: {
                    name: "delete"
                  }
                }, this.$t('Common.Delete'))
              ])
            ]);
          }
        }
      ],
      newFileUploadAction: GetAPIUrl(),
      updateFileUploadAction: GetAPIUrl(),
      newVideoUploadAction: GetAPIUrl(),
      updateVideoUploadAction: GetAPIUrl(),
      uploading: false,
      uploadPercentage: 0,
      uploadTimer: null,
      modalSelectFile: false,
      modalSelectVideo: false,

      showUploadCover:false,
      uploadingInfo: { ready: true, name: '', process: 0 },
      updateProcessTimer: null
    };
  },
  props: {
    courseId: {
      required: true
    }, 
    schoolId: {
      required: true
    }
  },
  mounted() {
    this.uploadHeaders = {"UserToken": auth.getUserToken()};
  },
  beforeDestroy()
  {
    if (this.updateProcessTimer)
    {
      clearTimeout(this.updateProcessTimer);
      this.updateProcessTimer = null;
    }
  },
  methods: {
    uploadVideoInputChange()
    {
      var input = $("#liveUploadVideoInput")[0];
      if (input.files.length==0 || this.handleEventVideoBeforeUpload(input.files[0]) == false)
      {
        return;
      }
      if (input.files[0].size >= 1024 * 1024 * 100)
      {
        alert(this.$t("Common.FileTooBig"));
        return;
      }
      let liveUploadVideoInput="#liveUploadVideoInput";
      this.isRepeatUpload(input.files[0],liveUploadVideoInput);
    },
    handleEventVideoBeforeUpload(file)
    {
      let accept = [".mp4"];
      var ext = file.name.substr(file.name.lastIndexOf("."));
      ext = ext.toLowerCase();
      if (!IsExistInArr(accept, ext))
      {
        alert(this.$t("Common.FileNotSupport"));
        return false;
      }
      return true;
    },
    //重复上传
    isRepeatUpload(file,id){
      let upfile=file;
      let filename=upfile.name;
      let self=this;
      let eventID=this.lectureId;
      let liveUploadInput=id;
      let url=GetAPIUrl() + "KWEventAttachment/UploadFile?Description=attachment"+"&EventID=" + this.lectureId;
      util.GetMD5(upfile).then(hash=>{
        webapi.UploadFileKwEventAttachmentHash(eventID, filename, hash, 0, 0).then((result)=>{
          if (result.RetCode == 0){//返回上传的数据
              if (result.RetData !== null) {
                let attachment = result.RetData;
                if (attachment.AttachmentID) {
                  if(liveUploadInput=="#liveUploadDocInput"){
                    let lectureFile = self._attachment2File(attachment);
                    self.editingLecture.detail.Attachments.push(attachment);
                    self.editingFiles.push(lectureFile);

                  }else{
                    let lectureVideo = self._attachment2File(attachment);
                    self.editingLecture.detail.Attachments.push(attachment);
                    self.editingVideos.push(lectureVideo);
                  }
                }
              }
              $(liveUploadInput).val("");
          }else if (result.RetCode == -6002){//此哈希值对应的文件不存在，请直接上传
            self.$refs.uploadfile.Upload(upfile,url +"&Hash="+hash, resultData =>
            { 
              if (resultData.RetData !== null) {
              let attachment = resultData.RetData;
                if (attachment.AttachmentID) {
                  if(liveUploadInput=="#liveUploadDocInput"){
                    let lectureFile = self._attachment2File(attachment);
                    self.editingLecture.detail.Attachments.push(attachment);
                    self.editingFiles.push(lectureFile);

                    if (attachment.FileType == 4 || attachment.FileType == 5)
                    {
                      self.updateEnd(true);
                      return;
                    }
                    self.showUploadCover=true;
                    self.uploadingInfo.name = filename;
                    self.uploadingInfo.process = 0;
                    self.updateProcessTimer = setInterval(() =>{
                      self.updateProcess(attachment.AttachmentID);
                    }, 1000);

                   

                  }else{
                    let lectureVideo = self._attachment2File(attachment);
                    self.editingLecture.detail.Attachments.push(attachment);
                    self.editingVideos.push(lectureVideo);
                  }
                }
              }
              $(liveUploadInput).val("");
            }, () =>
            {
              $(liveUploadInput).val("");
              });
          }else if (result.RetCode == -6003){//文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
              self.$Message.warning({content:self.$t("Common.FileAlreadyinList"),duration: 3});
              $(id).val("");
          }
          else{
            $(liveUploadInput).val("");
          }
        });
      }) 
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
        this.$Message.info({content:this.$t('KloudSyncDocuments.FileUploadedSuccessfully'),duration: 3});
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
    uploadDocInputChange()
      {
        var input = $("#liveUploadDocInput")[0];
        if (input.files.length==0 || this.handleEventDocBeforeUpload(input.files[0]) == false)
        {
          return;
        }
        if (!this.uploadingInfo.ready)
        {
          alert(this.$t("Common.WaitForFileUploading"));
          $("#uploadNewFileWithTag").val("");
          return;
        }
        if (input.files[0].size >= 1024 * 1024 * 100)
        {
          alert(this.$t("Common.FileTooBig"));
          return;
        }
        let file=input.files[0];
        let liveUploadDocInput="#liveUploadDocInput";
        this.isRepeatUpload(file,liveUploadDocInput);
      },
    handleEventDocBeforeUpload (file)
    {
      let accept = [".jpg", ".jpeg", ".jpe", ".png", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"];
      var ext = file.name.substr(file.name.lastIndexOf("."));
      ext = ext.toLowerCase();
      if (!IsExistInArr(accept, ext))
      {
        alert(this.$t("Common.FileNotSupport"));
        return false;
      }
      return true;
    },
    readData(id) {
      this.lectureId = id;
      this.editingFiles = [];
      this.editingVideos = [];

      let self = this;
      if (this.lectureId < 0) {
        this.isCreating = true;

        let url = GetAPIUrl() + "Lecture/Sequence";
        this._getData(url, null, (result) => {
          self.lectureId = parseInt(result);

          self.editingLecture = {
            id: self.lectureId,
            title: "",
            desc: "",
            lessonCount: 0,
            detail: {"LectureID": self.lectureId, "CourseID": self.courseId, "Title": "", "Description": "", LessonCount: 0, Attachments: []}
          };

          let uploadFile = GetAPIUrl() + "KWEventAttachment/UploadFile?Description=attachment";
          uploadFile += "&EventID=" + self.lectureId;
          self.newFileUploadAction = uploadFile;

          let uploadVideo = GetAPIUrl() + "KWEventAttachment/UploadFile?Description=attachment";
          uploadVideo += "&EventID=" + self.lectureId;
          self.newVideoUploadAction = uploadVideo;

          self.$nextTick(() => {
            self.$refs.title.focus();
          });
        }, null);
      }
      else {
        this.isCreating = false;

        let url = GetAPIUrl() + "Lecture/Item?lectureID=" + this.lectureId;
        this._getData(url, null, (result) => {
          let lecture = result;

          self.editingLecture = {
            id: lecture.LectureID,
            title: lecture.Title,
            desc: lecture.Description,
            lessonCount: lecture.LessonCount,
            detail: lecture
          };

          for (let i = 0; i < lecture.Attachments.length; i++) {
            let attachment = lecture.Attachments[i];
            if (attachment.AttachmentID) {
              let lectureFile = self._attachment2File(attachment);

              if (lectureFile.type === 4) {
                self.editingVideos.push(lectureFile);
              }
              else {
                self.editingFiles.push(lectureFile);
              }
            }
          }

          let uploadFile = GetAPIUrl() + "KWEventAttachment/UploadFile?Description=attachment";
          uploadFile += "&EventID=" + self.lectureId;
          self.newFileUploadAction = uploadFile;

          let uploadVideo = GetAPIUrl() + "KWEventAttachment/UploadFile?Description=attachment";
          uploadVideo += "&EventID=" + self.lectureId;
          self.newVideoUploadAction = uploadVideo;
        }, null);
      }
    },
    handleFileActionClick(action, file) {
      switch(action) {
        case 'upload':
          // this.uploadReaplaceDocInputChange(file);
          break;

        case 'delete':
          this.handleRemoveFile(file);
          break;
        case 'download':
           window.open(file.url);
          break;  
      }
    },
    uploadReaplaceDocInputChange(row){
        var input = $('#upload-docment'+row.id)[0];
        if (input.files.length==0 || this.handleEventDocBeforeUpload(input.files[0]) == false)
        {
          return;
        }
        if (input.files[0].size >= 1024 * 1024 * 100)
        {
          alert(this.$t("Common.FileTooBig"));
          return;
        }
        let file=input.files[0];
        let liveUploadDocInput='#upload-docment'+row.id;
        let itemId=row.id;
        this.isRepeatUpdateUpload(file,liveUploadDocInput,itemId);
    },
    //update上传
    isRepeatUpdateUpload(file,id,itemId){
      let upfile=file;
      let filename=upfile.name;
      let self=this;
      let eventID=this.lectureId;
      let liveUploadInput=id;
      let url=GetAPIUrl() + "KWEventAttachment/UpdateFile?Description=attachment"+"&EventID=" + this.lectureId;
      util.GetMD5(upfile).then(hash=>{
        webapi.UploadUpdateFileKwEventAttachmentHash(eventID,itemId ,filename, hash).then((result)=>{
          if (result.RetCode == 0){//返回上传的数据
              if (result.RetData !== null) {
                let attachment = result.RetData;
                if (attachment.AttachmentID) {
                  if(liveUploadInput.indexOf("#upload-docment")!=-1){
                    let lectureFile = self._attachment2File(attachment);
                    for(let i=0;i<self.editingFiles.length;i++){
                      if(self.editingFiles[i].id==attachment.ItemID){
                        self.editingLecture.detail.Attachments.splice(i, 1, attachment);
                        self.editingFiles.splice(i, 1, lectureFile);
                      }
                    }
                  }else{
                    let lectureVideo = self._attachment2File(attachment);
                    for(let i=0;i<self.editingVideos.length;i++){
                      if(self.editingVideos[i].id==attachment.ItemID){
                        self.editingLecture.detail.Attachments.splice(i, 1, attachment);
                        self.editingVideos.splice(i, 1, lectureVideo);
                      }
                    }
                  }
                }
              }
              $(liveUploadInput).val("");
          }else if (result.RetCode == -6002){//此哈希值对应的文件不存在，请直接上传
            self.$refs.uploadfile.Upload(upfile,url +"&Hash="+hash+"&itemID="+itemId, resultData =>
            { 
              if (resultData.RetData !== null) {
                let attachment = resultData.RetData;
                if (attachment.AttachmentID) {
                  if(liveUploadInput.indexOf("#upload-docment")!=-1){
                    let lectureFile = self._attachment2File(attachment);
                    for(let i=0;i<self.editingFiles.length;i++){
                      if(self.editingFiles[i].id==attachment.ItemID){
                        self.editingLecture.detail.Attachments.splice(i, 1, attachment);
                        self.editingFiles.splice(i, 1, lectureFile);
                      }
                    }
                  }else{
                    let lectureVideo = self._attachment2File(attachment);
                    for(let i=0;i<self.editingVideos.length;i++){
                      if(self.editingVideos[i].id==attachment.ItemID){
                        self.editingLecture.detail.Attachments.splice(i, 1, attachment);
                        self.editingVideos.splice(i, 1, lectureVideo);
                      }
                    }
                  }
                }
              }
              $(liveUploadInput).val("");
            }, () =>
            {
              $(liveUploadInput).val("");
              });
          }else if (result.RetCode == -6003){//文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
              self.$Message.warning({content:self.$t("Common.FileAlreadyinList"),duration: 3});
              $(id).val("");
          }
          else{
            $(liveUploadInput).val("");
          }
        });
      }) 
    },
    handleViewFile(file) {
      //console.log(file);
    },
    handleRemoveFile(file) {
      let self = this;

      this.$Modal.confirm({
        title: self.$t("Files.RemoveDocTitle"),
        content: self.$t("Files.RemoveDocContent"),
        okText: self.$t("Common.Delete"),
        cancelText: self.$t("Base.Cancel"),
        onOk: () => {
          let url = GetAPIUrl() + "KWEventAttachment/RemoveAttachments?itemIDs=" + file.id;

          self._deleteData(url, null, (result) => {
            for(let i=0;i<self.editingFiles.length;i++){
              if(self.editingFiles[i].id==file.id){
                self.editingFiles.splice(i,1);
              }
            }
            // let list = self.editingFiles;
            // list.splice(list.indexOf(file), 1);
            // list = self.editingLecture.detail.Attachments;
            // list.splice(list.indexOf(file.detail), 1);
          }, null);
        }
      });
    },
    handleUpdateFile(file) {
      this.updateFileUploadAction = GetAPIUrl() + "KWEventAttachment/UpdateFile?attachmentID=" + file.id;

      this.$nextTick(() => {
        this.$refs.updateFileUpload.handleClick();
      });
    },
    handleDownloadFile(file) {
    },
    handleFileBeforeUpload(file) {
      this.startUploadProgress();
    },
    handleFileProgress(event, file, fileList) {
      //this.uploadPercentage = file.percentage;
    },
    handleFileError(error, file, fileList) {
      this.endUploadProgress();

      console.log(error);
    },
    handleNewFileSuccess(result, file) {
      this.endUploadProgress();

      if (result.RetCode === 0) {
        if (result.RetData !== null) {
          let attachment = result.RetData;
          if (attachment.AttachmentID) {
            let lectureFile = this._attachment2File(attachment);

            this.editingLecture.detail.Attachments.push(attachment);
            this.editingFiles.push(lectureFile);
          }
        }
      }
      else {
        console.log(result);
      }
    },
    handleUpdateFileSuccess(result, file) {
      this.endUploadProgress();

      if (result.RetCode === 0) {
        if (result.RetData !== null) {
          let attachment = result.RetData;
          if (attachment.AttachmentID) {
            let lectureFile = this._attachment2File(attachment);

            for (let i = 0; i < this.editingFiles.length; i++) {
              if (lectureFile.id === this.editingFiles[i].id) {
                this.editingLecture.detail.Attachments.splice(i, 1, attachment);
                this.editingFiles.splice(i, 1, lectureFile);
                break;
              }
            }
          }
        }
      }
      else {
        console.log(result);
      }
    },
    handleSelectFile() {
      this.$refs.fileList.loadData();
      this.modalSelectFile = true;
    },
    handleSelectFileOK() {
      let selection = this.$refs.fileList.getSelection();
      if (selection.length === 0)
        this.modalSelectFile = false;

      let self = this;
      let url = GetAPIUrl() + "KWEventAttachment/UploadFromFavorite?issueID=" + this.lectureId + "&itemIDs=" + selection.toString();
      this._postData(url, {}, null, (result) => {
        for (let i = 0; i < result.length; i++) {
          let file = self._attachment2File(result[i]);
          this.editingFiles.splice(0, 0, file);
        }

        this.modalSelectFile = false;
      }, null);
    },
    handleSelectFileCancel() {
      this.modalSelectFile = false;
    },
    handleDropbox() {
      let self = this;

      Dropbox.choose({
        success: function (files) {
          let url = GetAPIUrl() + "KWEventAttachment/UploadRemoteFile?EventID=" + self.lectureId;

          for (let i = 0; i < files.length; i++) {
            self.startUploadProgress();

            let data = {
              'Title': files[i].name,
              'Description': '',
              'Url': files[i].link,
              'FileName': files[i].name
            };

            self._postData(url, data, null, (result) => {
              let attachment = result;
              if (attachment.AttachmentID) {
                let lectureFile = self._attachment2File(attachment);

                self.editingLecture.detail.Attachments.push(attachment);
                self.editingFiles.push(lectureFile);
              }
            }, null);
          }
        },
        cancel: function () {
        },
        linkType: "preview", // or "direct"
        multiselect: true // or true
        // Optional. This is a list of file extensions. If specified, the user will
        // only be able to select files with these extensions. You may also specify
        // file types, such as "video" or "images" in the list. For more information,
        // see File types below. By default, all extensions are allowed.
        //extensions: ['.pdf', '.doc', '.docx'],
      });
    },
    handleVideoActionClick(action, video) {
      switch(action) {
        case 'upload':
          // this.uploadVideoUpdateInputChange(video);
          break;

        case 'delete':
          this.handleRemoveVideo(video);
          break;
        case 'download':
          window.open(video.url)
          break;
      }
    },
    uploadVideoUpdateInputChange(param){
      var input = $("#upload-video"+param.id)[0];
      if (input.files.length==0 || this.handleEventVideoBeforeUpload(input.files[0]) == false)
      {
        return;
      }
      if (input.files[0].size >= 1024 * 1024 * 100)
      {
        alert(this.$t("Common.FileTooBig"));
        return;
      }
      let liveUploadVideoInput="#upload-video"+param.id;
      let itemId=param.id;
      this.isRepeatUpdateUpload(input.files[0],liveUploadVideoInput,itemId);
    },
    handleViewVideo(video) {
      //console.log(video);
    },
    handleRemoveVideo(video) {
      let self = this;

      this.$Modal.confirm({
        title: self.$t("Files.RemoveVedioTitle"),
        content: self.$t("Files.RemoveVedioContent"),
        okText: self.$t("Common.Delete"),
        cancelText: self.$t("Base.Cancel"),
        onOk: () => {
          let url = GetAPIUrl() + "KWEventAttachment/RemoveAttachments?itemIDs=" + video.id;

          self._deleteData(url, null, (result) => {
            for(let i=0;i<self.editingVideos.length;i++){
              if(self.editingVideos[i].id==video.id){
                self.editingVideos.splice(i,1);
              }
            }
            // let list = self.editingVideos;
            // list.splice(list.indexOf(video), 1);
            // list = self.editingLecture.detail.Attachments;
            // list.splice(list.indexOf(video.detail), 1);
          }, null);
        }
      });
    },
    handleUpdateVideo(video) {
      this.updateVideoUploadAction = GetAPIUrl() + "KWEventAttachment/UpdateFile?attachmentID=" + video.id;

      this.$nextTick(() => {
        this.$refs.updateVideoUpload.handleClick();
      });
    },
    handleDownloadVideo(video) {
    },
    handleVideoBeforeUpload(video) {
      this.startUploadProgress();
    },
    handleVideoProgress(event, video, videoList) {
      //this.uploadPercentage = video.percentage;
    },
    handleVideoError(error, video, videoList) {
      this.endUploadProgress();

      console.log(error);
    },
    handleNewVideoSuccess(result, video) {
      this.endUploadProgress();

      if (result.RetCode === 0) {
        if (result.RetData !== null) {
          let attachment = result.RetData;
          if (attachment.AttachmentID) {
            let lectureVideo = this._attachment2File(attachment);
            this.editingLecture.detail.Attachments.push(attachment);
            this.editingVideos.push(lectureVideo);
          }
        }
      }
      else {
        console.log(result);
      }
    },
    handleUpdateVideoSuccess(result, video) {
      this.endUploadProgress();

      if (result.RetCode === 0) {
        if (result.RetData !== null) {
          let attachment = result.RetData;
          if (attachment.AttachmentID) {
            let lectureVideo = this._attachment2File(attachment);

            for (let i = 0; i < this.editingVideos.length; i++) {
              if (lectureVideo.id === this.editingVideos[i].id) {
                this.editingLecture.detail.Attachments.splice(i, 1, attachment);
                this.editingVideos.splice(i, 1, lectureVideo);
                break;
              }
            }
          }
        }
      }
      else {
        console.log(result);
      }
    },
    handleSelectVideo() {
      this.$refs.videoList.loadData();
      this.modalSelectVideo = true;
    },
    handleSelectVideoOK() {
      let selection = this.$refs.videoList.getSelection();
      if (selection.length === 0)
        this.modalSelectVideo = false;

      let self = this;
      let url = GetAPIUrl() + "KWEventAttachment/UploadFromFavorite?issueID=" + this.lectureId + "&itemIDs=" + selection.toString();
      this._postData(url, {}, null, (result) => {
        for (let i = 0; i < result.length; i++) {
          let file = self._attachment2File(result[i]);
          this.editingVideos.splice(0, 0, file);
        }

        this.modalSelectVideo = false;
      }, null);
    },
    handleSelectVideoCancel() {
      this.modalSelectVideo = false;
    },
    startUploadProgress() {
      this.uploading = true;
      this.uploadPercentage = 0;

      let self = this;
      this.uploadTimer = setInterval(function () {
        self.uploadPercentage += Math.round((100 - self.uploadPercentage) * 0.05);
      }, 100);
    },
    endUploadProgress() {
      this.uploadPercentage = 100;
      this.uploading = false;
      if (this.uploadTimer) {
        clearInterval(this.uploadTimer);
        this.uploadTimer = null;
      }
    },
    saveData() {
      let title = this.editingLecture.title;
      if (!title) {
        alert(this.$t('CourseItem.ErrorTitleCannotEmpty'));
        return;
      }

      let desc = this.editingLecture.desc;

      let url = "";
      let data = null;

      if (this.isCreating) {
        url = GetAPIUrl() + "Lecture/CreateLecture";

        data = {
          "CourseID": this.courseId,
          "LectureID": this.lectureId,
          "Title": title,
          "Description": desc,
          "LessonCount": this.editingLecture.lessonCount
        };
      }
      else {
        url = GetAPIUrl() + "Lecture/UpdateLecture";

        data = {
          "LectureID": this.lectureId,
          "Title": title,
          "Description": desc,
          "LessonCount": this.editingLecture.lessonCount
        };
      }

      let self = this;
      self._postData(url, data, null, (result) => {
        self.afterSaveOrRemove('save');
      }, null);
    },
    removeData() {
      if (this.isCreating) {
        this.afterSaveOrRemove('remove');
      }
      else {
        let self = this;

        this.$Modal.confirm({
          title: self.$t("Files.RemoveLectureTitle"),
          content: self.$t("Files.RemoveLectureContent"),
          okText: self.$t("Common.Delete"),
          cancelText: self.$t("Base.Cancel"),
          onOk: () => {
            let url = GetAPIUrl() + "Lecture/Delete?lectureID=" + self.lectureId;
            self._deleteData(url, null, (result) => {
              self.afterSaveOrRemove('remove');
            }, null);
          }
        });
      }
    },
    afterSaveOrRemove(method) {
      this.$emit('on-save-remove', method);
    },
    _attachment2File(attachment) {
      let date = '';
      if (attachment.CreatedDate)
        date = (new Date(parseInt(attachment.CreatedDate))).Format("yyyy-MM-dd hh:mm:ss");

      let typen = attachment.Title.lastIndexOf(".");
      let type = '';
      if (typen > 0)
        type = attachment.Title.substr(typen + 1);

      let lectureFile = {
        id: attachment.ItemID,
        name: attachment.Title,
        url: attachment.SourceFileUrl,
        status: this.$t('Files.Finished'),
        type: type.toUpperCase(), //attachment.FileType,
        size: attachment.VideoSize,
        duration: attachment.VideoDuration,
        date: date,
        detail: attachment
      };

      return lectureFile;
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
            if (success && typeof success === 'function') {
              success(result.RetData);
            }

            self.loading = false;
            self.$Loading.finish();
          }
          else { // error
            if (error && typeof error === 'function') {
              error(result);
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          if (error && typeof error === 'function') {
            error();
          }

          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);
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
            if (success && typeof success === 'function') {
              success(result.RetData);
            }

            self.loading = false;
            self.$Loading.finish();
          }
          else { // error
            if (error && typeof error === 'function') {
              error(result);
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          if (error && typeof error === 'function') {
            error();
          }

          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);
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
            if (success && typeof success === 'function') {
              success(result.RetData);
            }

            self.loading = false;
            self.$Loading.finish();
          }
          else { // error
            if (error && typeof error === 'function') {
              error(result);
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          if (error && typeof error === 'function') {
            error();
          }

          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);
        }
      });
    }
  }
}
</script>

