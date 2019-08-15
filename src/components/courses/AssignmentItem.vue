<template>
  <div class="assignment-item">
    <div class="item-header">
      Homework
    </div>

    <table class="assignment-info-table">
      <tr>
        <td><label for="assignmentTitle">Title</label></td>
        <td>
          <Input id="assignmentTitle" ref="title" v-model="editingAssignment.title" :placeholder="$t('AssignmentList.PlaceholderAnewAddAssignment')"/>
        </td>
      </tr>
      <tr>
        <td><label for="assignmentDeadline">Deadline</label></td>
        <td>
          <DatePicker id="assignmentDeadline" v-model="editingAssignment.deadline" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
        </td>
      </tr>
      <tr>
        <td style="height: 1.2em;"><label for="assignmentDesc">Description</label></td>
        <td rowspan="2">
          <Input id="assignmentDesc" v-model="editingAssignment.desc" type="textarea" :autosize="{minRows:2, maxRows:5}" :placeholder="$t('AssignmentList.placeholderDescriptionAddAssignment')"></Input>
        </td>
      </tr>
      <tr>
        <td style="opacity: 0">Position</td>
      </tr>
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td style="height: 1.2em;">
          <label for="assignmentFiles">Homework content</label>
        </td>
        <td rowspan="2">
          <div class="assignment-file-list">
            <div class="assignment-file" v-for="item in editingFiles" :key="item.id" >
              <table>
                <tr>
                  <td class="assignment-file-left">
                    <div class="assignment-file-name">
                      <Icon type="document" size="36" style="margin-right:8px;"></Icon>
                      <span>{{item.name}}</span>
                    </div>
                    <div class="assignment-file-cover">
                      <Icon type="ios-eye-outline" :title="$t('AssignmentList.FileView')" @click.native="handleViewFile(item)"></Icon>
                      <Icon type="ios-trash-outline" :title="$t('AssignmentList.DeleteFile')" @click.native="handleRemoveFile(item)"></Icon>
                      <Icon type="ios-cloud-upload-outline" :title="$t('AssignmentList.UploadNewVersion')">
                      </Icon>
                      <div class="uploadReplace">
                        <input :id="'uploadReplace'+item.id" type="file" @change="uploadReplaceAssignment(item);"  accept="video/mp4,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                      </div>
                      <a download><Icon type="ios-cloud-download-outline" :title="$t('AssignmentList.DownloadFile')" @click.native="handleDownloadFile(item)"></Icon></a>
                    </div>
                  </td>
                  <td class="assignment-file-right">
                    <div>
                      <label>Points</label>
                      <Input v-model="item.points"/>
                    </div>
                  </td>
                </tr>
              </table>
            </div>

            <div class="assignment-file" >
              <table>
                <tr>
                  <td class="assignment-file-left">
                    <div style="border-right: 1px solid #bbbec4;">
                      <Tabs v-model="uploadWay">
                        <TabPane label="Upload" icon="ios-cloud-upload" name="localfile">                          
                        </TabPane>
                        <TabPane label="My saved file" icon="ios-star" name="savedfile">                          
                        </TabPane>
                        <TabPane label="Dropbox" icon="social-dropbox" name="dropbox">                          
                        </TabPane>
                        <TabPane label="Google Drive" icon="social-google" name="googledrive">                          
                        </TabPane>
                      </Tabs>

                      <div>
                        <div style="padding: 0 4em 1em;" v-show="uploadWay == 'localfile'">
                          <div class="clickFile">
                            <p>Click or Drag files here to upload</p>
                            <input id="UploadAssignmentItem" type="file" @change="uploadAssignmentChange(this);"  accept="video/mp4,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="assignment-file-right">
                    <div>
                      <label>Points</label>
                      <Input v-model="newFilePoints"/>
                    </div>
                  </td>
                </tr>
              </table>
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
              style="display: none">
            </Upload>
            <Progress v-show="fileUploading" :percent="uploadPercentage" hide-info></Progress>
          </div>
        </td>
      </tr>
      <tr>
        <td style="opacity: 0">Position</td>
      </tr>
      <!-- <tr v-if="true">
        <td>
          <label for="assignmentUpload">Upload from: </label>
        </td>
        <td>
          <button type="button" class="k-button" style="color: #1e7fef; border-color: #1e7fef;" @click="handleDropbox"><Icon type="social-dropbox" style="margin-right: 0.5em"></Icon> Dropbox</button>
          <button type="button" class="k-button" style="color: #d7431f; border-color: #d7431f;" @click="handleGoogle"><Icon type="social-google" style="margin-right: 0.5em"></Icon> Google Drive</button>
        </td>
      </tr> -->
    </table>
  </div>
</template>

<style lang="scss">
.clickFile{
  height: 80px;
  position: relative;
  background: white;
  text-align: center;
  padding-top: 25px;
  border: 1px dashed #bbbec4;

  #UploadAssignmentItem{
    position: absolute;
    right: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

  .assignment-item {
    padding: 1em 2em;

    .item-header {
      font-size: 20px;
      padding: 8px 8px 16px;
    }

    .assignment-info-table{
      //font-size: 16px;
      text-align: left;
      width: 100%;

      td:first-of-type {
        text-align: right;
        width:12em;
      }

      td {
        padding: .5em;
      }

      #assignmentTitle{
        input {
          width: 100%;
        }
      }

      #assignmentDesc {
        textarea {
          width: 100%;
          resize: none;
        }
      }

      .assignment-file-list{
        padding: 0;
        margin: 0;
      }

      .assignment-file{
        width: 100%;
        background: #e9eaec;
        position: relative;
        margin: 4px;

        .assignment-file-left {
          width:60%; 
          position: relative; 
          padding:3px 0;
        }

        .assignment-file-name {
          display:flex; 
          align-items:center; 
          padding: 1em 2em; 
          border-right: 1px solid #bbbec4;
        }

        .assignment-file-right {
           padding:1em 2em;
        }
      }

      .assignment-file-cover{
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0,0,0,.5);
        text-align: center;
        line-height: 100px;

        .uploadReplace{
          position: absolute;
          left: 30px;
          bottom: 30px;
          width: 30px;
          height: 26.5px;
          overflow: hidden;
          opacity: 0;
        }
      }
      .assignment-file-left:hover .assignment-file-cover{
        display: block;
      }
      .assignment-file-cover i{
        color: #fff;
        font-size: 30px;
        cursor: pointer;
        margin: 0 16px;
      }
    }
  }
</style>

<script>
  import Vue from 'vue';
  import auth from '../../authenticator';
  import UploadFile from '../livelesson/UploadFile';
  import webapi from '../../webapi/webapi.js';
  import util from '../../common/util.js';

  export default {
    data() {
      return {
        initialized: false,
        loading: false,
        assignmentId: 0,
        isCreating: false,
        uploadHeaders: {},
        editingAssignment: {title: ""},
        editingFiles: [],
        newFileUploadAction: GetAPIUrl(),
        updateFileUploadAction: GetAPIUrl(),
        fileUploading: false,
        uploadPercentage: 0,
        uploadTimer: null,
        newFilePoints: 0,
        uploadWay: 'localfile'
      };
    },
    props: {
      courseId: {
        required: true
      }
    },
    components: {
      UploadFile
    },
    mounted() {
      this.uploadHeaders = {"UserToken": auth.getUserToken()};
    },
    methods: {
      //分片上传
      uploadAssignmentChange()
      {
        var input = $("#UploadAssignmentItem")[0];
        if (input.files.length==0 || this.handleEventVideoBeforeUpload(input.files[0]) == false)
        {
          return;
        }
        if (input.files[0].size >= 1024 * 1024 * 100)
        {
          alert(this.$t("Common.FileTooBig"));
          return;
        }
        //判断是否重复上传
        let upfile=input.files[0];
        let filename=upfile.name;
        let self=this;
        let eventID=this.assignmentId;
        let points=this.newFilePoints;
        util.GetMD5(upfile).then(hash=>{
          webapi.UploadFileKwEventAttachmentHash(eventID, filename, hash, points, 0).then((result)=>{
            if (result.RetCode == 0){//返回上传的数据
                let resultData=result.RetData;
                if (resultData.RetData !== null) {
                  let attachment = resultData;
                  if (attachment.AttachmentID) {
                    let assignmentFile = self._attachment2File(attachment);

                    self.editingAssignment.detail.Attachments.push(attachment);
                    self.editingFiles.push(assignmentFile);
                  }
                }
                $("#UploadAssignmentItem").val("");
            }else if (result.RetCode == -6002){//此哈希值对应的文件不存在，请直接上传
              self.$refs.uploadfile.Upload(input.files[0], 
              GetAPIUrl() + "KWEventAttachment/UploadFile?Description=attachment&EventID="+ eventID+"&Hash="+hash+"&Points=" +points+ "&ParentID=" + 0, 
              resultData =>
              { 
                if (resultData.RetData !== null) {
                  let attachment = resultData.RetData;
                  if (attachment.AttachmentID) {
                    let assignmentFile = self._attachment2File(attachment);

                    self.editingAssignment.detail.Attachments.push(attachment);
                    self.editingFiles.push(assignmentFile);
                  }
                }
                $("#UploadAssignmentItem").val("");
              }, () =>
              {
                $("#UploadAssignmentItem").val("");
                });
            }else if (result.RetCode == -6003){//文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
                self.$Message.warning({content:self.$t("Common.FileAlreadyinList"),duration: 3});
                $("#UploadAssignmentItem").val("");
            }
            else{
              $("#UploadAssignmentItem").val("");
            }
          });
        })       
      },
      handleEventVideoBeforeUpload: function (file)
      {
        let accept = [".mp4",".jpg", ".jpeg", ".jpe", ".png", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"];
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
        this.assignmentId = id;
        this.editingFiles = [];

        let self = this;
        if (this.assignmentId < 0) {
          this.isCreating = true;

          let url = GetAPIUrl() + "Assignment/Sequence";
          this._getData(url, null, (result) => {
            self.assignmentId = parseInt(result);

            self.editingAssignment = {
              id: self.assignmentId,
              title: "",
              desc: "",
              detail: {"AssignmentID": self.assignmentId, "CourseID": self.courseId, "Title": "", "Description": "", Attachments: []}
            };
            self.$nextTick(() => {
              self.$refs.title.focus();
            });
          }, null);
        }
        else {
          this.isCreating = false;

          let url = GetAPIUrl() + "Assignment/Item?assignmentID=" + this.assignmentId;
          this._getData(url, null, (result) => {
            let assignment = result;

            self.editingAssignment = {
              id: assignment.AssignmentID,
              title: assignment.Title,
              desc: assignment.Description,
              detail: assignment
            };

            for (let i = 0; i < assignment.Attachments.length; i++) {
              let attachment = assignment.Attachments[i];
              if (attachment.AttachmentID) {
                let assignmentFile = self._attachment2File(attachment);
                self.editingFiles.push(assignmentFile);
              }
            }
          }, null);
        }
      },
      handleViewFile(file) {
        //console.log(file);
      },
      handleRemoveFile(file) {
        let self = this;

        this.$Modal.confirm({
          title: self.$t("Files.RemoveFilesTitle"),
          content: self.$t("Files.RemoveFilesContent"),
          okText: self.$t("Common.Delete"),
          cancelText: self.$t("Base.Cancel"),
          onOk: () => {
            let url = GetAPIUrl() + "KWEventAttachment/RemoveAttachments?itemIDs=" + file.id;

            self._deleteData(url, null, (result) => {
              let list = self.editingFiles;
              list.splice(list.indexOf(file), 1);
              list = self.editingAssignment.detail.Attachments;
              list.splice(list.indexOf(file.detail), 1);
            }, null);
          }
        });
      },
      uploadReplaceAssignment(item){
        var input = $("#uploadReplace"+item.id)[0];
        if (input.files.length==0 || this.handleEventVideoBeforeUpload(input.files[0]) == false)
        {
          return;
        }
        if (input.files[0].size >= 1024 * 1024 * 100)
        {
          alert(this.$t("Common.FileTooBig"));
          return;
        }
        //判断是否重复上传
        let upfile=input.files[0];
        let filename=upfile.name;
        let self=this;
        let eventID=this.assignmentId;
        util.GetMD5(upfile).then(hash=>{
          webapi.UploadUpdateFileKwEventAttachmentHash(eventID,item.id ,filename, hash).then((result)=>{
            if (result.RetCode == 0){//返回上传的数据
                let resultData=result.RetData;
                if (resultData.RetData !== null) {
                  let attachment = resultData;
                  if (attachment.AttachmentID) {
                    let assignmentFile = self._attachment2File(attachment);
                    for(let i=0;i<self.editingFiles.length;i++){
                      if(self.editingFiles[i].id==attachment.ItemID){
                        self.editingAssignment.detail.Attachments.splice(i, 1, attachment);
                        self.editingFiles.splice(i, 1, assignmentFile);
                      }
                    }
                  }
                }
                $("#uploadReplace"+item.id).val("");
            }else if (result.RetCode == -6002){//此哈希值对应的文件不存在，请直接上传
              self.$refs.uploadfile.Upload(input.files[0], GetAPIUrl() + "KWEventAttachment/UpdateFile?Description=attachment&EventID="+ eventID+"&Hash="+hash+"&itemID="+item.id, resultData =>
              { 
                if (resultData.RetData !== null) {
                  let attachment = resultData.RetData;
                  if (attachment.AttachmentID) {
                    let assignmentFile = self._attachment2File(attachment);
                    for(let i=0;i<self.editingFiles.length;i++){
                      if(self.editingFiles[i].id==attachment.ItemID){
                        self.editingAssignment.detail.Attachments.splice(i, 1, attachment);
                        self.editingFiles.splice(i, 1, assignmentFile);
                      }
                    }
                  }
                }
                $("#uploadReplace"+item.id).val("");
              }, () =>
              {
                $("#uploadReplace"+item.id).val("");
                });
            }else if (result.RetCode == -6003){//文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
                self.$Message.warning({content:self.$t("Common.FileAlreadyinList"),duration: 3});
                $("#uploadReplace"+item.id).val("");
            }
            else{
              $("#uploadReplace"+item.id).val("");
            }
          });
        })       
      },
      handleDownloadFile(file) {
        window.open(file.url);
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
              let assignmentFile = this._attachment2File(attachment);

              this.editingAssignment.detail.Attachments.push(attachment);
              this.editingFiles.push(assignmentFile);
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
              let assignmentFile = this._attachment2File(attachment);

              for (let i = 0; i < this.editingFiles.length; i++) {
                if (assignmentFile.id === this.editingFiles[i].id) {
                  this.editingAssignment.detail.Attachments.splice(i, 1, attachment);
                  this.editingFiles.splice(i, 1, assignmentFile);
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
      handleDropbox() {
        let self = this;

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
          multiselect: true, // or true
          // Optional. This is a list of file extensions. If specified, the user will
          // only be able to select files with these extensions. You may also specify
          // file types, such as "video" or "images" in the list. For more information,
          // see File types below. By default, all extensions are allowed.
          extensions: ['.pdf', '.doc', '.docx']
        });
      },
      _uploadRemoteFile(fileName, fileTitle, fileDesc, fileLink) {
        let self = this;
        let url = GetAPIUrl() + "KWEventAttachment/UploadRemoteFile";

        let data = {
          'IssueID': this.assignmentId,
          'Title': fileTitle,
          'Description': fileDesc,
          'Url': fileLink,
          'FileName': fileName
        };

        this.startUploadProgress();
        this._postData(url, data, null, (result) => {
          let attachment = result;
          if (attachment.AttachmentID) {
            let assignmentFile = self._attachment2File(attachment);

            self.editingAssignment.detail.Attachments.push(attachment);
            self.editingFiles.push(assignmentFile);
          }

          self.endUploadProgress();
        }, (error) => {
          self.endUploadProgress();
        });
      },
      handleGoogle() {
        if (!googleAuthApiLoaded) {
          this.$Message.error("Google Authentication API is NOT ready!");
        }
        if (!googlePickerApiLoaded) {
          this.$Message.error("Google Picker API is NOT ready!");
        }
        if (!googleClientApiLoaded) {
          this.$Message.error("Google Client API is NOT ready!");
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
      startUploadProgress() {
        this.fileUploading = true;
        this.uploadPercentage = 0;

        let self = this;
        this.uploadTimer = setInterval(function () {
          self.uploadPercentage += Math.round((100 - self.uploadPercentage) * 0.05);
        }, 100);
      },
      endUploadProgress() {
        this.uploadPercentage = 100;
        this.fileUploading = false;
        if (this.uploadTimer) {
          clearInterval(this.uploadTimer);
          this.uploadTimer = null;
        }
      },
      saveData() {
        let title = this.editingAssignment.title;
        if (!title) {
          alert(this.$t("CourseItem.ErrorTitleCannotEmpty"));
          return;
        }

        let desc = this.editingAssignment.desc;

        let url = "";
        let data = null;

        if (this.isCreating) {
          url = GetAPIUrl() + "Assignment/CreateAssignment";

          data = {
            "CourseID": this.courseId,
            "AssignmentID": this.assignmentId,
            "Title": title,
            "Description": desc
          };
        }
        else {
          url = GetAPIUrl() + "Assignment/UpdateAssignment";

          data = {
            "AssignmentID": this.assignmentId,
            "Title": title,
            "Description": desc
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
            title: self.$t("Files.RemoveAssignmentTitle"),
            content: self.$t("Files.RemoveAssignmentContent"),
            okText: self.$t("Common.Delete"),
            cancelText: self.$t("Base.Cancel"),
            onOk: () => {
              let url = GetAPIUrl() + "Assignment/Delete?assignmentID=" + self.assignmentId;

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
        let id = attachment.ItemID;
        let url = attachment.SourceFileUrl;
        let name = attachment.Title;
        let points = attachment.Points;
        let assignmentFile = {
          id: id,
          name: name,
          url: url,
          status: this.$t("Files.Finished"),
          detail: attachment,
          points: points
        };

        return assignmentFile;
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
