<template>
  <div class="lecture-list">
    <div class="list-header">
      {{$t("CourseItem.Lectures")}}
      <div style="float: right;">
        <Button type="primary" shape="circle" icon="plus-round" @click="createLecture">{{$t("LectureList.AddLecture")}}</Button>
      </div>
    </div>
    <Table size="small" :no-data-text="$t('Common.NoData')" :loading="loading" highlight-row stripe
           :data="tableData" :columns="tableColumn"
           @on-sort-change="tableSortChange">
    </Table>

    <Modal v-model="modalItem" :title="$t('Common.Lecture')" :mask-closable="false" width="800">
      <lecture-item ref="lectureItem" :course-id="courseId" :school-id="schoolId" @on-save-remove="afterItemSaveOrRemove"></lecture-item>
      <div slot="footer" style="height:35px;">
        <!-- <div style="float: left">
          <button type="button" class="k-button" style="color:darkred" @click="handleItemRemove">{{$t("LectureList.DeleteLecture")}}</button>
        </div> -->
        <div style="float: right">
          <button type="button" class="k-button k-primary" @click="handleItemOK">{{$t('Base.OK')}}</button>
          <button type="button" class="k-button" @click="handleItemCancel">{{$t('Base.Cancel')}}</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss">
  .lecture-list{

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
    .table-action-icon {
      opacity: 0;
      cursor: pointer;
      margin-right: 1em;
    }

    tr:hover .table-action-icon,
    .ivu-table-row-highlight .table-action-icon {
      opacity: 1;
    }
    .ivu-dropdown-item {
      text-align: left;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import LectureItem from './LectureItem.vue';

  export default {
    components: {
      LectureItem
    },
    props: {
      courseId: {
        required: true
      }, 
      schoolId: {
        required: true
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
            title: this.$t('Common.Lecture'),
            key: 'index',
            width: 100,
            sortable: true,
            sortMethod: (a, b, type) => {
              let x = parseInt(a.substr(8));
              let y = parseInt(b.substr(8));
              return (type === 'asc') ? x - y : y- x;
            }
          },
          {
            title: this.$t('Base.Title'),
            key: 'title',
            sortable: true
          },
          {
            title: this.$t('Common.LessonCount'),
            key: 'lessonCount',
            width:150,
            sortable: false
          },
          {
            title: this.$t('Common.Status'),
            key: 'status',
            width:150,
            sortable: true
          },
          {
            title: " ",
            key: "action",
            width: 120,
            render: (h, params) => {
              let iconArray = [];
              iconArray.push(h("span", {class: "table-action-icon", attrs: { title: "Open" }, 
                        on: {click: () => {this.handleViewLecture(params.row);}}},
                    [h("Icon", { props: { type: "eye", size: "16", color: "#19be6b" }})]));
              iconArray.push(h("span", {class: "table-action-icon", attrs: { title: "Edit" }, 
                        on: {click: () => {this.tableRowClick(params.row);}}},
                    [h("Icon", { props: { type: "edit", size: "16", color: "#2d8cf0" }})]));
              iconArray.push(h("span", {class: "table-action-icon", attrs: { title: this.$t("Common.Delete") },
                        on: { click: () => {this.handleDeleteLecture(params.row);}}},
                    [h("Icon", {props: { type: "close-round", size: "16", color: "#ed3f14" }})]));
              return h("div", iconArray);
            }
          }
          /*{
            title: " ",
            key: "action",
            width: 80,
            align:"center",
            renderHeader:(h,params)=>{
              return h("span",{domProps:{title:this.$t('KloudSyncDocLeftPart.MoreAction')},style:{display:'inline-block',width:"40px",cursor:'pointer'}},[
                  h('Icon', {props: {type: 'help-buoy', size: '16',color:"white"}}),
                ]
              )
            },
            render: (h, params) => {

              return h("Dropdown",
                {props:{trigger:"hover",placement:"bottom-end",},style:{textAlign:'center'},class:'table-action-icon',
                  on:{
                    "on-click": ($event) => {
                      event.stopPropagation();
                      this.handleLecture($event,params);
                    }
                  }
                },
                [h("span",{style:{display:"inline-block",width:"40px"},
                  on:{
                    "click": ($event) => {
                      event.stopPropagation();
                    }
                  }
                },[
                  h("span",{style:{display:"inline-block",width:"40px"}},[h('Icon', {props: {type: 'more', size: '16', color: 'black'}})]),
                ]),
                h('DropdownMenu',{slot:"list"},[
                  h("DropdownItem",{props:{name:'view'},},[
                   h('Icon', {props: {type: 'eye', size: '16'}}),
                   h("span",{style:'display:inline-block;margin-left:5px'},"View")
                  ]),
                  h("DropdownItem",{props:{name:'edit'},},[
                    h('Icon', {props: {type: 'ios-compose-outline', size: '16'}}),
                    h("span",{style:'display:inline-block;margin-left:5px'},"Edit")
                  ]),
                  h("DropdownItem",{props:{name:'delete'},},[
                    h('Icon', {props: {type: 'ios-trash-outline', size: '16'}}),
                    h("span",{style:'display:inline-block;margin-left:5px'},"Delete")
                  ]),
                ]
                )]
              );
            }
          },*/
          
        ]
      };
    },
    methods: {
      handleLecture(name,params){
        switch (name) {
          case "view":
            this.handleViewLecture(params.row);
            break;
          case "edit":
            this.tableRowClick(params.row);
            break;
          case "delete":
            this.handleDeleteLecture(params.row);
            break;
          default:
            break;
        }

      },
      handleViewLecture(row){
        this.$router.push({ name: "lecture", params: { id:row.id,courseID:this.courseId } });
      },
      handleDeleteLecture(row){
        let self = this;
        this.$Modal.confirm({
          title: self.$t("Files.RemoveLectureTitle"),
          content: self.$t("Files.RemoveLectureContent"),
          okText: self.$t("Common.Delete"),
          cancelText: self.$t("Base.Cancel"),
          onOk: () => {
            let url = GetAPIUrl() + "Lecture/Delete?lectureID=" + row.id;
            self._deleteData(url, null, (result) => {
              self.tableData.splice(row._index,1);
            }, null);
          }
        });
      },
      initialize() {
        // if (!this.initialized) {
          this.readData();
          // this.initialized = true;
        // }
      },
      refresh(){
        this.readData();
      },
      readData() {
        let self = this;

        let url = GetAPIUrl() + "Lecture/List?courseID=" + this.courseId;
        this._getData(url, null, (result) => {
          self._initLectureList(result);
        }, null);
      },
      _initLectureList(data) {
        let self = this;
        let lectures = [];
        for (let i = 0; i < data.length; i++) {
          let lecture = {
            index: self.$t('Common.Lecture') + ' ' + (i + 1),
            id: data[i].LectureID,
            title: data[i].Title,
            lessonCount: data[i].LessonCount,
            status: self.$t('AddLesson.Ready')
          };

          lectures.push(lecture);
        }

        this.tableData = lectures;
      },
      createLecture() {
        this.$refs.lectureItem.readData(-1);
        this.modalItem = true;
      },
      tableSortChange(params) {

      },
      tableRowClick(row) {
        this.$refs.lectureItem.readData(row.id);
        this.modalItem = true;
      },
      handleItemRemove(){
        this.$refs.lectureItem.removeData();
      },
      handleItemOK() {
        this.$refs.lectureItem.saveData();
      },
      handleItemCancel(){
        this.modalItem = false;
      },
      afterItemSaveOrRemove() {
        this.refresh();
        this.modalItem = false;
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
      }
    }
  }
</script>
