<template>
  <div class="course-students">
    <div class="header-part">
      <span class="header-label">{{$t('CourseStudents.Students')}}</span>
      <Button type="text" size="large" icon="plus-round" @click="handleInvite">{{$t('CourseTeachers.Invite')}}</Button>
    </div>

    <div class="context-part">
      <Table :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
             :data="studentTableData" :columns="studentTableColumn">
      </Table>
    </div>

    <div class="footer-part" v-if="studentTableData.length>=1">
      <Button type="text" size="large" @click="handleShowAll">{{buttonLabelShowAll}}</Button>
      <span class="total-label"> 1 - {{ studentTableData.length }} {{$t('CourseTeachers.Of')}} {{ allStudents.length }} </span>
    </div>
    
    <div>
      <Modal v-model="modalInvite" :mask-closable="false" :title="$t('CourseStudents.InviteStudents')" :width="600">
        <Table ref="selection" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
               :data="inviteTableData" :columns="inviteTableColumn" @on-selection-change="selectStudents" :height="600">
        </Table>
        <div slot="footer" style="display:none"></div>
        <div slot="close">
          <Button type="primary" :loading="loading" @click="handleInviteOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleInviteCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
  .course-students {
    button {
      color: #0061BB;
      padding:0;
    }

    .header-part {
      .header-label {
        font-weight: bold;
      }

      button {
        float: right;
      }
    }

    .context-part {
      margin-top: 5px;

      .table-action-icon {
        opacity: 0;
        cursor: pointer;
        margin-right: 1em;
      }

      tr:hover .table-action-icon, .ivu-table-row-highlight .table-action-icon {
        opacity: 1;
      }
    }

    .footer-part {
      padding: 5px 50px;
      background-color: #dddee1;
      //margin-top: 5px;

      .total-label {
        font-weight: bold;
        float: right;
      }
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import friends from '../../friends';

  export default {
    props:{
      courseId: {
        type: Number,
        default: 0
      },
      schoolId:{
        type:Number,
        default:-1,
      },
      isSchool:{
        type:Boolean,
        default:false,
      },
      isCreating: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectedArray:[],
        memberStudentsList:[],
        newCreateStudentsList:[],
        loading: false,
        smallCount: 3,
        studentTableData: [],
        studentTableColumn: [
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
            title: this.$t('Common.Name'),
            key: 'name',
            sortable: true,
          },
          // {
          //   title: 'Gender',
          //   key: 'gender',
          //   sortable: true,
          // },
          {
            title: this.$t('Common.Phone'),
            key: 'phone',
            sortable: false
          },
          {
            title: this.$t('Common.Status'),
            key: 'status',
            sortable: true,
            width: 150
          },
          {
            title: this.$t('CourseTeachers.PurchaseDate'),
            key: 'date',
            sortable: true,
            width: 150,
            render: (h, params) => {
              return h('div', params.row.date.toLocaleDateString());
            }
          },
          {
            title: ' ',
            key: 'action',
            width: 50,
            render: (h, params) => {
              return h('div', [
                h('span', {
                    class: 'table-action-icon', attrs: {title: this.$t('Common.Delete')}, on: {
                      click: () => {
                        this.handleDeleteContact(params);
                      }
                    }
                  },
                  [h('Icon', {props: {type: 'close-round', size: '16', color: '#ed3f14'}})])
              ]);
            }
          }
        ],
        allStudents: [],
        modalInvite: false,
        inviteTableData: [],
        inviteTableColumn: [
          {
            title: ' ',
            key: 'ischeck',
            sortable: false,
            type: 'selection',
            width: 60,
          },
          {
            title: this.$t('Common.Avatar'),
            key: 'avatar',
            sortable: false,
            width: 150,
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
            title: this.$t('Common.Name'),
            key: 'name',
            sortable: true,
          },
          {
            title: this.$t('Common.Phone'),
            key: 'phone',
            sortable: false
          }
        ]
      };
    },
    computed: {
      buttonLabelShowAll() {
        return this.studentTableData.length < this.allStudents.length ? this.$t('CourseTeachers.SeeAll') : this.$t('CourseTeachers.Collapse');
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.readStudents();
      });
    },
    methods: {
      readSelected(){
        this.selectedArray=[];
        for(let item of this.allStudents){
          this.selectedArray.push(item.id);
        }
      },
      handleDeleteContact(params){
        let self = this;
        if(this.isCreating==false){
            this.$Modal.confirm({
            title: self.$t('CourseStudents.AlertDeleteStudentTitle'),
            content: self.$t('CourseStudents.AlertDeleteStudentContent'),
            okText: self.$t("Common.Delete"),
            cancelText: self.$t("Base.Cancel"),
            onOk: () => {
              let id = params.row.id;
              let url = GetAPIUrl() + "CourseMember/Delete?courseID="+this.courseId+"&memberIDs="+id;
              $.ajax({
                type: 'DELETE',
                url: url,
                beforeSend: function (request) {
                  request.setRequestHeader("UserToken", auth.getUserToken());
                },
                success: function (result) {
                  if (result.RetCode === 0) {
                    self.studentTableData.splice(params.index, 1);
                    self.readStudents();
                  }
                  else { // error
                    console.log(result);
                  }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                  console.log(xhr);
                }
              });
            }
          });
        }else{
          this.$Modal.confirm({
            title: self.$t('CourseStudents.AlertDeleteStudentTitle'),
            content: self.$t('CourseStudents.AlertDeleteStudentContent'),
            okText: self.$t("Common.Delete"),
            cancelText: self.$t("Base.Cancel"),
            onOk: () => {
              let id = params.row.id;
              self.studentTableData.splice(params.index, 1);
              self.allStudents.splice(params.index, 1);
              let count = self.allStudents.length < self.smallCount ? self.allStudents.length : self.smallCount;
              self.showStudents(count);
              let arryHelp=self.allStudents;
              let arryhelp2=[];
              if(arryHelp.length>=1){
                for(var i=0;i<arryHelp.length;i++) {
                    arryhelp2.push({"MemberID":arryHelp[i].id,"Role":1,"AvatarUrl":arryHelp[i].avatar,"MemberName":arryHelp[i].name,"Phone":arryHelp[i].phone});
                }
              }
              let dataList=arryhelp2;
              self.$emit('select-studentsData',dataList);
            }
          });
        }
       
      },
      readStudents() {
        let self = this;
        if (this.isCreating==false) {
          let url = GetAPIUrl() + "CourseMember/List?courseID=" + this.courseId;
          this._getData(url, null, (data) => {
             let arrHelpStudents=[];
             for(let i=0;i<data.length;i++){
               if(data[i].Role==1){
                 arrHelpStudents.push(data[i]);
               }
             }
             self.allStudents = self.initializeUsers1(arrHelpStudents);
             let count = self.allStudents.length < self.smallCount ? self.allStudents.length : self.smallCount;
             self.showStudents(count);
          }, null);
        }
      },
      initializeUsers1(data) {
        let list = [];
        for (let i = 0, count = data.length; i < count; i++) {
          let user = data[i];
          let item = {
            id: user.MemberID,
            avatar: user.AvatarUrl?user.AvatarUrl:"../../../static/images/user.svg",
            name: user.MemberName,
            // gender: this._genderLabel(user.Gender),
            phone: user.Phone,
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
            name: user.Name,
            // gender: this._genderLabel(user.Gender),
            phone: user.Phone,
            // email: user.Email,
            // detail: user,
            _checked:this.selectedArray.includes(user.UserID),
          };

          list.push(item);
        }
        return list;
      },
      initializeUsers3(data) {
        let list = [];
        for (let i = 0, count = data.length; i < count; i++) {
          let user = data[i];
          let item = {
            id: user.UserID,
            avatar: user.AvatarUrl?user.AvatarUrl:"../../../static/images/user.svg",
            name: user.UserName,
            gender: user.Sex === 2 ? this.$t('CourseTeachers.Female') : this.$t('CourseTeachers.Male'),
            phone: user.Phone,
            email: user.Email,
            detail: user,
            _checked:this.selectedArray.includes(user.UserID)
          };

          list.push(item);
        }
        return list;
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
      showStudents(count) {
        this.studentTableData = [];
        for(let i = 0; i < count; i++){
          let item = this.allStudents[i];
          item.status = this.$t('CourseTeachers.Paid');
          item.date = new Date();
          this.studentTableData.push(item);
        }
      },
      handleInvite() {
        this.modalInvite = true;
        let self= this;
        // if (this.isSchool) {
          let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Students + "&pageIndex=-1";
          this._getData(url, null, (data) => {
            self.readSelected();
            self.inviteTableData = self.initializeUsers3(data);
          }, null);
        // }
        // else {
        //   friends.getFriends(function (users) {
        //     self.readSelected();
        //     self.inviteTableData = self.initializeUsers2(users);
        //   });
        // }
      },
      selectStudents(params) {
        let MemberList=[];
        let newCreateStudents=[];
        for(let i=0;i<params.length;i++){
           MemberList.push({"MemberID":params[i].id,"Role":1});
           newCreateStudents.push({"MemberID":params[i].id,"Role":1,"AvatarUrl":params[i].avatar,"MemberName":params[i].name,"Phone":params[i].phone});
        }
        this.memberStudentsList=MemberList;
        this.newCreateStudentsList=newCreateStudents;
      },
      handleInviteOK() {
        if(this.isCreating==false){
          //过滤已经添加的
          this.readSelected();
          this.memberStudentsList=this.memberStudentsList.filter((item)=>{
            let selectedArray=this.selectedArray;
            return !selectedArray.includes(item.MemberID);
          });
          if(this.memberStudentsList.length==0){
            return;
          }
          let url=GetAPIUrl()+"CourseMember/AddCourseMember";
          let data={
            "CourseID":this.courseId,
            "MemberList":this.memberStudentsList
          }
          this._postData(url, data, null, (result) => {
              this.readStudents();
              this.modalInvite = false;
              // this.$refs.selection.selectAll(false);
          }, null);
        }else{
          let dataList=this.newCreateStudentsList;
          this.allStudents = this.initializeUsers1(dataList);
          let count = this.allStudents.length < this.smallCount ? this.allStudents.length : this.smallCount;
          this.showStudents(count);
          this.modalInvite = false;
          // this.$refs.selection.selectAll(false);
          this.$emit('select-studentsData',dataList);
        }
      },
      handleInviteCancel() {
        this.modalInvite = false;
        // this.$refs.selection.selectAll(false);
      },
      initialOk(){
         
      },
      handleShowAll() {
        if (this.studentTableData.length < this.allStudents.length) {
          this.showStudents(this.allStudents.length);
        }
        else {
          let count = this.allStudents.length < this.smallCount ? this.allStudents.length : this.smallCount;
          this.showStudents(count);
        }
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
              self.$Message.error(result.ErrorMessage);
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);
          }
        });
      },
    }
  }
</script>
