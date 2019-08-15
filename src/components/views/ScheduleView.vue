<template>
  <div style="position:relative">
    <div id="scheduleView">
    </div>

    <ul id="scheduleViewActions" style="display:none;">
      <li id="scheduleViewEventPrepare">
        {{$t("Base.Prepare")}}
      </li>
      <li id="scheduleViewEventStart">
        {{$t("Base.Start")}}
      </li>
      <li id="scheduleViewEventEdit">
        {{$t("Base.Edit")}}
      </li>
      <li id="scheduleViewEventDelete">
        {{$t("Base.Delete")}}
      </li>
    </ul>

    <div>
      <lesson-info ref="lessonInfo"></lesson-info>
      <recurring-lesson-info ref="recurringLessonInfo"></recurring-lesson-info>
    </div>

    <schedule-filter v-if="isKlassroom" ref="scheduleFilter"></schedule-filter>
  </div>
</template>

<style lang="scss">
$images-root: "../../../static/images/";

#scheduleView {
  border-width: 0;

  .lesson-actions {
    z-index: 1;
    position: absolute;
    top: 3px;
    right: 4px;
    white-space: nowrap;
    display: none;
  }

  .k-event:hover .lesson-actions,
  .k-event.k-state-selected .lesson-actions {
    display: block;
  }

  .k-scheduler-layout {
    color: #495060;
  }

  .k-scheduler-toolbar li.k-nav-current .k-lg-date-format {
    display: none;
  }
  .k-scheduler-toolbar li.k-nav-current .k-sm-date-format {
    display: inline;
  }

  .k-scheduler-toolbar > ul.k-scheduler-views {
    position: initial !important;
  }

  // .k-scheduler-header .k-scheduler-table th {
  // }

  .k-newicon-add {
    background-repeat: no-repeat;
    display: inline-block;
    width: 28px;
    height: 28px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    text-align: center;
    vertical-align: middle;
    background-size: 28px 28px;
    background-image: url($images-root+"newicon-add.svg");
  }

  .k-space-right .k-icon {
    right: 8px;
  }
  #scheduler-search-icon.k-i-search {
    background-image: url($images-root+"icon-search-16.png") !important;
    background-position: 0 0 !important;
  }
  #scheduler-search-icon.k-i-cancel {
    background-image: url($images-root+"icon-cancel-16.png") !important;
    background-position: 0 0 !important;
  }

  #scheduler-filter:hover, #scheduler-add-lesson:hover {
    background-color: #57a3f3 !important;
  }

  .k-scheduler-dayview .k-scheduler-header .k-scheduler-table {
    th {
      color: white;
      background-color: #495060; //#0061BB;

      span {
        line-height: 1.5em;
      }
    }
  }

  .k-scheduler-weekview .k-scheduler-header .k-scheduler-table {
    th {
      color: white;
      background-color: #495060; //#0061BB;

      span {
        line-height: 1.5em;
      }
    }

    th:first-of-type,
    th:last-of-type {
      background-color: #80848f;
    }
  }

  .k-scheduler-monthview .k-scheduler-header .k-scheduler-table {
    th {
      height: 3em;
      color: white;
      background-color: #495060; //#0061BB;
    }

    th:first-of-type,
    th:last-of-type {
      background-color: #80848f;
    }
  }
  .scheduler-Menu-List{
    text-align: left;
    background: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 6px rgba(0,0,0,.2);
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    position: absolute;
    z-index: 900;
    right:0px;
    top: 42px;
    display: none;
    li{
      cursor: pointer;
      list-style: none;
      padding: 5px 25px 5px 25px;
      font-size: 13px;
      font-weight: 600;
      color: #007eae;
      white-space:nowrap; 
    }
    li:nth-child(1){
      border-bottom: 1px solid #c0c0c0;
    }
    li:nth-child(2){
      border-bottom: 1px solid #c0c0c0;
    }
  }
}
</style>

<script>
import auth from "../../authenticator";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import LessonInfo from "./LessonInfo";
import RecurringLessonInfo from "./RecurringLessonInfo";
import ScheduleFilter from "./ScheduleFilter3";
import util from "../../common/util.js";

let HEADER_HEIGHT = 50; //76;

export default {
  components: {
    LessonInfo, RecurringLessonInfo, ScheduleFilter
  },
  data: function() {
    return {
      loading: false,
      joinLessonID: "",
      recurringLessonIDStart: 1000000000,
      scheduler: null,
      isKlassroom: IsKlassroom()
    };
  },
  beforeDestroy () {
    document.body.removeEventListener("click",this.hideSchedulerMenuList);
  },
  created() {
    util.LoadKendoFiles().then(()=>{
      var lang = localStorage.getItem("Language") && localStorage.getItem("Language") == "cn" ? "zh-CN" : "en-US";
      kendo.culture(lang);
      document.body.addEventListener("click",this.hideSchedulerMenuList);
    });   
  },
  computed: {
    ...mapState(['showScheduleType'])
  },
  mounted: function() {
    util.LoadKendoFiles().then(()=>{
      this.init();
    });    
  },
  methods: {    
    init(){
      this.$parent.$emit("viewChanged", "schedule");
      let self = this;

      let currentView = localStorage.getItem("ScheduleCurrentView");
      if (!currentView) currentView = "week";

      let currentDate = localStorage.getItem("ScheduleCurrentDate");
      if (!currentDate) currentDate = new Date();

      $(window).resize(function() {
        $("#scheduleView").height(window.innerHeight - HEADER_HEIGHT);
        if (self.scheduler) 
          self.scheduler.resize();
      });

      $("#scheduleViewActions").kendoContextMenu({
        target: "#scheduleView",
        filter: ".lesson-actions",
        showOn: "click",
        select: function(e) {
          let selection = self.scheduler.select();
          if (selection.events.length > 0) {
            let event = selection.events[0];

            switch (e.item.id) {
              case "scheduleViewEventPrepare":
                self.prepareEvent(event);
                break;

              case "scheduleViewEventStart":
                self.startEvent(event);
                break;

              case "scheduleViewEventEdit":
                self.editEvent(event);
                break;

              case "scheduleViewEventDelete":
                self.scheduler.removeEvent(event);
                break;
            }
          }
        }
      });

      $("#scheduleView").kendoScheduler({
        height: window.innerHeight - HEADER_HEIGHT,
        footer: false,
        allDaySlot: false,
        selectable: true,
        currentTimeMarker: false,
        workDayStart: new Date(2017, 0, 1, 8, 0, 0),
        workDayEnd: new Date(2017, 0, 1, 20, 0, 0),
        dateHeaderTemplate:
          "<div><span>#=kendo.toString(date, 'dddd')#</span><br><span>#=kendo.toString(date, 'MMM dd')#</span></div>",
        eventTemplate:
          "<div title='#:courseName# -- #:title#'><div>#:courseName# -- #:title#</div></div>" +
          "<div class='lesson-actions'><i class='ivu-icon ivu-icon-navicon-round' style='font-size: 16px; color:##dddee1;'></i></div>",
        views: [
          { type: "day", selected: currentView === "day" },
          { type: "week", selected: currentView === "week" },
          { type: "month", selected: currentView === "month" } //,{type: "agenda"}
        ],
        date: currentDate,
        timezone: "Etc/UTC",
        editable: {
          destroy: false
        },
        dataSource: null, //dataSource
        messages: {
          deleteWindowTitle: "Delete lesson",
          editable: {
            confirmation: "Are you sure you want to delete this lesson?"
          }
        },
        add: function(e) {
          e.preventDefault();
          if (e.event.start && e.event.end) {
            self.$router.push({
              name: routerPrefix() + "create-lesson",
              query: {
                start: e.event.start.getTime(),
                end: e.event.end.getTime()
              }
            });
          } else {
            self.$router.push({ name: routerPrefix() + "create-lesson" });
          }
        },
        edit: function(e) {
          e.preventDefault();
          self.prepareEvent(e.event);
        },
        remove: function(e) {
          self.removeEvent(e.event);
        },
        moveStart: function(e) {},
        move: function(e) {},
        moveEnd: function(e) {
          self.timeChanged(e.event, e.start, e.end);
        },
        resizeStart: function(e) {},
        resize: function(e) {},
        resizeEnd: function(e) {
          self.timeChanged(e.event, e.start, e.end);
        },
        navigate: function(e) {
          localStorage.setItem("ScheduleCurrentView", e.view);
          localStorage.setItem("ScheduleCurrentDate", e.date);

          if (e.view === "day" || e.view === "week") {
            self.$nextTick(() => {
              $("#scheduleView div.k-scheduler-content").scrollTop(500);
            });
          }

          self.$nextTick(() => {
            self.getData();
          });
        }
      });

      $("#schedule-new-lesson").click(function() {
        let selection = self.scheduler.select();
        if (selection.start && selection.end) {
          self.$router.push({
            name: routerPrefix() + "create-lesson",
            query: {
              start: selection.start.getTime(),
              end: selection.end.getTime()
            }
          });
        } else {
          self.$router.push({ name: routerPrefix() + "create-lesson" });
        }
        return false;
      });
      $("#scheduler-add-lesson").click(function(e) {
        $("#scheduler-MenuList").show();
        e.stopPropagation();
      });
      $("#schedule-do-metting-now").click(function(e) {
        self.$parent.$refs.headerBar.$refs.userInfos.enterKlassroom();
        self.$nextTick(()=>{
          $("#scheduler-MenuList").hide();
        })
        e.stopPropagation();
      });
      $("#schedule-metting").click(function(e) {
        self.$router.push({name:'schedule-meeting'});
        e.stopPropagation();
      });
      /*if (IsKlassroom()) {
        $("#scheduler-filter").show().click(function() {
          self.$refs.scheduleFilter.show();
        });
      }*/

      $("#scheduler-search-input").on("input", function() {
        self.handleSearch();
      });
      $("#scheduler-search-icon").click(function() {
        $("#scheduler-search-input").val("");
        self.handleSearch();
      });

      $("#scheduleView div.k-scheduler-content").scrollTop(500);

      this.$nextTick(() => {
        this.scheduler = $("#scheduleView").data("kendoScheduler");

        setTimeout(() => {
          this.getData();
        }, 500);
      })
    },
    hideSchedulerMenuList(e){
      let dom=$("#scheduler-MenuList");
      let target=$(e.target);
      if(dom){
        if(!target.is('#scheduler-MenuList')){
          $("#scheduler-MenuList").hide();
        }
      }
    },
    getData() {
      if (!this.scheduler)
        return;

      let element = this.scheduler.view().content.find("tr:first td:first");
      let slot = this.scheduler.slotByElement(element);
      let start = slot.startDate;

      element = this.scheduler.view().content.find("tr:last td:last");
      slot = this.scheduler.slotByElement(element);
      let end = slot.endDate;

      let self = this;
      let schoolId = auth.getChosenSchoolId();
      let schedule = this.showScheduleType;

      let url = GetAPIUrl() + "Lesson/ScheduleList";
      url += "?schoolID=" + ((schedule == "showAllSchoolSchedule" && !this.isKlassroom) ? 0 : schoolId);
      url += "&startDate=" + start.getTime();
      url += "&endDate=" + end.getTime();
      if (this.isKlassroom)
        url += "&recurring=1";      

      this._getData(url, null, (data) => {
        self._loadData(data);
      }, null);
    },
    _loadData(data) {
      let dataSource = new kendo.data.SchedulerDataSource({
        data: data,
        schema: {
          model: {
            id: "id",
            fields: {
              id: { from: "LessonID", type: "number" },
              title: { from: "Title", defaultValue: "No title" },
              //start: {from: "PlanedStartDate", type: "date"},
              //end: {from: "PlanedEndDate", type: "date"},
              //startTimezone: {from: "StartTimezone"},
              //endTimezone: {from: "EndTimezone"},
              description: { from: "Description" },
              //recurrenceId: {from: "RecurrenceID"},
              //recurrenceRule: {from: "RecurrenceRule"},
              //recurrenceException: {from: "RecurrenceException"},
              //ownerId: {from: "UserID", defaultValue: 1},
              teachers: { from: "TeacherNames", defaultValue: "" },
              students: { from: "StudentNames", defaultValue: "" },
              courseId: { from: "CourseID", defaultValue: 0 },
              courseName: { from: "CourseName", defaultValue: "" },
              recurringId: { from: "RecurringLessonID", defaultValue: 0},
              readLessonId: { from: "RealLessonID", defaultValue: 0},
              isAllDay: { from: "IsAllDay", defaultValue: false, type: "boolean"}
            }
          }
        }
      });

      dataSource.fetch(function() {
        let data = this.data();
        for (let i = 0, length = data.length; i < length; ++i) {
          if (data[i].PlanedStartDate && data[i].PlanedEndDate) {
            data[i].start = new Date(parseInt(data[i].PlanedStartDate));
            data[i].end = new Date(parseInt(data[i].PlanedEndDate));
          } 
          else {
            /*data[i].start = new Date();
              data[i].start.setHours(i).setMinutes(0).setSeconds(0).setMilliseconds(0);

              data[i].end = new Date();
              data[i].end.setHours(i + 1).setMinutes(0).setSeconds(0).setMilliseconds(0);*/
          }
        }
      });

      this.$nextTick(() => {
        if (this.scheduler) {
          this.scheduler.setDataSource(dataSource);
        }
      });
    },
    timeChanged(event, start, end) {
      let id = event.id;
      if (id > this.recurringLessonIDStart) {
        let url = GetAPIUrl() + "Course/UpdateRecurringLessonTime";
        url += "?courseId=" + event.courseId;
        url += "&lessonId=" + event.recurringId;
        url += "&startTime=" + start.getTime();
        url += "&endTime=" + end.getTime();

        this._postData(url, {}, null, null, null);
      }
      else {
        let url = GetAPIUrl() + "Lesson/UpdateLessonDate";

        let data = {
          LessonID: id,
          StartDate: start.getTime(),
          EndDate: end.getTime()
        };

        this._postData(url, data, null, null, null);
      }
    },
    removeEvent(event) {
      let id = event.id;
      if (id > this.recurringLessonIDStart) {
        let url = GetAPIUrl() + "Course/DeleteRecurringLesson";
        url += "?courseId=" + event.courseId;
        url += "&lessonId=" + event.recurringId;

        this._deleteData(url, null, null, null);
      }
      else {
        let url = GetAPIUrl() + "Lesson/Delete?lessonID=" + id;

        this._deleteData(url, null, null, null);
      }
    },
    prepareEvent(event) {
      let id = event.id;
      if (id > this.recurringLessonIDStart) {
        if (event.readLessonId > 0) {
          this.changeLessonID(0);
          this.$router.push({ name: "live", params: { id: event.readLessonId } });
        }
        else {
          let url = GetAPIUrl() + "Lesson/CreateLessonFromRecurringLesson";
          url += "?courseId=" + event.courseId;
          url += "&lessonId=" + event.recurringId;

          let self = this;
          this._postData(url, {}, null, (data) => {
            if (data > 0) {
              self.changeLessonID(0);
              self.$router.push({ name: "live", params: { id: data } });
            }
          }, null);
        }
      }
      else {
        this.changeLessonID(0);
        this.$router.push({ name: "live", params: { id: id } });
      }
    },
    startEvent(event) {
    },
    editEvent(event) {
      let id = event.id;
      if (id > this.recurringLessonIDStart) {
        this.$refs.recurringLessonInfo.showEdit(event.courseId, event.recurringId, this.handleRefresh)
      }
      else {
        this.$refs.lessonInfo.showEdit(id, this.handleRefresh);
      }
    },
    handleRefresh() {
      this.getData();
    },
    handleSearch() {
      let search = $("#scheduler-search-input").val();

      const icon = $("#scheduler-search-icon");
      if (search && search.length > 0) {
        if (icon.hasClass("k-i-search"))
          icon.removeClass("k-i-search").addClass("k-i-cancel");
      } else {
        if (icon.hasClass("k-i-cancel"))
          icon.removeClass("k-i-cancel").addClass("k-i-search");
      }

      this.startSearch(search);
    },
    startSearch(search) {
      if (search && search.length > 0) {
        let dataSource = this.scheduler.dataSource;
        dataSource.filter({
          logic: "or",
          filters: [
            { field: "title", operator: "contains", value: search },
            { field: "courseName", operator: "contains", value: search }
          ]
        });
      } 
      else {
        this.endSearch();
      }
    },
    endSearch() {
      let dataSource = this.scheduler.dataSource;
      dataSource.filter([]);
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
};
</script>
