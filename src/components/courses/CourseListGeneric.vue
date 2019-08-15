<template>
  <div class='course-list-generic'>
    <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :loading="loading"
           :data="tableData" :columns="tableColumn"
           @on-sort-change="tableSortChange" @on-row-click="tableRowClick">
    </Table>

    <div class="page-part" v-show="showPage">
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

    <div class="actions-part" v-show="showAction">
      <Button type="primary" shape="circle" icon="plus-round" :disabled="!canCreate" @click="createCourse">{{addCourseButtonText}}</Button>
    </div>
  </div>
</template>

<style lang="scss">
.course-list-generic {
  .page-part {
    margin: 16px 0;
    overflow: hidden;
    text-align: left;
  }

  .actions-part {
    margin: 20px 2px;
    text-align: left;
  }

  .ivu-table-wrapper {
    border-left: 0;
  }
  .ivu-table::after {
    width: 0;
  }

  .course-list-action {
    opacity: 0;
  }
  .ivu-table-row-hover .course-list-action {
    opacity: 1;
  }

  td {
    cursor: pointer;
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
    cohortId: {
      type: Number,
      default: -1
    },
    termId: {
      type: Number,
      default: -1
    },
    listType: {
      // 1: template, 2: active, 3: finished
      type: Number
    },
    courseType: {
      // -1: all, 0: private, 1: public (for active or finished list)
      type: Number,
      default: -1
    },
    templateType: {
      // 1:  system, 2: personal, 3: school (for template list)
      type: Number,
      default: -1
    },
    showPage: {
      type: Boolean,
      default: true
    },
    showAction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      loaded: false,
      dataTotal: 0,
      pageSize: 10,
      pageIndex: 1,
      sortKey: 0,
      sortOrder: 1,
      tableData: []
    };
  },
  computed: {
    teacherId() {
      return this.isSchool ? -1 : auth.getUserID();
    },
    addCourseButtonText() {
      if (this.listType === 1) {
        if (this.templateType === 1) {
          return this.$t('CourseList.BrowseSystemCourseTemplate');
        } else if (this.templateType === 3) {
          return this.$t('CourseList.AddSchoolCourseTemplate');
        }

        return this.$t('CourseList.AddCourseTemplate');
      }

      return this.$t('CourseList.AddCourse');
    },
    tableColumn() {
      const course = {
        title: this.$t("Common.Courses"),
        key: "name",
        sortable: true
      };
      const homework = {
        title: this.$t("Common.Homework"),
        key: "homework",
        sortable: true
      };
      const type = {
        title: this.$t("Common.Type"),
        key: "type",
        sortable: true,
        render: (h, params) => {
          return h("div", this.formatType(params.row.type));
        }
      };
      const start = {
        title: this.$t("Common.StartDate"),
        key: "start",
        sortable: true,
        render: (h, params) => {
          return h("div", this.formatDate(params.row.start));
        }
      };
      const end = {
        title: this.$t("Common.FinishedDate"),
        key: "end",
        sortable: true,
        render: (h, params) => {
          return h("div", this.formatDate(params.row.end));
        }
      };
      const teacher = {
        title: this.$t("Common.Teacher"),
        key: "teacher"
      };
      const student = {
        title: this.$t("Common.Student"),
        key: "student"
      };
      const school = {
        title: this.$t("Common.School"),
        key: "school"
      };
      const cost = {
        title: this.$t("Common.Cost"),
        key: "cost"
      };
      const status = {
        title: this.$t("Common.Status"),
        key: "status",
        sortable: true,
        width: 150,
        render: (h, params) => {
          const row = params.row;

          // NotStarted = 1, InProgress = 2, Finished = 3, Dropped = 4
          switch (row.status) {
            default:
            case 1:
              return h(
                "Tag",
                {
                  props: {
                    type: "border"
                  }
                },
                this.$t("Common.NOTSTARTED")
              );
            case 2:
              return h(
                "Tag",
                {
                  props: {
                    type: "border",
                    color: "blue"
                  }
                },
                this.$t("Common.INPROGRESS")
              );
            case 3:
              return h(
                "Tag",
                {
                  props: {
                    type: "border",
                    color: "green"
                  }
                },
                this.$t("Common.COMPLETED")
              );
            case 4:
              return h(
                "Tag",
                {
                  props: {
                    type: "border",
                    color: "red"
                  }
                },
                this.$t("Common.DROPPED")
              );
          }
        }
      };
      const progress = {
        title: this.$t("Common.Progress"),
        key: "progress",
        //sortable: true,
        width: 200,
        render: (h, params) => {
          const row = params.row;
          const percent = row.all === 0 ? 0 : (row.done * 100) / row.all;
          const text = row.done + "/" + row.all;

          return h("div", { style: { width: "160px" } }, [
            h(
              "Progress",
              {
                props: {
                  percent: percent
                }
              },
              text
            )
          ]);
        }
      };

      const lecture = {
        title: this.$t("Common.Lecture"),
        key: "lecture"
      };
      const price = {
        title: this.$t("Common.Price"),
        key: "cost",
        sortable: true
      };
      const author = {
        title: this.$t("Common.Author"),
        key: "author"
      };
      const publishStatus = {
        title: this.$t("Common.PublishStatus"),
        key: "publishStatus",
        width: 150,
        render: (h, params) => {
          const row = params.row;

          switch (row.publishStatus) {
            case -1:
              return h(
                "Tag",
                {
                  props: {
                    color: "red"
                  }
                },
                this.$t("Common.REJECTED")
              );

            default:
            case 0:
              return h(
                "Tag",
                {
                  props: {
                    color: "default"
                  }
                },
                this.$t("Common.REVIEWING")
              );

            case 1:
              return h(
                "Tag",
                {
                  props: {
                    color: "green"
                  }
                },
                this.$t("Common.APPROVED")
              );

            case 2:
              return h(
                "Tag",
                {
                  props: {
                    color: "blue"
                  }
                },
                this.$t("Common.PUBLISHED")
              );
          }
        }
      };
      /*const actions = {
          title: ' ',
          key: 'action',
          width: 50,
          render: (h, params) => {
            return h(CourseListAction, {
              props: {
                listType: this.listType,
                courseId: params.row.id
              }
            });
            return h('Dropdown', {
              props: {
                trigger: 'click',
                placement: 'bottom-end'
              },
              on: {
                'on-click': (name) => {
                  this.activeClickAction(name, params.index)
                }
              }
            }, [
              h('Icon', {
                props: {
                  type: 'more'
                }
              }),
              h('Dropdown-menu', {
                slot: 'list'
              }, [
                h('Dropdown-item', {
                  props: {
                    name: "View"
                  }
                }, 'View'),
                h('Dropdown-item', {
                  props: {
                    name: "Edit"
                  }
                }, 'Edit'),
                h('Dropdown-item', {
                  props: {
                    name: "Delete"
                  }
                }, 'Delete')
              ])
            ]);
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, 'View'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, 'Delete')
            ]);
          }
        }*/

      let list = [];
      if (this.listType === 1) {
        //template
        if (this.templateType === 1) {
          // system
        } else if (this.templateType === 2) {
          // Personal
          list.push(course);
          list.push(lecture);
          list.push(price);
          list.push(publishStatus);
        } else {
          // School
          list.push(course);
          list.push(lecture);
          if (!this.isKlassroom) 
            list.push(school);
          list.push(author);
          list.push(publishStatus);
          list.push(price);
          list.push(teacher);
        }
      } else if (this.listType === 2) {
        // active
        if (this.isKlassroom) {
          list.push(course);
          list.push(homework);
          list.push(start);
          list.push(teacher);
          list.push(student);

          list.push(status);
          list.push(progress);
        }
        else {
          list.push(course);
          list.push(type);
          list.push(start);
          list.push(school);
          list.push(teacher);
          list.push(student);
          list.push(cost);

          list.push(status);
          list.push(progress);
        }
      } else {
        // finished
        if (this.isKlassroom) {
          list.push(course);
          list.push(homework);
          list.push(end);
          list.push(teacher);
          list.push(student);

          list.push(status);
          list.push(progress);
        }
        else {
          list.push(course);
          list.push(type);
          list.push(end);
          list.push(school);
          list.push(teacher);
          list.push(student);
          list.push(cost);

          list.push(status);
          list.push(progress);
        }
      }

      return list;
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
      if (!this.loaded) {
        if (this.showPage) {
          this.readDataWithTotal();
        }
        else {
          this.readData();
        }
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
      url += "&courseType=" + this.courseType;
      url += "&templateType=" + this.templateType;
      if (this.isSchool) {
        url += "&SchoolID=" + this.schoolId;
        if (this.isKlassroom) {
          url += "&FolderID=" + this.folderId;
        }
      } else {
        url += "&TeacherID=" + this.teacherId;
      }
      if (this.isKlassroom) {
        url += "&cohortID=" + this.cohortId;
        if (this.listType != 1)
          url += "&semesterID=" + this.termId;
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
      url += "&courseType=" + this.courseType;
      url += "&templateType=" + this.templateType;
      if (this.isSchool) {
        url += "&SchoolID=" + this.schoolId;
        if (this.isKlassroom) {
          url += "&FolderID=" + this.folderId;
        }
      } else {
        url += "&TeacherID=" + this.teacherId;
      }
      if (this.isKlassroom) {
        url += "&cohortID=" + this.cohortId;
        if (this.listType != 1)
          url += "&semesterID=" + this.termId;
      }
      url += "&sortBy=" + this.sortKey;
      url += "&order=" + this.sortOrder;
      url += "&pageIndex=" + (this.showPage ? this.pageIndex - 1 : -1);
      url += "&pageSize=" + this.pageSize;

      this._getData(
        url,
        null,
        data => {
          self.initializeData(data);
          self.loaded = true;
        },
        null
      );
    },
    initializeData(data) {
      let list = [];
      for (let i = 0, count = data.length; i < count; i++) {
        let course = data[i];
        let item = {
          id: course.CourseID,
          name: course.Title,
          author: course.Author,
          type: course.TypeID,
          status: course.Status,
          school: course.SchoolName,
          teacher: course.TeacherCount,
          student: course.StudentCount,
          start: new Date(parseInt(course.StartDate)),
          end: new Date(parseInt(course.EndDate)),
          cost: course.Cost,
          all: course.LessonCount,
          lecture: course.LectureCount,

          done: 0,
          progress: 0,
          active: "Yes",
          publishStatus: 0
        };

        list.push(item);
      }

      this.tableData = list;
    },
    formatType(type) {
      switch (type) {
        case 0:
          return "1 on 1";
        case 1:
          return "Public";
        case 2:
          return "1 to N";
        case 3:
          return "Master";
        case 4:
          return "Sub";
      }

      return "";
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
    pageSizeChange(data) {
      this.pageIndex = 1;
      this.readData();
    },
    pageIndexChange(page) {
      this.pageIndex = page;
      this.readData();
    },
    createCourse() {
      if (this.listType === 1) {
        // Template
        this.$router.push({
          name: routerPrefix() + "course-item",
          params: { courseId: -this.templateType }
        });
      } else {
        this.$router.push({
          name: routerPrefix() + "create-course",
          query: { type: this.courseType < 0 ? 1 : this.courseType }
        });
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
    }
  }
};
</script>
