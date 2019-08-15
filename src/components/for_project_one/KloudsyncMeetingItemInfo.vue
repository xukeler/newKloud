<template>
  <div class="lesson-item-info">
    <table class="lesson-info-table">
      <!-- <tr v-show="showHeader">
        <td colspan="2" style="text-align: left; color: #80848f; font-weight: bold;">
          {{$t("kloudsyncMeetinInfo.Meeting")}} {{lessonInfo.index}}
        </td>
      </tr> -->
      <tr>
        <td>
          {{$t("kloudsyncMeetinInfo.MeetingTitle")}}:
        </td>
        <td>
          <Input v-model="lessonInfo.title" :placeholder="$t('kloudsyncMeetinInfo.MeetingTitle')" style="width: 100%" @on-change="titleChanged"></Input>
        </td>
      </tr>
      <tr>
        <td>
          {{$t("Common.Date")}}:
        </td>
        <td class="date-time-cell">
          <input :id="datePickerId" style="width:150px" />
        </td>
      </tr>
      <tr>
        <td>
          {{$t("Common.Time")}}:
        </td>
        <td class="date-time-cell">
          <input :id="startPickerId" style="width:150px" />
          <label style="margin: 0 1em;">-</label>
          <input :id="endPickerId" style="width:150px" />
        </td>
      </tr>
      <!-- <tr>
        <td>
          {{$t("Common.Lecture")}}:
        </td>
        <td>
          <Select v-model="lessonInfo.lectures" multiple placeholder="Select Lectures" style="width:100%" @on-change="lecturesChanged">
            <Option v-for="lecture in allLectures" :value="lecture.id" :key="lecture.id" :label="lecture.index">
              {{lecture.index}}: {{ lecture.name }}
            </Option>
          </Select>
        </td>
      </tr> -->
    </table>
  </div>
</template>

<style lang="scss">
.lesson-item-info {
  //background-color: #f5f5f5;
  padding: 10px;

  .lesson-info-table {
    //font-size: 14px;
    text-align: left;
    width: 100%;

    input {
      font-size: 14px;
    }

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
  import friends from '../../friends';
  import util from "../../common/util.js";

  export default {
    props: ["lessonId", "lessonInfo", "allLectures", "showHeader"],
    data() {
      return {};
    },
    computed: {
      datePickerId() {
        return 'date-picker-' + this.lessonId;
      },
      startPickerId() {
        return 'start-time-picker-' + this.lessonId;
      },
      endPickerId() {
        return 'end-date-picker-' + this.lessonId;
      }
    },
    mounted() {
      let self = this;
      this.$nextTick(() => {
        util.LoadKendoFiles().then(()=>{
          $("#" + this.datePickerId).kendoDatePicker({
            value: this.lessonInfo.date,
            change: function() {
              self.lessonInfo.date = this.value();
              self.lessonInfo.dirty = true;
            }
          });
          $("#" + this.startPickerId).kendoTimePicker({
            value: this.lessonInfo.start,
            change: function() {
              self.lessonInfo.start = this.value();
              self.lessonInfo.dirty = true;
            }
          });
          $("#" + this.endPickerId).kendoTimePicker({
            value: this.lessonInfo.end,
            change: function() {
              self.lessonInfo.end = this.value();
              self.lessonInfo.dirty = true;
            }
          });
        });
      });
    },
    methods: {
      refresh() {
        let picker = $("#" + this.datePickerId).data("kendoDatePicker");
        picker.value(this.lessonInfo.date);

        picker = $("#" + this.startPickerId).data("kendoTimePicker");
        picker.value(this.lessonInfo.start);

        picker = $("#" + this.endPickerId).data("kendoTimePicker");
        picker.value(this.lessonInfo.end);
      },
      titleChanged() {
        this.lessonInfo.dirty = true;
      },
      dateChanged() {
        this.lessonInfo.dirty = true;
      },
      startChanged() {
        this.lessonInfo.dirty = true;
      },
      endChanged() {
        this.lessonInfo.dirty = true;
      },
      lecturesChanged() {
        this.lessonInfo.dirty = true;
      }
    }
  }
</script>
