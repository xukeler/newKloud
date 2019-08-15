<template>
  <div class="lesson-item">
    <table>
      <!--<tr>
        <td style="text-align: center;">{{lessonInfo.title}}</td>
        <td><DatePicker v-model="lessonInfo.date" type="date" placeholder="Start Date" :clearable="false" style="width: 100%" @on-change="dateChanged"></DatePicker></td>
        <td><TimePicker v-model="lessonInfo.start" type="time" placeholder="Start Time" format="HH:mm" :steps="[1, 10, 10]" :clearable="false" style="width: 100%" @on-change="startChanged"></TimePicker></td>
        <td><TimePicker v-model="lessonInfo.end" type="time" placeholder="End Time" format="HH:mm" :steps="[1, 10, 10]" :clearable="false" style="width: 100%" @on-change="endChanged"></TimePicker></td>
      </tr>-->
      <tr>
        <td style="text-align: center;">{{lessonInfo.title}}</td>
        <td><input :id="datePickerId" style="width:100%" /></td>
        <td><input :id="startPickerId" style="width:100%" /></td>
        <td><input :id="endPickerId" style="width:100%" /></td>
      </tr>
      <tr>
        <td></td>
        <td colspan="3">
          <Select v-model="lessonInfo.lectures" multiple :placeholder="$t('AddLesson.SelectLectures')" style="width:100%" @on-change="lecturesChanged">
            <Option v-for="lecture in allLectures" :value="lecture.id" :key="lecture.id" :label="lecture.index">
              {{lecture.index}}: {{ lecture.name }}
            </Option>
          </Select>
        </td>
      </tr>
      <tr v-show="lessonInfo.error">
        <td></td>
        <td colspan="3" style="padding: 0 0.5em;"><Alert type="error" show-icon>{{lessonInfo.error}}</Alert></td>
      </tr>
    </table>

    <div style="position: absolute; top: 0.2em; right: 0.5em; cursor: pointer;" @click="handleDelete">
      <Icon type="close-round"></Icon>
    </div>
  </div>
</template>

<style lang="scss">
  .lesson-item {
    background-color: #eeeeee;
    padding: 1em;
    position: relative;

    table {
      width: 100%;

      td {
        width: 25%;
        padding: 0.5em;
      }
    }
  }
</style>

<script>
import util from "../../common/util.js";
  export default {
    props: ["lessonId", "lessonInfo", "allLectures"],
    data () {
      return {
      };
    },
    computed: {
      datePickerId() {
        return 'lesson-item-date-picker-' + this.lessonId;
      },
      startPickerId() {
        return 'lesson-item-start-time-picker-' + this.lessonId;
      },
      endPickerId() {
        return 'lesson-item-end-date-picker-' + this.lessonId;
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
      dateChanged() {
        this.lessonInfo.dirty = true;
      },
      startChanged() {
        this.lessonInfo.dirty = true;
      },
      endChanged() {
        this.lessonInfo.dirty = true;
      },
      lecturesChanged(current) {
        this.lessonInfo.dirty = true;
      },
      handleDelete() {
        this.$emit('on-delete', this.lessonInfo);
      }
    }
  }
</script>
