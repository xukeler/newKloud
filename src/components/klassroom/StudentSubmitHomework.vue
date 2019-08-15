<template>
  <div class="student-submit-homework">
    <div style="color:rgb(45, 140, 240);font-size: 13px;font-weight: bold;cursor: pointer;position:relative;padding: 7px 16px;">
      立即提交
      <div class="submit-homework">
        <input style="width:100%;height:100%;" :id="'submitStuHomework'+homework.detail.ItemID" type="file" @change="uploadStuHomework(homework.detail);"  accept="video/mp4,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
      </div>
    </div>
    <upload-file preid="live" ref="uploadfile"></upload-file>
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
.student-submit-homework{
  width: 100%;
  height: 100%;
  position: relative;
  span{
    display: inline-block;
  }
  .submit-homework{
    position: absolute;
    width: 100%;
    height: 100%;
    left:0px;
    top:0px;
    overflow: hidden;
    opacity: 0;
  }
}
</style>
<script>
import auth from "../../authenticator";
import util from "../../common/util.js";
import UploadFile from "../livelesson/UploadFile";
import webapi from "../../webapi/webapi.js";
var MyStorage = localStorage;
  export default {
    data(){
      return {
        folderId:-1,
        showUploadCover:false,
        uploadingInfo: { ready: true, name: '', process: 0 },
        updateProcessTimer: null
      }
    },
    props: {
      homework: Object,
    },
    components: {
      UploadFile,
    },
    methods: {
      //分片上传
      uploadStuHomework(item){
        var input = $("#submitStuHomework"+item.ItemID)[0];
        if (input.files.length == 0 || this.handleEventVideoBeforeUpload(input.files[0]) == false) {
          alert(this.$t("UploadFileWithTag.PleaseSelectUploadFile"));
          return;
        }
        if (!this.uploadingInfo.ready)
        {
          alert(this.$t("Common.WaitForFileUploading"));
          $("#submitStuHomework"+item.ItemID).val("");
          return;
        }
        if (input.files[0].size >= 1024 * 1024 * 100) {
          alert(this.$t("Common.FileTooBig"));
          return;
        }
        this.uploadVideoInputChange(item);
      },
      async uploadVideoInputChange(item) {
        //判断是否重复上传
        let inputID = "#submitStuHomework"+item.ItemID ;
        let upfile = $(inputID)[0].files[0];
        let filename = upfile.name;
        let self = this;
        var ext = filename.substr(filename.lastIndexOf(".")).toLowerCase();
        let folder = this.folderId;
        var hash=await util.GetMD5(upfile);
        
        let assignmentID = "";
        if(MyStorage.getItem('business.assignment')){
          assignmentID = MyStorage.getItem('business.assignment');
        }
        
        var result =await webapi.BusinessUploadHomeworkFileFavWithHash(assignmentID, item.FileID, filename, hash);
        if (result.RetCode == 0) {
          //返回上传的数据
          self.$Message.info({content: "File uploaded successfully",duration: 3});
          $(inputID).val("");
        }else if(result.RetCode == -6002){
          //此哈希值对应的文件不存在，请直接上传
          self.$refs.uploadfile.Upload(
            upfile,
            GetAPIUrl() +
              "Homework/CommitStudentTaskAttachment?Description=description&Hash=" +
              hash +
              "&AssignmentID=" +
              assignmentID +
              "&FileID=" + item.FileID +
              "&IsAddToFavorite=0",
            result => {
              $(inputID).val("");

              var lineItem = result.RetData;
              if (lineItem.FileType == 4 || lineItem.FileType == 5)
              {
                self.updateEnd(true);
                return;
              }
              self.showUploadCover=true;
              self.uploadingInfo.name = filename;
              self.uploadingInfo.process = 0;
              self.updateProcessTimer = setInterval(() =>
              {
                self.updateProcess(lineItem.AttachmentID);
              }, 1000);

            },
            () => {
              $(inputID).val("");
            }
          );
        }else if (result.RetCode == -6003) {
          //文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
          self.$Message.warning({
            content: this.$t("Common.FileAlreadyinList"),
            duration: 3
          });
          $(inputID).val("");
        } else {
          $(inputID).val("");
        }
        return;//下方为最新上传阿里云和S3最新方案
        // if (result.RetCode == 0) {
        //   //返回上传的数据
        //   self.$Message.info({content: "File uploaded successfully",duration: 3});
        //   $(inputID).val("");
        // } else if (result.RetCode == -6002) {
        //   //此哈希值对应的文件不存在，请直接上传
        //   var name="tempupload/"+util.GetMD5String(auth.getUserIDEx()+"_"+filename+"_"+new Date().toString());
        //   var type=util.GetCovertType(filename);
        //   var servername=GUID()+""+ext;
        //   if(type=="")
        //   {
        //     name=result.RetData.Path+"/"+servername;
        //   }
        //   self.$refs.uploadfile.UploadCloud(upfile,name,async (guid,convertParam)=> {
        //       var type=util.GetCovertType(filename);
        //       if(type=="")
        //       {
        //           var newfileresult= await this.uploadNewFile(item.ItemID,filename,servername,result.RetData.FileID,1,hash);
        //           $(inputID).val("");
        //           self.updateEnd(true);
        //       }
        //       else
        //       {
        //         self.showUploadCover=true;
        //         await webapi.startConverting({Key:name,DocumentType:type,Bucket:convertParam,TargetFolderKey:result.RetData.Path});
        //         self.updateProcessTimer = setInterval(async() =>
        //         {
        //           var cresult = await self.updateProcess(guid,{Key:name,Bucket:convertParam});
        //             if(cresult.Code ==-1)
        //             {
        //                 clearTimeout(self.updateProcessTimer);
        //                 self.updateProcessTimer = null;
        //                 self.showUploadCover=false;
        //             }
        //             else if(cresult.Code==100)
        //             {
        //                 clearTimeout(self.updateProcessTimer);
        //                 self.updateProcessTimer = null;
        //                 self.showUploadCover=false;
                        

        //                 var newfileresult= await this.uploadNewFile(item.ItemID,filename,cresult.Data.FileName,result.RetData.FileID,cresult.Data.Count,hash);
        //                 //console.log(newfileresult);
        //                 $(inputID).val("");
        //                 self.updateEnd(true);
        //             }
        //         }, 1500);
        //       }
        //       return;
        //     },() => {
        //       $(inputID).val("");
        //     }
        //   );

        // } else if (result.RetCode == -6003) {
        //   //文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
        //   self.$Message.warning({
        //     content: this.$t("Common.FileAlreadyinList"),
        //     duration: 3
        //   });
        //   $(inputID).val("");
        // } else {
        //   $(inputID).val("");
        // }
        
        
      },
      async uploadNewFile(itemID,filename,servername,fileid,pagecount,md5){
        var newfile= new Object();
        newfile.Title =filename;
        newfile.HomeWorkID =itemID;
        newfile.Description =filename;
        newfile.Hash =md5;
        newfile.FileID=fileid;
        newfile.PageCount =pagecount;
        newfile.FileName=servername;      
        var newfileresult =await webapi.UploadHomeworkNewFile(newfile);
        return newfileresult;
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
    }
  };
</script>
