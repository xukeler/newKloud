<template>
  <div id="filesView">
    <div class="paneGutter"></div>
    <div class="panelDetail">
      <div class="part-header">
        Saved Files
        <div class="part-action-button">
          <!--<Button type="text" icon="plus-round" @click="handleAddFile">Upload New File</Button>-->

          <Upload :action="uploadAction"
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
          </Upload>
        </div>

        <Progress v-show="fileUploading" :percent="uploadPercentage" hide-info></Progress>
      </div>

      <Table size="small" no-data-text="No Files" :stripe="true" :highlight-row="true"
             :data="filesData" :columns="filesColumn" :loading="loading">
      </Table>
    </div>
    <div class="paneGutter"></div>
  </div>
</template>

<style lang="scss">
  #filesView{
    background-color: transparent;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    min-height: 1px;
    padding-top: 20px;
    min-width: 785px;
    min-height: 200px;
    width: 100%;

    .paneGutter {
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      box-flex: 1;
      -webkit-flex: 1 0 20px;
      -moz-flex: 1 0 20px;
      -ms-flex: 1 0 20px;
      flex: 1 0 20px;
    }

    .panelDetail {
      -webkit-box-flex: 5500;
      -moz-box-flex: 5500;
      box-flex: 5500;
      -webkit-flex: 5500 1 500px;
      -moz-flex: 5500 1 500px;
      -ms-flex: 5500 1 500px;
      flex: 5500 1 500px;
      max-width: 1500px;
      min-width: 500px;

      background-color: #FFFFFF;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 3px;

      padding: 28px;
      text-align: left;
    }

    .part-header {
      font-size: 24px;
      color: #1c2438;
      border-bottom: 1px solid #dddee1;
      padding-bottom: 10px;
      margin-bottom: 16px;
      vertical-align: middle;
    }

    .part-action-button {
      float: right;
      .ivu-btn-text {
        padding: 3px;
      }
    }

    .table-action-icon {
      opacity: 0;
      cursor: pointer;
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
  import webapi from '../../webapi/webapi.js';
  import util from '../../common/util.js';

  export default {
    data: function () {
      return {
        initialized: false,
        loading: false,
        uploadAction: GetAPIUrl(),
        uploadHeaders: {},
        fileUploading: false,
        uploadPercentage: 0,
        uploadTimer: null,
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
            width: 150
          },
          {
            title: ' ',
            key: 'action',
            width: 50,
            render: (h, params) => {
              return h('div', [
                h('span', { class: 'table-action-icon', attrs: { title: 'Delete' }, on: { click: () => { this.handleDeleteFile(params); }}},
                  [h('Icon', { props: { type: 'close-round', size: '16', color: '#ed3f14' }})])
              ]);
            }
          }
        ]
      };
    },
    mounted: function () {
      this.$parent.$emit("viewChanged", "files");

      this.initialize();
    },
    methods: {
      initialize() {
        // this.uploadAction = GetAPIUrl() + "FavoriteAttachment/AddNewFavorite?Title=&Description=MyFiles&FileName=";
        this.uploadHeaders = { "UserToken": auth.getUserToken() };

        if (!this.initialized) {
          this.readData();
        }
      },
      readData() {
        let self = this;
        let url = GetAPIUrl() + "FavoriteAttachment/MyFavoriteAttachments";

        this._getData(url, () => {
          self.filesData = [];
        }, (data) => {
          let list = data;

          for(let i = 0; i < list.length; i++) {
            let attachment = list[i];
            let file = self._attachment2File(attachment);

            self.filesData.push(file);
          }

          self.initialized = true;
        });
      },
      handleFileBeforeUpload(file) {
        let accept = [".jpg", ".jpeg", ".jpe", ".png", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"];
        let ext = file.name.substr(file.name.lastIndexOf("."));
        ext = ext.toLowerCase();
        if (!IsExistInArr(accept, ext)) {
          alert("This file not support!");
          return false;
        }
        let self = this;
        //判断是否重复上传
        let filename=file.name;
        let upfile=file;
        util.GetMD5(upfile).then(hash=>{
          webapi.UploadFile2FavWithHash(-1, -1, filename, hash).then((result)=>{
            if (result.RetCode == 0){//返回上传的数据
            }else if (result.RetCode == -6002){//此哈希值对应的文件不存在，请直接上传
               self.uploadAction = GetAPIUrl() + "FavoriteAttachment/AddNewFavorite?Title="+filename+"&Description=MyFiles&FileName="+"&Hash="+hash;
            }else if (result.RetCode == -6003){//文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
                self.$Message.warning({content:"The file is already in the list!",duration: 3});
            }
          });
        })

        this.fileUploading = true;
        this.uploadPercentage = 0;
        this.uploadTimer = setInterval(function () {
          self.uploadPercentage += Math.round((100 - self.uploadPercentage) * 0.05);
        }, 100);
      },
      handleFileProgress() {

      },
      handleFileSuccess(result, file) {
        this.fileUploading = false;
        if (this.uploadTimer)
          clearInterval(this.uploadTimer);

        if (result.RetCode === 0) {
          if (result.RetData !== null) {
            let attachment = result.RetData;
            if (attachment.AttachmentID) {
              let file = this._attachment2File(attachment);

              this.filesData.splice(0, 0, file);
            }
          }
        }
        else {
          this.$Message.error(result.ErrorMessage);
          console.log(result);
        }
      },
      handleFileError(error, file, fileList) {
        this.fileUploading = false;
        if (this.uploadTimer)
          clearInterval(this.uploadTimer);

        this.$Message.error(error);
        console.log(error);
      },
      handleDeleteFile(params) {
        let self = this;

        this.$Modal.confirm({
          title: "Delete",
          content: "Do you want to remove this file?",
          okText: "Delete",
          cancelText: "Cancel",
          onOk: () => {
            let url = GetAPIUrl() + "EventAttachment?ProjectID=211&AttachmentID=" + params.row.id;

            self._deleteData(url, null, (data) => {
              self.filesData.splice(params.index, 1);
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
