<template>
    <div class="courses-upload-file-with-tag">
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
            <div class="courses-upload-new-file-with-tag" v-show="filesShow">
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
                    id="uploadNewFileWithTag"
                    type="file"
                    @change="schoolFileChange(this)"
                    accept="audio/wav, audio/mp4a-latm, audio/aac, audio/3gpp, audio/mpeg, video/mp4, image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
            </div>
            <div class="courses-upload-new-file-with-tag" style="background: #fff;border: 1px dashed #dddee1;border-radius: 4px;" v-show="!filesShow">
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
              <Button type="primary" @click="upLoadfileWithTagOk">{{$t('Base.OK')}}</Button>
            </div>
        </Modal>
        <upload-file preid="live" ref="uploadfile"></upload-file>
    </div>
</template>

<style lang="scss">
.courses-upload-new-file-with-tag {
    $images-root: "../../../static/images/";
    position: relative;
    margin-top: 20px;
    width: 100%;
    height: 110px;
    #uploadNewFileWithTag {
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
import auth from "../../authenticator";
import webapi from "../../webapi/webapi.js";
import util from "../../common/util.js";
import UploadFile from "../livelesson/UploadFile";
import UploadFileSelectTags from "../courses/UploadFileSelectTags";
export default {
  components: {
    UploadFileSelectTags,
    UploadFile
  },
  props: {
    tagUploadShowFlag: {
      type: Boolean,
      default: false
    },
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
      selectTagsStr:"",
      uploadType:'',
      filesObj:{
          fileName:'',
      },
      filesShow: true,
      title: "",
      showUploadWithTag: false
    };
  },
  mounted() {
    this.$refs.uploadFileSelectTags.uploadFileWithTag();
  },
  methods: {
    handleRemoveFile(){
      this.filesObj={fileName:''};
      $("#uploadNewFileWithTag").val("");
      this.filesShow=true;
    },
    //清空上次填入的内容
    cancelUpload(){
      this.showUploadWithTag=false;
      this.filesObj={fileName:''};
      $("#uploadNewFileWithTag").val("");
      this.filesShow=true;
      this.title="";
      this.$refs.uploadFileSelectTags.uploadFileWithTag();
    },
    schoolFileChange() {
      var input = $("#uploadNewFileWithTag")[0];
      this.filesShow=false;
      this.filesObj=input.files[0];
      this.filesObj.fileName=this.filesObj.name;
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
    upLoadfileWithTagOk() {
        var input = $("#uploadNewFileWithTag")[0];
        if (input.files.length == 0 ||this.handleEventVideoBeforeUpload(input.files[0]) == false) {
          alert(this.$t('UploadFileWithTag.PleaseSelectUploadFile'));
          return;
        }
        if (input.files[0].size >= 1024 * 1024 * 100) {
          alert(this.$t("Common.FileTooBig"));
          return;
        }
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
    //上传title和tag(type -- 附件类型：FavoriteAttachment = 1, LessonAttachment = 2, CourseAttachment = 3）
    uploadTitleAndTags(itemId){
      let self=this;
      if(self.selectTagsStr.length!=0){
        self.uploadType=1;
        let url=GetAPIUrl() + "AttachmentTag/CreateTags?itemID="+itemId+"&tagIDs="+self.selectTagsStr+"&type="+self.uploadType;
        self._postData(url, null, null, (result)=>{
          
        }, null);
      }
    },
    uploadVideoInputChange() {
      //判断是否重复上传
      let upfile = this.filesObj;
      let filename = upfile.name;
      let self = this;
      let school = this.schoolId;
      let folder = this.folderId;
      util.GetMD5(upfile).then(hash => {
        webapi.UploadFile2FavWithHash(school, folder, filename, hash).then(result => {
          if (result.RetCode == 0) {
            //返回上传的数据
            self.uploadTitleAndTags(result.RetData.ItemID);
            self.$Message.info({content:"File uploaded successfully",duration: 3});
            self.cancelUpload();
            self.$nextTick(()=>{
              self.$parent.refresh();
            })
          } else if (result.RetCode == -6002) {
            //此哈希值对应的文件不存在，请直接上传
            self.$refs.uploadfile.Upload(
              upfile,
              GetAPIUrl() + "FavoriteAttachment/AddNewFavoriteMultipart?Description=description&Hash=" + hash + "&schoolID=" + school + "&folderID=" + folder,
              (result) => {
                self.uploadTitleAndTags(result.RetData.ItemID);
                self.$Message.info({content:"File uploaded successfully",duration: 3});
                self.cancelUpload();
                self.$nextTick(()=>{
                  self.$parent.refresh();
                })
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
    uploadVideoInputChangeOss() {
      //判断是否重复上传
      let upfile = this.filesObj;
      let filename = upfile.name;
      let self = this;
      let school = this.schoolId;
      let folder = this.folderId;
      util.GetMD5(upfile).then(hash => {
        webapi.UploadFile2FavWithHash(school, folder, filename, hash).then(result => {
          if (result.RetCode == 0) {
            //返回上传的数据
            self.uploadTitleAndTags(result.RetData.ItemID);
            self.$Message.info({content:"File uploaded successfully",duration: 3});
            self.cancelUpload();
            self.$nextTick(()=>{
              self.$parent.refresh();
            })
          } else if (result.RetCode == -6002) {
            //此哈希值对应的文件不存在，请直接上传
            var name= util.GetMD5String(auth.getUserIDEx()+"_"+hash);
            self.$refs.uploadfile.UploadOss(upfile,name,async(guid) =>{
                 //copy源文件
                await webapi.CopyOssFile(name);
                var type=util.GetCovertType(filename);
                let addresult;
                if(type==""){
                  addresult= await webapi.TransferOrConvertFile(school,filename,hash,"",name);
                }else{
                  let token=webapi.convertDoc(name,type);
                  addresult = await webapi.TransferOrConvertFile(school,filename,hash,token,name);
                }
                self.uploadTitleAndTags(addresult.ItemID);
                self.$Message.info({content:"File uploaded successfully",duration: 3});
                self.cancelUpload();
                self.$nextTick(()=>{
                  self.$parent.refresh();
                })
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
    initial() {
      this.showUploadWithTag = this.tagUploadShowFlag;
      this.$nextTick(()=>{
        this.$refs.uploadFileSelectTags.initial();
      })
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
            self.$Message.error(result.ErrorMessage);
            console.log(result);
            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);
          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
  }
};
</script>
