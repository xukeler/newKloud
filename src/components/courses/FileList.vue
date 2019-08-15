<template>
  <div id="file-list">
    <div class="part-header">
      <div class="part-action-button">
        <Button type="primary" icon="plus-round" @click="showUploadModal">{{$t("Files.UploadNewFile")}}</Button>
        <!--注释原有上传2018 12/19-->
        <!-- <input
          id="liveUploadVideoInput"
          type="file"
          @change="uploadVideoInputChange(this);"
          accept="audio/wav, audio/mp4a-latm, audio/aac, audio/3gpp, audio/mpeg, video/mp4, image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        > -->

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
        </Upload>-->
        <select-tags ref="selecetTaglist" @filterSelectTags="getFilterSelectTags"></select-tags>
        <upload-file-with-tag ref="uploadFileWithTag" :tagUploadShowFlag="tagUploadShow" :schoolId="schoolId" :folderId="folderId"></upload-file-with-tag>
      </div>
      <upload-file preid="live" ref="uploadfile"></upload-file>
      <!-- <Progress v-show="fileUploading" :percent="uploadPercentage" hide-info></Progress> -->
    </div>

    <Table
      size="small"
      :no-data-text="$t('Common.NoData')"
      :stripe="true"
      :highlight-row="true"
      :data="filesData"
      :columns="filesColumn"
      :loading="loading"
    ></Table>
    <Modal v-model="modalEditFile" :mask-closable="false" :title="$t('Files.EditFile')" width="500" style="z-index: 900; position: absolute;">
      <Form :model="editingFile" label-position="right" :label-width="120">
        <FormItem :label="$t('Files.EditTitle')">
          <Input v-model="editingFile.title" placeholder="name" style="width: 300px"/>
        </FormItem>
        <FormItem :label="$t('EditFileWithTag.Tag')">
          <Edit-file-select-tags ref="EditFileSelectTags" @editSelectTags="getEditSelectTags" :editTagList="editingFile.tagList"></Edit-file-select-tags>
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
    <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
      <Select v-model="pageSize" style="width:150px;" @on-change="pageSizeChange">
        <Option :value="15">{{$t('Common.Page15')}}</Option>
        <Option :value="25">{{$t('Common.Page25')}}</Option>
        <Option :value="50">{{$t('Common.Page50')}}</Option>
        <Option :value="100">{{$t('Common.Page100')}}</Option>
      </Select>

      <div style="float: right; display: flex; align-items: center;">
        <div
          style="display: inline-block; margin-right: 1em;"
        >{{dataTotal}} {{$t("Files.TotalFiles")}}</div>
        <div style="display: inline-block">
          <Page
            :total="dataTotal"
            :current="pageIndex"
            :page-size="pageSize"
            @on-change="pageIndexChange"
          ></Page>
        </div>
      </div>
    </div>
    <error-modal ref="gErrorModal" :errorTitle="$t('Common.errorTitle')" :errorContent="$t('Common.errorContent')"></error-modal>
  </div>
</template>

<style lang="scss">
#file-list {
  .part-header {
    font-size: 24px;
    color: #1c2438;
    //border-bottom: 1px solid #dddee1;
    //padding-bottom: 10px;
    margin-bottom: 16px;
    vertical-align: middle;
    text-align: left;
  }
  .part-action-button {
    position: relative;
    .ivu-btn-text {
      padding: 3px;
    }
    #liveUploadVideoInput {
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

  tr:hover .table-action-icon,
  .ivu-table-row-highlight .table-action-icon {
    opacity: 1;
  }

  .ivu-table th {
    background-color: #495060;
    color: white;
  }

  .ivu-table-row-highlight td,
  .ivu-table-stripe
    .ivu-table-body
    tr.ivu-table-row-highlight:nth-child(2n)
    td {
    background-color: #dddee1;
  }
  .tags-item{
    display: inline-block;
    position: relative;
    padding: 0px 5px;
    height: 18px;
    margin-top: 3px;
    line-height: 18px;
    font-size: 13px;
    text-align: left;
    word-break: break-all;
    background-color: #ff0000;
    border-radius: 0px 4px 4px 0px;
    color: #ffffff;
    .left-triangle {
      content: "";
      position: absolute;
      top: 0px;
      right: 100%;
      border-top: 9px solid transparent;
      border-bottom: 9px solid transparent;
      border-right:9px solid #ff0000;
    }
  }

}
</style>

<script>
import auth from "../../authenticator";
import UploadFile from "../livelesson/UploadFile";
import SelectTags from "../courses/SelectTags";
import EditFileSelectTags from "../courses/EditFileSelectTags";
import UploadFileWithTag from "../courses/UploadFileWithTag";
import webapi from "../../webapi/webapi.js";
import util from "../../common/util.js";

export default {
  components: {
    UploadFile,
    SelectTags,
    UploadFileWithTag,
    EditFileSelectTags
  },
  props: {
    schoolId: {
      type: Number,
      required: true
    },
    folderId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      filterSelectTagsIDStr:"",
      selectEditTagsIDStr:'',
      tagUploadShow:false,
      filesId: 0,
      loaded: false,
      loading: false,
      dataTotal: 0,
      pageSize: 15,
      pageIndex: 1,
      uploadAction: GetAPIUrl(),
      uploadHeaders: {},
      fileUploading: false,
      uploadPercentage: 0,
      // uploadTimer: null,
      filesData: [],
      filesColumn: [
        {
          title: this.$t("Files.Title"),
          key: "title",
          sortable: true,
          align:"left"
        },
        {
          title: this.$t("Files.FileName"),
          key: "file",
          align:"left",
          sortable: true,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleViewFile(params);
                  }
                },
                // attrs: {
                //   title: 'download "' + params.row.file + '"',
                //   href: params.row.download,
                //   download: "download",
                //   target:'_blank'
                // }
              },
              params.row.file
            );
          }
        },
        {
          title: this.$t("Files.Date"),
          key: "date",
          width: 200,
          sortable: true,
          align:"left",
        },
        {
          title: this.$t("Files.Sync"),
          key: 'syncs',
          width: 110,
          sortable: true,
          align:"left",
          renderHeader:(h,params)=>{
            return h("span",{style:{display:'inline-block'}},[
                h('span',{
                  class:'icon icon-yinxiang',
                  style:{
                    marginRight: '3px',
                    color:"rgba(50,175,163)"
                  }
                }),
                h('span',this.$t("Files.Sync"))
              ]
            )
          }
        },
        {
          title: this.$t('Files.Tag'),
          key: "tagList",
          width: 260,
          align:"left",
          render:(h,params)=>{
            if(params.row.tagList.length==0){
              return;
            }else{
              let tagArrayList=params.row.tagList;
              let left="0px";
              return h("div",tagArrayList.map((item,index)=>{
                if(index!=0){
                  left="15px";
                }
                return  h("div",{class:"tags-item",style:{backgroundColor:this.colorSelectNumber(item.ColorID),marginLeft:left}},
                        [h("div",{class:'left-triangle',style:{borderRightColor:this.colorSelectNumber(item.ColorID)}}),h("span",{style:'display:inline-block;'},item.TagName),
                        ])}));
            }
          }
        },
        {
          title: " ",
          key: "action",
          width: 175,
          align:"left",
          render: (h, params) => {
            return h("div", [
                 h('span', {
                      class: 'table-action-icon', attrs: {title: this.$t("Base.View")}, on: {
                        click: () => {
                          this.handleViewFile(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'eye', size: '16', color: '#19be6b'}})]),
              h(
                "span",
                {
                  class: "table-action-icon",
                  attrs: { title: this.$t("Common.Edit") },
                  on: {
                    click: () => {
                      this.handleEditFile(params);
                    }
                  }
                },
                [
                  h("Icon", {
                    props: { type: "edit", size: "16", color: "#2d8cf0" }
                  })
                ]
              ),
              /*h('span', {
                    class: 'table-action-icon', attrs: {title: 'Copy to My Files'}, on: {
                      click: () => {
                        this.handleMoveFile(params);
                      }
                    }
                  },
                  [h('Icon', {props: {type: 'arrow-swap', size: '16', color: '#19be6b'}})]),*/
              
              h('span', {
                      class: 'table-action-icon', attrs: {title: this.$t('Files.Download')}, on: {
                        click: () => {
                          this.handleDownloadFile(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'arrow-down-c', size: '20', color: '#2d8cf0'}})]),

              h(
                "span",
                {
                  class: "table-action-icon",
                  attrs: { title: this.$t("Common.Delete") },
                  on: {
                    click: () => {
                      this.handleDeleteFile(params);
                    }
                  }
                },
                [
                  h("Icon", {
                    props: { type: "close-round", size: "16", color: "#ed3f14" }
                  })
                ]
              )
            ]);
          }
        }
      ],
      modalEditFile: false,
      editingFile: { title: "", file: "", date: "" ,tagList:[]}
    };
  },
  mounted() {},
  methods: {
    async handleDownloadFile(params){
      let result = await util.getSourceFileUrl(params.row.detail.SourceFileUrl);
      if(result){
        window.open(result, '_blank');
      }else{
        this.$refs.gErrorModal.initial();
      }
    },
    updateFileTag(fileId){
      let self=this;
      //上传title和tag type -- 附件类型：FavoriteAttachment = 1, LessonAttachment = 2, CourseAttachment = 3
      self.uploadType=1;
      let url=GetAPIUrl() + "AttachmentTag/UpdateTags?itemID="+fileId+"&tagIDs="+self.selectEditTagsIDStr+"&type="+self.uploadType;
      self._postData(url, null, null, (result)=>{
        this.$nextTick(()=>{
          this.$refs.EditFileSelectTags.editFileWithTag();
        })
      }, null);
    },
    getEditSelectTags(val){
      let str="";
      if(val){
        for(let item of val){
          str+=item.TagID+",";
        }
        this.selectEditTagsIDStr=str.substring(0,str.length-1);
      }
    },
    getFilterSelectTags(val){
      let str2="";
      if(val){
        for(let item of val){
          str2+=item.TagID+",";
        }
        this.filterSelectTagsIDStr=str2.substring(0,str2.length-1);
      }
    },
    //颜色枚举
    colorSelectNumber(id){
      switch (id) {
        case 1:
          return '#d93651';
        case 2:
          return '#ff9f1b';
        case 3:
          return '#ffd500';
        case 4:
          return '#8acc47';
        case 5:
          return '#47cc8a';  
        case 6:
          return '#30bfbf';  
        case 7:
          return '#00aaff';  
        case 8:
          return '#8f7ee6';  
        case 9:
          return '#98aab3';  
        default:
          return;
      }
    },
    showUploadModal(){
      this.tagUploadShow=true;
      this.$nextTick(()=>{
        this.$refs.uploadFileWithTag.initial();
      })
    },
    uploadVideoInputChange() {
      var input = $("#liveUploadVideoInput")[0];
      if (
        input.files.length == 0 ||
        this.handleEventVideoBeforeUpload(input.files[0]) == false
      ) {
        return;
      }
      if (input.files[0].size >= 1024 * 1024 * 100) {
        alert(this.$t("Common.FileTooBig"));
        return;
      }
      //判断是否重复上传
      let upfile = input.files[0];
      let filename = upfile.name;
      let self = this;
      let school = this.schoolId;
      let folder = this.folderId;
      util.GetMD5(upfile).then(hash => {
        webapi.UploadFile2FavWithHash(school, folder, filename, hash).then(result => {
          if (result.RetCode == 0) {
            //返回上传的数据
            $("#liveUploadVideoInput").val("");
            self.refresh();
          } else if (result.RetCode == -6002) {
            //此哈希值对应的文件不存在，请直接上传
            self.$refs.uploadfile.Upload(
              input.files[0],
              GetAPIUrl() + "FavoriteAttachment/AddNewFavoriteMultipart?Description=description&Hash=" + hash + "&schoolID=" + school + "&folderID=" + folder,
              () => {
                $("#liveUploadVideoInput").val("");
                self.refresh();
              },
              () => {
                $("#liveUploadVideoInput").val("");
              }
            );
          } else if (result.RetCode == -6003) {
            //文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
            self.$Message.warning({
              content: this.$t("Common.FileAlreadyinList"),
              duration: 3
            });
            $("#liveUploadVideoInput").val("");
          } else {
            $("#liveUploadVideoInput").val("");
          }
        });
      });
    },
    handleEventVideoBeforeUpload: function(file) {
      let accept = [".mp3", ".aac", ".m4a", ".3gp", ".wav", ".mp4", ".jpg", ".jpeg", ".jpe", ".png", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"];
      var ext = file.name.substr(file.name.lastIndexOf("."));
      ext = ext.toLowerCase();
      if (!IsExistInArr(accept, ext)) {
        alert(this.$t("Common.FileNotSupport"));
        return false;
      }
      return true;
    },
    handleEditFileCancel() {
      this.modalEditFile = false;
      this.$nextTick(()=>{
        this.$refs.EditFileSelectTags.editFileWithTag();
      })
    },
    handleViewFile(params) {
        //console.log(params.row.detail);
        if(params.row.detail.FileType==5 || params.row.detail.FileType==4)
        {
            this.$Message.error("Can't view this file!");
            return;
        }
        webapi.AddTempLessonWithOriginalDoc(params.row.detail.AttachmentID,params.row.detail.Title).then(res=>{
            //res.RetData
            this.$router.push({ name: "live", params: { id: res.RetData } });
        });

      },
    pageIndexChange(page) {
      this.pageIndex = page;
      this.readData();
    },
    pageSizeChange(data) {
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
    reset() {
      this.loaded = false;
      this.pageIndex = 1;
    },
    //编辑、删除时调用
    refresh() {
      this.readData();
    },
    //切换筛选条件时调用
    selectedRefresh(){
      this.pageIndex = 1;
      this.readData();
    },
    readData() {
      let self = this;
      let url = GetAPIUrl() + "FavoriteAttachment/MyFavoriteAttachmentsNew?type=0";
      url += "&schoolID=" + this.schoolId;
      url += "&folderID=" + this.folderId;
      url += "&pageIndex=" + (this.pageIndex - 1);
      url += "&pageSize=" + this.pageSize;
      if(this.filterSelectTagsIDStr.length!=0){
        url += "&tagIDs=" + this.filterSelectTagsIDStr;
      }
      this._getData(
        url,
        () => {
          self.filesData = [];
        },
        data => {
          self.dataTotal = data.Count;
          let list = data.List;

          for (let i = 0; i < list.length; i++) {
            let attachment = list[i];
            let file = self._attachment2File(attachment);

            self.filesData.push(file);
          }

          self.loaded = true;
        },
        null
      );
    },
    handleFileBeforeUpload(file) {
      let accept = [".jpg", ".jpeg", ".jpe", ".png", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"];
      let ext = file.name.substr(file.name.lastIndexOf("."));
      ext = ext.toLowerCase();
      if (!IsExistInArr(accept, ext)) {
        alert("This file not support!");
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
      this.uploadPercentage = Math.floor((event.loaded / event.total) * 100);
      if (this.uploadPercentage == 100) {
        this.uploadPercentage = 99;
      }
    },
    handleFileSuccess(result, file) {
      this.fileUploading = false;
      // if (this.uploadTimer)
      //   clearInterval(this.uploadTimer);

      if (result.RetCode === 0) {
        this.refresh();
      } else {
        this.$Message.error(result.ErrorMessage);
        console.log(result);
      }
    },
    handleFileError(error, file, fileList) {
      this.fileUploading = false;
      // if (this.uploadTimer)
      //   clearInterval(this.uploadTimer);

      this.$Message.error(error);
      console.log(error);
    },
    handleEditFile(params) {
      this.editingFile.title = params.row.title;
      this.editingFile.file = params.row.title;
      this.editingFile.date = params.row.date;
      this.editingFile.tagList = params.row.tagList;
      
      this.filesId = params.row.id;
      this.modalEditFile = true;
      
      this.$nextTick(()=>{
        this.$refs.EditFileSelectTags.initEditSelectTags();
      })
    },
    handleEditFileOK() {
      let self = this;
      let editTitle = encodeURIComponent(
        base64encode(utf16to8(this.editingFile.title))
      );
      if (this.filesId != 0) {
        let url = GetAPIUrl() + "FavoriteAttachment/RenameAttachment";
        url += "?itemID=" + this.filesId
        url += "&title=" + editTitle;
        this._postData(url,{},() => {self.loading = false;},
          result => {
            self.modalEditFile = false;
            self.updateFileTag(self.filesId);
            self.$nextTick(()=>{
              self.refresh();
            })
          },
          null
        );
      }
    },
    handleMoveFile(params) {
      let self = this;

      this.$Modal.confirm({
        title: "Copy",
        content: "Do you want to copy this file to your personal files?",
        okText: "Copy",
        cancelText: "Cancel",
        onOk: () => {
          let url = GetAPIUrl() + "FavoriteAttachment/CopyAttachmentsBetweenTeacherAndSchool";
          url += "?attachmentIDs=" + params.row.id;

          self._postData(
            url,
            {},
            () => {
              self.loading = false;
            },
            result => {
              self.$Message.success("File copied.");
            },
            null
          );
        }
      });
    },
    handleDeleteFile(params) {
      let self = this;

      this.$Modal.confirm({
        title: self.$t("Files.RemoveFilesTitle"),
        content: self.$t("Files.RemoveFilesContent"),
        okText: self.$t("Common.Delete"),
        cancelText: self.$t("Base.Cancel"),
        onOk: () => {
          let url = GetAPIUrl() + "FavoriteAttachment/RemoveFavorite";
          url += "?itemIDs=" + params.row.id;

          self._deleteData(url, null, data => {
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
    _attachment2File: function(attachment) {
      let date = new Date(parseInt(attachment.CreatedDate));

      return {
        id: attachment.ItemID,
        title: attachment.Title,
        tagList:attachment.TagList,
        file: attachment.Title,
        date: date.Format("yyyy-MM-dd hh:mm:ss"),
        syncs: attachment.SyncCount,
        download: attachment.SourceFileUrl,
        detail: attachment
      };
    },
    _getData(url, before, success, error) {
      this.loading = true;
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
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _postData(url, data, before, success, error) {
      this.loading = true;
      this.$Loading.start();

      if (before && typeof before === "function") {
        before();
      }

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
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _deleteData(url, before, success, error) {
      this.loading = true;
      this.$Loading.start();

      if (before && typeof before === "function") {
        before();
      }

      let self = this;
      $.ajax({
        type: "DELETE",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    }
  }
};
</script>
