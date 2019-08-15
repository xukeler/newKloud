<template>
  <div id="selectcoursetemp" class="selectcoursetemp">
    <div style="padding:10px 20px 2px;">
      <RadioGroup v-model="prepareTempValue">
        <Radio label="My Course" disabled></Radio>
        <Radio label="School Course" disabled></Radio>
      </RadioGroup>
    </div>
    <Row type="flex" justify="center" align="middle" style="margin:5px; padding-top:10px;">
      <Col span="7" style="height:30px; line-height:30px; vertical-align:middle;" justify="center" align="middle">
      <div>Course：</div>
      </Col>
      <Col span="17">
      <Select v-model="selectCourse" style="width:280px; height:30px;" @on-change="onCourseChange">
        <Option v-for="item in prepareTempCourseList" :value="item.value" :key="item.value">{{ item.text }}</Option>
      </Select>
      </Col>
    </Row>
    <div id="welcomeMessagePrepareTemp_selectLecture">
      <Row type="flex" justify="center" align="middle" style="margin:5px;">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle;" justify="center" align="middle">
        <div>Lecture：</div>
        </Col>
        <Col span="17">
        <Select v-model="selectLecture" style="width:280px; height:30px;">
          <Option v-for="item in lectureList" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle" style="margin:5px; padding-top:10px;">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle;" justify="center" align="middle">
        </Col>
        <Col span="17">
        <Button type="primary" @click="prepareTempOk">OK</Button>
        <Button type="text" @click="cancelPrepareTemp">Cancel</Button>
        </Col>
      </Row>
    </div>
    <div id="welcomeMessagePrepareTemp_newLecture" style="display:none;">
      <Row type="flex" justify="center" align="middle" style="margin:5px;">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle;" justify="center" align="middle">
        <div>New Course Name：</div>
        </Col>
        <Col span="17">
        <Input v-model="welcomeMessagePrepareNewCourseName" placeholder="" style="width: 300px"></Input>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle" style="margin:5px;">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle;" justify="center" align="middle">
        <div>New Lecture Name：</div>
        </Col>
        <Col span="17">
        <Input v-model="welcomeMessagePrepareNewLectureName" placeholder="" style="width: 300px"></Input>
        </Col>
      </Row>
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
        <Upload ref="newFileUpload"
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
        <Upload ref="updateFileUpload"
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
        <Progress v-show="fileUploading" :percent="uploadPercentage" hide-info></Progress>
      </div>
      <Row type="flex" justify="center" align="middle" style="margin:5px; padding-top:10px;">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle;" justify="center" align="middle">
        </Col>
        <Col span="17">
        <Button type="primary" @click="prepareTempNewTempOk">OK</Button>
        <Button type="text" @click="cancelPrepareTemp">Cancel</Button>
        </Col>
      </Row>
    </div>
    
  </div>
</template>
<style scoped lang="scss">
  $header-height: 50px; $images-root: "../../../static/images/"; $lecture-file-width: 30px; $lecture-file-height: 30px; .selectcoursetemp {

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
  }
</style>
<script>
  import auth from '../../authenticator'
  import webapi from '../../webapi/webapi.js';

  export default {
    data: function () {
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
        prepareTempValue: "My Course",
        prepareTempCourseList: [],
        prepareLectureID: 0,
        selectCourse: null,
        selectLecture: null,
        selectStudent: null,
        studentList: [],
        courseList: [],
        lectureList: [],
        seqLectureID:0
      }
    },
    components: {
      
    },
    mounted: function ()
    {
      this.uploadHeaders = { "UserToken": auth.getUserToken() };
    },
    methods: {
      init()
      {
        var initCourseTemp = (list) =>
        {
          this.prepareTempCourseList = [];
          for (var course of list)
          {
            var obj = new Object();
            obj.text = course.Title;
            obj.value = course.CourseID;
            this.prepareTempCourseList.push(obj);
          }
        };
        if (auth.getSchoolID() != "" && auth.getSchoolID() != "0")
        {
          this.prepareTempValue = "School Course";
          webapi.getSchoolCourseTempList(auth.getSchoolID()).then((list) =>
          {
            initCourseTemp(list);
          });

        }
        else
        {
          this.prepareTempValue = "My Course";
          webapi.getMyCourseTempList().then((list) =>
          {
            var obj = new Object();
            obj.Title = "{+Add a New Course}";
            obj.CourseID = "-1";
            list = [obj].concat(list);

            initCourseTemp(list);
          });
        }

        webapi.getLectureSequence().then((seqid) =>
        {
          this.seqLectureID = seqid;
          let uploadUrl = GetAPIUrl() + "KWEventAttachment/UploadFile?FileName=&Title=&Description=attachment";
          uploadUrl += "&EventID=" + seqid;
          this.newFileUploadAction = uploadUrl;
        });
      },
      onCourseChange()
      {
        if (this.selectCourse == null || this.selectCourse == "") return;
        if (this.selectCourse == "-1")
        {
          this.newCourseTemp();
          return;
        }
        else
        {
          this.cancelNewCourseTemp();
        }

        webapi.getLectureList(this.selectCourse).then((info) =>
        {
          this.lectureList = [];
          for (var lecture of info)
          {
            var obj = new Object();
            obj.text = lecture.Title;
            obj.value = lecture.LectureID;
            this.lectureList.push(obj);
          }
        });
      },
      prepareTempOk()
      {
        if (this.selectCourse == null || this.selectCourse == "")
        {
          this.$Message.error({content: "Please select Course!",duration: 0,closable: true})
          return;
        }
        if (this.selectLecture == null || this.selectLecture == "")
        {
          this.$Message.error({content: "Please select Lecture!",duration: 0,closable: true})
          return;
        }
        this.$parent.$parent.prepareTempOk(this.selectLecture);
      },
      prepareTempNewTempOk()
      {
        if (this.welcomeMessagePrepareNewCourseName == "")
        {
          this.$Message.error({content: "Please input Course name!",duration: 0,closable: true})
          return;
        }
        if (this.welcomeMessagePrepareNewLectureName == "")
        {
          this.$Message.error({content: "Please input Lecture name!",duration: 0,closable: true})
          return;
        }
        if (this.editingFiles.length < 1)
        {
          this.$Message.error({content: "Please upload file!",duration: 0,closable: true})
          return;
        }

        //Role枚举：Student = 1,Teacher = 2
        var course = new Object();
        course.Title = this.welcomeMessagePrepareNewCourseName;
        course.Description = "";
        course.SchoolID = 0;
        // course.StudentID = 0;
        // course.TeacherID = auth.getUserID();
        course.CourseMembers=[{"MemberID":auth.getUserID(), "Role":2},{"MemberID":0, "Role":1}],
        course.TemplateType = 2;
        course.IsTemplate = 1;

        webapi.createCourse(course).then(courseinfo =>
        {
          if (courseinfo == null) return;
          var lecture = new Object();
          lecture.Title = this.welcomeMessagePrepareNewLectureName;
          lecture.Description = "";
          lecture.CourseID = courseinfo.Course.CourseID;
          lecture.LectureID = this.seqLectureID;
          webapi.createLecture(lecture).then(lectureInfo =>
          {
            this.$parent.$parent.prepareTempOk(this.seqLectureID);
          });
          
        });


      },
      cancelPrepareTemp()
      {
        this.$parent.$parent.cancelPrepareTemp();
      },
      newCourseTemp()
      {
        $("#welcomeMessagePrepareTemp_selectLecture").hide();
        $("#welcomeMessagePrepareTemp_newLecture").show();
      },
      cancelNewCourseTemp()
      {
        $("#welcomeMessagePrepareTemp_selectLecture").show();
        $("#welcomeMessagePrepareTemp_newLecture").hide();
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
