<template>
  <div class="contact-detail">
    <div class="avatar-name">
      <Avatar size="large" :src="contact.avatar"></Avatar>
      <span style="margin-left: 1em; color: black;">{{contact.name}}</span>
    </div>

    <div class="info-block base-contact">
      <!-- Base information part -->
      <div class="block-header">{{$t('ContactDetail.ContactInformation')}} <div class="block-action"><span v-if="canEdit" @click="handleEditContact"><Icon type="edit" size="16" color="#1c2438" :title="$t('Common.Edit')"></Icon></span></div></div>
      <div class="info-item"><label class="info-label">{{$t('ContactDetail.UserID')}}:</label><span class="info-data">{{contact.userName}}</span></div>
      <!-- <div class="info-item"><label class="info-label">{{$t('ContactDetail.Nickname')}}:</label><span class="info-data">{{contact.nickname}}</span></div> -->
      <div class="info-item"><label class="info-label">{{$t("Common.Phone")}}:</label><span class="info-data">{{contact.phone}}</span></div>
      <div class="info-item"><label class="info-label">{{$t("Common.Email")}}:</label><span class="info-data">{{contact.email}}</span></div>
      <div class="info-item"><label class="info-label">{{$t('AddContact.DateOfBirth')}}:</label><span class="info-data">{{contact.birthday}}</span></div>
      <div class="info-item"><label class="info-label">{{$t('Common.Gender')}}:</label><span class="info-data">{{contact.gender}}</span></div>
      <div v-show="isStudent">
        <div class="info-item"><label class="info-label">{{$t('Common.Grade')}}:</label><span class="info-data">{{contact.grade}}</span></div>
        <div class="info-item"><label class="info-label">{{$t('Common.School')}}:</label><span class="info-data">{{contact.school}}</span></div>
      </div>
      <div v-show="isEmployee">
        <div class="info-item"><label class="info-label">{{$t('Common.Role')}}:</label><span class="info-data">{{contact.roleLabel}}</span></div>
        <div class="info-item"><label class="info-label">{{$t('AddContact.ContactPrivilege')}}:</label><span class="info-data">{{contact.contactPrivilege}}</span></div>
        <div class="info-item"><label class="info-label">{{$t('AddContact.CoursePrivilege')}}:</label><span class="info-data">{{contact.coursePrivilege}}</span></div>
      </div>
    </div>

    <div class="info-block employee-contact" v-show="!isEmployee">
      <!-- Employee contact part -->
      <div class="block-header">{{$t('ContactDetail.EmployeeInformation')}} <div class="block-action"><span v-if="canEdit" @click="handleLinkEmployee"><Icon type="edit" size="16" color="#1c2438" :title="$t('Common.Edit')"></Icon></span></div></div>
      <div v-for="employee in employees" :key="employee.id" class="employee-block">
        <div class="info-item"><label class="info-label">{{$t("Common.Name")}}:</label><span class="info-data">{{employee.name}}</span></div>
        <div class="info-item"><label class="info-label">{{$t("Common.Phone")}}:</label><span class="info-data">{{employee.phone}}</span></div>
        <div class="info-item"><label class="info-label">{{$t("Common.Email")}}:</label><span class="info-data">{{employee.email}}</span></div>
      </div>
    </div>

    <div class="info-block related-parent" v-show="isStudent">
      <!-- for students: parents -->
      <div class="block-header">{{$t('ContactDetail.Parents')}} <div class="block-action"><span v-if="canEdit" @click="handleLinkParents"><Icon type="edit" size="16" color="#1c2438" :title="$t('Common.Edit')"></Icon></span></div></div>
      <div v-for="parent in parents" :key="parent.id" class="parent-block">
        <div class="info-item"><label class="info-label">{{$t("Common.Name")}}:</label><span class="info-data">{{parent.name}} ({{parent.relationship}})</span></div>
        <div class="info-item"><label class="info-label">{{$t("Common.Phone")}}:</label><span class="info-data">{{parent.phone}}</span></div>
        <div class="info-item"><label class="info-label">{{$t("Common.Email")}}:</label><span class="info-data">{{parent.email}}</span></div>
      </div>
    </div>

    <div class="info-block related-student" v-show="isParent">
      <!-- for parents: students -->
      <div class="block-header">{{$t('ContactDetail.StudentsOrRelationship')}} <div class="block-action"><span v-if="canEdit" @click="handleLinkChildren"><Icon type="edit" size="16" color="#1c2438" :title="$t('Common.Edit')"></Icon></span></div></div>
      <table>
        <tr v-for="child in children" :key="child.id">
          <td>{{child.name}}</td>
          <td style="padding-left: 1em; color: #80848f">{{child.relationship}}</td>
        </tr>
      </table>
    </div>

    <div>
      <Modal v-model="modalEditContact" :mask-closable="false" :title="$t('ContactDetail.ContactInformation')" :width="600">
        <edit-contact ref="editContact" :contactId="contactId" :school-id="schoolId"></edit-contact>

        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleEditContactOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleEditContactCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalLinkEmployee" :mask-closable="false" :title="$t('ContactDetail.LinkEmployeeInformation')" :width="600">
        <link-employee ref="linkEmployee" :contactId="contactId" :school-id="schoolId"></link-employee>

        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleLinkEmployeeOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleLinkEmployeeCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalLinkParent" :mask-closable="false" :title="$t('ContactDetail.LinkParentsInformation')" :width="600" @on-visible-change="handleLinkParentClose">
        <link-parents ref="linkParents" :contactId="contactId" :school-id="schoolId"></link-parents>

        <div slot="footer">
          <!--<Button type="primary" :loading="loading" @click="handleLinkParentsOK">OK</Button>
          <Button @click="handleLinkParentsCancel">Cancel</Button>-->
        </div>
      </Modal>

      <Modal v-model="modalLinkChildren" :mask-closable="false" :title="$t('ContactDetail.LinkChildrenInformation')" :width="600" @on-visible-change="handleLinkChildrenClose">
        <link-children ref="linkChildren" :contactId="contactId" :school-id="schoolId"></link-children>

        <div slot="footer">
          <!--<Button type="primary" :loading="loading" @click="handleLinkChildrenOK">OK</Button>
          <Button @click="handleLinkChildrenCancel">Cancel</Button>-->
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
  .contact-detail {
    text-align: left;
    //padding: 24px;
    position: relative;

    .avatar-name {
      font-size: 16px;
    }

    .info-block {
      margin-top: 12px;

      .block-header {
        font-weight: bold;
        padding-bottom: 4px;
      }

      .block-action {
        display: inline-block;
        margin-left: 2em;
        cursor: pointer;
      }

      .info-item {
        line-height: 1.8em;

        .info-label {
          padding-right: 1em;
        }

        .info-data {
          color: #2b85e4;
        }
      }

      .employee-block, .parent-block {
        border-bottom: 1px solid #dddee1;
        padding: 4px 0;
      }
      .employee-block:last-of-type, .parent-block:last-of-type {
        padding-bottom: 0;
        border-bottom-width: 0;
      }

      .teacher-course-block {
        border-bottom: 1px solid #dddee1;
        padding: 4px 0;
      }
      .teacher-course-block:last-of-type {
        border-bottom-width: 0;
      }
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import EditContact from './EditContact';
  import LinkEmployee from './LinkEmployee';
  import LinkParents from './LinkParents';
  import LinkChildren from './LinkChildren';

  export default {
    components: {
      EditContact,
      LinkEmployee,
      LinkParents,
      LinkChildren
    },
    props: {
      onDetailChanged: Function,
      schoolId: Number
    },
    data () {
      return {
        loading: false,
        canEdit: true,//auth.canEditContact(),
        contactId: 0,
        isStudent: false,
        isTeacher: false,
        isParent: false,
        isEmployee: false,
        contact: {
          id: 0,
          userName: '',
          nickname: '',
          name: '',
          avatar: '',
          phone: '',
          email: '',
          birthday: '',
          grade: '',
          school: '',
          gender: '',
          role: 0,
          roleLabel: '',
          contactPrivilege: '',
          coursePrivilege: ''
        },
        employees: [],
        parents: [],
        children: [],
        modalEditContact: false,
        modalLinkEmployee: false,
        modalLinkParent: false,
        modalLinkChildren: false,
      };
    },
    methods: {
      initialize(id) {
        this.readData(id);
      },
      refresh() {
        this.readData(this.contactId);
      },
      readData(id) {
        let self = this;
        this.contactId = id;

        let url = GetAPIUrl() + "SchoolContact/FullInfo?schoolID=" + this.schoolId + "&userID=" + id;
        this._getData(url, null, (data) => {
          self.initializeData(data);
        }, null);
      },
      initializeData(user) {
        let type = user.Role;

        this.isStudent = type === auth.SchoolRole.Students || type === auth.SchoolRole.Prospects;
        this.isParent = type === auth.SchoolRole.Parents;
        this.isTeacher = type === auth.SchoolRole.IndependentTeachers || type === auth.SchoolRole.OfficeTeacher;
        this.isEmployee = type === auth.SchoolRole.OfficeTeacher || type === auth.SchoolRole.OfficeStaff || type === auth.SchoolRole.Admin || type === auth.SchoolRole.Owner;

        this.contact.id =  user.UserID;
        this.contact.userName = user.LoginName;
        this.contact.nickname = user.Nickname;
        this.contact.name = user.UserName;
        this.contact.avatar = user.AvatarUrl?user.AvatarUrl:"../../../static/images/user.svg";
        this.contact.phone = user.Phone;
        this.contact.email = user.Email;
        this.contact.birthday = user.BirthDate;
        this.contact.grade = user.Grade;
        this.contact.school = user.SchoolName;
        this.contact.gender = this._genderLabel(user.Gender);
        this.contact.role = user.Role;
        this.contact.roleLabel = auth.getSchoolRoleName(user.Role);
        this.contact.contactPrivilege = auth.getPrivilegeName(user.ContactPrivilege);
        this.contact.coursePrivilege = auth.getPrivilegeName(user.CoursePrivilege);

        let employees = [];
        for (let i = 0; i < user.Employees.length; i++) {
          let item = {
            id: user.Employees[i].UserID,
            name: user.Employees[i].UserName,
            phone: user.Employees[i].Phone,
            email: user.Employees[i].Email,
          };
          employees.push(item);
        }
        this.employees = employees;

        let parents = [];
        for (let i = 0; i < user.Parents.length; i++) {
          let item = {
            id: user.Parents[i].UserID,
            name: user.Parents[i].UserName,
            phone: user.Parents[i].Phone,
            email: user.Parents[i].Email,
            relationship: user.Parents[i].RelationshipLabel,
          };
          parents.push(item);
        }
        this.parents = parents;

        let children = [];
        for (let i = 0; i < user.Children.length; i++) {
          let item = {
            id: user.Children[i].UserID,
            name: user.Children[i].UserName,
            phone: user.Children[i].Phone,
            email: user.Children[i].Email,
            relationship: user.Children[i].RelationshipLabel,
          };
          children.push(item);
        }
        this.children = children;
      },
      _genderLabel(gender) {
        switch (gender) {
          case 1:
            return this.$t('CourseTeachers.Male');
          case 2:
            return this.$t('CourseTeachers.Female');
          default:
            return this.$t('CourseTeachers.Other');
        }
      },
      handleEditContact() {
        this.$refs.editContact.initialize();
        this.modalEditContact = true;
      },
      handleEditContactOK() {
        this.loading = true;
        this.$refs.editContact.saveData(() => {
          this.loading = false;
          this.modalEditContact = false;
          this.refresh();
          if (this.onDetailChanged) {
            this.onDetailChanged(this.contactId);
          }
        }, () => {
          this.loading = false;
        });
      },
      handleEditContactCancel() {
        this.modalEditContact = false;
      },
      handleLinkEmployee() {
        this.$refs.linkEmployee.initialize();
        this.modalLinkEmployee = true;
      },
      handleLinkEmployeeOK() {
        this.loading = true;
        this.$refs.linkEmployee.saveData(() => {
          this.loading = false;
          this.modalLinkEmployee = false;
          this.refresh();
        }, () => {
          this.loading = false;
        });
      },
      handleLinkEmployeeCancel() {
        this.modalLinkEmployee = false;
      },
      handleLinkParents() {
        this.$refs.linkParents.initialize();
        this.modalLinkParent = true;
      },
      handleLinkParentClose(show) {
        if (show)
          return;

        this.refresh();
      },
      handleLinkParentsOK() {
        this.loading = true;
        this.$refs.linkParents.saveData(() => {
          this.loading = false;
          this.modalLinkParent = false;
          this.refresh();
        }, () => {
          this.loading = false;
        });
      },
      handleLinkParentsCancel() {
        this.modalLinkParent = false;
      },
      handleLinkChildren() {
        this.$refs.linkChildren.initialize();
        this.modalLinkChildren = true;
      },
      handleLinkChildrenClose(show) {
        if (show)
          return;

        this.refresh();
      },
      handleLinkChildrenOK() {
        this.loading = true;
        this.$refs.linkChildren.saveData(() => {
          this.loading = false;
          this.modalLinkChildren = false;
          this.refresh();
        }, () => {
          this.loading = false;
        });
      },
      handleLinkChildrenCancel() {
        this.modalLinkChildren = false;
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
    }
  }
</script>
