<template>
  <div id="user-profile-classroom">
    <div class="classroom-part">
      <div class="part-header" v-if="!isKloudSync">{{isKloudSync?$t("UserInfoKloudSyc.MyKlassroom"):$t("UserProfile.MyKlassroom")}}</div>
      <div>{{isKloudSync?$t("ClassroomInfo.WelcomeToMyMeetingroom"):$t('ClassroomInfo.WelcomeToMyKlassroom')}} <b>{{classroomID}}</b>  <Button type="primary" @click="handleClassroomChange" style="margin-left: 2em;">{{$t('ClassroomInfo.ChangeRoomID')}}</Button></div>
    </div>

    <div class="apply-part" v-show="showTeacherApply && showSchoolApply && !isKloudSync">
      <div class="part-header" style="margin-bottom: 2em;">
        <p>{{$t('ClassroomInfo.PendingTechnology')}}</p>
        <p>{{$t('ClassroomInfo.InstructorOrStartSchool')}}</p>
      </div>

      <div class="teacher-apply-part">
        <div class="part-header">{{$t('ClassroomInfo.ForInstructors')}}</div>
        <div style="padding: 2em 1em; text-align: left;">
          <div>
            <div style="float: left; margin-right: 1em;"><Icon type="android-checkmark-circle" color="#19be6b" size="20"></Icon></div>
            {{$t('ClassroomInfo.KlassroomHelp')}}
          </div>
          <div style="padding-top: 1em;">
            <div style="float: left; margin-right: 1em;"><Icon type="android-checkmark-circle" color="#19be6b" size="20"></Icon></div>
            {{$t('ClassroomInfo.PresentingPurpose')}}
          </div>
        </div>
        <Button type="primary" @click="handleApplyTeacher"><span style="font-size: 16px">{{$t('ClassroomInfo.ApplyInstructor')}}</span></Button>
      </div>

      <!--<table>
        <tr>
          <td style="border-right: 1px solid #dddee1; width: 50%; vertical-align: top;">
            <div class="teacher-apply-part">
              <div class="part-header">For instructors</div>
              <div style="padding: 2em 1em; text-align: left;">
                <div>
                  <div style="float: left; margin-right: 1em;"><Icon type="android-checkmark-circle" color="#19be6b" size="20"></Icon></div>
                  Klassroom helps you manage tutoring and payment activities. You will gain more business via Klassroom easily
                </div>
                <div style="padding-top: 1em;">
                  <div style="float: left; margin-right: 1em;"><Icon type="android-checkmark-circle" color="#19be6b" size="20"></Icon></div>
                  Suitable for teaching, training, and presenting purpose
                </div>
              </div>
              <Button type="primary" @click="handleApplyTeacher"><span style="font-size: 16px">Apply to be an instructor</span></Button>
            </div>
          </td>
          <td style="vertical-align: top;">
            <div class="school-apply-part">
              <div class="part-header">For School or Business</div>
              <div style="padding: 2em 1em; text-align: left;">
                <div>
                  <div style="float: left; margin-right: 1em;"><Icon type="android-checkmark-circle" color="#19be6b" size="20"></Icon></div>
                  A management system that minimize your daily administration work for schools, organization training & learning activities, webinar and online events.
                </div>
                <div style="padding-top: 1em;">
                  <div style="float: left; margin-right: 1em;"><Icon type="android-checkmark-circle" color="#19be6b" size="20"></Icon></div>
                  Assist you in maintaining and handing all contact information in differen roles
                </div>
              </div>
              <Button type="primary" @click="handleApplySchool"><span style="font-size: 16px">Start your Klassroom school</span></Button>
            </div>
          </td>
        </tr>
      </table> -->
    </div>

    <div>
      <Modal v-model="modalChangeClassroom" :mask-closable="false" :title="$t('ClassroomInfo.ChangeRoomIDTitle')">
        <Form ref="formChangeClassroom" :model="changeClassroom" :rules="changeClassroomRule" label-position="right" :label-width="150">
          <FormItem :label="$t('ClassroomInfo.CurrentRoomID')">
            <Input v-model="changeClassroom.classroom0" disabled style="width: 250px"></Input>
          </FormItem>
          <FormItem :label="$t('ClassroomInfo.NewRoomID')" prop="classroom1" :error="changeClassroom.classroom1Error" :required="true">
            <Input v-model="changeClassroom.classroom1" style="width: 250px"></Input>
          </FormItem>
        </Form>

        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleChangeClassroomOK">{{$t('ClassroomInfo.Change')}}</Button>
          <Button @click="handleChangeClassroomCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>

    <Modal v-model="modalApplySchool" :mask-closable="false" title="School / Business Application Form">
      <div class="apply-school-part">
        <school-info-block :school="applySchool" :is-creating="true"></school-info-block>
      </div>

      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handleApplySchoolOK">{{$t('ClassroomInfo.ApplySure')}}</Button>
        <Button @click="handleApplySchoolCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss">
#user-profile-classroom {

  .part-header {
    font-size: larger;
    font-weight: bold;
    margin-bottom: 0.2em;
    color: #1c2438;
  }

  .classroom-part, .desc-part, .apply-part {
    margin-bottom: 2em;
  }

  .teacher-apply-part, .school-apply-part {
    padding: 1em 2em;
    //text-align: center;
    vertical-align: top;

    .part-header {
      font-size: 16px;
      background-color: #ff9900;
      color: white;
      display: inline-block;
      padding: 0.5em 3em;
      border-radius: 0.25em;
    }
  }
}
</style>

<script>
  import auth from '../../authenticator';
  import SchoolInfoBlock from './SchoolInfoBlock';
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

  export default {
    components: { SchoolInfoBlock },
    props: ["showTeacherApply", "showSchoolApply"],
    data() {
      const validateClassroom1 = (rule, value, callback) => {
        if (value === '') 
        {
          callback(new Error(this.$t('ClassroomInfo.EnterNewRoomID')));
        }
        else if(!(/^(?=[0-9]*[a-zA-Z])[a-zA-Z0-9]{3,12}$/ig).test(value))
        {
          callback(new Error(this.$t('ClassroomInfo.NewRoomIDRule')));
        }
        else {
          callback();
        }
      };

      return {
        loading: false,
        classroom: auth.getClassroomID(),
        modalChangeClassroom: false,
        changeClassroom: {
          classroom0: '',
          classroom1: '',
          classroom1Error: ''
        },
        changeClassroomRule: {
          classroom1: [
            { validator: validateClassroom1, trigger: 'blur' }
          ]
        },
        modalApplySchool: false,
        applySchool: {
          type0: 0,
          type1: 0,
          name: auth.getUserName() + "'s School",
          owner: parseInt(auth.getUserID()),
          admin: parseInt(auth.getUserID())
        },
        isKloudSync:false
      }
    },
    mounted() {
      this.isKloudSync=IsKloudSync();
    },
    computed: {
      classroomID() {
        if (this.classroom === 0 || this.classroom === '0' || this.classroom === '') {
          return '(No Klassroom ID yet)';
        }
        else {
          let id = this.classroom;
          if (id.indexOf("-") === 0) {
            id = id.substr(1);
          }
          return id;
        }
      },
    },
    methods: {
      handleClassroomChange() {
        this.changeClassroom.classroom0 = this.classroomID;
        this.changeClassroom.classroom1 = '';
        this.changeClassroom.classroom1Error = '';
        this.changeClassroom.saving = false;
        this.modalChangeClassroom = true;
      },
      handleChangeClassroomOK() {
        let self = this;

        this.$refs.formChangeClassroom.validate((valid) => {
          if (valid) {
            let url = GetAPIUrl() + "Lesson/UpdateClassRoomID?classroomID=" + encodeURIComponent(self.changeClassroom.classroom1);

            self._postData(url, {}, null, (result) => {
              self.classroom = self.changeClassroom.classroom1;
              auth.setClassroomID(self.classroom);
              self.modalChangeClassroom = false;
              self.changeMyMeetingRoomID(self.classroom);
            }, null);
          }
        });
      },
      handleChangeClassroomCancel() {
        this.modalChangeClassroom = false;
      },
      handleApplyTeacher() {
        let self = this;

        this.$Modal.confirm({
          title: this.$t('ClassroomInfo.ApplyToBeTeacherTitle'),
          content: this.$t('ClassroomInfo.ApplyToBeTeacherContent'),
          okText: this.$t('ClassroomInfo.ApplySure'),
          cancelText: this.$t('Base.Cancel'),
          onOk: () => {
            let url = GetAPIUrl() + "User/ApplyTeacher";

            self._postData(url, {}, null, (result) => {
              self.$parent.teacherApplied();
            }, null);
          }
        });
      },
      handleApplySchool() {
        this.modalApplySchool = true;
      },
      handleApplySchoolOK() {
        if (this.applySchool.type1 === '')
          this.applySchool.type1 = 0;

        let self = this;

        let url = GetAPIUrl() + "School/CreateSchool";
        let data = {
          "SchoolName": this.applySchool.name,
          "Category1": this.applySchool.type0,
          "Category2": this.applySchool.type1,
          "OwnerID": this.applySchool.owner,
          "AdminID": this.applySchool.admin
        };

        this._postData(url, data, null, (result) => {
          self.modalApplySchool = false;
          let id = parseInt(result.SchoolID);
          let type = self.applySchool.type0;

          self.$parent.schoolApplied(id, type);
        }, null);
      },
      handleApplySchoolCancel() {
        this.modalApplySchool = false;
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
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);
          }
        });
      },
      ...mapMutations(['changeMyMeetingRoomID'])
    }
  }
</script>
