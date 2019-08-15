<template>
  <div id="schoolListView">
    <div class="paneGutter"></div>
    <div class="panelDetail">
      <div class="school-select">
        <!-- <label for="schoolSelect">Select a school</label>
        <Select id="schoolSelect" v-model="schoolId" style="width:35%; min-width:300px" @on-change="schoolSelectChanged">
          <Option v-for="item in schoolList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select> -->

        <Button icon="plus-round" style="float:right;" @click="applyNewSchool">Add a new school</Button>
        <br/>
        <Modal v-model="modalApplyNewSchool" :mask-closable="false" title="School / Business Application Form">
          <div class="apply-school-part">
            <school-info-block :school="applySchool" :is-creating="true"></school-info-block>
          </div>

          <div slot="footer">
            <Button type="primary" :loading="loading" @click="handleNewApplySchoolOK">Apply</Button>
            <Button @click="handleApplySchoolCancel">Cancel</Button>
          </div>
      </Modal>
      </div>

      <div>
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
    <div class="paneGutter"></div>
  </div>
</template>

<style lang="scss">
  #schoolListView{
    background-color: transparent;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    min-height: 1px;
    padding-top: 20px;
    min-width: 785px;
    min-height: 200px;
    width: 100%;

    .paneGutter {
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      box-flex: 1;
      -webkit-flex: 1 0 20px;
      -moz-flex: 1 0 20px;
      -ms-flex: 1 0 20px;
      flex: 1 0 20px;
    }

    .panelCatalog {
      -webkit-box-flex: 0;
      -moz-box-flex: 0;
      box-flex: 0;
      -webkit-flex: 0 0 250px;
      -moz-flex: 0 0 250px;
      -ms-flex: 0 0 250px;
      flex: 0 0 250px;
      -webkit-box-pack: start;
      -moz-box-pack: start;
      box-pack: start;
      -webkit-justify-content: flex-start;
      -moz-justify-content: flex-start;
      -ms-justify-content: flex-start;
      -o-justify-content: flex-start;
      justify-content: flex-start;
      -ms-flex-pack: start;
      margin-right: 15px;
    }

    .panelDetail {
      -webkit-box-flex: 5500;
      -moz-box-flex: 5500;
      box-flex: 5500;
      -webkit-flex: 5500 1 500px;
      -moz-flex: 5500 1 500px;
      -ms-flex: 5500 1 500px;
      flex: 5500 1 500px;
      max-width: 1500px;
      min-width: 800px;

      background-color: #FFFFFF;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 3px;

      padding: 28px;
    }

    .school-select {
      text-align: left;
      padding-bottom: 1em;

      label {
        margin-right: 2em;
        font-weight: bold;
      }
    }

    .school-view{
      padding: 0;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import SchoolInfoBlock from '../profile/SchoolInfoBlock';

  export default {
    components: { SchoolInfoBlock },
    inject:['reload','reloadHeader'],
    data: function () {
      return {
        initialized: false,
        loading: false,
        schoolList: [],//[{id:1, name: 'My school (me as an independent tutor)'}, {id:3134, name: '131 Sample School'}],
        schoolId: -1,
        modalApplyNewSchool:false,
        applySchool: {
          type0: 0,
          type1: 0,
          name: auth.getUserName() + "'s School",
          owner: parseInt(auth.getUserID()),
          admin: parseInt(auth.getUserID())
        }
      };
    },
    mounted: function () {
      this.$on("viewChanged", () => {
        this.$parent.$emit("viewChanged", "school");
      });
      this.$parent.$emit("viewChanged", "school");

      this.initialize();
    },
    methods: {
      showMessage(info){
          this.$Message.info({
                content:info,
                duration: 5
            });
      },
      applyNewSchool(){
        this.modalApplyNewSchool=true;
      },
      handleNewApplySchoolOK(){        
        if (this.applySchool.type1 === '')
          this.applySchool.type1 = 0;

        let self = this;

        let url = GetAPIUrl() + "School/CreateSchool";
        let schoolUnion=this.schoolList;
        for(let i=0;i<schoolUnion.length;i++){
          if(this.applySchool.name===schoolUnion[i].name){
            this.showMessage('The name of the add mechanism already exists. Please add it again');
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
          this.initialize();
          this.reloadHeader();
        }, null);        
      },
      handleApplySchoolCancel(){
        this.modalApplyNewSchool=false;
      },
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
              school.name = "My school (me as an independent tutor)";
              school.isMine = true;
              list.splice(0, 0, school);
            }
            else {
              list.push(school);
            }
          }

          self.setSchoolList(list);
        }, null);
      },
      setSchoolList(list) {
        this.schoolList = list;
        if (this.$route.params.schoolId) {
          this.schoolId = parseInt(this.$route.params.schoolId);
        }
        else {
          this.schoolId = auth.getCustomerID();
          this.gotoSchool();
        }

        this.$nextTick(() => {
          this.initialized = true;
        });
      },
      gotoSchool() {
        this.schoolId=auth.getChosenSchoolId();
        this.$router.push({name: 'school-item', params: {schoolId: this.schoolId}});
      },
      // schoolSelectChanged(item) {
      //   if (!this.initialized)
      //     return;

      //   this.$nextTick(() => {this.gotoSchool()});
      // },
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
