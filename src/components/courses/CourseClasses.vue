<template>
  <div class="course-classes">
    <div class="header-part">
      <span class="header-label">{{$t('CourseClasses.Classes')}}</span>
      <Button type="text" size="large" icon="plus-round" @click="handleInvite">{{$t('CourseClasses.Invite')}}</Button>
    </div>

    <div class="context-part">
      <Table :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
             :data="classTableData" :columns="classTableColumn">
      </Table>
    </div>

    <div>
      <Modal v-model="modalInvite" :mask-closable="false" :title="$t('CourseClasses.Invite')" :width="600" class="course-select-classes">
        <Tree ref="InviteClassTree" :data="classTreeData" :render="classTreeRender" show-checkbox multiple></Tree>
        <div slot="footer" style="display:none"></div>
        <div slot="close">
          <Button type="primary" :loading="loading" @click="handleInviteOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleInviteCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
  .course-classes {
    button {
      color: #0061BB;
      padding:0;
    }

    .header-part {
      .header-label {
        font-weight: bold;
      }

      button {
        float: right;
      }
    }

    .context-part {
      margin-top: 5px;

      .table-action-icon {
        opacity: 0;
        cursor: pointer;
        margin-right: 1em;
      }

      tr:hover .table-action-icon, .ivu-table-row-highlight .table-action-icon {
        opacity: 1;
      }
    }

    .footer-part {
      padding: 5px 50px;
      background-color: #dddee1;
      //margin-top: 5px;

      .total-label {
        font-weight: bold;
        float: right;
      }
    }
  }

  .course-select-classes {
    .ivu-modal-footer {
      border-width: 0;
    }

    .class-node {
      display: inline-block;
      width: 100%;
      line-height: 1em;
    }

    .ivu-tree-title {
      vertical-align: top;
      padding: 4px;
      margin-top:-2px;
    }

    .icon {
      font-size: 24px;
      vertical-align: middle;
    }
    .color-blue {
      color: #4a90e2;
    }
    .color-light-blue {
      color: #45c3d1;
    }
    .color-brown {
      color: #d18c45;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import friends from '../../friends';

  export default {
    props:{
      courseId: {
        type: Number,
        default: 0
      },
      schoolId:{
        type: Number,
        default:- 1,
      },
      isSchool:{
        type: Boolean,
        default: false,
      },
      termYear:{
        type: Number,
        default:- 1,
      },
      isCreating: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        classTableData: [],
        classTableColumn: [
          {
            title: "Classes",
            key: 'class',
            sortable: true,
          },
          {
            title: "College",
            key: 'college',
            sortable: true,
          },
          {
            title: "Department",
            key: 'department',
            sortable: true,
          },
          {
            title: "Students",
            key: 'students',
            sortable: true,
          },
          {
            title: "Grade",
            key: 'grade',
            sortable: true,
          },
          {
            title: ' ',
            key: 'action',
            width: 50,
            render: (h, params) => {
              return h('div', [
                h('span', {
                    class: 'table-action-icon', attrs: {title: this.$t('Common.Delete')}, on: {
                      click: () => {
                        this.handleDeleteClass(params);
                      }
                    }
                  },
                  [h('Icon', {props: {type: 'close-round', size: '16', color: '#ed3f14'}})])
              ]);
            }
          }
        ],
        modalInvite: false,
        checkedNodes: [],
        classTreeOrgData: [],
        classTreeData: [],
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.readClasses();
      });
    },
    methods: {
      readClasses() {
        let self = this;
        if (!this.isCreating) {
          let url = GetAPIUrl() + "CourseMember/ClassList";
          url += "?schooldID=" + this.schoolId;
          url += "&courseID=" + this.courseId;

          this._getData(url, null, (data) => {
            let list = [];
            self.checkedNodes = [];
            for (let i = 0; i < data.length; i++) {
              let node = self.readClassNode(data[i]);
              let item = self.buildTableDataItem(node);
              self.checkedNodes.push(item.id);
              list.push(item);
              self.classTableData = list;
            }
          }, null);
        }
      },
      readClassNode(data) {
        if (data) {
          let node = {
            id: data.FolderID,
            title: data.FolderName,
            type: data.FolderType,
            parentId: data.ParentFolderID,
            parent: this.readClassNode(data.ParentFolderNode)
          };
          return node;
        }
        else {
          return null;
        }
      },
      buildTableDataItem(node) {
        let item = {
          id: node.id,
          title: node.title,
          type: node.type,
        };
        this._Node2Item(item, node);

        return item;
      },
      _Node2Item(item, node) {
        if (!node) {
          return;
        }

        switch(node.type) {
          case 0: // School
            item.school = node.title;
            item.schoolId = node.id;
            break;
          case 1: // Campus
            item.campus = node.title;
            item.campusId = node.id;
            break;
          case 2: // College
            item.college = node.title;
            item.collegelId = node.id;
            break;
          case 3: // Department
            item.department = node.title;
            item.departmentId = node.id;
            break;
          case 4: // Specialty
            item.specialty = node.title;
            item.specialtyId = node.id;
            break;
          case 11: // Grade
            item.grade = node.title;
            item.gradeId = node.id;
            break;
          case 12: // Class
            item.class = node.title;
            item.classId = node.id;
            break;
        }

        if (node.parent) {
          this._Node2Item(item, node.parent);
        }
      },
      handleDeleteClass(params){
        let self = this;

        if (this.isCreating) {
          this.$Modal.confirm({
            title: self.$t('CourseClasses.AlertDeleteTitle'),
            content: self.$t('CourseClasses.AlertDeleteContent'),
            okText: self.$t("Common.Delete"),
            cancelText: self.$t("Base.Cancel"),
            onOk: () => {
              let id = params.row.id;
              self.classTableData.splice(params.index, 1);
              let index = self.checkedNodes.indexOf(id);
              if (index > -1)
                self.checkedNodes.splice(index, 1);
              self.emitSelectClassesData();
            }
          });
        }
        else {
          this.$Modal.confirm({
            title: self.$t('CourseClasses.AlertDeleteTitle'),
            content: self.$t('CourseClasses.AlertDeleteContent'),
            okText: self.$t("Common.Delete"),
            cancelText: self.$t("Base.Cancel"),
            onOk: () => {
              let id = params.row.id;
              let url = GetAPIUrl() + "CourseMember/Delete?courseID=" + this.courseId + "&memberIDs=" + id;
              self._deleteData(url, null, (data) => {
                self.classTableData.splice(params.index, 1);
                let index = self.checkedNodes.indexOf(id);
                if (index > -1)
                  self.checkedNodes.splice(index, 1);
                //self.readClasses();
              }, null);
            }
          });
        }       
      },
      emitSelectClassesData() {
        let data = this.classTableData;
        let eventdata = [];
        for(let i = 0; i < data.length; i++) {
          eventdata.push({"MemberID":data[i].id, "Role": 10});
        }
        this.$emit('select-ClassesData', eventdata);
      },
      handleInvite() {
        this.modalInvite = true;

        if (this.classTreeOrgData.length == 0) {
          let self = this;

          let url = GetAPIUrl() + "BusinessHierarchy/GetFolderTree";
          url += "?customerId=" + this.schoolId;
          url += "&termYear=" + this.termYear;

          this._getData(url, null, data => {
            self.classTreeOrgData = data;
            self.classTreeData = self._readFolderData(data, null);
          }, null);
        }
        else {
          this.classTreeData = this._readFolderData(this.classTreeOrgData, null);
        }
      },
      _readFolderData(data, parentItem) {
        let list = [];
        data.forEach(folder => {
          let item = {
            id: folder.FolderID,
            parent: parentItem, //folder.ParentFolderID,
            title: folder.FolderName,
            type: folder.FolderType,
            children: [],
            expand: true,
            checked: this.checkedNodes.indexOf(folder.FolderID) > -1,
          };

          item.children = this._readFolderData(folder.Children, item);

          list.push(item);
        });

        return list;
      },
      classTreeRender(h, { root, node, data }) {
        return h('span', {class: 'class-node'},
          [h('i', {class: 'icon ' + this._typeIconClass(data.type)}),
           h('span', {class:'ivu-tree-title'}, data.title)]);
      },
      _typeIconClass(type) {
        switch (type) {
          case 0: // School
            return "";
          case 1: // Campus
            return "icon-campus color-blue";
          case 2: // College
            return "icon-colledge color-light-blue";
          case 3: // Department
            return "icon-deparment color-brown";
          case 4: // Specialty
            return "icon-organization color-blue";
          case 11: // Grade
            return "icon-organization color-brown";
          case 12: // Class
            return "icon-organization color-light-blue";
          default:
            return "";
        }
      },
      handleInviteOK(e) {
        e.stopPropagation();
        if (this.isCreating) {
          this.checkedNodes = [];
          let checkNodes = this.$refs.InviteClassTree.getCheckedNodes();
          let list = [];
          for (let i = 0; i < checkNodes.length; i++) {
            let node = checkNodes[i];
            // Leaf node only
            if (node.children.length === 0) {
              let item = this.buildTableDataItem(node);
              this.checkedNodes.push(item.id);
              list.push(item);
            }
          }

          this.classTableData = list;
          this.emitSelectClassesData();                       

          this.modalInvite = false;
        }
        else {
          let checkNodes = this.$refs.InviteClassTree.getCheckedNodes();
          let list = [];
          for (let i = 0; i < checkNodes.length; i++) {
            let node = checkNodes[i];
            // Leaf node only
            if (node.children.length === 0) {
              if (this.checkedNodes.indexOf(node.id) < 0) {
                list.push({"MemberID":node.id, "Role": 10});
              }
            }
          }

          if (list.length == 0) {
            this.modalInvite = false;
          }

          let url = GetAPIUrl() + "CourseMember/AddCourseMember";
          let data = {
            "CourseID": this.courseId,
            "MemberList": list
          };

          let self = this;
          this._postData(url, data, null, (result) => {
              self.readClasses();
              self.modalInvite = false;
          }, null);
        }
      },
      handleInviteCancel(e) {
        e.stopPropagation();
        this.modalInvite = false;
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
      }
    }
  }
</script>
