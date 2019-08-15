<template>
  <div class="course-students">
    <div class="header-part">
      <span class="header-label">{{$t('CoursePartners.TeacherFromSchool')}}</span>
      <Button type="text" size="large" icon="plus-round" @click="handleInvite">{{$t('CourseTeachers.Invite')}}</Button>
    </div>

    <div class="context-part">
      <Table :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
             :data="teacherTableData" :columns="teacherTableColumn">
      </Table>
    </div>

    <div class="footer-part" v-if="teacherTableData.length>=1">
      <Button type="text" size="large" @click="handleShowAll">{{buttonLabelShowAll}}</Button>
      <span class="total-label"> 1 - {{ teacherTableData.length }} {{$t('CourseTeachers.Of')}} {{ allTeachers.length }} </span>
    </div>

    <div>
      <Modal v-model="modalInvite" :mask-closable="false" :title="$t('CoursePartners.SelectPartners')" :width="600">
        <Table ref="selection" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
               :data="inviteTableData" :columns="inviteTableColumn" @on-selection-change="selectTeachers" :height="600">
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
      },
    },
    data() {
      return {
        selectedArray:[],
        memberTeachersList:[],
        newCreateTeachersList:[],
        loading: false,
        smallCount: 3,
        teacherTableData: [],
        teacherTableColumn: [
          {
            title: ' ',
            key: 'avatar',
            sortable: false,
            width: 80,
            align: 'center',
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
            align: 'center',
          },
          {
            title: this.$t('Common.SchoolName'),
            key: 'schoolName',
            sortable: true,
            align: 'center',
          },
          {
            title: this.$t('Common.SchoolType'),
            key: 'schoolType',
            sortable: true,
            align: 'center',
          },
          {
            title: this.$t('Common.Location'),
            key: 'location',
            sortable: true,
            align: 'center',
          },
          {
            title: this.$t('Common.Phone'),
            key: 'phone',
            sortable: false,
            align: 'center',
          },
          {
            title: this.$t('Common.Email'),
            key: 'email',
            sortable: false,
            align: 'center',
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
        allTeachers: [],
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
            width: 80,
            align: 'center',
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
            align: 'center'
          },
          {
            title: this.$t('Common.Phone'),
            key: 'phone',
            sortable: false,
            align: 'center'
          },
          {
            title: this.$t('Common.Email'),
            key: 'email',
            sortable: false,
            align: 'center'
          }
        ],
        avatarUrl:"",
        email:""
      };
    },
    computed: {
      buttonLabelShowAll() {
        return this.teacherTableData.length < this.allTeachers.length ?  this.$t('CourseTeachers.SeeAll') : this.$t('CourseTeachers.Collapse');
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.readTeachers();
      });
      if(this.isCreating==true){
        this.getdefaultTeacher();
      }
    },
    methods: {
      readSelected(){
        this.selectedArray=[];
        for(let item of this.allTeachers){
          this.selectedArray.push(item.id);
        }
      },
      getdefaultTeacher(){
         let role=auth.getRole();
         if(role=="1"){
           let self = this;
           let url = GetAPIUrl() + "User/UserProfile";
           this._getData(url, null, (user) => {
              if(user) {
                self.avatarUrl=user.AvatarUrl?user.AvatarUrl:"../../../static/images/user.svg";
                self.email=user.Email;
                let dataList=[{"MemberID":parseInt(auth.getUserID()),"Role":2,"AvatarUrl":self.avatarUrl,"MemberName":auth.getUserName(),"Phone":auth.getMobile(),"Email":user.Email}];
                self.allTeachers = self.initializeUsers1(dataList);
                let count = self.allTeachers.length < self.smallCount ? self.allTeachers.length : self.smallCount;
                self.showTeachers(count);
                self.$emit('select-partnersData',dataList);
              }
            });
         }
      },
      handleDeleteContact(params){
        let self = this;
        if(this.isCreating==false){
            this.$Modal.confirm({
            title: self.$t('CourseTeachers.AlertDeleteTeacherTitle'),
            content: self.$t('CourseTeachers.AlertDeleteTeacherContent'),
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
                    self.teacherTableData.splice(params.index, 1);
                    self.readTeachers();
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
        }
        else{
          this.$Modal.confirm({
            title: self.$t('CourseTeachers.AlertDeleteTeacherTitle'),
            content: self.$t('CourseTeachers.AlertDeleteTeacherContent'),
            okText: self.$t("Common.Delete"),
            cancelText: self.$t("Base.Cancel"),
            onOk: () => {
              let id = params.row.id;
              self.teacherTableData.splice(params.index, 1);
              self.allTeachers.splice(params.index, 1);
              let count = self.allTeachers.length < self.smallCount ? self.allTeachers.length : self.smallCount;
              self.showTeachers(count);
              let arryHelp=self.allTeachers;
              let arryhelp2=[];
              if(arryHelp.length>=1){
                for(var i=0;i<arryHelp.length;i++) {
                    arryhelp2.push({"MemberID":arryHelp[i].id,"Role":2,"AvatarUrl":arryHelp[i].avatar,"MemberName":arryHelp[i].name,"Phone":arryHelp[i].phone});
                }
              }
              let dataList=arryhelp2;
              self.$emit('select-partnersData',dataList);
            }
          });
        }       
      },
      readTeachers() {
        let self = this;
        if (this.isCreating==false) {
          let url = GetAPIUrl() + "CourseMember/List?courseID=" + this.courseId;
          this._getData(url, null, (data) => {
             let arrHelpTeachers=[];
             for(let i=0;i<data.length;i++){
               if(data[i].Role==2){
                 arrHelpTeachers.push(data[i]);
               }
             }
             self.allTeachers = self.initializeUsers1(arrHelpTeachers);
             let count = self.allTeachers.length < self.smallCount ? self.allTeachers.length : self.smallCount;
             self.showTeachers(count);
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
            email: user.Email
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
            email: user.Email,
            detail: user,
            _checked:this.selectedArray.includes(user.UserID)
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
      showTeachers(count) {
        this.teacherTableData = [];
        for(let i = 0; i < count; i++){
          let item = this.allTeachers[i];
          this.teacherTableData.push(item);
        }
      },
      handleInvite() {
        this.modalInvite = true;
        let self= this;
        // if (this.isSchool) {
        let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Teachers + "&pageIndex=-1";
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
      selectTeachers(params) {
        let MemberList=[];
        let newCreateTeachers=[];
        for(let i=0;i<params.length;i++){
           MemberList.push({"MemberID":params[i].id,"Role":2});
           newCreateTeachers.push({"MemberID":params[i].id,"Role":2,"AvatarUrl":params[i].avatar,"MemberName":params[i].name,"Phone":params[i].phone,"Email":params[i].email});
        }
        this.memberTeachersList=MemberList;
        this.newCreateTeachersList=newCreateTeachers;
      },
      handleInviteOK() {
        if(this.isCreating==false){
          //过滤已经添加的
          this.readSelected();
          this.memberTeachersList=this.memberTeachersList.filter((item)=>{
            let selectedArray=this.selectedArray;
            return !selectedArray.includes(item.MemberID);
          });
          if(this.memberTeachersList.length==0){
            return;
          }
          let url=GetAPIUrl()+"CourseMember/AddCourseMember";
          let data={
            "CourseID":this.courseId,
            "MemberList":this.memberTeachersList
          }
          this._postData(url, data, null, (result) => {
              this.readTeachers();
              this.modalInvite = false;
          }, null);
        }else{
          let role=auth.getRole();
          let isIncludsMe=this.isContainMe();
          if(role=="1" && isIncludsMe){
             this.newCreateTeachersList.unshift({"MemberID":auth.getUserID(),"Role":2,"AvatarUrl":this.avatarUrl,"MemberName":auth.getUserName(),"Phone":auth.getMobile(),"Email":this.email});
          }
          let dataList=this.newCreateTeachersList;
          this.allTeachers = this.initializeUsers1(dataList);
          let count = this.allTeachers.length < this.smallCount ? this.allTeachers.length : this.smallCount;
          this.showTeachers(count);
          this.modalInvite = false;
          this.$emit('select-partnersData',dataList);
        }
      },
      //不能同时添加自己两次以上
      isContainMe(){
        for(let ietm of this.newCreateTeachersList){
          if(ietm.MemberID==auth.getUserID()){
            return false;
          }
        }
        return true;
      },
      handleInviteCancel() {
        this.modalInvite = false;
      },
      handleShowAll() {
        if (this.teacherTableData.length < this.allTeachers.length) {
          this.showTeachers(this.allTeachers.length);
        }
        else {
          let count = this.allTeachers.length < this.smallCount ? this.allTeachers.length : this.smallCount;
          this.showTeachers(count);
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
