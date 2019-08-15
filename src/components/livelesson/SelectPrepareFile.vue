<template>
  <div id="selectpreparefile" class="selectpreparefile">
    <div style="padding:10px 20px 2px;">
      <RadioGroup v-model="prepareFileValue" @on-change="onSelectFile">
        <Radio label="My file"></Radio>
        <Radio label="Shared file"></Radio>
      </RadioGroup>
    </div>
    <div class="lecture-file-list">
      <div class="lecture-file" v-for="item in editingFiles" :key="item.id">
        <!--<img class="lecture-file-thumbnail" :src="item.url">-->
        <span class="lecture-file-thumbnail file"></span>
        <div class="lecture-file-cover">
          <!--<Icon type="ios-eye-outline" title="View" @click.native="handleViewFile(item)"></Icon>-->
          <Icon type="ios-trash-outline" title="Delete File" @click.native="handleRemoveFile(item)"></Icon>
          <!--<Icon type="ios-cloud-upload-outline" title="Upload new version" @click.native="handleUpdateFile(item)"></Icon>
        <a :href="item.url" download><Icon type="ios-cloud-download-outline" title="Download File" @click.native="handleDownloadFile(item)"></Icon></a>-->
        </div>
        <p>{{item.name}}</p>
      </div>
      <div style="clear:both;">
        <Upload ref="newFileUpload"
                v-if="showUploadFile"
                type="drag"
                :action="newFileUploadAction"
                :headers="uploadHeaders"
                :show-upload-list="false"
                :default-file-list="editingFiles"
                :before-upload="handleFileBeforeUpload"
                :on-progress="handleFileProgress"
                :on-success="handleNewFileSuccess"
                :on-error="handleFileError"
                style="display: inline-block; width: 150px; height: 75px; margin: 4px; overflow: hidden; opacity: 0.7">
          <div style="text-align: center">
            <span class="lecture-file-thumbnail upload-file"></span>
            <p>Click or drag file here to upload.</p>
          </div>
        </Upload>
        <Button type="primary" class="livefromfavorite" v-if="showFromFav" @click="AddFromFav();">Upload file from my favorite.</Button>
      </div>
      <Progress v-show="fileUploading" :percent="uploadPercentage" hide-info></Progress>
      <div style="padding-top:10px;">
        <Button type="primary" @click="OK">OK</Button>
        <Button type="text" @click="cancelPrepareTemp">Cancel</Button>
      </div>
    </div>
    <Modal v-model="selectFav"
           title="Select file"
           width="800"
           :closable="false"
           :mask-closable="false"
           @on-ok="selectFavOK"
           @on-cancel="selectFavCancel" style="z-index:40001;position: absolute;" class-name="hideModalFooter">
      <div slot="header" style=" height:30px;">
        <span style="font-size:16px; font-weight:bold;">Select file</span>
        <span style="float:right;">
          <Button type="primary" @click="selectFavOK">OK</Button>
          <Button type="text" @click="selectFavCancel">Cancel</Button>
        </span>
      </div>
      <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
        <Col span="2">&nbsp;</Col>
        <Col span="9">Title</Col>
        <Col span="9">FileName</Col>
        <Col span="4">Date</Col>
      </Row>
      <div style="height:300px; overflow:auto;">
        <div id="favList" class="favList" v-for="item in favList">
          <Row style="height:26px;" type="flex" align="middle">
            <Col span="2"><input type="checkbox" :value=item.id v-model="selectedFav"></Col>
            <Col span="9">{{item.title}}</Col>
            <Col span="9">{{item.filename}}</Col>
            <Col span="4">{{item.date}}</Col>
          </Row>
        </div>
      </div>
      <div slot="footer" style="display:none;">
      </div>
    </Modal>
  </div>
</template>
<style scoped lang="scss">
  $header-height: 50px;
  $images-root: "../../../static/images/";
  $lecture-file-width: 30px;
  $lecture-file-height: 30px;

  /*test*/

  .selectpreparefile {
    .lecture-file-list

  {
    padding: 0;
    margin: 0;
  }

  .lecture-file {
    display: inline-block;
    height: 75px;
    width: 150px;
    //line-height: $lecture-file-height * 1.5;
    text-align: center;
    //border: 1px solid transparent;
    //border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    margin: 4px;
    //box-shadow: 0 1px 1px rgba(0,0,0,.2);
  }

  .lecture-file-thumbnail {
    display: inline-block;
    width: $lecture-file-width;
    height: $lecture-file-height;
  }

  .file {
    background-image: url($images-root + 'file.svg');
    background-size: $lecture-file-width $lecture-file-height;
  }

  .upload-file {
    background-image: url($images-root + 'upload-file.svg');
    background-size: $lecture-file-width $lecture-file-height;
  }

  .lecture-file-cover {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    line-height: 75px;
    background: rgba(0,0,0,.6);
    text-align: center;
  }

  .lecture-file:hover .lecture-file-cover {
    display: block;
  }

  .lecture-file-cover i {
    color: #fff;
    font-size: 30px;
    cursor: pointer;
    margin: 0 16px;
  }
  .livefromfavorite {
    width: 280px;
    background: #445F73;
    border-color: #445F73;
  }

    .livefromfavorite:hover {
    }
  }
</style>
<script>
  import auth from '../../authenticator'
  import webapi from '../../webapi/webapi.js';

  export default {
    data: function ()
    {
      return {
        isCreating: false,
        uploadHeaders: {},
        editingLecture: { title: "" },
        editingFiles: [],
        newFileUploadAction: GetAPIUrl(),
        updateFileUploadAction: GetAPIUrl(),
        fileUploading: false,
        uploadPercentage: 0,
        uploadTimer: null,
        welcomeMessagePrepareTemp: false,
        welcomeMessagePrepareLesson: false,
        welcomeMessagePrepareNewCourseName: "",
        welcomeMessagePrepareNewLectureName: "",
        showWelMsgPrepareMenu: true,
        isPrepare: false,
        prepareFileValue: "My file",
        prepareTempCourseList: [],
        prepareLectureID: 0,
        selectCourse: null,
        selectLecture: null,
        selectStudent: null,
        studentList: [],
        courseList: [],
        lectureList: [],
        seqLectureID: 0,
        showUploadFile:true,
        showFromFav: false,
        selectFav: false,
        favList: [],
        selectedFav: [],
        lessonID:0
      }
    },
    components: {

    },
    mounted: function ()
    {
      this.uploadHeaders = { "UserToken": auth.getUserToken() };
      webapi.getLessonSequence().then((seqid) =>
      {
        this.lessonID = seqid;
        //let uploadUrl = GetAPIUrl() + "KWEventAttachment/UploadFile?FileName=&Title=&Description=attachment";
        //uploadUrl += "&EventID=" + seqid;
        let uploadurl = GetAPIUrl() + "EventAttachment/UploadFile?ViewType=1&ProjectID=211&CustomerID=-1&EventID=0&Title=Attachment&Description=Attachment";
        uploadurl += "&IncidentID=" + seqid;
        uploadurl += "&FileName=";
        this.newFileUploadAction = uploadurl;
      });
    },
    methods:
    {
      onSelectFile()
      {
        if (this.prepareFileValue == "My file")
        {          
          this.showFromFav = false;
          this.showUploadFile = true;
        }
        else
        {
          this.showUploadFile = false;
          this.showFromFav = true;
        }
      },
      AddFromFav()
      {
        webapi.getMyFavorite().then(d =>
        {
          this.favList = [];
          for (let item of d.DocumentList)
          {
            this.favList.push(this.favList2ShowList(item));
          }
          this.selectFav = true;
        });
      },
      favList2ShowList(item)
      {
        var ct = new Date();
        ct.setTime(item.CreatedDate);
        let showCT = ct.Format("yyyy-MM-dd hh:mm:ss");
        return {
          id: item.AttachmentID,
          title: item.Title,
          filename: item.FileName,
          date: showCT
        };
      },
      selectFavOK()
      {
        if (this.selectedFav.length < 1)
        {
          return;
        }
        this.addFav2Meeting(this.lessonID, this.selectedFav).then(() =>
        {

        });

        this.selectFav = false;
      },
      selectFavCancel()
      {
        this.selectFav = false;
      },
      OK()
      {
        var now = new Date();
        var enddate = new Date();
        enddate.setHours(enddate.getHours() + 2);
        let start = now.getDatePart() + now.getTimePart();
        let end = enddate.getDatePart() + enddate.getTimePart();
        var meetingid = this.$route.query.id;

        var lesson = new Object();
        lesson.LessonID = this.lessonID;
        lesson.Title = "New Lesson " + now.Format("yyyy-MM-dd hh:mm:ss");
        lesson.Description = "";
        lesson.CourseID = 0;
        lesson.LectureIDs =0;
        lesson.StartDate = start;
        lesson.EndDate = end;
        lesson.StudentID = -1;
        //lesson.classroomID = meetingid;
        webapi.createLesson(lesson).then((lessonid) =>
        {
          this.$parent.$parent.prepareFileOk(lessonid);
        });
      },
      cancelPrepareTemp()
      {
        this.$parent.$parent.cancelPrepareFile();
      },
      handleViewFile: function (file)
      {
        //console.log(file);
      },
      handleRemoveFile: function (file)
      {
        let self = this;

        //this.$Modal.confirm({
        //  title: "Delete File",
        //  content: "Do you want to remove this file: '" + file.name + "'",
        //  okText: "Delete",
        //  cancelText: "Cancel",
        //  styles: { "z-index":"999"},
        //  onOk: () =>
        //  {
        let url = GetAPIUrl() + "KWEventAttachment/RemoveAttachments?attachmentIDs=" + file.id;

        $.ajax({
          type: 'DELETE',
          url: url,
          beforeSend: function (request)
          {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (result)
          {
            if (result.RetCode === 0)
            {
              let list = self.editingFiles;
              list.splice(list.indexOf(file), 1);
              list = self.editingLecture.detail.Attachments;
              list.splice(list.indexOf(file.detail), 1);
            }
            else
            {
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError)
          {
            console.log(xhr);
          }
        });
        //  }
        //});
      },
      handleUpdateFile: function (file)
      {
        this.updateFileUploadAction = GetAPIUrl() + "KWEventAttachment/UpdateFile?attachmentID=" + file.id;

        this.$refs.updateFileUpload.handleClick();
      },
      handleDownloadFile: function (file)
      {

      },
      handleFileBeforeUpload: function (file)
      {
        this.startUploadProgress();
      },
      handleFileProgress: function (event, file, fileList)
      {
        //this.uploadPercentage = file.percentage;
      },
      handleFileError: function (error, file, fileList)
      {
        this.endUploadProgress();

        console.log(error);
      },
      handleNewFileSuccess: function (result, file)
      {
        this.endUploadProgress();

        if (result.RetCode === 0)
        {
          if (result.RetData !== null)
          {
            let attachment = result.RetData;
            if (attachment.AttachmentID)
            {
              let lectureFile = this._attachment2File(attachment);
              this.editingFiles.push(lectureFile);
            }
          }
        }
        else
        {
          console.log(result);
        }
      },
      handleUpdateFileSuccess: function (result, file)
      {
        this.endUploadProgress();

        if (result.RetCode === 0)
        {
          if (result.RetData !== null)
          {
            let attachment = result.RetData;
            if (attachment.AttachmentID)
            {
              let lectureFile = this._attachment2File(attachment);

              for (let i = 0; i < this.editingFiles.length; i++)
              {
                if (lectureFile.id === this.editingFiles[i].id)
                {
                  this.editingFiles.splice(i, 1, lectureFile);
                  break;
                }
              }
            }
          }
        }
        else
        {
          console.log(result);
        }
      },
      startUploadProgress()
      {
        this.fileUploading = true;
        this.uploadPercentage = 0;

        let self = this;
        this.uploadTimer = setInterval(function ()
        {
          self.uploadPercentage += Math.round((100 - self.uploadPercentage) * 0.05);
        }, 100);
      },
      endUploadProgress()
      {
        this.uploadPercentage = 100;
        this.fileUploading = false;
        if (this.uploadTimer)
        {
          clearInterval(this.uploadTimer);
          this.uploadTimer = null;
        }
      },
      _attachment2File(attachment)
      {
        let id = attachment.AttachmentID;
        let url = attachment.SourceFileUrl;
        let name = attachment.FileName;
        let lectureFile = {
          id: id,
          name: name,
          url: url,
          status: 'finished',
          detail: attachment
        };

        return lectureFile;
      }
    }
  }
</script>
