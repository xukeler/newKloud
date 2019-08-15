<template>
  <div class="add-contact">
    <Button v-if="isKlassroom" type="primary" size="large" shape="circle" icon="plus-round" @click="handleNewContact">{{typeText}}</Button>
    <Button v-else type="text" size="large" shape="circle" icon="plus-round" @click="handleNewContact">{{typeText}}</Button>

    <div>
      <Modal v-model="modalNewContact" :mask-closable="false" :title="modalNewContactTitle" :width="600">
        <div v-show="step === 1" class="add-contact">
          <RadioGroup v-model="wayToAdd">
            <p class="way-to-add"><Radio :label="0" size='large'>{{$t('AddContact.SearchContact')}}</Radio></p>
            <p class="way-to-add"><Radio :label="1" size='large'>{{$t('AddContact.FindList')}}</Radio></p>
            <p class="way-to-add"><Radio :label="2" size='large'>{{$t('AddContact.AddNewOne')}}</Radio></p>
          </RadioGroup>
        </div>

        <div v-show="step === 2 && wayToAdd == 0" class="add-contact">
          <Input v-model="searchKey" icon="ios-search" :placeholder="$t('AddContact.PlaceholderEnterPhoneNumberOrName')" @on-enter="handleSearch" @on-click="handleSearch"/>
          <div style="height:1em;"></div>
          <Table ref="search" size="small" :no-data-text="$t('AddContact.NoContractFound')" :stripe="true" :highlight-row="true"
                :data="searchData" :columns="searchColumn" :loading="loading" height="400">
          </Table>
        </div>

        <div v-show="step === 2 && wayToAdd == 1" class="add-contact">
          <Input v-model="searchFriendKey" icon="ios-search" :placeholder="$t('AddContact.PlaceholderEnterPhoneNumberOrName')" @on-enter="searchMyFriend" @on-click="searchMyFriend"/>
          <div style="height:1em;"></div>
          <Table ref="friends" size="small" :no-data-text="$t('AddContact.NoFriends')" :stripe="true" :highlight-row="true"
                :data="friendsData" :columns="friendsColumn" :loading="loading" height="400">
          </Table>
        </div>

        <div v-show="step === 2 && wayToAdd == 2" class="add-contact">
          <div>
            <table class="contact-detail">
              <tr>
                <td>{{$t('Common.Name')}}: </td>
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
                <td>{{$t('Common.Phone')}}: </td>
                <td><Input v-model="contact.phone" :placeholder="$t('AddContact.PlaceholderPhoneNumber')"/></td>
                <td><span style="color:red;padding-left:20px;">{{$t('Common.Required')}}</span></td>
              </tr>
              <tr>
                <td>{{$t('Common.Email')}}: </td>
                <td><Input v-model="contact.email" type="email" :placeholder="$t('AddContact.PlaceholderEmailAddress')"/></td>
                <td></td>
              </tr>
            </table>
          </div>

          <div v-if="isStudent">
            <table class="contact-detail">
              <tr>
                <td>{{$t('Common.Grade')}}:</td>
                <td><Input v-model="student.grade" :placeholder="$t('AddContact.PlaceholderGrade')"/></td>
                <td></td>
              </tr>
              <tr>
                <td>{{$t('Common.School')}}: </td>
                <td><Input v-model="student.school" :placeholder="$t('AddContact.PlaceholderSchool')"/></td>
                <td></td>
              </tr>
            </table>
          </div>

          <div v-if="isStudent">
            <div class="separate-line"></div>

            <table class="contact-detail">
              <tr>
                <td>{{$t('AddContact.OptionalParent')}}: </td>
                <td>
                  <Input v-model="parent.firstName" :placeholder="$t('AddContact.PlaceholderFirstName')" style="width: 32%"/>
                  <Input v-model="parent.middleName" :placeholder="$t('AddContact.PlaceholderMiddleName')" style="width: 32%"/>
                  <Input v-show="!isLanguageCN" v-model="parent.lastName" :placeholder="$t('AddContact.PlaceholderLastName')" style="width: 32%"/>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>{{$t('Common.Phone')}}: </td>
                <td><Input v-model="parent.phone" :placeholder="$t('AddContact.PlaceholderPhoneNumber')"/></td>
                <td></td>
              </tr>
              <tr>
                <td>{{$t('Common.Email')}}: </td>
                <td><Input v-model="parent.email" :placeholder="$t('AddContact.PlaceholderEmailAddress')"/></td>
                <td></td>
              </tr>
              <tr>
                <td>{{$t('AddContact.Relationship')}}: </td>
                <td>
                  <Select v-model="parent.relationship" style="width: 100%">
                    <Option v-for="item in relationshipList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                  </Select>
                </td>
                <td></td>
              </tr>
            </table>
          </div>

          <div v-if="isParent">
            <div class="separate-line"></div>

            <table class="contact-detail">
              <tr>
                <td>{{$t('Common.Student')}}: </td>
                <td>
                  <Select v-model="student.id" clearable filterable remote :remote-method="handleLoadStudents" @on-change="handleChangeStudent" :loading="loading"
                          :placeholder="$t('AddContact.PlaceholderFindStudent')" style="width: 100%">
                    <Option :value='-1'>{{$t('AddContact.CreateNewOne')}}</Option>
                    <Option v-for="item in studentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>{{$t('AddContact.Relationship')}}: </td>
                <td>
                  <Select v-model="student.relationship" style="width: 100%">
                    <Option v-for="item in relationshipList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                  </Select>
                </td>
                <td></td>
              </tr>
            </table>
          </div>

          <div v-if="isEmployee">
            <div class="separate-line"></div>

            <table class="contact-detail">
              <tr>
                <td>{{$t('Common.Role')}}: </td>
                <td>
                  <Select v-model="employee.role" style="width: 100%">
                    <Option v-for="item in employeeRoleList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                  </Select>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>{{$t('AddContact.ContactPrivilege')}}: </td>
                <td>
                  <Select v-model="employee.contactPrivilege" style="width: 100%">
                    <Option v-for="item in privilegeList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                  </Select>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>{{$t('AddContact.CoursePrivilege')}}: </td>
                <td>
                  <Select v-model="employee.coursePrivilege" style="width: 100%">
                    <Option v-for="item in privilegeList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                  </Select>
                </td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>

        <div slot="footer">
          <Button v-show="step === 1" @click="handleNewContactNext">{{$t('Common.Next')}}</Button>
          <Button v-show="step === 2" @click="step = 1">{{$t('Common.Back')}}</Button>
          <Button v-show="step === 2" type="primary" :loading="loading" @click="handleNewContactOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleNewContactCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
      <Modal v-model="modalApplyNewSchool" :mask-closable="false" :title="$t('AddContact.SchoolOrBusinessApplicationForm')">
          <div class="apply-school-part">
            <school-info-block :school="applySchool" :is-creating="true"></school-info-block>
          </div>

          <div slot="footer">
            <Button type="primary" :loading="loading" @click="handleNewApplySchoolOK">{{$t('Common.Apply')}}</Button>
            <Button @click="handleApplySchoolCancel">{{$t('Base.Cancel')}}</Button>
          </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
.add-contact {
  .ivu-input-icon{
    cursor: pointer;
  }
  .way-to-add {
    padding: .5em 1em;
  }

  .ivu-select-dropdown {
    max-height: 400px;
  }

  .contact-detail {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    td:first-of-type {
      text-align: right;
      width: 25%;
    }

    td:nth-of-type(2) {
      padding: 5px 20px;
      text-align: left;
    }
    td:last-of-type {
      width: 15%;
    }
  }

  .separate-line {
    border-top: 1px solid #dddee1;
    margin: 1em 3em;
  }

  .ivu-table th {
    background-color: #495060;
    color: white;
  }

  .ivu-table-row-highlight td {
    background-color: #dddee1;
  }
}
</style>

<script>
  import auth from '../../authenticator';
  import friends from '../../friends';
  import SchoolInfoBlock from '../profile/SchoolInfoBlock';
  let base64= require("js-base64").Base64;

  export default {
    props: {
      type: String,
      onContactAdded: Function,
      schoolId: Number,
      isKlassroom: {
        type: Boolean,
        default: false
      },
      folderId: {
        type: Number,
        default: -1
      },
    },
    components: { SchoolInfoBlock },
    inject:['reloadHeader'],
    data() {
      return {
        schoolList: [],//[{id:1, name: 'My school (me as an independent tutor)'}, {id:3134, name: '131 Sample School'}],
        modalApplyNewSchool:false,
        applySchool: {
          type0: 0,
          type1: 0,
          name: auth.getUserName() + "'s School",
          owner: parseInt(auth.getUserID()),
          admin: parseInt(auth.getUserID())
        },
        modalApplyNewSchool:false,
        //上面是add New school参数
        loading: false,
        isTutoring: true,
        modalNewContact: false,
        step: 1,
        wayToAdd: 0,
        searchKey: '',
        searchFriendKey:'',
        searchData: [],
        searchColumn: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: ' ',
            key: 'avatar',
            sortable: false,
            width: 80,
            render: (h, params) => {
              return h('Avatar', {
                props: {
                  size: 'large',
                  src: params.row.avatar
                }
              });
            }
          },
          {
            title: this.$t("Common.Name"),
            key: 'name',
            sortable: true,
          },
          {
            title: this.$t("Common.Phone"),
            key: 'phone',
            sortable: false
          }
        ],
        friendsData: [],
        friendsColumn: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: ' ',
            key: 'avatar',
            sortable: false,
            width: 80,
            render: (h, params) => {
              return h('Avatar', {
                props: {
                  size: 'large',
                  src: params.row.avatar
                }
              });
            }
          },
          {
            title: this.$t("Common.Name"),
            key: 'name',
            sortable: true,
          },
          {
            title: this.$t("Common.Phone"),
            key: 'phone',
            sortable: false
          }
        ],
        contact: {
          firstName: '',
          middleName: '',
          lastName: '',
          gender: '0',
          birthday: '',
          phone: '',
          email: '',
        },
        student: {
          grade: '',
          school: '',
          id: null,
          relationship: 0
        },
        parent: {
          firstName: '',
          middleName: '',
          lastName: '',
          phone: '',
          email: '',
          relationship: 0
        },
        employee: {
          role: 6,
          contactPrivilege: 0,
          coursePrivilege: 0,
        },
        parentNewChild: false,
        studentList: [],
        studentListTimeout: 0,
        relationshipList: [
          {id: 1, label: this.$t('AddContact.Father')},
          {id: 2, label: this.$t('AddContact.Mother')},
          {id: 3, label: this.$t('AddContact.Grandfather')},
          {id: 4, label: this.$t('AddContact.Grandmother')},
          {id: 5, label: this.$t('AddContact.Uncle')},
          {id: 6, label: this.$t('AddContact.Aunt')},
          {id: 7, label: this.$t('AddContact.Sister')},
          {id: 8, label: this.$t('AddContact.Brother')},
          {id: 0, label: this.$t('AddContact.Other')}
        ],
        employeeRoleList: [
          {id: auth.SchoolRole.OfficeStaff, label: this.$t('AddContact.OfficeStaff')},
          {id: auth.SchoolRole.OfficeTeacher, label: this.$t('AddContact.Teacher')},
          {id: auth.SchoolRole.Admin, label: this.$t('AddContact.Administrator')},
          {id: auth.SchoolRole.Owner, label: this.$t('AddContact.Owner')},
        ],
        privilegeList: [
          {id: auth.Privilege.NoAccess, label: this.$t('AddContact.NoAccess')},
          {id: auth.Privilege.View, label: this.$t('AddContact.ViewOnly')},
          {id: auth.Privilege.EditView, label: this.$t('AddContact.EditView')},
          {id: auth.Privilege.CreateEditView, label: this.$t('AddContact.CreateEditView')},
          {id: auth.Privilege.DeleteCreateEditView, label: this.$t('AddContact.DeleteCreateEditView')}
        ]
      };
    },
    computed: {
      isStudent() {
        return this.type === 'student' || this.parentNewChild;
      },
      isTeacher() {
        return !this.isKlassroom && this.type === 'teacher';
      },
      isParent() {
        return this.type === 'parent' && !this.parentNewChild;
      },
      isEmployee() {
        return this.type === 'employee' || (this.type === 'teacher' && this.isKlassroom);
      },
      isSchoolProfile() {
        return this.type === 'profile';
      },
      typeText() {
        switch (this.type) {
          case 'prospect':
            return this.$t("AddContact.AddNewProspect");

          case 'student':
            return this.$t("AddContact.AddNewStudent");

          case 'teacher':
            return this.$t("AddContact.AddNewTeacher");

          case 'parent':
            return this.$t("AddContact.AddNewParent");

          case 'employee':
            return this.$t("AddContact.AddNewFaculty");

          case 'class':
            return 'Add New Class';
          case 'profile':
             return this.$t("AddContact.AddNewSchool");
          default:
            return this.$t("AddContact.AddNewContact");
        }
      },
      modalNewContactTitle() {
        switch (this.type) {
          case 'prospect':
            return this.$t("AddContact.NewProspectTitle");

          case 'student':
            return this.$t("AddContact.NewStudentTitle");

          case 'teacher':
            return this.$t("AddContact.NewTeacherTitle");

          case 'parent':
            return this.$t("AddContact.NewParentTitle");

          case 'employee':
            return this.$t("AddContact.FacultyTitle");

          case 'class':
            return 'New Class';

          default:
            return this.$t("AddContact.NewContactTitle");
        }
      },
      roleId() {
        switch (this.type) {
          case 'prospect':
            return auth.SchoolRole.Prospects;

          case 'student':
            return auth.SchoolRole.Students;

          case 'teacher':
            return auth.SchoolRole.IndependentTeachers;

          case 'parent':
            return auth.SchoolRole.Parents;

          case 'employee':
            return auth.SchoolRole.OfficeStaff;

          default:
            return 0
        }
      },
      isLanguageCN(){
        if(this.$i18n.locale==="cn"){
          return true;
        }
        return false;
      }
    },
    mounted: function () {
      this.initialize();
    },
    methods: {
      initialize() {
        let self = this;
        let url = GetAPIUrl() + "School/UserSchoolList?userID=" + auth.getUserID();

        this._getData(url, null, (data) => {
          let list = [];
          for (let i = 0; i < data.length; i++) {
            let item = data[i];

            let school = {
              id: item.SchoolID,
              name: item.SchoolName,
              type1: item.Category1,
              type2: item.Category2,
              role: item.Role,
              contactPrivilege: item.ContactPrivilege,
              coursePrivilege: item.CoursePrivilege,
              isMine: false,
            }

            if (school.id == auth.getCustomerID()) {
              school.name = self.$t('SchoolInfoSchoolProfile.MySchoolIndependentTutor');
              school.isMine = true;
              list.splice(0, 0, school);
            }
            else {
              list.push(school);
            }
          }
          self.schoolList = list;
        }, null);
      },
      showMessage(info){
          this.$Message.info({
                content:info,
                duration: 5
            });
      },
      handleNewApplySchoolOK(){ 
        if (this.applySchool.type1 === '')
          this.applySchool.type1 = 0;
        if(this.applySchool.name==""){
            this.showMessage(this.$t('AddContact.AlertTheNameNotEmpty'));
            return;
        }  
        let self = this;

        let url = GetAPIUrl() + "School/CreateSchool";
        let schoolUnion=this.schoolList;
        for(let i=0;i<schoolUnion.length;i++){
          if(this.applySchool.name===schoolUnion[i].name){
            this.showMessage(this.$t('AddContact.AlertTheNameExistsAddAgain'));
            return;
          }
        }
        let data = {
          "SchoolName": this.applySchool.name,
          "Category1": this.applySchool.type0,
          "Category2": this.applySchool.type1,
          "OwnerID": this.applySchool.owner,
          "AdminID": this.applySchool.admin
        };
        this._postData(url, data, null, (result) => {
          self.modalApplyNewSchool = false;
          this.reloadHeader();
        }, null);        
      },
      handleApplySchoolCancel(){
        this.modalApplyNewSchool=false;
      },
      //上面是add New school方法
      clearData() {
        this.step = 1;

        this.searchKey = '';
        this.searchFriendKey='';
        this.searchData = [];

        this.friendsData = [];

        this.contact.firstName = '';
        this.contact.middleName = '';
        this.contact.lastName = '';
        this.contact.gender = '0';
        this.contact.birthday = '';
        this.contact.phone = '';
        this.contact.email = '';

        this.student.grade = '';
        this.student.school = '';
        this.student.id = null;
        this.student.relationship = 0;

        this.parent.firstName = '';
        this.parent.middleName = '';
        this.parent.lastName = '';
        this.parent.phone = '';
        this.parent.email = '';
        this.parent.relationship = 0;

        this.employee.role = 6;
        this.employee.contactPrivilege = 0;
        this.employee.coursePrivilege = 0;

        this.parentNewChild = false;
      },
      handleNewContact() {
        this.clearData();
        if (this.isSchoolProfile==true) {
          this.modalNewContact = false;
          this.modalApplyNewSchool=true;
        }else{
          this.modalNewContact = true;
          this.modalApplyNewSchool=false;
        }
      },
      handleNewContactNext() {
        this.step = 2;
        let self = this;

        if (this.wayToAdd == 1) {
          friends.getFriends(function (users) {
            self.friendsData = self.initializeUsers2(users);
          });
        }
      },
      searchMyFriend(){
        let self = this;
        if (!this.searchFriendKey) {
          friends.getFriends(function (users) {
            self.friendsData = self.initializeUsers2(users);
          });
          return;
        }
        let url = GetAPIUrl() + "Friend/SearchMyFriends?searchText=" + encodeURIComponent(base64encode(utf16to8(trimStr(this.searchFriendKey))));
        this._getData(url, null, (data) => {
          self.friendsData = self.initializeUsers2(data);
        }, null);
      },
      handleSearch() {
        if (!this.searchKey) {
          this.searchData = [];
          return;
        }

        let self = this;
        let url = GetAPIUrl() + "User/SearchContact?searchText=" + encodeURIComponent(base64encode(utf16to8(trimStr(this.searchKey))));
        this._getData(url, null, (data) => {
          self.searchData = self.initializeUsers2(data);
        }, null);
      },
      initializeUsers1(data) {
        let list = [];
        for (let i = 0, count = data.length; i < count; i++) {
          let user = data[i];
          let item = {
            id: user.UserID,
            avatar: user.AvatarUrl,
            name: user.UserName,
            gender: user.Sex === 2 ?  this.$t('CourseTeachers.Female') : this.$t('CourseTeachers.Male'),
            phone: user.Phone,
            email: user.Email,
            detail: user
          };

          list.push(item);
        }
        return list;
      },
      initializeUsers2(data) {
        let list = [];
        for (let i = 0, count = data.length; i < count; i++) {
          let user = data[i];
          let item = {
            id: user.UserID,
            avatar: user.AvatarUrl?user.AvatarUrl:"../../../static/images/user.svg",
            name: user.Name?user.Name:user.UserName,
            gender: user.Sex === 2 ? this.$t('CourseTeachers.Female') : this.$t('CourseTeachers.Male'),
            phone: user.Phone,
            email: user.Email,
            detail: user
          };

          list.push(item);
        }
        return list;
      },
      handleNewContactOK() {
        let self = this;

        if (this.wayToAdd == 0) { // Search
          let selected = this.$refs.search.getSelection();
          let count = selected.length;

          for (let i = 0; i < selected.length; i++) {
            this.handleNewContactAdd(selected[i], () => {
              count--;
              if (count <= 0) {
                if (self.onContactAdded && typeof self.onContactAdded === 'function') {
                  self.onContactAdded(self.type);
                }
                self.modalNewContact = false;
              }
            });
          }
        }
        else if (this.wayToAdd == 1) { // Friend
          let selected = this.$refs.friends.getSelection();
          let count = selected.length;

          for (let i = 0; i < selected.length; i++) {
            this.handleNewContactAdd(selected[i], () => {
              count--;
              if (count <= 0) {
                if (self.onContactAdded && typeof self.onContactAdded === 'function') {
                  self.onContactAdded(self.type);
                }
                self.modalNewContact = false;
              }
            });
          }
        }
        else if (this.wayToAdd == 2) { // Add
          this.handleNewContactCreate();
        }
      },
      handleNewContactAdd(user, callback) {
        let self = this;
        let url = GetAPIUrl() + "SchoolContact/AddContact?schoolID=" + this.schoolId + "&roleID=" + this.roleId + "&userID=" + user.id + "&folderID=" + this.folderId;
        let data = {};

        this._postData(url, data, null, (result) => {
          if (result != this.roleId) {
            self.$Message.warning({content:user.name + this.$t('AddContact.AlertAlreadyMemberOfSchool') + auth.getSchoolRoleName(result),duration:3});
          }

          if (callback && typeof callback === 'function') {            
            callback();            
          }
        }, null);        
      },
      handleNewContactCreate() {
        if (!this.contact.phone) {
          this.$Modal.warning({
            title: this.$t('Common.Warning'),
            content: this.$t('AddContact.AlertPhoneNumberNecessary')
          });

          return;
        }

        let role = this.roleId;
        if (this.type === 'employee')
          role = this.employee.role;

        let self = this;
        let url = GetAPIUrl() + "SchoolContact/CreateContact";
        if(this.isLanguageCN){
          this.contact.lastName=""
        }
        let data = {
          "Role": role,
          "School": this.schoolId,
          "Folder": this.folderId,

          "FirstName": this.contact.firstName,
          "MiddleName": this.contact.middleName,
          "LastName": this.contact.lastName,
          "Gender": this.contact.gender,
          "BirthDay": this.contact.birthday,
          "Phone": this.contact.phone,
          "Email": this.contact.email,

          "Grade": this.student.grade,
          "SchoolName": this.student.school,

          "ParentFirstName": this.parent.firstName,
          "ParentMiddleName": this.parent.middleName,
          "ParentLastName": this.parent.lastName,
          "ParentPhone": this.parent.phone,
          "ParentEmail": this.parent.email,

          "StudentID": this.student.id === null ? 0 : parseInt(this.student.id),
          "Relationship": this.student.relationship,

          "ContactPrivilege": this.employee.contactPrivilege,
          "CoursePrivilege": this.employee.coursePrivilege,
        };

        this._postData(url, data, null, (result) => {
          if (self.onContactAdded && typeof self.onContactAdded === 'function') {
            self.onContactAdded(self.type);
          }

          this.modalNewContact = false;
        }, null);
      },
      handleNewContactCancel() {
        this.modalNewContact = false;
      },
      handleLoadStudents(query) {
        if (this.studentListTimeout) {
          clearTimeout(this.studentListTimeout);
          this.studentListTimeout = 0;
        }

        if (query === null || query === '') {
          this.studentList = [];
        }
        else {
          let self = this;

          this.studentListTimeout = setTimeout(() => {
            let url = GetAPIUrl() + "SchoolContact/SearchContact?schoolID=" + this.schoolId + '&roleID=' + auth.SchoolRole.Students + '&keyword=' + query;
            this._getData(url, null, function (list) {
              let users = [];
              for (let i = 0; i < list.length; i++) {
                let item = list[i];
                let user = {
                  id: item.UserID,
                  avatar: item.AvatarUrl,
                  name: item.UserName,
                  phone: item.Phone,
                  role: item.Role,
                  detail: item
                };
                users.push(user);
              }

              self.studentList = users;
            });
          }, 500);
        }
      },
      handleChangeStudent(current) {
        if (this.student.id === -1) {
          let info = JSON.stringify(this.contact);
          let relationship = this.student.relationship;

          this.$emit("seleted-stu",'student');

          this.clearData();

          let parent = JSON.parse(info);

          this.parent.firstName = parent.firstName;
          this.parent.middleName = parent.middleName;
          this.parent.lastName = parent.lastName;
          this.parent.phone = parent.phone;
          this.parent.email = parent.email;
          this.parent.relationship = relationship;

          this.parentNewChild = true;
        }
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
    }
  }
</script>
