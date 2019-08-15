<template>
  <div class="recurring-lesson">
    <div>
      <Button type="primary" shape="circle" @click="handleRules">Schedule Rules</Button>
    </div>

    <div style="height:1em;"></div>

    <div v-show="enableRecurring">
      <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :loading="loading"
            :data="lessonList" :columns="lessonColumns">
      </Table>
    </div>
    <div v-show="!enableRecurring">
      <lesson-list ref="lessonList" :is-creating="isCreating" :course-id="courseId" :course-type="courseType"></lesson-list>
    </div>

    <Modal v-model="modalRules" title="Define Schedule Rules" :mask-closable="false" width="800">
      <div class="recurring-lesson-rules">
        <Checkbox v-model="enableRecurringRule">Enable Recurring Lesson</Checkbox>
      </div>
      <div class="recurring-lesson-rules" v-show="enableRecurringRule">
        <div class="header-part">
          <div class="header-item"> Start Date: <input id="recurringRuleStartPicker" /></div>
          <div class="header-item"> End Date: <input id="recurringRuleEndPicker" /></div>
        </div>
        <div style="height:1em;"></div>
        <div class="header-part">
          <div class="header-item"> Lessons per Week: <InputNumber :min="0" :max="20" v-model="lessonAmount"></InputNumber></div>
          <div class="header-item"> 
            Lesson Duration: 
            <Select v-model="lessonDuration" style="width:150px">
              <Option v-for="item in durationList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <div class="content-part">
          <recurring-lesson-item style="margin-bottom: 2px;" v-for="lessonItem in ruleList" :lesson-id="lessonItem.id" :lesson-info="lessonItem" :lesson-duration="lessonDuration" :key="lessonItem.id"></recurring-lesson-item>
        </div>
      </div>

      <div slot="footer">
        <Button style="min-width: 72px;" type="primary" @click="handleRulesOK">{{$t('Base.OK')}}</Button>
        <Button style="" @click="handleRulesCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
    
    <Modal v-model="modalEditLesson" title="Edit Lesson" :mask-closable="false">
      <div>
        <table class="recurring-lesson-detail-table">
          <tr>
            <td colspan="2" style="text-align: left; color: #80848f; font-weight: bold;">
              {{$t("Common.Lesson")}} {{editingLesson.id}}
            </td>
          </tr>
          <tr>
            <td>
              {{$t("Common.Date")}}:
            </td>
            <td class="date-time-cell">
              <input id="recurringLessonDatePicker" style="width:150px" />
            </td>
          </tr>
          <tr>
            <td>
              {{$t("Common.Time")}}:
            </td>
            <td class="date-time-cell">
              <input id="recurringLessonStartPicker" style="width:150px" />
              <label style="margin: 0 1em;">-</label>
              <input id="recurringLessonEndPicker" style="width:150px" />
            </td>
          </tr>
          <tr>
            <td>
              {{$t("Common.Lecture")}}:
            </td>
            <td>
              <Select v-model="editingLesson.lectures" multiple placeholder="Select Lectures" style="width:100%" @on-change="handleLessonLecturesChange">
                <Option v-for="lecture in allLectures" :value="lecture.id" :key="lecture.id" :label="lecture.index">
                  {{lecture.index}}: {{ lecture.name }}
                </Option>
              </Select>
            </td>
          </tr>
          <tr>
            <td style="height:3.5em;">
              Notes:
            </td>
            <td rowspan="2">
              <Input v-model="editingLesson.notes" type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="Notes..."/>
            </td>
          </tr>
          <tr>
            <td>
            </td>
          </tr>
        </table>

        <div style="margin:1em 0 0.5em;">
          Files from lectures
        </div>
        <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :data="lectureFilesData" :columns="lectureFilesColumn" :loading="loading"></Table>
      </div>

      <div slot="footer">
        <Button style="min-width: 72px;" type="primary" @click="handleEditLessonOK">{{$t('Base.OK')}}</Button>
        <Button style="" @click="handleEditLessonCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss">
.recurring-lesson {
  padding: 10px;

  .table-action-icon {
    opacity: 0;
    cursor: pointer;
    margin-right: 1em;
  }

  tr:hover .table-action-icon,
  .ivu-table-row-highlight .table-action-icon {
    opacity: 1;
  }
}

.recurring-lesson-rules {
  padding: 10px;

  .header-part {
    .header-item {
      display: inline-block;
      margin-right: 2em;  
    }
  }

  .content-part {
    margin-top: 1em;
  }
}

.recurring-lesson-detail-table {
  text-align: left;
  width: 100%;

  td:first-of-type {
    text-align: right;
    width: 8em;
  }

  td {
    padding: .5em;
  }

  td.date-time-cell input {
    box-sizing: initial;    
  }
}
</style>

<script>
import auth from '../../authenticator';
import util from "../../common/util.js";
import RecurringLessonItem from './RecurringLessonItem.vue';
import LessonList from './LessonList.vue';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  components: {
    RecurringLessonItem, LessonList
  },
  props: {
    courseType:{
      type: Number,
      default: 0
    },
    courseId: {
      type: Number,
      default: 0
    },
    isCreating: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      loading: false,
      enableRecurring: true,
      allLectures: [],
      modalRules: false,
      originalRules: null,
      confirmedRules: null,
      enableRecurringRule: true,
      startDate: '',
      endDate: '',
      lessonAmount: 0,
      lessonDuration: 45,
      durationList: [],
      ruleList: [],
      lessonListIsNew: false,
      lessonList: [],
      lessonColumns: [
        { title: ' ', key: "id", width: 60, },
        { title: 'Date', key: "startDate", width: 180, },
        { title: 'Time', key: "startTime", width: 120, },
        { title: 'Duration', key: "duration", width: 100, },
        { title: 'Lecture', key: "lecturesName", },
        { title: 'Notes', key: "notes", },
        { title: " ", key: "action", width: 60, minWidth:40,
          renderHeader: (h, params)=>{
            return h("span", {domProps: {title: this.$t('KloudSyncDocLeftPart.MoreAction')}, style: {cursor:'pointer'}},[
                h('Icon', {props: {type: 'help-buoy', size: '16',color:"white"}}), ])
          },
          render: (h, params) => {
            return h("Dropdown", {props: {trigger: "hover"}, class: 'table-action-icon', on: {"on-click": ($event) => {this.handleLessonAction($event, params.row);}}},
            [ h("span", {style: {display:"inline-block", width:"40px"}}, [h('Icon', {props: {type: 'more', size: '16', color: 'black'}})]),
              h('DropdownMenu', {slot: "list"},
              [ h("DropdownItem", {props:{name:"prepare"}}, [h('Icon', {props: {type: 'eye', size: '16'}}),h("span",{style:'display:inline-block; margin-left:8px'}, 'Prepare')]),
                h("DropdownItem", {props:{name:"start"}}, [h('Icon', {props: {type: 'play', size: '16'}}),h("span",{style:'display:inline-block; margin-left:8px'},'Start')]),
                h("DropdownItem", {props:{name:"edit"}}, [h('Icon', {props: {type: 'edit', size: '16'}}),h("span",{style:'display:inline-block; margin-left:8px'},'Edit')]),
                h("DropdownItem", {props:{name:"delete"}}, [h('Icon', {props: {type: 'trash-a', size: '16'}}),h("span",{style:'display:inline-block; margin-left:8px'},'Delete')]),
              ]
            )]);
          }
        }
      ],
      modalEditLesson: false, 
      editingLesson: {},
      lectureFilesData: [],
      lectureFilesColumn: [
        {
          title: this.$t("Files.Title"),
          key: "title",
          sortable: true,
        },
        {
          title: this.$t("Files.Date"),
          key: "date",
          width: 200,
          sortable: true,
        },
      ]
    };
  },
  watch: {
    courseId(to, from) {
      this.$nextTick(() => {
        this.clear();
        this.initialize();
      });
    },
    lessonAmount(to, from) {
      this.$nextTick(() => {
        this.isDirty = true;
        this._resetRuleList();
      });
    },
  },
  computed: {
    ...mapState(["Klassroom", "KlassroomSettings"]),

    currentTerm() {
      return this.Klassroom.currentTerm;
    },
  },
  mounted() {
    this.durationList = [
      {value: 15, label: '15 minutes'},
      {value: 20, label: '20 minutes'},
      {value: 30, label: '30 minutes'},
      {value: 40, label: '40 minutes'},
      {value: 45, label: '45 minutes'},
      {value: 50, label: '50 minutes'},
      {value: 55, label: '55 minutes'},
      {value: 60, label: '1 hour'},
      {value: 90, label: '1.5 hour'},
      {value: 120, label: '2 hour'},
      {value: 150, label: '2.5 hour'},
      {value: 180, label: '3 hour'},
    ]

    let self = this;
    this.$nextTick(() => {
      util.LoadKendoFiles().then(()=>{
        $("#recurringRuleStartPicker").kendoDatePicker({
          value: self.startDate,
          change: function() {
            self.startDate = this.value();
            self.isDirty = true;
          }
        });
        $("#recurringRuleEndPicker").kendoDatePicker({
          value: self.endDate,
          change: function() {
            self.endDate = this.value();
            self.isDirty = true;
          }
        });
      });

      $("#recurringLessonDatePicker").kendoDatePicker({});
      $("#recurringLessonStartPicker").kendoTimePicker({});
      $("#recurringLessonEndPicker").kendoTimePicker({});
    });
  },
  methods: {
    clear() {
      this.enableRecurring = true;

      if (this.currentTerm) {
        this.startDate = new Date(this.currentTerm.start);
        this.endDate = new Date(this.currentTerm.end);

        let picker = $("#recurringRuleStartPicker").data("kendoDatePicker");
        if (picker)
          picker.value(this.startDate);

        picker = $("#recurringRuleEndPicker").data("kendoDatePicker");
        if (picker)
          picker.value(this.endDate);
      }
      this.lessonAmount = 0;
      this.lessonDuration = 45;
      this.ruleList = [];
      this.lessonList = [];

      this.$refs.lessonList.clear();
    },
    initialize() {
      this.readData();

      this.$refs.lessonList.initialize();
    },
    refresh() {
      this.readData();

      this.$refs.lessonList.refresh();
    },
    checkData() {
      if (this.enableRecurringRule)
        return this.$refs.lessonList.checkData();
      else
        return this._checkRules();
    },
    readData() {
      this._readLectureList();
    },
    _readLectureList(){
      if (!this.courseId) {
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "Lecture/List?courseID=" + this.courseId;
      this._getData(url, null, (data) => {
        let lectures = [];
        for (let i = 0; i < data.length; i++) {
          let lecture = {
            index: self.$t('Common.Lecture') + ' ' + (i + 1),
            id: data[i].LectureID,
            name: data[i].Title,
            lessonCount: data[i].LessonCount,
            status: self.$t('AddLesson.Ready'),
            attachments: data[i].Attachments,
          };

          lectures.push(lecture);
        }
        self.allLectures = lectures;
        self._readLessonData();
      }, null);
    },
    _readLessonData() {
      if (this.isCreating) {
        this._resetRuleList();
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "Course/GetRecurringLesson?courseID=" + this.courseId;
      this._getData(url, null, (data) => {
        self.originalRule = data;
        self.confirmedRules = data;
        self._readRules(data);
        self._readLessons(data);
        self.lessonListIsNew = false;
      }, null);
    },
    _readRules(data) {
      if (data.StartDate) {
        this.startDate = new Date(parseInt(data.StartDate));
        $("#recurringRuleStartPicker").data("kendoDatePicker").value(this.startDate);
      }
      if (data.EndDate) {
        this.endDate = new Date(parseInt(data.EndDate));
        $("#recurringRuleEndPicker").data("kendoDatePicker").value(this.endDate);
      }

      this.enableRecurring = data.LessonAmount >= 0;

      this.lessonAmount = data.LessonAmount < 0 ? 0 : data.LessonAmount;
      this.lessonDuration = data.LessonDuration > 0 ? data.LessonDuration : 45;

      let rules = [];
      for (let i = 0; i < data.RuleList.length; i++) {
        let item = data.RuleList[i];
        let rule = {
          id: item.LessonID,
          title: "Lesson " + (-item.LessonID) + ": ",
          date: item.DayOfWeek,
          start: new Date(parseInt(item.StartTime)),
          end: new Date(parseInt(item.EndTime)),
          error: '',
        };
        rules.push(rule);
      }
      this.ruleList = rules;
      this._resetRuleList();
    },
    _readLessons(data) {
      let lessons = [];
      for (let i = 0; i < data.LessonList.length; i++) {
        let item = data.LessonList[i];
        let lesson = {
          id: item.LessonID,
          date: item.DayOfWeek,
          start: new Date(parseInt(item.StartTime)),
          end: new Date(parseInt(item.EndTime)),
          lectures: item.Lectures,
          notes: item.Notes,
          realLessonId: item.RealLessonID,
        };

        lesson.startDate = lesson.start.toLocaleDateString() + ' ' + this._getDayName(lesson.date);
        lesson.startTime = lesson.start.toLocaleTimeString();
        lesson.duration = this._getDuration(lesson.start, lesson.end);
        lesson.lecturesName = this._getLectureName(lesson.lectures);

        lessons.push(lesson);
      }
      this.lessonList = lessons;
    },
    _getLectureName(idstring) {
      if (!idstring) {
        return '';
      }

      let ids = idstring.split(',');
      let names = '';
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let item = this.allLectures.find((lecture) => { return lecture.id == id});
        if (item) {
          names += item.name + ",";
        }
      }

      if (names.length > 0) {
        names = names.substr(0, names.length - 1);
      }
      return names;
    },
    _checkRules() {
      if (this.endDate < this.startDate) {
        this.$Message.error(this.$t('AddLesson.EndShouldLaterThanStart'));
        return false;
      }

      let result = true;
      for (let i = 0; i < this.ruleList.length; i++) {
        let rule = this.ruleList[i];
        if (rule.end < rule.start) {
          rule.error = this.$t('AddLesson.EndShouldLaterThanStart');
          result = false;
        }
        else {
          rule.error = '';
        }
      }

      return result;
    },
    _saveRules() {
      let rules = this._getRuleList();

      let data = {
        CourseID: this.courseId,
        StartDate: this.startDate.getDatePart(),
        EndDate: this.endDate.getDatePart(),
        LessonAmount: this.lessonAmount,
        RuleList: rules,
      };

      return data;
    },
    _isRuleDifferent(a, b) {
      if (!a || !b) {
        return true;
      }

      if (a.StartDate != b.StartDate || a.LessonAmount != b.LessonAmount || a.LessonDutaion != b.LessonDutaion) {
        return true;
      }

      if (a.RuleList.length != b.RuleList.length) {
        return true;
      }

      for (let i = 0; i < a.RuleList.length; i++) {
        let arule = a.RuleList[i];
        let brule = b.RuleList[i];

        if (arule.DayOfWeek != brule.DayOfWeek || arule.StartTime != brule.StartTime || arule.EndTime != brule.EndTime) {
          return true;
        }
      }

      return false;
    },
    handleRules() {
      this.enableRecurringRule = this.enableRecurring;
      this.modalRules = true;
    },
    handleRulesOK() {
      this.enableRecurring = this.enableRecurringRule;

      if (this.enableRecurring) {
        if (!this._checkRules()) {
          return;
        }

        let rules = this._saveRules();
        if (this._isRuleDifferent(rules, this.confirmedRules)) {
          this.confirmedRules = rules;
          this._resetLessonList();
        }
      }
      this.modalRules = false;
    },
    handleRulesCancel() {
      if (this.confirmedRules)
        this._readRules(this.confirmedRules);
      else
        this.clear();

      this.modalRules = false;
    },
    saveData(newCourseId, lectureRelation, memberData, callback) {
      let data = {};

      if (this.enableRecurring) {
        let rules = this._getRuleList();
        let lessons = this._getLessonList(lectureRelation);

        data = {
          CourseID: newCourseId > 0 ? newCourseId : this.courseId,
          StartDate: this.startDate.getDatePart(),
          EndDate: this.endDate.getDatePart(),
          LessonAmount: this.lessonAmount,
          LessonDuration: this.lessonDuration,
          RuleList: rules,
          LessonList: lessons,
        };
      }
      else {
        data = {
          CourseID: newCourseId > 0 ? newCourseId : this.courseId,
          StartDate: this.startDate ? this.startDate.getDatePart() : 1,
          EndDate: this.endDate ? this.endDate.getDatePart() : 1,
          LessonAmount: -1,
          LessonDuration: this.lessonDuration,
          RuleList: [],
          LessonList: [],
        };
      }

      let self = this;
      let url = GetAPIUrl() + "Course/SetRecurringLesson";
      this._postData(url, data, null, (result) => {
        if (self.enableRecurring) {
          self.readData();
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
        else {
          self.$refs.lessonList.saveData(newCourseId, lectureRelation, memberData, callback);
        }
      }, null);
    },
    _resetRuleList() {
      let currentAmount = this.ruleList.length;
      for (let i = this.lessonAmount; i < currentAmount; i++) {
        this.ruleList.pop();
      }

      let duration = this.lessonDuration * 60 * 1000;
      let start = new Date(2000, 0, 1, 8, 0, 0);
      currentAmount = this.ruleList.length;
      for (let i = currentAmount; i < this.lessonAmount; i++) {
        let item = {
          id: -(i + 1),
          title: "Lesson " + (i + 1) + ": ",
          date: (i + 1) % 7,
          start: start,
          end: new Date(start.getTime() + duration),
        };

        this.ruleList.push(item);
      }

      this._sortRuleList();
    },
    _sortRuleList() {
      this.ruleList.sort((a, b) => {
        let order = a.date - b.date;
        if (order == 0)
          order = a.start.getTimePart() - b.start.getTimePart();
        return order;
      });

      for (let i = 0; i < this.ruleList.length; i++) {
        this.ruleList[i].title = "Lesson " + (i + 1) + ": ";
      }
    },
    _getRuleList() {
      this._sortRuleList();

      let rules = [];
      let start = this.startDate;
      let date, differ;
      for (let i = 0; i < this.ruleList.length; i++) {
        differ = this.ruleList[i].date - start.getDay();
        date = new Date(start.getTime());
        date.setDate(date.getDate() + differ);
        let item = {
          LessonID: this.ruleList[i].id,
          DayOfWeek: this.ruleList[i].date,
          StartTime: date.getDatePart() + this.ruleList[i].start.getTimePart(),
          EndTime: date.getDatePart() + this.ruleList[i].end.getTimePart(),
          Lectures: '',
          Notes: '',
        };
        rules.push(item);
      }
      
      return rules;
    },
    _resetLessonList() {
      let lectures = [];
      for (let i = 0; i < this.allLectures.length; i++) {
        let lecture = this.allLectures[i];
        if (lecture.lessonCount > 0) {
          for (let j = 0; j < lecture.lessonCount; j++) {
            lectures.push({id: lecture.id, name: lecture.name});
          }
        }
      }

      let lessons = [];
      let start = new Date(this.startDate.getDatePart());
      let end = new Date(this.endDate.getDatePart());
      end.setHours(23, 59, 59, 999);

      let date = new Date(start.getTime());
      let current, differ;
      let index = 1;
      while (date < end) {
        for (let i = 0; i < this.ruleList.length; i++) {
          differ = this.ruleList[i].date - date.getDay();
          current = new Date(date.getTime());        
          current.setDate(current.getDate() + differ);

          if (current > start && current < end) {
            let item = {
              id: index,
              date: this.ruleList[i].date,
              start: new Date(current.getDatePart() + this.ruleList[i].start.getTimePart()),
              end: new Date(current.getDatePart() + this.ruleList[i].end.getTimePart()),
            };
            lessons.push(item);
            index++;
          }
        }
        
        date.setDate(date.getDate() + 7);
      }

      let lectureCount = lectures.length;
      for (let i = 0; i < lessons.length; i++) {
        let lesson = lessons[i];
        lesson.startDate = lesson.start.toLocaleDateString() + ' ' + this._getDayName(lesson.date);
        lesson.startTime = lesson.start.toLocaleTimeString();
        lesson.duration = this._getDuration(lesson.start, lesson.end);
        lesson.notes = '';
        if (i < lectureCount) {
          lesson.lectures = lectures[i].id;
          lesson.lecturesName = lectures[i].name;
        }
        else {
          lesson.lectures = '';
          lesson.lecturesName = '';
        }
      }
      
      this.lessonList = lessons;
      this.lessonListIsNew = true;
    },
    _getLessonList(lectureRelation) {
      if (lectureRelation.length > 0) {
        let lectures = {};
        for (let i = 0; i < lectureRelation.length; i++) {
          let res = lectureRelation[i].split(',');
          lectures["L" + res[0]] = parseInt(res[1]);
        }

        for (let i = 0; i < this.lessonList.length; i++) {
          let lesson = this.lessonList[i];
          let lessonLectures = lesson.lectures.toString().split(",");
          let newlectures = "";
          for (let j = 0; j < lessonLectures.length; j++) {
            if (lessonLectures[j]) {
              let newid = lectures["L" + lessonLectures[j]];
              if (newid) {
                newlectures += newid + ",";
              }
            }
          }
          lesson.lectures = newlectures;
        }
      }

      let lessons = [];
      for (let i = 0; i < this.lessonList.length; i++) {
        let item = {
          LessonID: this.lessonList[i].id,
          DayOfWeek: this.lessonList[i].date,
          StartTime: this.lessonList[i].start.getTime(),
          EndTime: this.lessonList[i].end.getTime(),
          Lectures: this.lessonList[i].lectures,
          Notes: this.lessonList[i].notes,
        };
        lessons.push(item);
      }
      
      return lessons;
    },
    _getDayName(day) {
      switch (day) {
        case 0:
          return 'Sunday';
        case 1:
          return 'Monday';
        case 2:
          return 'Tuesday';
        case 3:
          return 'Wednesday';
        case 4:
          return 'Thursday';
        case 5:
          return 'Friday';
        case 6:
          return 'Saturday';
      }

      return 'Invalid';
    },
    _getDuration(start, end) {
      let duration = end.getTime() - start.getTime();
      duration = duration / 1000 / 60; // to mitues
      if (duration < 60) {
        return Math.round(duration) + ' minutes';
      }
      else {
        duration = duration / 60; // to hours
        duration = Math.round(duration * 10) / 10;
        return duration + ' hours';
      }
    },
    handleLessonAction(name, lesson) {
      switch(name) {
        case 'prepare':
          this.handlePrepareLesson(lesson);
          break;
        case 'start':
          this.handleStartLesson(lesson);
          break;
        case 'edit':
          this.handleEditLesson(lesson);
          break;
        case 'delete':
          this.handleDeleteLesson(lesson);
          break;
      }
    },
    handlePrepareLesson(lesson) {
      if (this.lessonListIsNew) {
        this.$Modal.warning({title: "Warning", content: "Please save data first, then prepare lesson."});
        return;
      }

      if (lesson.realLessonId > 0) {
        this.changeLessonID(0);
        this.$router.push({ name: "live", params: { id: lesson.realLessonId } });
      }
      else {
        let url = GetAPIUrl() + "Lesson/CreateLessonFromRecurringLesson";
        url += "?courseId=" + this.courseId;
        url += "&lessonId=" + lesson.id;

        let self = this;
        this._postData(url, {}, null, (data) => {
          if (data > 0) {
            self.changeLessonID(0);
            self.$router.push({ name: "live", params: { id: data } });
          }
        }, null);
      }
    },
    handleStartLesson(lesson) {
      if (this.lessonListIsNew) {
        this.$Modal.warning({title: "Warning", content: "Please save data first, then start lesson."});
        return;
      }
    },
    handleEditLesson(lesson) {
      this.editingLesson.origin = lesson;
      this.editingLesson.id = lesson.id;
      this.editingLesson.lectures = lesson.lectures.toString().split(",").map(Number);
      this.editingLesson.notes = lesson.notes;

      let picker = $("#recurringLessonDatePicker").data("kendoDatePicker");
      picker.value(lesson.start);

      picker = $("#recurringLessonStartPicker").data("kendoTimePicker");
      picker.value(lesson.start);

      picker = $("#recurringLessonEndPicker").data("kendoTimePicker");
      picker.value(lesson.end);

      this._getLectureFiles(this.editingLesson.lectures);
      this.modalEditLesson = true;
    },
    _getLectureFiles(lectures) {
      this.lectureFilesData = [];

      let lectureArray = this.allLectures.filter(item => {
        return lectures.indexOf(item.id) >= 0;
      });

      let files = [];
      for (let i = 0; i < lectureArray.length; i++) {
        let lecture = lectureArray[i];
        for (let j = 0; j < lecture.attachments.length; j++) {
          let attachment = lecture.attachments[j];
          let date = new Date(parseInt(attachment.CreatedDate));
          let file = {
            id: attachment.AttachmentID,
            title: attachment.Title,
            date: date.Format("yyyy-MM-dd hh:mm:ss"),
            detail: attachment
          };
          files.push(file);
        }
      }

      this.lectureFilesData = files;
    },
    handleLessonLecturesChange() {
      this.$nextTick(() => {
        this._getLectureFiles(this.editingLesson.lectures);
      })
    },
    handleEditLessonOK() {
      let picker = $("#recurringLessonDatePicker").data("kendoDatePicker");
      let date = picker.value();

      picker = $("#recurringLessonStartPicker").data("kendoTimePicker");
      let start = picker.value();

      picker = $("#recurringLessonEndPicker").data("kendoTimePicker");
      let end = picker.value();

      let startTime = date.getDatePart() + start.getTimePart();
      let endTime = date.getDatePart() + end.getTimePart();

      if (startTime > endTime) {
        this.$Modal.warning({title: "Warning", content: this.$t('AddLesson.EndShouldLaterThanStart')});
        return;
      }      

      let lesson = this.editingLesson.origin;
      lesson.notes = this.editingLesson.notes;
      lesson.start = new Date(startTime);
      lesson.end = new Date(endTime);

      lesson.date = lesson.start.getDay();

      lesson.startDate = lesson.start.toLocaleDateString() + ' ' + this._getDayName(lesson.date);
      lesson.startTime = lesson.start.toLocaleTimeString();
      lesson.duration = this._getDuration(lesson.start, lesson.end);

      let lectures = this.editingLesson.lectures.toString();
      if (!Number.isSafeInteger(parseInt(lectures))) {
        lectures = '';
      }
      lesson.lectures = lectures;
      lesson.lecturesName = this._getLectureName(lesson.lectures);      

      if (this.lessonListIsNew) {
        this.modalEditLesson = false;
      }
      else {
        this.modalEditLesson = false;

        let self = this;
        let data = {
          CourseID: this.courseId,
          LessonID: lesson.id,
          DayOfWeek: lesson.date,
          StartTime: lesson.start.getTime(),
          EndTime: lesson.end.getTime(),
          Lectures: lesson.lectures,
          Notes: lesson.notes,
        };

        let url = GetAPIUrl() + "Course/UpdateRecurringLesson";
        this._postData(url, data, null, null, null);
      }
    },
    handleEditLessonCancel() {
      this.modalEditLesson = false;
    },
    handleDeleteLesson(lesson) {
      let self = this;
      this.$Modal.confirm({
        title: self.$t('Activity.ModalDeleteTitle'),
        content: self.$t('Activity.ModalDeleteTitle') + "?",
        okText: self.$t("Common.Delete"),
        cancelText: self.$t("Base.Cancel"),
        onOk: () => {
          if (self.lessonListIsNew) {
            self._deleteLessonFromList(lesson);
          }
          else {
            let url = GetAPIUrl() + "Course/DeleteRecurringLesson";
            url += "?courseId=" + self.courseId;
            url += "&lessonId=" + lesson.id;
            self._deleteData(url, null, (result) => {
              self._deleteLessonFromList(lesson);
            }, null);
          }
        }
      });
    },
    _deleteLessonFromList(lesson) {
      let index = this.lessonList.findIndex((item) => {return item.id == lesson.id;});
      this.lessonList.splice(index, 1);
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
    },

    ...mapMutations(["changeLessonID"])
  }
}
</script>
