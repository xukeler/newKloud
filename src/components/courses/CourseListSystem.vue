<template>
  <div class='course-list-system'>
    <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :loading="loading"
           :data="tableData" :columns="tableColumn"
           @on-sort-change="tableSortChange" @on-row-click="tableRowClick">
    </Table>
    <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
      <Select v-model="pageSize" style="width:150px;" @on-change="pageSizeChange">
        <Option :value="10">{{$t('Common.Page10')}}</Option>
        <Option :value="25">{{$t('Common.Page25')}}</Option>
        <Option :value="50">{{$t('Common.Page50')}}</Option>
        <Option :value="100">{{$t('Common.Page100')}}</Option>
      </Select>

      <div style="float: right; display: flex; align-items: center;">
        <div style="display: inline-block; margin-right: 1em;">{{dataTotal}} {{$t('Common.TotalCourse')}}</div>
        <div style="display: inline-block">
          <Page :total="dataTotal" :current="pageIndex" :page-size="pageSize" @on-change="pageIndexChange"></Page>
        </div>
      </div>
    </div>
    <div style="margin: 20px 2px; text-align: left" v-show="canCreate">
      <Button type="primary" shape="circle" icon="plus-round" @click="createCourse">{{$t('CourseList.BrowseSystemCourseTemplate')}}</Button>
    </div>

    <div>
      <Modal v-model="modalSelectCourse" :mask-closable="false" :title="$t('CourseList.SelectSystemCourse')" :width="75">
        <div class="system-course-list">
          <Table size="small" :no-data-text="$t('Common.NoData')" :highlight-row="true" :loading="loading"
                 :data="tableDataSelect" :columns="tableColumnSelect" :row-class-name="rowClassName"
                 @on-current-change="handleCurrentChanged">
          </Table>
          <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
            <Select v-model="selectPageSize" style="width:150px;" @on-change="selectPageSizeChange">
              <Option :value="10">{{$t('Common.Page10')}}</Option>
              <Option :value="25">{{$t('Common.Page25')}}</Option>
              <Option :value="50">{{$t('Common.Page50')}}</Option>
              <Option :value="100">{{$t('Common.Page100')}}</Option>
            </Select>
            <div style="float: right; display: flex; align-items: center;">
              <div style="display: inline-block; margin-right: 1em;">{{selectDataTotal}} {{$t('Common.TotalCourse')}}</div>
              <div style="display: inline-block">
                <Page :total="selectDataTotal" :current="selectPageIndex" :page-size="selectPageSize" @on-change="selectPageIndexChange"></Page>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleSelectCourseOK">Save</Button>
          <Button @click="handleSelectCourseCancel">Cancel</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
.course-list-system {
  margin-bottom: 20px;

  .course-list-header-title {
    //font-weight: bold;
    font-size: 14px;
    line-height: 2em;
    padding-left: 1em;
  }
  .course-list-header-pager {
    overflow: hidden;
    text-align: left;
    float: right;
  }

  .ivu-table-wrapper {
    border-left: 0;
  }
  .ivu-table::after {
    width: 0;
  }

  td {
    cursor: pointer;
  }
}

.system-course-list {
  .ivu-table th {
    background-color: #495060;
    color: white;
  }

  .ivu-table-row-highlight td,
  .ivu-table-stripe
    .ivu-table-body
    tr.ivu-table-row-highlight:nth-child(2n)
    td {
    background-color: #aad5ff;
    //color: white;
  }

  .ivu-table .bought-row td {
    background-color: #ff9900;
    color: #fff;
  }
}
</style>

<script>
import auth from "../../authenticator";
import CourseListAction from "./CourseListAction.vue";

export default {
  components: {
    CourseListAction
  },
  props: {
    isSchool: {
      type: Boolean,
      default: false
    },
    schoolId: {
      type: Number,
      default: -1
    },  
    isKlassroom: {
      type: Boolean,
      default: false
    },
    folderId: {
      type: Number,
      default: -1
    },
  },
  data() {
    return {
      loading: false,
      loaded: false,
      listType: 1, // Template
      templateType: 1, // System
      dataTotal: 0,
      pageSize: 10,
      pageIndex: 1,
      sortKey: 0,
      sortOrder: 1,
      boughtList: [],
      tableData: [],
      tableColumn: [
        {
          title: this.$t("Common.Courses"),
          key: "name",
          sortable: true
        },
        {
          title: this.$t("Common.Lecture"),
          key: "lecture",
          sortable: true
        },
        {
          title: this.$t("Common.Author"),
          key: "author",
          sortable: true
        },
        {
          title:this.$t("Common.SuggestedPrice"),
          key: "cost"
        },
        {
          title: this.$t("Common.Price"),
          key: "cost"
        },
        // {
        //   title: this.$t("Common.Editable"),
        //   key: "editable"
        // },
        // {
        //   title: this.$t("Common.EditableRightPrice"),
        //   key: "costEditable"
        // }
      ],
      modalSelectCourse: false,
      selectDataTotal:0,
      selectPageSize:10,
      selectPageIndex:1,
      tableDataSelect: [],
      tableColumnSelect: [
        /*{
            type: 'selection',
            width: 60,
            align: 'center'
          },*/
        {
          title: this.$t("Common.Courses"),
          key: "name",
          sortable: true
        },
        {
          title: this.$t("Common.Lecture"),
          key: "lecture",
          sortable: true
        },
        {
          title: this.$t("Common.Author"),
          key: "author",
          sortable: true
        },
        {
          title: this.$t("Common.SuggestedPrice"),
          key: "cost"
        },
        // {
        //   title: this.$t("Common.Editable"),
        //   key: "editable"
        // },
        // {
        //   title: this.$t("Common.EditableRightPrice"),
        //   key: "costEditable"
        // }
      ],
      selectedRow: null
    };
  },
  computed: {
    teacherId() {
      return this.isSchool ? -1 : auth.getUserID();
    },
    canEdit() {
      return true;
    },
    canCreate() {
      return true;
    }
  },
  methods: {
    initialize() {
      if (!this.loaded){
        //this.readData();
        this.readDataWithTotal();
      } 
    },
    reset() {
      this.loaded = false,
      this.pageIndex = 1;
    },
    readDataWithTotal() {
      let self = this;

      let url = GetAPIUrl() + "Course/ListCount";
      url += "?listType=" + this.listType;
      url += "&templateType=" + this.templateType;
      if (this.isSchool) {
        url += "&SchoolID=" + this.schoolId;
        if (this.isKlassroom) {
          url += "&FolderID=" + this.folderId;
        }
      } else {
        url += "&TeacherID=" + this.teacherId;
      }
      this._getData(
        url,
        null,
        data => {
          self.dataTotal = parseInt(data);
          self.readData();
        },
        null
      );
    },
    readData() {
      let self = this;

      let url = GetAPIUrl() + "Course/List";
      url += "?listType=" + this.listType;
      url += "&templateType=" + this.templateType;
      if (this.isSchool) {
        url += "&SchoolID=" + this.schoolId;
        if (this.isKlassroom) {
          url += "&FolderID=" + this.folderId;
        }
      } else {
        url += "&TeacherID=" + this.teacherId;
      }
      url += "&sortBy=" + this.sortKey;
      url += "&order=" + this.sortOrder;
      url += "&pageIndex=" + (this.pageIndex - 1);
      url += "&pageSize=" + this.pageSize;

      this._getData(
        url,
        null,
        data => {
          self.tableData = self.initializeData(data, true);
          this.loaded = true;
        },
        null
      );
    },
    initializeData(data, bought) {
      let list = [];
      if (bought) {
        this.boughtList = [];
      }

      for (let i = 0, count = data.length; i < count; i++) {
        let course = data[i];
        let item = {
          id: course.CourseID,
          name: course.Title,
          author: course.Author,
          type: course.TypeID,
          status: course.Status,
          school: course.SchoolName,
          teacher: course.TeacherName,
          student: course.StudentName,
          start: new Date(parseInt(course.StartDate)),
          end: new Date(parseInt(course.EndDate)),
          cost: course.Cost,
          lecture: course.LectureCount,

          publishStatus: (i % 4) - 1,
          active: "Yes",
          editable: "Yes",
          costEditable: course.Cost
        };

        list.push(item);

        if (bought) this.boughtList.push(course.BoughtFrom);
      }

      return list;
    },
    refresh() {
      this.readData();
      this.readDataWithTotal();
    },
    formatDate(date) {
      return date.toLocaleDateString();
    },
    tableSortChange(params) {
      switch (params.key) {
        case "name":
          this.sortKey = 1;
          break;
        case "type":
          this.sortKey = 2;
          break;
        case "start":
          this.sortKey = 3;
          break;
        case "teacher":
          this.sortKey = 4;
          break;
        case "status":
          this.sortKey = 5;
          break;
        case "cost":
          this.sortKey = 6;
          break;
        case "end":
          this.sortKey = 7;
          break;
        case "student":
          this.sortKey = 8;
          break;
      }

      if (params.order === "asc") this.sortOrder = 0;
      else this.sortOrder = 1;

      this.readData();
    },
    tableRowClick(row) {
      if (!this.canEdit) {
        return;
      }

      this.$router.push({ name: routerPrefix() + "course-item", params: { courseId: row.id } });
    },
    selectPageSizeChange(data){
      this.selectPageIndex = 1;
      this.readSelectData();
    },
    pageSizeChange(data) {
      this.pageIndex = 1;
      this.readData();
    },
    selectPageIndexChange(page){
      this.selectPageIndex = page;
      this.readSelectData();
    },
    pageIndexChange(page) {
      this.pageIndex = page;
      this.readData();
    },
    createCourse() {
      this.readDataWithSelectTotal();
      this.modalSelectCourse = true;
      this.selectedRow = null;
      //this.$router.push({name: 'course-item', params: { courseId: -1 }});
    },  
    readDataWithSelectTotal() {
      let self = this;
      let url = GetAPIUrl() + "Course/ListCount";
      url += "?listType=" + this.listType;
      url += "&templateType=" + this.templateType;
      this._getData(
        url,
        null,
        data => {
          self.selectDataTotal = parseInt(data);
          self.readSelectData();
        },
        null
      );
    },
    readSelectData() {
      let self = this;

      let url = GetAPIUrl() + "Course/List";
      url += "?listType=" + this.listType;
      url += "&templateType=" + this.templateType;
      url += "&sortBy=" + this.sortKey;
      url += "&order=" + this.sortOrder;
      url += "&pageIndex=" + (this.selectPageIndex - 1);
      url += "&pageSize=" + this.selectPageSize;

      this._getData(
        url,
        null,
        data => {
          self.tableDataSelect = self.initializeData(data);
        },
        null
      );
    },
    rowClassName(row) {
      if (this.boughtList.includes(row.id)) {
        return "bought-row";
      }

      return "";
    },
    handleCurrentChanged(currentRow) {
      this.selectedRow = currentRow;
    },
    handleSelectCourseOK() {
      if (!this.selectedRow) {
        this.$Modal.warning({
          title: "Warning",
          content: "Please select a course first.",
          okText: "OK"
        });
        return;
      }

      let id = this.selectedRow.id;
      if (this.boughtList.includes(id)) {
        this.$Modal.warning({
          title: "Warning",
          content: "You have bought this course, please change another one.",
          okText: "OK"
        });
        return;
      }

      let url = GetAPIUrl() + "Course/BuySystemTemplateCourse";
      let teacherID = this.isSchool ? 0 : this.teacherId;
      let data = {
        CourseID: id,
        CourseMembers:[{"MemberID":teacherID,"Role":2}],
        SchoolID: this.isSchool ? this.schoolId : 0,
        FolderID: this.isKlassroom ? this.folderId : -1
      };

      let self = this;
      this._postData(
        url,
        data,
        null,
        result => {
          self.refresh();
          self.modalSelectCourse = false;
        },
        null
      );
    },
    handleSelectCourseCancel() {
      this.modalSelectCourse = false;
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
            if (success && typeof success === "function") {
              success(result.RetData);
            }

            self.loading = false;
            self.$Loading.finish();
          } else {
            // error
            if (error && typeof error === "function") {
              error(result);
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          if (error && typeof error === "function") {
            error();
          }

          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);
        }
      });
    }
  }
};
</script>
