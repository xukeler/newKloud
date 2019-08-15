<template>
  <div class="recurring-lesson-item">
    <table>
      <tr>
        <td style="text-align: center;">{{lessonInfo.title}}</td>
        <td> 
          <Select v-model="lessonInfo.date" style="width:100%;" @on-change="dateChanged">
            <Option v-for="item in weekdateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </td>
        <td><input :id="startPickerId" style="width:100%" /></td>
        <td><input :id="endPickerId" style="width:100%" /></td>
      </tr>
      <tr v-show="lessonInfo.error">
        <td></td>
        <td colspan="3" style="padding: 0 0.5em;"><Alert type="error" show-icon>{{lessonInfo.error}}</Alert></td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss">
.recurring-lesson-item {
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
  props: ["lessonId", "lessonInfo", "lessonDuration"],
  data () {
    return {
      startPicker: null,
      endPicker: null,
      weekdateList: []
    };
  },
  computed: {
    startPickerId() {
      return 'recurring-lesson-item-start-time-picker-' + this.lessonId;
    },
    endPickerId() {
      return 'recurring-lesson-item-end-date-picker-' + this.lessonId;
    }
  },
  mounted() {
    let self = this;

    this.$nextTick(() => {
      util.LoadKendoFiles().then(()=>{
        $("#" + self.startPickerId).kendoTimePicker({
          value: self.lessonInfo.start,
          interval: 15,
          min: new Date(2000, 0, 1, 7, 0, 0),
          change: function() {
            self.startChanged();
          }
        });
        $("#" + self.endPickerId).kendoTimePicker({
          value: self.lessonInfo.end,
          interval: 15,
          change: function() {
            self.endChanged();
          }
        });

        self.startPicker = $("#" + self.startPickerId).data("kendoTimePicker");
        self.endPicker = $("#" + self.endPickerId).data("kendoTimePicker");
      });
    });

    let list = [];
    list.push({id: 0, name: 'Sunday'});
    list.push({id: 1, name: 'Monday'});
    list.push({id: 2, name: 'Tuesday'});
    list.push({id: 3, name: 'Wednesday'});
    list.push({id: 4, name: 'Thursday'});
    list.push({id: 5, name: 'Friday'});
    list.push({id: 6, name: 'Saturday'});
    this.weekdateList = list;
  },
  watch: {
    lessonDuration(to, from) {
      this.$nextTick(() => {
        this.durationChanged();
      });
    },
  },
  methods: {
    dateChanged() {
      this.lessonInfo.dirty = true;
    },
    startChanged() {
      if (!this.startPicker) {
        return;
      }

      let start = this.startPicker.value();  
      let duration = Math.abs(this.lessonInfo.end.getTime() - this.lessonInfo.start.getTime());
      let end = new Date(start.getTime() + duration);
      
      this.lessonInfo.dirty = true;
      this.lessonInfo.start = start;
      this.lessonInfo.end = end;

      this.endPicker.value(end);
    },
    endChanged() {
      if (!this.endPicker) {
        return;
      }

      let end = this.endPicker.value();      
      this.lessonInfo.dirty = true;
      this.lessonInfo.end = end;
    },
    durationChanged() {
      let start = this.startPicker.value();
      let duration = this.lessonDuration * 60 * 1000;
      let end = new Date(start.getTime() + duration);
      
      this.lessonInfo.dirty = true;
      this.lessonInfo.start = start;
      this.lessonInfo.end = end;

      this.endPicker.value(end);
    }
  }
}
</script>
