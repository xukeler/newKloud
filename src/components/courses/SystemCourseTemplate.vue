<template>
  <div class='course-list-system'>
        <div class="system-course-list">
          <Table size="small" :no-data-text="$t('Common.NoData')" :highlight-row="true" :loading="loading"
                 :data="tableDataSelect" :columns="tableColumnSelect" :row-class-name="rowClassName"
                 @on-current-change="handleCurrentChanged" @on-row-click="tableRowClick">
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
        <div class="actions-part">
          <Button type="primary" shape="circle" icon="plus-round" @click="createsysCourse">{{$t('CourseList.AddSystemCourseTemplate')}}</Button>
        </div>
  </div>
</template>

<style lang="scss">
.course-list-system {
  margin-bottom: 20px;

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
  .actions-part {
    margin: 20px 2px;
    text-align: left;
  }
}
</style>

<script>
import auth from "../../authenticator";

export default {
  props: {
    isSchool: {
      type: Boolean,
      default: false
    },
    schoolId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      selectPageSize:10,
      selectDataTotal:0,
      selectPageIndex:1,
      loading: false,
      loaded: false,
      listType: 1, // Template
      templateType: 1, // System
      sortKey: 0,
      sortOrder: 1,
      boughtList: [],
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
          title:this.$t("Common.SuggestedPrice"),
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
  methods: {
    tableRowClick(row) {
      this.$router.push({ name:routerPrefix()+"course-item", params: { courseId: row.id } });
    },
    //创建系统course
    createsysCourse(){
      this.$router.push({name:routerPrefix()+'course-item',params:{courseId:-1}});
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
    initialize() {
      this.readDataWithSelectTotal();
      this.readSelectData();
    },
    selectPageSizeChange(data){
      this.selectPageIndex = 1;
      this.readSelectData();
    },
    selectPageIndexChange(page){
      this.selectPageIndex = page;
      this.readSelectData();
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
