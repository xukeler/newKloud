<template>
  <div class="lesson-item-info">
    <table class="lesson-info-table">
      <tr v-show="showHeader">
        <td colspan="2" style="text-align: left; color: #80848f; font-weight: bold;">
          Lesson {{lesson.index}}
        </td>
      </tr>
      <tr>
        <td>
          Lesson Title:
        </td>
        <td>
          <Input v-model="lesson.title" placeholder="Please enter lesson title" style="width: 100%" @on-change="titleChanged"></Input>
        </td>
      </tr>
      <tr>
        <td>
          Date:
        </td>
        <td>
          <DatePicker v-model="lesson.date" type="date" :clearable="false" style="width: 150px" @on-change="dateChanged"></DatePicker>
        </td>
      </tr>
      <tr>
        <td>
          Time:
        </td>
        <td>
          <TimePicker v-model="lesson.start" type="time" placeholder="Start Time" format="HH:mm" :steps="[1, 10, 10]" :clearable="false" style="width: 150px" @on-change="startChanged"></TimePicker>
          <label style="margin: 0 1em;">-</label>
          <TimePicker v-model="lesson.end" type="time" placeholder="End Time" format="HH:mm" :steps="[1, 10, 10]" :clearable="false" style="width: 150px" @on-change="endChanged"></TimePicker>
        </td>
      </tr>
      <tr>
        <td>
          Lecture:
        </td>
        <td>
          <Select v-model="lesson.lectures" multiple placeholder="Select Lectures" style="width:100%" @on-change="lecturesChanged">
            <Option v-for="lecture in allLectures" :value="lecture.id" :key="lecture.id" :label="lecture.index">
              {{lecture.index}}: {{ lecture.name }}
            </Option>
          </Select>
        </td>
      </tr>
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

    .ivu-input {
      font-size: 14px;
    }

    td:first-of-type {
      text-align: right;
      width: 8em;
    }

    td {
      padding: .5em;
    }
  }
}
</style>

<script>
  import auth from '../../authenticator';
  import friends from '../../friends';

  export default {
    props: ["lesson", "allLectures", "showHeader"],
    data() {
      return {};
    },
    mounted() {
    },
    methods: {
      titleChanged() {
        this.lesson.dirty = true;
      },
      dateChanged() {
        this.lesson.dirty = true;
      },
      startChanged() {
        this.lesson.dirty = true;
      },
      endChanged() {
        this.lesson.dirty = true;
      },
      lecturesChanged() {
        this.lesson.dirty = true;
      }
    }
  }
</script>
