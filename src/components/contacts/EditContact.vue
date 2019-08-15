<template>
  <div id="editContact" class="edit-contact-class">
    <div>
      <table class="contact-detail">
        <tr>
          <td>{{$t('ContactDetail.UserID')}}: </td>
          <td><Input v-model="contact.userName" disabled/></td>
          <td></td>
        </tr>
        <!-- <tr>
          <td>{{$t('ContactDetail.Nickname')}}: </td>
          <td><Input v-model="contact.nickname" disabled/></td>
          <td></td>
        </tr> -->
        <tr>
          <td>{{$t("Common.Name")}}: </td>
          <td>
            <Input v-model="contact.firstName" :placeholder="$t('AddContact.PlaceholderFirstName')" style="width: 32%"/>
            <Input v-model="contact.middleName" :placeholder="$t('AddContact.PlaceholderMiddleName')" style="width: 32%"/>
            <Input v-show="!isLanguageCN" v-model="contact.lastName" :placeholder="$t('AddContact.PlaceholderLastName')" style="width: 32%"/>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t('Common.Gender')}}: </td>
          <td>
            <div style="padding: 5px;">
              <RadioGroup v-model="contact.gender">
                <Radio label="1"><span>{{$t('CourseTeachers.Male')}}</span></Radio>
                <Radio label="2"><span>{{$t('CourseTeachers.Female')}}</span></Radio>
                <Radio label="0"><span>{{$t('CourseTeachers.Other')}}</span></Radio>
              </RadioGroup>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t('AddContact.DateOfBirth')}}:</td>
          <td><Input v-model="contact.birthday" type="date" :placeholder="$t('AddContact.PlaceholderDateOfBirth')"/></td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t("Common.Phone")}}: </td>
          <td><Input v-model="contact.phone" :placeholder="$t('AddContact.PlaceholderPhoneNumber')"/></td>
          <td><span style="color:red;padding-left:20px;">{{$t('Common.Required')}}</span></td>
        </tr>
        <tr>
          <td>{{$t("Common.Email")}}: </td>
          <td><Input v-model="contact.email" type="email" :placeholder="$t('AddContact.PlaceholderEmailAddress')"/></td>
          <td></td>
        </tr>
      </table>
    </div>

    <div v-if="isStudent">
      <table class="contact-detail">
        <tr>
          <td>{{$t('Common.Grade')}}:</td>
          <td><Input v-model="contact.grade" :placeholder="$t('AddContact.PlaceholderGrade')"/></td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t('Common.School')}}: </td>
          <td><Input v-model="contact.school" :placeholder="$t('AddContact.PlaceholderSchool')"/></td>
          <td></td>
        </tr>
      </table>
    </div>

    <div v-show="isEmployee">
      <div style="border-top: 1px solid #dddee1; margin: 1em 2em;"></div>

      <table class="contact-detail">
        <tr>
          <td>{{$t('Common.Role')}}: </td>
          <td>
            <Select v-model="contact.role" style="width: 100%">
              <Option v-for="item in employeeRoles" :value="item.id" :key="item.id">{{ item.label }}</Option>
            </Select>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t('AddContact.ContactPrivilege')}}: </td>
          <td>
            <Select v-model="contact.contactPrivilege" style="width: 100%">
              <Option v-for="item in privileges" :value="item.id" :key="item.id">{{ item.label }}</Option>
            </Select>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t('AddContact.CoursePrivilege')}}: </td>
          <td>
            <Select v-model="contact.coursePrivilege" style="width: 100%">
              <Option v-for="item in privileges" :value="item.id" :key="item.id">{{ item.label }}</Option>
            </Select>
          </td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
  .edit-contact-class {
    .contact-detail {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;

      td:first-of-type {
        text-align: right;
        width: 25%;
        padding: 5px 20px;
      }

      td:nth-of-type(2) {
        text-align: left;
        padding: 5px 20px;
      }
      td:last-of-type {
        width: 15%;
      }
    }
  }
</style>

<script>
  import auth from '../../authenticator';

  export default {
    props: {
      contactId: Number,
      schoolId: Number
    },
    data() {
      return {
        initialized: false,
        loading: false,
        contact: {
          id: 0,
          firstName: '',
          middleName: '',
          lastName: '',
          userName: '',
          nickname: '',
          avatar: '',
          phone: '',
          email: '',
          birthday: '',
          gender: '0',
          role: 0,
          coursePrivilege: 0,
          contactPrivilege: 0
        },
        roleId: 0,
        isStudent: false,
        isTeacher: false,
        isParent: false,
        isEmployee: false,
        employeeRoles: [
          {id: auth.SchoolRole.OfficeStaff, label: this.$t('AddContact.OfficeStaff')},
          {id: auth.SchoolRole.OfficeTeacher, label: this.$t('AddContact.Teacher')},
          {id: auth.SchoolRole.Admin, label: this.$t('AddContact.Administrator')},
          {id: auth.SchoolRole.Owner, label: this.$t('AddContact.Owner')},
        ],
        privileges: [
          {id: auth.Privilege.NoAccess, label: this.$t('AddContact.NoAccess')},
          {id: auth.Privilege.View, label: this.$t('AddContact.ViewOnly')},
          {id: auth.Privilege.EditView, label: this.$t('AddContact.EditView')},
          {id: auth.Privilege.CreateEditView, label: this.$t('AddContact.CreateEditView')},
          {id: auth.Privilege.DeleteCreateEditView, label: this.$t('AddContact.DeleteCreateEditView')}
        ],
      };
    },
    computed: {
      isKlassroom() {
        return IsKlassroom();
      },
      isLanguageCN(){
        if(this.$i18n.locale==="cn"){
          return true;
        }
        return false;
      }
    },
    methods: {
      initialize() {
        this.readData();
      },
      refresh() {
        this.readData();
      },
      readData() {
        let self = this;

        let url = GetAPIUrl() + "SchoolContact/Item?schoolID=" + this.schoolId + "&userID=" + this.contactId;
        this._getData(url, null, (data) => {
          self.initializeData(data);
        }, null);
      },
      initializeData(user) {
        this.roleId = user.Role;

        this.isStudent = this.roleId === auth.SchoolRole.Students || this.roleId === auth.SchoolRole.Prospects;
        this.isParent = this.roleId === auth.SchoolRole.Parents;
        this.isTeacher = this.roleId === auth.SchoolRole.IndependentTeachers || this.roleId === auth.SchoolRole.OfficeTeacher;
        this.isEmployee = (this.isKlassroom && this.roleId === auth.SchoolRole.IndependentTeachers) || this.roleId === auth.SchoolRole.OfficeTeacher || this.roleId === auth.SchoolRole.OfficeStaff || this.roleId === auth.SchoolRole.Admin || this.roleId === auth.SchoolRole.Owner;

        this.contact.id =  user.UserID;
        this.contact.userName = user.LoginName;
        this.contact.nickname = user.Nickname;
        this.contact.name = user.UserName;
        this.contact.firstName = user.FirstName;
        this.contact.middleName = user.MiddleName;
        this.contact.lastName = user.LastName;
        this.contact.avatar = user.AvatarUrl;
        this.contact.phone = user.Phone;
        this.contact.email = user.Email;
        this.contact.birthday = user.BirthDate;
        this.contact.gender = user.Gender.toString();
        this.contact.role = user.Role;
        this.contact.contactPrivilege = user.ContactPrivilege;
        this.contact.coursePrivilege = user.CoursePrivilege;
      },
      saveData(successCallback, errorCallback) {
        if (!this.contact.phone) {
          this.$Modal.warning({
            title: this.$t('Common.Warning'),
            content: this.$t('AddContact.AlertPhoneNumberNecessary')
          });

          return;
        }

        let role = this.roleId;
        if (this.isEmployee)
          role = this.contact.role;

        let self = this;
        let url = GetAPIUrl() + "SchoolContact/UpdateContact";
        if(this.isLanguageCN){
          this.contact.lastName=""
        }
        let data = {
          "ContactID": this.contactId,
          "Role": role,
          "School": this.schoolId,

          "FirstName": this.contact.firstName,
          "MiddleName": this.contact.middleName,
          "LastName": this.contact.lastName,
          "Gender": this.contact.gender,
          "BirthDay": this.contact.birthday,
          "Phone": this.contact.phone,
          "Email": this.contact.email,

          "Grade": this.contact.grade,
          "SchoolName": this.contact.school,

          "ContactPrivilege": this.contact.contactPrivilege,
          "CoursePrivilege": this.contact.coursePrivilege,
        };

        this._postData(url, data, null, (result) => {
          if (successCallback && typeof successCallback === 'function')
            successCallback();
        }, (error) => {
          if (errorCallback && typeof errorCallback === 'function')
            errorCallback();
        });
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
              self.loading = false;
              self.$Loading.finish();

              if (success && typeof success === 'function') {
                success(result.RetData);
              }
            }
            else { // error
              self.loading = false;
              self.$Loading.error();
              self.$Message.error(result.ErrorMessage);
              console.log(result);

              if (error && typeof error === 'function') {
                error(result);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);

            if (error && typeof error === 'function') {
              error();
            }
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
              self.loading = false;
              self.$Loading.finish();

              if (success && typeof success === 'function') {
                success(result.RetData);
              }
            }
            else { // error
              self.loading = false;
              self.$Loading.error();
              self.$Message.error(result.ErrorMessage);
              console.log(result);

              if (error && typeof error === 'function') {
                error(result);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);

            if (error && typeof error === 'function') {
              error();
            }
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
              self.loading = false;
              self.$Loading.finish();

              if (success && typeof success === 'function') {
                success(result.RetData);
              }
            }
            else { // error
              self.loading = false;
              self.$Loading.error();
              self.$Message.error(result.ErrorMessage);
              console.log(result);

              if (error && typeof error === 'function') {
                error(result);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
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
