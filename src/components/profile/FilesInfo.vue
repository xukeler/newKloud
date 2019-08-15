<template>
  <div id="user-profile-files">
    <div class="part-header">
      <select-tags ref="selecetTaglist" @filterSelectTags="getFilterSelectTags"></select-tags>
      <Input v-model="searchFile " placeholder="Search file..." style="width:260px;margin-top: 2px;" icon="ios-search" @on-enter="handleSearch" @on-click="handleSearch"></Input>
      <div class="part-action-button">
        <Button type="text" icon="plus-round" @click="showUploadModal">{{$t("Files.UploadNewFile")}}</Button>
        <!--注释原有上传2018 12/21-->
        <!-- <input id="liveUploadVideoInput" type="file" @change="uploadVideoInputChange(this);"  accept="audio/wav,audio/mp4a-latm,audio/aac,audio/3gpp,audio/mpeg,video/mp4,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"> -->
        <!-- <Upload :action="uploadAction"
                :headers="uploadHeaders"
                :show-upload-list="false"
                :default-file-list="filesData"
                :before-upload="handleFileBeforeUpload"
                :on-progress="handleFileProgress"
                :on-success="handleFileSuccess"
                :on-error="handleFileError"
                accept="video/mp4,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          <div>
            <Button type="text" icon="plus-round">Upload New File</Button>
          </div>
        </Upload> -->
      </div>
      <div v-show="!uploadingInfo.ready" :title="uploadingInfo.name" style="width:100%;padding:3px; position:relative;height:26px; margin:10px 0px;">
        <span style="width:80%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis; display:block; position:absolute;z-index:2;">{{uploadingInfo.name}}</span>
        <div  style="width:100%; height:100%; position:absolute;top:0px;left:0px;background-color:#e1f3e1;">
          <div style="background-color:green;opacity:0.3;height:100%;" :style="'width:'+uploadingInfo.process+'%'"></div>
          <div style="position: absolute;right: 0px;top: 0px;padding:3px 3px 0px 0px;">{{uploadingInfo.status}}&nbsp;{{uploadingInfo.process}}%</div>
        </div>
      </div>
      <upload-file preid="live" ref="uploadfile"></upload-file>
      <!-- <Progress v-show="fileUploading" :percent="uploadPercentage"></Progress> -->
    </div>

    <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true"
           :data="filesData" :columns="filesColumn" :loading="loading">
    </Table>
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
    <div>
      <Modal v-model="modalEditFile" :mask-closable="false" :title="$t('Files.EditFile')" width="500" style="z-index: 900; position: absolute;">

        <Form :model="editingFile" label-position="right" :label-width="120">
          <FormItem :label="$t('Files.EditTitle')">
            <Input v-model="editingFile.title" placeholder="name" style="width: 300px"></Input>
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
    </div>
    <Modal
        v-model="showUploadWithTag"
        :title="$t('Files.UploadNewFile')"
        okText="Ok"
        cancelText="Cancel"
        :styles="{top: '210px'}"
        :mask-closable="false" width="500"
        :transfer="true"
        style="z-index: 999; position: absolute;">
        <!-- <Input v-model="title" :placeholder="$t('UploadFileWithTag.PlaceholderTitle')" style="width:100%;"></Input> //上传文件的title-->
        <div style="width:100%;height:20px;"></div>
        <upload-file-select-tags ref="uploadFileSelectTags" @uploadSelectTags="getSelectTags"></upload-file-select-tags>
        <div class="chooseNewFileAndTag" v-show="filesShow">
            <Upload
                multiple
                type="drag"
                action="">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>{{$t('UploadFileWithTag.ClickUpload')}}</p>
                </div>
            </Upload>
            <input
                id="liveUploadVideoInput" class="uploadNewFileWithTag"
                type="file"
                @change="schoolFileChange(this)"
                accept="audio/wav, audio/mp4a-latm, audio/aac, audio/3gpp, audio/mpeg, video/mp4, image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
        </div>
        <div class="chooseNewFileAndTag" style="background: #fff;border: 1px dashed #dddee1;border-radius: 4px;" v-show="!filesShow">
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
        <div style="width:100%;height:20px;"></div>
        <div slot="close" v-show="false"></div>
        <div slot="footer">
          <Button @click="cancelUpload">{{$t('Base.Cancel')}}</Button>
          <Button type="primary" id="btnFilesInfoUploadFileOK" @click="upLoadfileWithTagOk">{{$t('Base.OK')}}</Button>
        </div>
    </Modal>
    <error-modal ref="gErrorModal" :errorTitle="$t('Common.errorTitle')" :errorContent="$t('Common.errorContent')"></error-modal>
  </div>
</template>

<style lang="scss">
#user-profile-files {
  .part-header {
    font-size: larger;
    font-weight: bold;
    margin-bottom: 0.2em;
    color: #1c2438;
  }

  .part-action-button {
    position: relative;
    float: right;
    clear: right;
    .ivu-btn-text {
      padding: 3px;
    }
    #liveUploadVideoInput{
      position: absolute;
      right: 0px;
      top: 0px;
      width: 113px;
      height: 26px;
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
.chooseNewFileAndTag {
    $images-root: "../../../static/images/";
    position: relative;
    margin-top: 20px;
    width: 100%;
    height: 110px;
    .uploadNewFileWithTag {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 110px;
      opacity: 0;
    }
    .file-icon{
      display: inline-block;
      width:70px;
      height: 70px; 
      background-image: url($images-root + 'file.svg');
      background-size: 70px 70px;
    }
    .fileIconParent{
        width: 100px;height: 110px;
      .fileIconShow{
          text-align: center;
          padding-top:10px;
          width:100px;
          height:110px
      }
      .deleteFileIcon{
          text-align: center;
          position: absolute;
          left: 0px;
          top: 10px;
          height: 100px;
          line-height: 100px;
          width:100px;
          background: rgba(0, 0, 0, 0.6);
          display: none;
      }
      &:hover{
          .deleteFileIcon{
            display: block;
          }
      }
    }
}
</style>

<script>
  import auth from '../../authenticator';
  import UploadFileSelectTags from "../courses/UploadFileSelectTags";
  import EditFileSelectTags from "../courses/EditFileSelectTags";
  import UploadFile from '../livelesson/UploadFile';
  import loger from '../../common/log.js';
  import webapi from '../../webapi/webapi.js';
  import util from '../../common/util.js';
  import SelectTags from "../kloudsync/SelectTags";

  export default {
    components:{
      UploadFile,
      UploadFileSelectTags,
      EditFileSelectTags,
      SelectTags
    },
    data() {
      return {
        filterSelectTagsIDStr:"",
        selectEditTagsStr:'',
        selectTagsStr:"",
        uploadType:'',
        filesObj:{
            fileName:'',
        },
        filesShow: true,
        title: "",
        showUploadWithTag: false,
        filesId:0,
        loaded: false,
        loading: false,
        uploadAction: GetAPIUrl(),
        uploadHeaders: {},
        fileUploading: false,
        uploadPercentage: 0,
        // uploadTimer: null,
        filesData: [],
        filesColumn: [
          {
            title: this.$t("Files.Title"),
            key: 'title',
            sortable: true,
            align:"left",
            renderHeader: (h, params) => {
              return h("span",this.$t('Files.Title'));
            },
          },
          {
            title: this.$t("Files.FileName"),
            key: 'file',
            sortable: true,
            align:"left",
            renderHeader: (h, params) => {
              return h("span",this.$t('Files.FileName'));
            },
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.handleViewFile(params);
                  }
                },
                // attrs: { title: 'download "' + params.row.file + '"', href: params.row.download, download: 'download',target:'_blank'}
              }, params.row.file);
            }
          },
          {
            title: this.$t("Files.Date"),
            key: 'date',
            width: 200,
            sortable: true,//sortType:"desc",            
            align:"left",
            renderHeader: (h, params) => {
              return h("span",this.$t('Files.Date'));
            },
          },
          {
            title: this.$t('Files.Tag'),
            key: "tagList",
            width: 200,
            align:"left",
            renderHeader: (h, params) => {
              return h("span",this.$t('Files.Tag'));
            },
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
            title: ' ',
            key: 'action',
            width: 175,
            render: (h, params) => {
              //if (auth.showSchool())
              if (false)
              {
                return h('div', [
                  h('span', {
                      class: 'table-action-icon', attrs: {title: this.$t("Common.Edit")}, on: {
                        click: () => {
                          this.handleEditFile(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'edit', size: '16', color: '#2d8cf0'}})]),
                  h('span', {
                      class: 'table-action-icon', attrs: {title: 'Copy to School Files'}, on: {
                        click: () => {
                          this.handleMoveFile(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'arrow-swap', size: '16', color: '#19be6b'}})]),
                  h('span', {
                      class: 'table-action-icon', attrs: {title: this.$t("Common.Delete")}, on: {
                        click: () => {
                          this.handleDeleteFile(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'close-round', size: '16', color: '#ed3f14'}})])
                ]);
              }
              else {
                return h('div', [
                   h('span', {
                      class: 'table-action-icon', attrs: {title: this.$t("Base.View")}, on: {
                        click: () => {
                          this.handleViewFile(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'eye', size: '16', color: '#19be6b'}})]),
                   h('span', {
                      class: 'table-action-icon', attrs: {title: this.$t("Base.Share")}, on: {
                        click: () => {
                          this.handleShareFile(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'android-share-alt', size: '16', color: '#19be6b'}})]),
                  h('span', {
                      class: 'table-action-icon', attrs: {title: this.$t("Common.Edit")}, on: {
                        click: () => {
                          this.handleEditFile(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'edit', size: '16', color: '#2d8cf0'}})]),

                  h('span', {
                      class: 'table-action-icon', attrs: {title: this.$t('Files.Download')}, on: {
                        click: () => {
                          this.handleDownloadFile(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'arrow-down-c', size: '20', color: '#2d8cf0'}})]),

                  h('span', {
                      class: 'table-action-icon', attrs: {title: this.$t("Common.Delete")}, on: {
                        click: () => {
                          this.handleDeleteFile(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'close-round', size: '16', color: '#ed3f14'}})])
                ]);
              }
            }
          }
        ],
        modalEditFile: false,
        editingFile: { title: "", file: "", date: "" ,tagList:[]},
        uploadingInfo: { ready: true, name: '', process: 0 },
        updateProcessTimer: null,

        dataTotal: 0,
        pageSize: 15,
        pageIndex: 1,
        searchFile:'',

      };
    },
    mounted() {
      this.initialize();
      this.$refs.uploadFileSelectTags.uploadFileWithTag();
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
        let url=GetAPIUrl() + "AttachmentTag/UpdateTags?itemID="+fileId+"&tagIDs="+self.selectEditTagsStr+"&type="+self.uploadType;
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
          this.selectEditTagsStr=str.substring(0,str.length-1);
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
        this.showUploadWithTag=true;
        this.$nextTick(()=>{
          this.$refs.uploadFileSelectTags.initial();
        })
      },
      handleRemoveFile(){
        this.filesObj={fileName:''};
        $("#liveUploadVideoInput").val("");
        this.filesShow=true;
      },
      //清空上次填入的内容
      cancelUpload(){
        this.showUploadWithTag=false;
        this.filesObj={fileName:''};
        $("#liveUploadVideoInput").val("");
        $("#btnFilesInfoUploadFileOK").attr("disabled",false);
        this.filesShow=true;
        this.title="";
        this.$refs.uploadFileSelectTags.uploadFileWithTag();
      },
      schoolFileChange() {
        var input = $("#liveUploadVideoInput")[0];
        this.filesShow=false;
        this.filesObj=input.files[0];
        this.filesObj.fileName=this.filesObj.name;
      },
      upLoadfileWithTagOk() {
        $("#btnFilesInfoUploadFileOK").attr("disabled",true);
        this.uploadVideoInputChange();
      },
      getSelectTags(val){
        let str="";
        if(val){
          for(let item of val){
            str+=item.TagID+",";
          }
          this.selectTagsStr=str.substring(0,str.length-1);
        }
      },
      uploadTitleAndTags(itemId){
        let self=this;
        if(self.selectTagsStr.length!=0){
          //上传title和tag type -- 附件类型：FavoriteAttachment = 1, LessonAttachment = 2, CourseAttachment = 3
          self.uploadType=1;
          let url=GetAPIUrl() + "AttachmentTag/CreateTags?itemID="+itemId+"&tagIDs="+self.selectTagsStr+"&type="+self.uploadType;
          self._postData(url, null, null, (result)=>{
            
          }, null);
        }
      },

      uploadVideoInputChangeOld()
      {
        var input = $("#liveUploadVideoInput")[0];
        if (input.files.length==0 || this.handleEventVideoBeforeUpload(input.files[0]) == false)
        {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('UploadFileWithTag.PleaseSelectUploadFile'), top: 24,duration: 4, left:true });
          return;
        }
        if (!this.uploadingInfo.ready)
        {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t("Common.WaitForFileUploading"), top: 24,duration: 4, left:true });
          $("#liveUploadVideoInput").val("");
          return;
        }
        if (input.files[0].size >= 1024 * 1024 * 100)
        {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t("Common.FileTooBig"), top: 24,duration: 4, left:true });
          return;
        }

        this.showUploadWithTag=false;

        //判断是否重复上传
        let upfile=input.files[0];
        let filename=upfile.name;
        let self=this;
        util.GetMD5(upfile).then(hash=>{
          webapi.UploadFile2FavWithHash(-1, -1, filename, hash).then((result)=>{
            if (result.RetCode == 0){//返回上传的数据
              //返回上传的数据
              self.uploadTitleAndTags(result.RetData.ItemID);
              self.$Message.info({content:"File uploaded successfully",duration: 3});
              self.cancelUpload();
              self.$nextTick(()=>{
                self.refresh();
              })
            }else if (result.RetCode == -6002){//此哈希值对应的文件不存在，请直接上传
              self.$refs.uploadfile.Upload(input.files[0], GetAPIUrl() + "FavoriteAttachment/AddNewFavoriteMultipart?Description=description&Hash="+hash, resultData =>
              { 
                self.uploadTitleAndTags(resultData.RetData.ItemID);
                self.cancelUpload();
                var lineItem = resultData.RetData;
                if (lineItem.FileType == 4 || lineItem.FileType == 5)
                {
                  this.updateEnd(true);
                  return;
                }
                this.uploadingInfo.process = 0;
                this.uploadingInfo.status = this.$t("Common.Converting");
                this.updateProcessTimer = setInterval(() =>
                {
                  loger.log("convertTimer");
                  self.updateProcess(lineItem.AttachmentID);
                }, 1000);
              }, () =>
              {
                self.cancelUpload();
                }, (process, guid) =>
                {//onProcess
                  if (process == -1)
                  {
                    this.uploadingInfo.ready = false;
                    this.uploadingInfo.name = filename;
                    this.uploadingInfo.process = 0;
                    this.uploadingInfo.status = this.$t("Common.Uploading");
                  }
                  else
                  {
                    this.uploadingInfo.process = process;
                  }
                });
            }else if (result.RetCode == -6003){//文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
                self.$Message.warning({content:this.$t("Common.FileAlreadyinList"),duration: 3});
                self.cancelUpload();
            }
            else{
              self.cancelUpload();
            }
          });
        })
      },
      async uploadVideoInputChange()
      {
        var input = $("#liveUploadVideoInput")[0];
        if (input.files.length==0 || this.handleEventVideoBeforeUpload(input.files[0]) == false)
        {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('UploadFileWithTag.PleaseSelectUploadFile'), top: 24,duration: 4, left:true });
          $("#btnFilesInfoUploadFileOK").attr("disabled",false);
          return;
        }
        if (!this.uploadingInfo.ready)
        {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t("Common.WaitForFileUploading"), top: 24,duration: 4, left:true });
          $("#liveUploadVideoInput").val("");
          $("#btnFilesInfoUploadFileOK").attr("disabled",false);
          return;
        }
        if (input.files[0].size >= 1024 * 1024 * 200)
        {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t("Common.FileTooBig"), top: 24,duration: 4, left:true });
          $("#btnFilesInfoUploadFileOK").attr("disabled",false);
          return;
        }

        this.showUploadWithTag=false;

        //判断是否重复上传
        let upfile=input.files[0];
        let filename=upfile.name;
        let self=this;
        var hash = await util.GetMD5(upfile);   
        var ext = filename.substr(filename.lastIndexOf(".")).toLowerCase();
        var isaddfile=false;     
        var result=await webapi.UploadFile2FavWithHash(-1, -1, filename, hash);        
        if (result.RetCode == 0){//返回上传的数据
          //返回上传的数据
          self.uploadTitleAndTags(result.RetData.ItemID);
          self.$Message.info({content:"File uploaded successfully",duration: 3});
          self.cancelUpload();
          self.$nextTick(()=>{
            self.refresh();
          })
        }else if (result.RetCode == -6002){//此哈希值对应的文件不存在，请直接上传
          
          var name="tempupload/"+util.GetMD5String(auth.getUserIDEx()+"_"+filename+"_"+new Date().toString());
          var type=util.GetCovertType(filename);
          var servername=GUID()+""+ext;
          if(type=="")
          {
            name=result.RetData.Path+"/"+servername;
          }
          self.$refs.uploadfile.UploadCloud(input.files[0],name,async(guid,convertParam)=>{

            if(type=="")
            {
              var addresult= await this.uploadNewFile(filename,servername,result.RetData.FileID,1,hash,input.files[0].size);
              //console.log(addresult);
              self.uploadTitleAndTags(addresult.ItemID);
              self.cancelUpload();
              this.updateEnd(true);
              return;
            }
            this.uploadingInfo.process = 0;
            this.uploadingInfo.status = this.$t("Common.Converting");
            await webapi.startConverting({Key:name,DocumentType:type,Bucket:convertParam,TargetFolderKey:result.RetData.Path});
            //console.log("token:"+token);
            util.setIntervalEx(async () =>
            {
              //loger.log("convertTimer");
              var cresult = await self.updateProcessNew(guid,{Key:name,Bucket:convertParam});
              //console.log(result);
              if(cresult.Code ==-1)
              {
                  // clearTimeout(self.updateProcessTimer);
                  // self.updateProcessTimer = null;
                  self.cancelUpload();
                  self.updateEnd(false);
                  return false;
              }
              else if(cresult.Code==100)
              {
                  //console.log("Convert end");
                  if(isaddfile==true)
                  {
                      return false;
                  }
                  isaddfile=true;
                  // clearTimeout(self.updateProcessTimer);
                  // self.updateProcessTimer = null;
                  self.uploadingInfo.ready = true;
                  self.uploadingInfo.name = "";
                  self.uploadingInfo.process = 0; 

                  var addresult= await this.uploadNewFile(filename,cresult.Data.FileName,result.RetData.FileID,cresult.Data.Count,hash,input.files[0].size);
                  
                  self.uploadTitleAndTags(addresult.ItemID);
                  self.cancelUpload();
                  this.updateEnd(true);
                  return false;
                  //console.log(addresult);
              }
              return true;
            }, 2000);

          },()=>{
            //on cancel
            self.cancelUpload();
          },(process,guid)=>{
            ////onProcess                
              if(process == -1)
              {
                this.uploadingInfo.ready = false;
                this.uploadingInfo.name = filename;
                this.uploadingInfo.process = 0;
                this.uploadingInfo.status = this.$t("Common.Uploading");
              }
              else
              {
                this.uploadingInfo.process = process;
              }
          });

        }else if (result.RetCode == -6003){//文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
            self.$Message.warning({content:this.$t("Common.FileAlreadyinList"),duration: 3});
            self.cancelUpload();
        }
        else{
          self.cancelUpload();
        }
        
      },
      async uploadNewFile(filename,servername,fileid,pagecount,md5,size){
        var newfile= new Object();
        newfile.Title =filename;
        newfile.SchoolID =-1;
        newfile.Description =filename;
        newfile.Hash =md5;
        newfile.FileID=fileid;
        newfile.PageCount =pagecount;
        newfile.FileSize=size;
        newfile.FileName=servername.lastIndexOf(".")>-1?servername.substr(0,servername.lastIndexOf(".")):servername;
        var newfileresult =await webapi.UploadFavNewFile(newfile);
        return newfileresult;
      },     
      updateEnd(success)
      {
        // clearTimeout(this.updateProcessTimer);
        // this.updateProcessTimer = null;
        this.uploadingInfo.ready = true;
        this.uploadingInfo.name = "";
        this.uploadingInfo.process = 0;
        if (success)
        {
          this.$Message.info({content:"File uploaded successfully",duration: 3});
          this.$nextTick(()=>{
            this.refresh();
          })
        }
      },
      updateProcess(guid)
      {
        webapi.getAttachmentConvertingPercentage([guid]).then((res) =>
        {
          //[{AttachmentID: 21808, Status: 0, Percentage: 0}]
          loger.log(res);
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
      async updateProcessEx(guid,token) {
            var res = await webapi.queryConvertPercentage(token);
            //loger.log(res);
            // {"code":"10000","msg":"","result":{"progress":0.02,"status":"Converting"}}   
            if (res.code == 10000) {
                this.uploadingInfo.process = Math.round(res.result.progress*100);
                if (this.uploadingInfo.process == 100) {
                    return 100;
                }
                return this.uploadingInfo.process;
            }else {
                  this.$Notice.error({
                    title:this.$t("Common.ConvertError"),
                    desc: '',
                    duration: 4,
                    bottom: 60,
                    left: true
                  });
                return -1;
            }
      },
      async updateProcessNew(guid,token) {
        //console.log("updateProcessNew");
        var res = await webapi.queryConvertPercentage(token);
        if(!res)
        {
          return {Code:this.uploadingInfo.process};
        }
        if (res.Success == true) {
            //file.process = Math.round(res.result.progress*100);
            if(res.Data.CurrentStatus==0)//0: Preparing, 1: Converting, 2: wait to send, 3: Failed 4:send  5:done
            {
                //file.process+=1;
                this.uploadingInfo.process=res.Data.FinishPercent;
                return {Code:this.uploadingInfo.process};
            }
            else if(res.Data.CurrentStatus==1)
            {
                this.uploadingInfo.process=res.Data.FinishPercent;//Math.min(Math.floor(res.Data.FinishPercent/2),49);
                return {Code:this.uploadingInfo.process};
            }  
            else if(res.Data.CurrentStatus==2)
            {
                this.uploadingInfo.process=res.Data.FinishPercent;
                return {Code:this.uploadingInfo.process};
            }                      
            else if(res.Data.CurrentStatus==3)
            {
                this.$Notice.error({
                    title:this.$t("Live.ConvertError"),
                    desc: "",
                    duration: 4,
                    bottom: 60,
                    left: true
                });
                return {Code:-1};
            }
            else if(res.Data.CurrentStatus==4)
            {
                    this.uploadingInfo.process= Math.min(99,res.Data.FinishPercent);//Math.max(51,50+Math.floor(res.Data.FinishPercent/2));
                    return {Code:this.uploadingInfo.process};
            }
            else if (res.Data.CurrentStatus==5) {
                this.uploadingInfo.process=100;
                return {Code:100,Data:res.Data.Result};
            }
            
        }else 
        {
            this.$Notice.error({
                title:"" +this.$t("Live.ConvertError"),
                desc: "",
                duration: 4,
                bottom: 60,
                left: true
            });

            return {Code:-1};
        }
        return {Code:-1};
      },
      handleEventVideoBeforeUpload: function (file)
      {
        let accept = [".mp3",".aac",".m4a",".3gp",".wav",".mp4",".jpg", ".jpeg", ".jpe", ".png", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"];
        var ext = file.name.substr(file.name.lastIndexOf("."));
        ext = ext.toLowerCase();
        if (!IsExistInArr(accept, ext))
        {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t("Common.FileNotSupport"), top: 24,duration: 4, left:true });
          return false;
        }
        return true;
      },
      initialize() {
        // this.uploadAction =  GetAPIUrl() + "FavoriteAttachment/AddNewFavorite";
        // this.uploadHeaders = { "UserToken": auth.getUserToken() };

        if (!this.loaded) {
          this.readData();
        }
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
      pageIndexChange(page) {
        this.pageIndex = page;
        this.readData();
      },
      pageSizeChange(data) {
        this.pageIndex = 1;
        this.readData();
      },
      handleSearch(){
        this.pageIndex = 1;
        this.readData();
      },
      readData() {
        let self = this;
        let url = GetAPIUrl() + "FavoriteAttachment/MyFavoriteAttachments?type=0&schoolID=-1";
        url += "&pageIndex=" + (this.pageIndex - 1);
        url += "&pageSize=" + this.pageSize;

        if(this.filterSelectTagsIDStr.length!=0){
          url += "&tagIDs=" + this.filterSelectTagsIDStr;
        }

        if(this.searchFile){
          url += "&searchText="+encodeURIComponent(base64encode(utf16to8(trimStr(this.searchFile))));
        }

        this._getData(url, () => {
          self.filesData = [];
        }, (data) => {
          self.filesData = [];
          self.dataTotal = data.TotalCount;
          let list = data.DocumentList;

          for(let i = 0; i < list.length; i++) {
            let attachment = list[i];
            let file = self._attachment2File(attachment);

            self.filesData.push(file);
          }

          self.loaded = true;
        });
      },
      saveData() {

      },
      handleFileBeforeUpload(file) {
        let accept = [".mp4",".jpg", ".jpeg", ".jpe", ".png", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"];
        let ext = file.name.substr(file.name.lastIndexOf("."));
        ext = ext.toLowerCase();
        if (!IsExistInArr(accept, ext)) {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t("Common.FileNotSupport"), top: 24,duration: 4, left:true });
          return false;
        }

        this.fileUploading = true;
        this.uploadPercentage = 0;
        // let self = this;
        // this.uploadTimer = setInterval(function () {
        //   self.uploadPercentage += Math.round((100 - self.uploadPercentage) * 0.05);
        // }, 100);
      },
      handleFileProgress(event) {
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
          this.uploadPercentage=100;
          this.$nextTick(()=>{
            this.refresh();
          })
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
        this.editingFile.file = params.row.title;
        this.editingFile.date = params.row.date;
        this.editingFile.tagList = params.row.tagList;
        
        this.filesId=params.row.id;
        this.modalEditFile = true;

        this.$nextTick(()=>{
          this.$refs.EditFileSelectTags.initEditSelectTags();
        })
      },
      handleEditFileOK() {
        let self=this;
        let editTitle=encodeURIComponent(base64encode(utf16to8(this.editingFile.title)));
        if(this.filesId!=0){
          let url = GetAPIUrl() + "FavoriteAttachment/RenameAttachment?ItemID=" + this.filesId+"&title="+editTitle;
          this._postData(url, {}, () =>{
            self.loading = false;
          }, (result) => {
            self.modalEditFile = false;
            self.updateFileTag(self.filesId)
            self.$nextTick(()=>{
              self.refresh();
            })
          }, null);
        }
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
            this.$Message.error({content: this.$t('KloudSyncDocuments.CantView'),duration: 0,closable: true});
            return;
        }
        // this.$router.push({ name: "docview", params: { id: params.row.detail.ItemID } });
        // return;
        webapi.AddTempLessonWithOriginalDoc(params.row.detail.AttachmentID,params.row.detail.Title).then(res=>{
            //res.RetData
            this.$router.push({ name: "docview", params: { id: res.RetData.ItemID } });
        });

      },
      handleShareFile(params) {
        //console.log(params.row.detail);
        if(params.row.detail.FileType==5 || params.row.detail.FileType==4)
        {
            this.$Message.error({content: "Can't share this file!",duration: 0,closable: true})
            return;
        }   
        var url=location.origin.toLowerCase();
        url+="/attachment/"+params.row.detail.AttachmentID;
        navigator.clipboard.writeText(url).then(()=>{
          this.$Message.info({content: this.$t("Live.CopySyncUrlSuccess"), duration: 3});
        },()=>{
          this.$Message.error({content: this.$t("Live.CopySyncUrlFailed"), duration: 0,closable: true});
        });

      },
      handleMoveFile(params) {
        let self = this;

        this.$Modal.confirm({
          title: "Copy",
          content: "Do you want to copy this file to your school share files?",
          okText: "Copy",
          cancelText: "Cancel",
          onOk: () => {
            let url = GetAPIUrl() + "FavoriteAttachment/CopyAttachmentsBetweenTeacherAndSchool?attachmentIDs=" + params.row.id + "&schoolID=" + auth.getSchoolID();

            self._postData(url, {}, () =>{
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
          title: self.$t("Files.RemoveFilesTitle"),
          content: self.$t("Files.RemoveFilesContent"),
          okText: self.$t("Common.Delete"),
          cancelText: self.$t("Base.Cancel"),
          onOk: () => {
            let url = GetAPIUrl() + "FavoriteAttachment/RemoveFavorite?itemIDs=" + params.row.id;

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
          id: attachment.ItemID,
          title: attachment.Title,
          file: attachment.Title,
          tagList:attachment.TagList,
          date: date.Format("yyyy-MM-dd hh:mm:ss"),
          syncs: attachment.SyncCount,
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
