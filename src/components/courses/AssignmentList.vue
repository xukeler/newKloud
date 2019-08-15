<template>
  <div class="assignment-list">
    <div class="list-header">
      {{$t("CourseItem.Assignments")}}
      <div style="float: right;">
        <Button style="margin-right:10px;" type="primary" shape="circle" @click="goHomework" v-if="isKlassroom && !isModalCourse">{{$t("AssignmentList.GoToHomeworkModule")}}</Button>
        <Button type="primary" shape="circle" icon="plus-round" @click="createAssignment">{{$t("AssignmentList.AddAssignment")}}</Button>
      </div>
    </div>
    <Table size="small" :no-data-text="$t('Common.NoData')" :loading="loading"
          :data="tableData" :columns="tableColumn"
          @on-sort-change="tableSortChange" @on-row-click="tableRowClick" @on-expand="tableRowExpand">
    </Table>

    <!-- <Modal v-model="modalItem" :title="$t('AssignmentList.AlertAssignmentTitle')" :mask-closable="false" width="800">
      <assignment-item ref="assignmentItem" :courseId="courseId" @on-save-remove="afterItemSaveOrRemove"></assignment-item>
      <div slot="footer" style="height:35px;">
        <div style="float: left">
          <button type="button" class="k-button" style="color:darkred" @click="handleItemRemove">{{$t("AssignmentList.DeleteAssignment")}}</button>
        </div>
        <div style="float: right">
          <button type="button" class="k-button k-primary" @click="handleItemOK">{{$t('Base.OK')}}</button>
          <button type="button" class="k-button" @click="handleItemCancel">{{$t('Base.Cancel')}}</button>
        </div>
      </div>
    </Modal> -->
  </div>
</template>

<style lang="scss">
  .assignment-list{

    .list-header{
      font-size: 20px;
      padding-bottom: 16px;
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
</style>

<script>
  import auth from '../../authenticator';
  import AssignmentItem from './AssignmentItem.vue';
  import HomeworkCardDetail from './HomeworkCardDetail.vue';

  export default {
    components: {
      AssignmentItem,
      HomeworkCardDetail
    },
    props:{
      courseId:{
        type:Number,
        default:-1,
      },
      isModalCourse:{
        type:Boolean,
        default:false,
      }
    },
    data() {
      return {
        initialized: false,
        loading: false,
        modalItem: false,
        tableData: [],
        tableColumn: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(HomeworkCardDetail, {
                props: {
                  homeworkCardDetail: params.row
                }
              })
            }
          },
          {
            title: this.$t("AssignmentList.AlertAssignmentTitle"),
            key: 'index',
            width: 150,
            sortable: true,
            sortMethod: (a, b, type) => {
              let x = parseInt(a.substr(11));
              let y = parseInt(b.substr(11));
              return (type === 'asc') ? x - y : y- x;
            }
          },
          {
            title: this.$t("CourseProperty.Title"),
            key: 'title',
            sortable: true
          },
          // {
          //   title: this.$t("Common.Status"),
          //   key: 'status',
          //   width:150,
          //   sortable: true
          // },
          {
            title: "Assign Date",
            key: 'assignDate',
            width: 160,
            sortable: true
          },
          {
            title: "Deadline",
            key: 'deadline',
            width: 160,
            sortable: true
          },
          {
            title: this.$t("AssignmentList.Points"),
            key: 'points',
            width:100,
            sortable: true
          },
          // {
          //   title: "Students finished",
          //   key: 'finished',
          //   width: 160,
          //   sortable: true
          // },
        ],
        rowExpanding: false
      };
    },
    computed: {
      isKlassroom() {
        return IsKlassroom();
      }
    },
    methods: {
      initialize() {
        if (!this.initialized) {
          this.readData();
          this.initialized = true;
        }
      },
      refresh(){
        this.readData();
      },
      readData(){
        let self = this;

        let url = GetAPIUrl() + "Assignment/List?courseID=" + this.courseId;
        this._getData(url, null, (result) => {
          self._initAssignmentList(result);
        }, null);
      },
      _initAssignmentList(data) {
        let assignments = [];
        for (let i =0; i < data.length; i++){
          let assignment = {
            index: this.$t("AssignmentList.AlertAssignmentTitle") + (i + 1),
            id: data[i].AssignmentID,
            title: data[i].Title,
            points: Math.floor(Math.random () * 10 + 1) * 5,
            status: this.$t("AddLesson.Ready"),
            attachments:data[i].Attachments,
            _expanded:true,
          };

          assignments.push(assignment);
        }

        this.tableData = assignments;
      },
      createAssignment() {
        this.$parent.goAddItem();
        // this.$refs.assignmentItem.readData(-1);
        // this.modalItem = true;
      },
      tableSortChange(params) {

      },
      tableRowClick(row) {
        if (this.rowExpanding) {
          this.rowExpanding = false;
          return;
        }

        this.rowExpanding = false;
        this.$parent.goEditItem(row.id);
        // this.$refs.assignmentItem.readData(row.id);
        // this.modalItem = true;
      },
      tableRowExpand() {
        this.rowExpanding = true;
      },
      handleItemRemove(){
        this.$refs.assignmentItem.removeData();
      },
      handleItemOK() {
        this.$refs.assignmentItem.saveData();
      },
      handleItemCancel(){
        this.modalItem = false;
      },
      afterItemSaveOrRemove() {
        this.refresh();
        this.modalItem = false;
      },
      goHomework(){
        auth.setRememberCourse(this.courseId);
        this.$router.push({name:'klassroom-homework'});
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
              if (success && typeof success === 'function') {
                success(result.RetData);
              }

              self.loading = false;
              self.$Loading.finish();
            }
            else { // error
              if (error && typeof error === 'function') {
                error(result);
              }

              self.loading = false;
              self.$Loading.error();
              self.$Message.error(result.ErrorMessage);
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);
          }
        });
      },
    }
  }
</script>
