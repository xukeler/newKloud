<template>
  <div class="header-part">
    <div class="primary-header">
      <div>
        <div class="left-logo">
          <div class="peertime-logo"></div>
          <div class="vertical-line"></div>
        </div>
      </div>
      <div class="main-router">
        <div class="clickable" :class="{'current': currentView === 'schedule'}" @click="goSchedule" title="schedule">
          {{$t("Base.Schedule")}}
          <div class="bottom-line"></div>
        </div>
        <!--<div class="clickable" :class="{'current': currentView === 'activity'}" @click="goActivity" title="activity">
          Activity
          <div class="bottom-line"></div>
        </div>-->
        <div class="clickable" :class="{'current': currentView === 'courses'}" @click="goCourses" title="courses">
          {{$t("Base.Courses")}}
          <div class="bottom-line"></div>
        </div>
        <div class="clickable" :class="{'current': currentView === 'homework'}" @click="goHomework" title="homework">
          {{$t("BusinessHeader.Homework")}}
          <div class="bottom-line"></div>
        </div>
        <div class="clickable" :class="{'current': currentView === 'students'}" @click="goStudents" title="students">
          {{studentsLabel}}
          <div class="bottom-line"></div>
        </div>
        <div class="clickable" :class="{'current': currentView === 'teachers'}" @click="goTeachers" title="teachers">
          {{teachersLabel}}
          <div class="bottom-line"></div>
        </div>
        <!-- <div v-show="!AdminMode" class="clickable" :class="{'current': currentView === 'setting'}" @click="goSetting" title="setting">
          {{$t("Live.Setting")}}
          <div class="bottom-line"></div>
        </div> -->
        <Dropdown v-show="AdminMode" placement="bottom" class="clickable" :class="{'current': currentView === 'school' || currentView === 'admin'}" @on-click="goMore">
          <span style="padding: 0 1em;">
            <Icon size="18" type="more"></Icon>
          </span>
          <div class="bottom-line"></div>
          <DropdownMenu slot="list" class="main-router-dropdown">
            <DropdownItem name="school">{{$t("BusinessHeader.SchoolProfile")}}</DropdownItem>
            <DropdownItem name="admin">{{$t("BusinessHeader.AdminSetup")}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <user-info-klassroom></user-info-klassroom>
    </div>

    <div class="secondary-header" v-if="showSecondary">
      <div class="left-part" v-show="KlassroomSettings.cohortCount > 0">
        <div style="width:2em;"></div>
        <div v-for="item in cohortList" class="clickable" :class="{'current': currentCohort === item.id}" :key="item.id" @click="goCohort(item.id)">
          {{item.name}}
        </div>
      </div>

      <div class="right-part" v-show="KlassroomSettings.termCount > 0">
        <Poptip ref="termPoptip" class="clickable" placement="bottom-end" @on-popper-show="handleTermPoptipShow">
          <div style="padding-left:4em;">
            <span>{{currentTerm}}</span>
            <span style="margin-left:1em;">
              <Icon type="chevron-down"></Icon>
            </span>
          </div>

          <div class="term-select-content" slot="content">
            <div class="term-select-row">{{$t("BusinessHeader.SelectTerm")}}</div>
            <div class="term-select-row" style="margin-bottom:1em; max-height: 300px; overflow-y:auto;">
              <div class="term-select-item" v-for="item in allTermList"  :key="item.id">
                <span class="checkbox-part"><Icon type="checkmark-round" v-show="item.id == selectedTerm"></Icon></span>
                <span class="name-part" @click="handleSelectTerm(item)">{{ item.name }}</span>
                <span class="action-part">
                  <Dropdown placement="left-start" @on-click="handleTermAction($event, item)">
                    <a href="javascript:void(0)" style="padding:0 8px;">
                      <Icon type="android-more-vertical" size="16"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                      <DropdownItem name="edit"><Icon size="16" type="edit" style="margin-right:8px;"></Icon>{{$t("Common.Edit")}}</DropdownItem>
                      <DropdownItem name="delete"><Icon size="16" type="trash-a" style="margin-right:8px;"></Icon>{{$t("Common.Delete")}}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </span>
              </div>
              <!-- <Select v-model="selectedTerm" style="width:100%">
                <Option v-for="item in allTermList" :value="item.id" :key="item.id"></Option>
              </Select> -->
            </div>
            <div class="term-select-row">
              <Button type="primary" shape="circle" long @click="handleSelectTermOK">{{$t('Base.OK')}}</Button>
            </div>
            <div class="term-select-row">
              <Button shape="circle" long @click="handleCreateTerm">{{$t("BusinessHeader.CreateNewTerm")}}</Button>
            </div>
          </div>
        </Poptip>
      </div>
      <!--<div class="right-part clickable">
        <div>Autumn Term 2018</div>
        <div style="margin-left:1em;"><Icon type="chevron-down"></Icon></div>
        <div style="width:2em;"></div>
      </div>-->
    </div>

    <div>
      <Modal v-model="modalCreateSchoolYear" :mask-closable="false" title="Create a new School Year">
        <div class="klassroom-create-school-year">
          <div class="label-part">School Year</div>
          <div>
            <Select v-model="dataSchoolYear.yearCreate" style="width:100%" @on-change="handleCreateSchoolYearChange">
              <Option v-for="item in schoolYearCreateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>

          <div class="label-part">Terms</div>
          <div>
            <div v-for="term in dataSchoolYear.termList" :key="term.id" style="line-height: 2em;">
              <span>{{term.name}}</span> <span style="margin-left: 2em;">{{term.start.toLocaleDateString()}}</span> - <span>{{term.end.toLocaleDateString()}}</span>
            </div>
          </div>

          <div class="label-part">Copy from School Year</div>
          <div>
            <Select v-model="dataSchoolYear.yearSource" style="width:100%">
              <Option v-for="item in schoolYearSourceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
        <div slot="footer">
          <Button style="min-width: 72px;" type="primary" @click="handleCreateSchoolYearOK">{{$t('Base.OK')}}</Button>
          <Button style="min-width: 72px;" @click="handleCreateSchoolYearCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalTerm" :mask-closable="false" :title="$t('BusinessHeader.NewTerm')">
        <table class="table-term-detail">
          <tr>
            <td class="td-title">{{$t('BusinessHeader.Year')}}</td>
            <td class="td-content" style="width:28px;">
              <Select v-model="dataTerm.year" style="width:100%" :disabled="dataTerm.id > 0" @on-change="handleTermChange">
                <Option v-for="item in schoolYearList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </td>
            <td class="td-gutter"></td>
          </tr>
          <tr>
            <td class="td-title">{{$t('BusinessHeader.Term')}}</td>
            <td class="td-content" style="width:28px;">
              <Select v-model="dataTerm.term" style="width:100%" :disabled="dataTerm.id > 0" @on-change="handleTermChange">
                <Option v-for="item in termList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </td>
            <td class="td-gutter"></td>
          </tr>
          <tr>
            <td class="td-title">{{$t('BusinessHeader.Start')}}</td>
            <td class="td-content">
              <DatePicker v-model="dataTerm.start" type="date" placeholder="Select start date"></DatePicker>
            </td>
            <td class="td-gutter"></td>
          </tr>
          <tr>
            <td class="td-title">{{$t('BusinessHeader.End')}}</td>
            <td class="td-content">
              <DatePicker v-model="dataTerm.end" type="date" placeholder="Select end date"></DatePicker>
            </td>
            <td class="td-gutter"></td>
          </tr>
          <tr v-show="dataTerm.id <= 0">
            <td class="td-title">Copy From Term</td>
            <td class="td-content" style="width:28px;">
              <Select v-model="dataTerm.copyTerm" style="width:100%">
                <Option v-for="item in allTermList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </td>
            <td class="td-gutter"></td>
          </tr>

          <tr>
            <td class="td-title"></td>
            <td class="td-content"></td>
            <td class="td-gutter"></td>
          </tr>
        </table>
        <div slot="footer">
          <Button style="min-width: 72px;" type="primary" @click="handleTermOK">{{$t('Base.OK')}}</Button>
          <Button style="min-width: 72px;" @click="handleTermCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalDeleteTerm" title="Delete term" width="350">
        <div v-show="mergeTermList.length > 0" style="padding:1em;">
          <div style="color:#ed3f14; margin-bottom:2em;">
            Before you delete the term, you need to merge the courses and files to other term.
          </div>
          <div>
            Select a term to merge
          </div>
          <div>
            <Select v-model="mergeTermTo" style="width:100%" clearable filterable>
              <Option v-for="term in mergeTermList" :value="term.id" :key="term.id">{{ term.name }}</Option>
            </Select>
          </div>
        </div>
        <div v-show="mergeTermList.length == 0">
          <div style="color:#ed3f14; margin-bottom:1em;">
            Before you delete the term, you need to delete all courses first.
          </div>
        </div>
        <div slot="footer">
          <Button style="min-width: 72px;" type="primary" @click="handleDeleteTermOK">{{$t('Base.OK')}}</Button>
          <Button style="min-width: 72px;" @click="handleDeleteTermCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
$primary-header-height: 50px;
$secondary-header-height: 40px;
$images-root: "../../../static/images/";

.header-part {
  .primary-header {
    height: $primary-header-height;
    max-height: $primary-header-height;
    background-color: #2e3d49;
    color: white;
    width: 100%;
    text-align: left;
    vertical-align: middle;
    position: relative;

    div,
    span {
      display: inline-block;
    }

    ul {
      margin-bottom: 0;
    }

    .left-logo {
      position: relative;
      //float: left;
      height: $primary-header-height;

      .peertime-logo {
        background-image: url($images-root+"logo.svg");
        background-size: 118px 20px;
        background-repeat: no-repeat;
        background-position: center;
        width: 118px;
        height: $primary-header-height;
        margin-left: 24px;
      }
      .vertical-line {
        height: 28px;
        width: 20px;
        border-right: 2px solid white;
        margin-bottom: 11px;
      }
    }

    .main-router {
      position: absolute;
      height: $primary-header-height;
      line-height: $primary-header-height;
      //left: 50%;
      //margin-left: -240px;
      left: 180px;

      .clickable {
        cursor: pointer;
        font-size: 18px;
        padding: 0 1em;
        color: #c5c8ce;
      }

      .bottom-line {
        height: 4px;
        width: 120%;
        display: block;
        margin-left: -10%;
        margin-top: -4px;
        border-radius: 1px;
      }

      .current {
        color: white;

        .bottom-line {
          background-color: white;
        }
      }
    }

    .main-router-dropdown {
      min-width: 160px;

      .ivu-dropdown-item {
        font-size: 15px !important;
        color: #17233d;
      }
    }
  }

  .secondary-header {
    text-align: left;
    height: $secondary-header-height;
    max-height: $secondary-header-height;
    position: relative;
    background: white;

    .left-part {
      display: inline-block;

      div,
      span {
        display: inline-block;
        line-height: $secondary-header-height;
      }
    }

    .clickable {
      cursor: pointer;
      padding: 0 1em;
      color: #808695;
    }

    .clickable.current {
      background: #f5f5f5;
      color: #17233d;
      font-weight: bolder;
    }

    .vertical-line {
      font-size: 20px;
      padding: 0 0.5em;
    }

    .right-part {
      float: right;
      color: #17233d;
      font-weight: bolder;
      line-height: $secondary-header-height;
      padding-right: 2em;

      .clickable {
        color: #17233d;
      }
    }

    .term-select-content {
      text-align: left;
      width: 240px;

      .term-select-row {
        line-height: 1.5em;
        padding: 0.5em 0;
      }

      .ivu-select-dropdown {
        max-height: 500px;
      }

      .term-select-item {
        line-height: 2.4em;
        display: flex;
        align-items: center;

        .checkbox-part {
          flex: 0 0 20px;
        }

        .name-part {
          flex: 1 1 100px;
        }

        .action-part {
          flex: 0 0 20px;
          opacity: 0;
        }
      }

      .term-select-item:hover {
        .action-part {
          opacity: 1;
        }
      }
    }
  }
}

.table-term-detail {
  width: 100%;

  .td-title {
    text-align: right;
    padding: 0.5em 1em;
    width: 25%;
  }

  .td-content {
    padding: 6px 0;
  }

  .td-gutter {
    width: 10%;
  }

  .ivu-select-dropdown {
    max-height: 500px;
  }
}

.klassroom-create-school-year {
  padding: 0 2em;

  .label-part {
    margin-top: 1em;
    margin-bottom: 0.25em;
    font-weight: bold;
  }
}
</style>

<script>
import auth from "../../authenticator";
import UserInfoKlassroom from "../user/UserInfoKlassroom.vue";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  components: {
    UserInfoKlassroom
  },
  data() {
    return {
      loading: false,
      schoolId: auth.getChosenSchoolId(),
      currentView: "schedule",
      currentTerm: "",
      selectedTerm: 0,
      allTermList: [],

      modalCreateSchoolYear: false,
      dataSchoolYear: { yearCreate: 2020, termList: [], yearSource: 2019},
      schoolYearCreateList: [],
      schoolYearSourceList: [],    

      modalTerm: false,
      dataTerm: { year: 2018, term: 1, start: null, end: null },
      schoolYearList: [],

      modalDeleteTerm: false,
      mergeTermList: [],
      mergeTermFrom: null,
      mergeTermTo: 0,
    };
  },
  mounted() {
    this.loadAllTerms();
    this._setCurrentView();
  },
  computed: {
    ...mapState(["Klassroom", "KlassroomSettings", "AdminMode"]),

    showSecondary() {
      let name = this.$route.name;
      return (name == "klassroom-courses" || name == "klassroom-students") && (this.KlassroomSettings.termCount > 0 || this.KlassroomSettings.cohortCount > 0);
    },
    studentsLabel() {
      return this.$t("Base.Students");
    },
    teachersLabel() {
      return this.$t("Base.Teachers");
    },
    currentCohort() {
      return this.Klassroom.currentCohort;
    },
    termList() {
      let list = [];
      list.push({ id: 1, name: this.KlassroomSettings.term1 });
      list.push({ id: 2, name: this.KlassroomSettings.term2 });
      if (this.KlassroomSettings.termCount > 2)
        list.push({ id: 3, name: this.KlassroomSettings.term3 });
      if (this.KlassroomSettings.termCount > 3)
        list.push({ id: 4, name: this.KlassroomSettings.term4 });

      return list;
    },
    cohortList() {
      let list = [];
      list.push({ id: 0, name: "All" });
      list.push({ id: 1, name: this.KlassroomSettings.cohort1 });
      list.push({ id: 2, name: this.KlassroomSettings.cohort2 });
      if (this.KlassroomSettings.cohortCount > 2)
        list.push({ id: 3, name: this.KlassroomSettings.cohort3 });
      if (this.KlassroomSettings.cohortCount > 3)
        list.push({ id: 4, name: this.KlassroomSettings.cohort4 });
      if (this.KlassroomSettings.cohortCount > 4)
        list.push({ id: 5, name: this.KlassroomSettings.cohort5 });

      return list;
    },
  },
  watch: {
    $route(to, from) {
      this.$nextTick(() => {
        this._setCurrentView();
      });
    }
  },
  methods: {
    goSchedule() {
      this.$router.push({ name: "klassroom-schedule" });
    },
    goActivity() {
      this.$router.push({ name: "klassroom-activity" });
    },
    goCourses() {
      this.$router.push({ name: "klassroom-courses" });
    },
    goHomework(){
      this.$router.push({ name: "klassroom-homework" });
    },
    goStudents() {
      this.$router.push({ name: "klassroom-students" });
    },
    goTeachers() {
      this.$router.push({ name: "klassroom-teachers" });
    },
    goCustomers() {
      this.$router.push({ name: "klassroom-customers" });
    },
    goSetting() {
      this.$router.push({ name: "klassroom-setting" });
    },
    goMore(name) {
      switch (name) {
        case "school":
          this.$router.push({ name: "klassroom-school-profile" });
          break;

        case "admin":
          this.$router.push({ name: "klassroom-school-setting" });
          break;
      }
    },
    goCohort(cohort) {
      this.Klassroom.currentCohort = cohort;
    },
    loadAllTerms() {
      let self = this;

      let url = GetAPIUrl() + "SchoolSemester/GetSemesterList";
      url += "?schoolId=" + this.schoolId;

      this._getData(url, null, data => {
          let list = [];
          data.forEach(item => {
            list.push(self._readTermItem(item));
          });

          self._findCurrentTerm(list);
          self.allTermList = list;
        }, null);
    },
    _readTermItem(item) {
      return { 
        id: item.SemesterID,
        year: item.StartYear,
        term: item.StandardSemester,
        start: item.StartDate,
        end: item.EndDate,
        name: this._getTermName(item.StartYear, item.StandardSemester)
      };
    },
    _findCurrentTerm(list) {
      //debugger;
      let current = list.find(item => {return item.id == this.Klassroom.currentTerm.id;});
      if (!current) {
        let currentYear = (new Date()).getFullYear();
        current = list.find(item => {return item.year == currentYear;});
      }

      if (!current) {
        if (list.length > 0) {
          current = list[0];
        }
      }

      if (current) {
        this.Klassroom.currentTerm = current;
      }
      else {
        this.Klassroom.currentTerm = {id: -1, year: -1};
      }

      this.currentTerm = (current) ? current.name : '{'+this.$t("BusinessHeader.PleaseSelectTerm")+'}';
    },
    _getTermName(year, id) {
      let term = '';
      switch (id) {
        case 1:
          term = year + " - " + this.KlassroomSettings.term1;
          break;
        case 2:
          if (this.KlassroomSettings.termCount == 2)
            term = (year + 1) + " - " + this.KlassroomSettings.term2;
          else 
            term = year + " - " + this.KlassroomSettings.term2;
          break;
        case 3:
          term = (year + 1) + " - " + this.KlassroomSettings.term3;
          break;
        case 4:
          term = (year + 1) + " - " + this.KlassroomSettings.term4;
          break;
        
        default: 
          term = 'Undefined';
          break;
      }

      return term;
    },
    handleSelectTerm(item) {
      this.selectedTerm = item.id;
    },
    handleTermAction(action, item) {
      switch(action) {
        case 'edit':
          this.handleEditTerm(item);
          break;

        case 'delete':
          this.handleDeleteTerm(item);
          break;
      }
    },
    handleEditTerm(item) {
      this.$refs.termPoptip.cancel();

      this.dataTerm.id = item.id;
      this.dataTerm.year = item.year;
      this.dataTerm.term = item.term;
      this.dataTerm.start = item.start;
      this.dataTerm.end = item.end;

      this.modalTerm = true;
    },
    handleDeleteTerm(item) {
      let self = this;

      let url = GetAPIUrl() + "Course/ListCount?listType=10";
      url += '&SchoolID=' + this.schoolId;
      url += "&semesterID=" + item.id;

      this._getData(url, null, (data) => {
        if (data > 0) {
          self.showDeleteTermModel(item);
        }
        else {
          self.deleteTerm(item);
        }
      }, null);
    },
    deleteTerm(item) {
      let self = this;
      
      this.$Modal.confirm({
        title: "Delete term",
        content: "Are you sure you want to delete term '" + item.name + "'?",
        okText: "Delete",
        cancelText: "Cancel",
        onOk: () => {
          let url = GetAPIUrl() + "SchoolSemester/DeleteSemester";
          url += "?schoolId=" + self.schoolId;
          url += "&semesterId=" + item.id;

          self._deleteData(url, null, (result) => {
            self.loadAllTerms();
          }, null);
        }
      });
    },
    handleTermPoptipShow() {
      this.selectedTerm = this.Klassroom.currentTerm.id;
    },
    handleSelectTermOK() {
      let termid = this.selectedTerm;

      let current = this.allTermList.find(item => {return item.id == termid;});

      if (current) {
        this.Klassroom.currentTerm = current;
      }
      this.currentTerm = (current) ? current.name : '{'+this.$t("BusinessHeader.PleaseSelectTerm")+'}';

      this.$refs.termPoptip.ok();
    },
    handleCreateTerm() {
      this.$refs.termPoptip.cancel();

      let now = new Date();
      let year = now.getFullYear();

      this.schoolYearList = [];
      for (let i = year; i <= year + 5; i++) {
        this.schoolYearList.push({id: i, name: i + ' - ' + (i + 1)});
      }

      this.dataTerm.id = -1;
      this.dataTerm.year = year;
      this.dataTerm.term = 1;
      this.dataTerm.start = null;
      this.dataTerm.end = null;
      this.dataTerm.copyTerm = this.Klassroom.currentTerm.id;

      this._resetTermDate();

      this.modalTerm = true;
    },
    _resetTermDate() {
      let gap = this.dataTerm.year - this.KlassroomSettings.term1Start.getFullYear();

      switch (this.dataTerm.term) {
        case 1:
          this.dataTerm.start = this._dateAddYears(this.KlassroomSettings.term1Start, gap);
          this.dataTerm.end = this._dateAddYears(this.KlassroomSettings.term1End, gap);
          break;
        case 2:
          this.dataTerm.start = this._dateAddYears(this.KlassroomSettings.term2Start, gap);
          this.dataTerm.end = this._dateAddYears(this.KlassroomSettings.term2End, gap);
          break;
        case 3:
          this.dataTerm.start = this._dateAddYears(this.KlassroomSettings.term3Start, gap);
          this.dataTerm.end = this._dateAddYears(this.KlassroomSettings.term3End, gap);
          break;
        case 4:
          this.dataTerm.start = this._dateAddYears(this.KlassroomSettings.term4Start, gap);
          this.dataTerm.end = this._dateAddYears(this.KlassroomSettings.term4End, gap);
          break;
      }
    },
    _dateAddYears(date, years) {
      let newdate = new Date(date.getTime());
      let year = date.getFullYear() + years;
      newdate.setFullYear(year);
      return newdate;
    },
    handleTermChange() {
      this.$nextTick(() => {
        this._resetTermDate();
      });
    },
    handleTermOK() {
      let self = this;
      let url = ''

      if (this.dataTerm.id <= 0) {
        url = GetAPIUrl() + "SchoolSemester/CreateSemester";
      }
      else {
        url = GetAPIUrl() + "SchoolSemester/UpdateSemester";
      }
      let data = {
        SchoolID: this.schoolId,
        SemesterID: this.dataTerm.id,
        StartYear: this.dataTerm.year,
        StandardSemester: this.dataTerm.term,
        StartDate: this.dataTerm.start,
        EndDate: this.dataTerm.end,
        CopySemesterID: this.dataTerm.copyTerm,
      };

      this._postData(url, data, null, (result) => {
        self.loadAllTerms();
        self.modalTerm = false;
      }, null);
    },
    handleTermCancel() {
      this.modalTerm = false;
    },
    showDeleteTermModel(item) {
      this.mergeTermList = [];
      for(let i = 0; i < this.allTermList.length; i++) {
        let term = this.allTermList[i];
        if (term.id !== item.id) {
          this.mergeTermList.push(term);
        }
      }

      this.mergeTermFrom = item;
      this.mergeTermTo = 0;

      this.modalDeleteTerm = true;          
    },
    handleDeleteTermOK() {
      if (this.mergeTermList.length === 0) {
        this.modalDeleteTerm = false;
        return;
      }

      if (this.mergeTermTo && this.mergeTermFrom) {
        let url = GetAPIUrl() + "SchoolSemester/MergeSemester";
        url += "?schoolId=" + this.schoolId;
        url += "&fromSemesterId=" + this.mergeTermFrom.id;
        url += "&toSemesterId=" + this.mergeTermTo;

        let self = this;

        this._postData(url, {}, null, (result) => {
          self.modalDeleteTerm = false;
          self.loadAllTerms();
        }, null);

      }
    },
    handleDeleteTermCancel() {
      this.modalDeleteTerm = false;
    },
    handleCreateSchoolYear() {
      this.modalCreateSchoolYear = true;
      this._createSchoolYearList();
      this._createSchoolYearTerms();
    },
    _createSchoolYearList() {
      let years = [];
      this.allTermList.forEach(term => {
        if (years.indexOf(term.year) < 0)
          years.push(term.year);
      });
      years.sort();
      years.reverse();

      let existYears = [];
      years.forEach(year => {
        existYears.push({id: year, name: year + ' - ' + (year + 1)});
      })
      this.schoolYearSourceList = existYears;

      let now = new Date();
      let year = now.getFullYear();
      let newYears = [];
      for (let i = 0; i < 10; i++) {
        let id = year + i;
        if (years.indexOf(id) < 0) {
          newYears.push({id: id, name: id + ' - ' + (id + 1)})
        }
      }
      this.schoolYearCreateList = newYears;
    },
    _createSchoolYearTerms() {
      let year = this.dataSchoolYear.yearCreate;

      let list = [];
      list.push({ id: -1, year: year, term: 1, start: new Date(year, 6, 1), end: new Date(year, 9, 1), name: this._getTermName(year, 1) });
      list.push({ id: -2, year: year, term: 2, start: new Date(year, 10, 1), end: new Date(year, 11, 1), name: this._getTermName(year, 2) });
      if (this.KlassroomSettings.termCount > 2)
        list.push({ id: -3, year: year, term: 3, start: new Date(year + 1, 1, 1), end: new Date(year + 1, 3, 1), name: this._getTermName(year, 3) });
      if (this.KlassroomSettings.termCount > 3)
        list.push({ id: -4, year: year, term: 4, start: new Date(year + 1, 4, 1), end: new Date(year + 1, 5, 1), name: this._getTermName(year, 4) });

      this.dataSchoolYear.termList = list;
    },
    handleCreateSchoolYearChange() {
      this.$nextTick(() => {
        this._createSchoolYearTerms();
      });
    },
    handleCreateSchoolYearOK() {
      this.modalCreateSchoolYear = false;
    },
    handleCreateSchoolYearCancel() {
      this.modalCreateSchoolYear = false;
    },
    _setCurrentView() {
      let name = this.$route.name;

      switch (name) {
        case "klassroom-schedule":
        case "klassroom-create-lesson":
          this.currentView = "schedule";
          break;

        case "klassroom-activity":
          this.currentView = "activity";
          break;

        case "klassroom-courses":
        case "klassroom-course-item":
        case "klassroom-create-course":
          this.currentView = "courses";
          break;

        case "klassroom-homework":
          this.currentView = "homework";
          break;

        case "klassroom-students":
          this.currentView = "students";
          break;

        case "klassroom-teachers":
          this.currentView = "teachers";
          break;

        case "klassroom-customers":
          this.currentView = "customers";
          break;
          
        case "klassroom-setting":
          this.currentView = "setting";
          break;

        case "klassroom-school-profile":
          this.currentView = "school";
          break;

        case "klassroom-school-setting":
          this.currentView = "admin";
          break;

        default:
          this.currentView = "settings";
          break;
      }
    },
    _getData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            // self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          // self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _postData(url, data, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: JSON.stringify(data),
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(resultString) {
          let result = JSON.parse(resultString);
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _deleteData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "DELETE",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    }
  }
};
</script>
