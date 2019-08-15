<template>
  <div class="recurring-lesson-info">
    <Modal v-model="modalEditLesson" title="Edit Lesson" :mask-closable="false">
      <div class="recurring-lesson-info">
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
              <Select v-model="editingLesson.lectures" multiple placeholder="Select Lectures" style="width:100%">
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
      </div>

      <div slot="footer">
        <Button style="min-width: 72px;" type="primary" :loading="loading" @click="handleEditLessonOK">{{$t('Base.OK')}}</Button>
        <Button style="" @click="handleEditLessonCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss">
.recurring-lesson-info {
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
}
</style>

<script>
import auth from '../../authenticator';
import util from "../../common/util.js";

export default {
  data() {
    return {
      loading: true,
      courseId: 0,
      lessonId: 0,
      callbackSave: null,
      allLectures: [],
      modalEditLesson: false, 
      editingLesson: {}
    }
  },
  mounted() {
    let self = this;
    this.$nextTick(() => {
      util.LoadKendoFiles().then(()=>{
        $("#recurringLessonDatePicker").kendoDatePicker({});
        $("#recurringLessonStartPicker").kendoTimePicker({});
        $("#recurringLessonEndPicker").kendoTimePicker({});
      })
    });
  },
  methods: {
    showEdit(courseId, lessonId, callback) {
      this.courseId = courseId,
      this.lessonId = lessonId;
      this.callbackSave = callback;
      this._readLectureList();
      this.modalEditLesson = true;
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
            status: self.$t('AddLesson.Ready')
          };

          lectures.push(lecture);
        }
        self.allLectures = lectures;
        self._readLesson();
      }, null);
    },
    _readLesson() {
      let self = this;

      let url = GetAPIUrl() + "Course/GetRecurringLessonItem";
      url += "?courseID=" + this.courseId;
      url += "&lessonID=" + this.lessonId;

      this._getData(url, null, (data) => {
        let item = data;
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

        self.handleEditLesson(lesson);
      }, null);
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
      this._postData(url, data, null, (result) => {
        self.modalEditLesson = false;
        if (self.callbackSave && typeof self.callbackSave === 'function') {
          self.callbackSave(result);
        }
      }, null);
    },
    handleEditLessonCancel() {
      this.modalEditLesson = false;
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
