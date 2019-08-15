<template>
  <div id="schoolViewFiles">

      <div class="part-header">

        <div class="part-action-button">
          <Button type="primary" icon="plus-round">Upload New File</Button>
          <input id="liveUploadVideoInput" type="file" @change="uploadVideoInputChange(this);"  accept="video/mp4,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          <!--<Button type="text" icon="plus-round" @click="handleAddFile">Upload New File</Button>-->

          <!-- <Upload :action="uploadAction"
                  :headers="uploadHeaders"
                  :show-upload-list="false"
                  :default-file-list="filesData"
                  :before-upload="handleFileBeforeUpload"
                  :on-progress="handleFileProgress"
                  :on-success="handleFileSuccess"
                  :on-error="handleFileError"
                  accept="image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
            <div>
              <Button type="primary" icon="plus-round">Upload New File</Button>
            </div>
          </Upload> -->
        </div>
         <upload-file preid="live" ref="uploadfile"></upload-file>
        <!-- <Progress v-show="fileUploading" :percent="uploadPercentage" hide-info></Progress> -->
      </div>

      <Table size="small" no-data-text="No Files" :stripe="true" :highlight-row="true"
             :data="filesData" :columns="filesColumn" :loading="loading">
      </Table>
      <Modal v-model="modalEditFile" :mask-closable="false" title="Edit File">

        <Form :model="editingFile" label-position="right" :label-width="120">
          <FormItem label="Name: ">
            <Input v-model="editingFile.title" placeholder="name" style="width: 300px"></Input>
          </FormItem>
          <FormItem label="File Name: ">
            <span>{{editingFile.file}}</span>
          </FormItem>
          <FormItem label="Upload Date: ">
            <span>{{editingFile.date}}</span>
          </FormItem>
        </Form>

        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleEditFileOK">OK</Button>
          <Button @click="handleEditFileCancel">Cancel</Button>
        </div>
      </Modal>
      <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
          <Select v-model="pageSize" style="width:150px;" @on-change="pageSizeChange">
            <Option :value="10">10 / Page</Option>
            <Option :value="25">25 / Page</Option>
            <Option :value="50">50 / Page</Option>
            <Option :value="100">100 / Page</Option>
          </Select>

          <div style="float: right; display: flex; align-items: center;">
            <div style="display: inline-block; margin-right: 1em;">{{dataTotal}} Total Files</div>
            <div style="display: inline-block">
              <Page :total="dataTotal" :current="pageIndex" :page-size="pageSize" @on-change="pageIndexChange"></Page>
            </div>
          </div>
    </div>
  </div>
</template>

<style lang="scss">
  #schoolViewFiles{
    .part-header {
      font-size: 24px;
      color: #1c2438;
      //border-bottom: 1px solid #dddee1;
      padding-bottom: 10px;
      margin-bottom: 16px;
      vertical-align: middle;
      text-align: left;
    }
    .part-action-button {
        position: relative;
        .ivu-btn-text {
          padding: 3px;
        }
        #liveUploadVideoInput{
          position: absolute;
          left: 0px;
          top: 0px;
          width: 136.5px;
          height: 32px;
          opacity: 0;
        }
    }
    .table-action-icon {
      opacity: 0;
      cursor: pointer;
      margin-right: 1em;
    }

    tr:hover .table-action-icon, .ivu-table-row-highlight .table-action-icon {
      opacity: 1;
    }

    .ivu-table th {
      background-color: #495060;
      color: white;
    }

    .ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td {
      background-color: #dddee1;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import UploadFile from '../livelesson/UploadFile';
  import webapi from '../../webapi/webapi.js';
  import util from '../../common/util.js';
  export default {
    components: {
      UploadFile
    },
    data: function () {
      return {
        loaded: false,
        loading: false,
        schoolId: -1,
        dataTotal: 0,
        pageSize: 10,
        pageIndex: 1,
        uploadAction: GetAPIUrl(),
        uploadHeaders: {},
        fileUploading: false,
        uploadPercentage: 0,
        // uploadTimer: null,
        filesData: [],
        filesColumn: [
          {
            title: 'Title',
            key: 'title'
          },
          {
            title: 'File Name',
            key: 'file',
            render: (h, params) => {
              return h('a', {attrs: { title: 'download "' + params.row.file + '"', href: params.row.download, download: 'download'}}, params.row.file);
            }
          },
          {
            title: 'Date',
            key: 'date',
            width: 160
          },
          {
            title: ' ',
            key: 'action',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('span', {
                    class: 'table-action-icon', attrs: {title: 'Edit'}, on: {
                      click: () => {
                        this.handleEditFile(params);
                      }
                    }
                  },
                  [h('Icon', {props: {type: 'edit', size: '16', color: '#2d8cf0'}})]),
                h('span', {
                    class: 'table-action-icon', attrs: {title: 'Copy to My Files'}, on: {
                      click: () => {
                        this.handleMoveFile(params);
                      }
                    }
                  },
                  [h('Icon', {props: {type: 'arrow-swap', size: '16', color: '#19be6b'}})]),
                h('span', {
                    class: 'table-action-icon', attrs: {title: 'Delete'}, on: {
                      click: () => {
                        this.handleDeleteFile(params);
                      }
                    }
                  },
                  [h('Icon', {props: {type: 'close-round', size: '16', color: '#ed3f14'}})])
              ]);
            }
          }
        ],
        modalEditFile: false,
        editingFile: {title: '', file: '', date: ''}
      };
    },
    mounted: function () {
      this.$parent.$emit("viewChanged", 'school');

      this.schoolId = parseInt(this.$route.params.schoolId);

      this.initialize();
    },
    methods: {
      uploadVideoInputChange()
      {
        var input = $("#liveUploadVideoInput")[0];
        if (input.files.length==0 || this.handleEventVideoBeforeUpload(input.files[0]) == false)
        {
          return;
        }
        //判断是否重复上传
        let upfile=input.files[0];
        let filename=upfile.name;
        let self=this;
        let school=this.schoolId;
        let folder = -1;
        util.GetMD5(upfile).then(hash=>{
          webapi.UploadFile2FavWithHash(school, folder, filename, hash).then((result)=>{
            if (result.RetCode == 0){//返回上传的数据
            }else if (result.RetCode == -6002){//此哈希值对应的文件不存在，请直接上传
              self.$refs.uploadfile.Upload(input.files[0], GetAPIUrl() + "FavoriteAttachment/AddNewFavoriteMultipart?Description=description&Hash="+hash+"&schoolID=" + school, () =>
              { 
                $("#liveUploadVideoInput").val("");
                self.refresh();
              }, () =>
              {
                $("#liveUploadVideoInput").val("");
                });
            }else if (result.RetCode == -6003){//文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
                self.$Message.warning({content:"The file is already in the list!",duration: 3});
                $("#liveUploadVideoInput").val("");
            }
            else{
              $("#liveUploadVideoInput").val("");
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
          this.$Message.error({content:"This file not support!",duration:0,closable:true});
          return false;
        }
        return true;
      },
      handleEditFileOK() {
        this.modalEditFile = false;
      },
      handleEditFileCancel() {
        this.modalEditFile = false;
      },
      pageIndexChange (page) {
        this.pageIndex = page;
        this.readData();
      },
      pageSizeChange (data) {
        this.pageIndex = 1;
        this.readData();
      },
      initialize() {
        // this.uploadAction = GetAPIUrl() + "FavoriteAttachment/AddNewFavorite?schoolID=" + this.schoolId;
        // this.uploadHeaders = { "UserToken": auth.getUserToken() };
        if (!this.loaded) {
          this.readData();
        }
      },
      refresh() {
        this.readData();
      },
      readData() {
        let self = this;
        let url = GetAPIUrl() + "FavoriteAttachment/MyFavoriteAttachmentsNew?type=0&schoolID=" + this.schoolId;
        url += "&pageIndex=" + (this.pageIndex - 1);
        url += "&pageSize=" + this.pageSize;

        this._getData(url, () => {
          self.filesData = [];
        }, (data) => {
          self.dataTotal = data.Count;
          let list = data.List;

          for(let i = 0; i < list.length; i++) {
            let attachment = list[i];
            let file = self._attachment2File(attachment);

            self.filesData.push(file);
          }

          self.loaded = true;
        }, null);
      },
      handleFileBeforeUpload(file) {
        let accept = [".jpg", ".jpeg", ".jpe", ".png", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"];
        let ext = file.name.substr(file.name.lastIndexOf("."));
        ext = ext.toLowerCase();
        if (!IsExistInArr(accept, ext)) {
          this.$Message.error({content:"This file not support!",duration:0,closable:true});
          return false;
        }

        this.fileUploading = true;
        this.uploadPercentage = 0;

        // let self = this;
        // this.uploadTimer = setInterval(function () {
        //   self.uploadPercentage += Math.round((100 - self.uploadPercentage) * 0.05);
        // }, 100);
      },
      handleFileProgress() {
        this.uploadPercentage=Math.floor((event.loaded) / (event.total) * 100);
         if(this.uploadPercentage==100){
           this.uploadPercentage=99
         }
      },
      handleFileSuccess(result, file) {
        this.fileUploading = false;
        // if (this.uploadTimer)
        //   clearInterval(this.uploadTimer);

        if (result.RetCode === 0) {
          this.refresh();
        }
        else {
          this.$Message.error({content: result.ErrorMessage,duration: 0,closable: true})
          console.log(result);
        }
      },
      handleFileError(error, file, fileList) {
        this.fileUploading = false;
        // if (this.uploadTimer)
        //   clearInterval(this.uploadTimer);

        this.$Message.error({content: error,duration: 0,closable: true})
        console.log(error);
      },
      handleEditFile(params) {
        this.editingFile.title = params.row.title;
        this.editingFile.file = params.row.file;
        this.editingFile.date = params.row.date;
        this.modalEditFile = true;
      },
      handleMoveFile(params) {
        let self = this;

        this.$Modal.confirm({
          title: "Copy",
          content: "Do you want to copy this file to your personal files?",
          okText: "Copy",
          cancelText: "Cancel",
          onOk: () => {
            let url = GetAPIUrl() + "FavoriteAttachment/CopyAttachmentsBetweenTeacherAndSchool?attachmentIDs=" + params.row.id;

            self._postData(url, {}, () => {
              self.loading = false;
            }, (result) => {
              self.$Message.success("File copied.")
            }, null);
          }
        });
      },
      handleDeleteFile(params) {
        let self = this;

        this.$Modal.confirm({
          title: "Delete",
          content: "Do you want to remove this file?",
          okText: "Delete",
          cancelText: "Cancel",
          onOk: () => {
            let url = GetAPIUrl() + "FavoriteAttachment/RemoveFavorite?itemID=" + params.row.id;

            self._deleteData(url, null, (data) => {
              self.filesData.splice(params.index, 1);
              self.dataTotal =  self.dataTotal-1;
              if(self.filesData.length == 0){
                self.pageIndex = self.pageIndex -1;
                if(self.pageIndex==0){
                  self.pageIndex = 1;
                  self.refresh();
                  return;
                }
                self.refresh();
              }
            });
          }
        });
      },
      _attachment2File: function (attachment) {
        let date = new Date(parseInt(attachment.CreatedDate));

        return {
          id: attachment.AttachmentID,
          title: attachment.Title,
          file: attachment.FileName,
          date: date.Format("yyyy-MM-dd hh:mm:ss"),
          download: attachment.SourceFileUrl,
          detail: attachment
        };
      },
      _getData(url, before, success, error) {
        this.loading = true;
        this.$Loading.start();

        if (before && typeof before === 'function') {
          before();
        }

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
        this.loading = true;
        this.$Loading.start();

        if (before && typeof before === 'function') {
          before();
        }

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
        this.loading = true;
        this.$Loading.start();

        if (before && typeof before === 'function') {
          before();
        }

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
      }
    }
  }
</script>
