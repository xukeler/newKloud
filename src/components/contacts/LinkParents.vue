<template>
  <div id="linkParents" class="link-parents-class">
    <Table :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loadingTable"
           :data="tableData" :columns="tableColumn" @on-current-change="handleCurrentChanged">
    </Table>

    <div style="margin-top: 2em;">
      <Button type="text" size="large" icon="plus-round" @click="handleLinkParent" v-show="!creatingParent">{{$t('LinkInfo.AddNewParent')}}</Button>
      <table class="contact-detail" v-show="creatingParent">
        <tr>
          <td>{{$t('LinkInfo.Parent')}}: </td>
          <td>
            <Select v-model="parentId" clearable filterable remote :remote-method="handleLoadParents" @on-change="handleChangeParent" :loading="loading"
                    :placeholder="$t('LinkInfo.PlaceHolderFindParent')" style="width: 100%">
              <Option v-for="item in parentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t('AddContact.Relationship')}}: </td>
          <td>
            <Select v-model="relationship" style="width: 100%">
              <Option v-for="item in relationshipList" :value="item.id" :key="item.id">{{ item.label }}</Option>
            </Select>
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td style="text-align: right">
            <Button type="primary" :loading="loading" @click="handleLinkParentOK">{{$t('Base.OK')}}</Button>
            <Button @click="handleLinkParentCancel">{{$t('Base.Cancel')}}</Button>
          </td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
  .link-parents-class {

    .ivu-table th {
      background-color: #495060;
      color: white;
    }

    .ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td {
      background-color: #aad5ff;
      //color: white;
    }

    .ivu-select-dropdown {
      max-height: 300px;
    }

    .contact-detail {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;

      td:first-of-type {
        text-align: right;
        width: 25%;
      }

      td:nth-of-type(2) {
        text-align: left;
        padding: 5px 20px;
      }
      td:last-of-type {
        width: 15%;
      }
    }

    .table-action-icon {
      opacity: 0;
      cursor: pointer;
      margin-right: 1em;
    }

    tr:hover .table-action-icon, .ivu-table-row-highlight .table-action-icon {
      opacity: 1;
    }
  }
</style>

<script>
  import auth from '../../authenticator';

  export default {
    props: {
      contactId: Number,
      schoolId: Number
    },
    data() {
      return {
        initialized: false,
        loading: false,
        loadingTable: false,
        tableData: [],
        tableColumn: [
          {
            title: ' ',
            key: 'avatar',
            sortable: false,
            width: 80,
            render: (h, params) => {
              return h('Avatar', {
                props: {
                  size: 'large',
                  src: params.row.avatar
                }
              });
            }
          },
          {
            title: this.$t("Common.Name"),
            key: 'name'
          },
          {
            title: this.$t("Common.Phone"),
            key: 'phone'
          },
          {
            title: this.$t('AddContact.Relationship'),
            key: 'relationship'
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
                        this.handleDeleteParent(params);
                      }
                    }
                  },
                  [h('Icon', {props: {type: 'close-round', size: '16', color: '#ed3f14'}})])
              ]);
            }
          }
        ],
        parentList: [],
        parentListTimeout: 0,
        relationshipList: [
          {id: 1, label: this.$t('AddContact.Father')},
          {id: 2, label: this.$t('AddContact.Mother')},
          {id: 3, label: this.$t('AddContact.Grandfather')},
          {id: 4, label: this.$t('AddContact.Grandmother')},
          {id: 5, label: this.$t('AddContact.Uncle')},
          {id: 6, label: this.$t('AddContact.Aunt')},
          {id: 7, label: this.$t('AddContact.Sister')},
          {id: 8, label: this.$t('AddContact.Brother')},
          {id: 0, label: this.$t('AddContact.Other')}
        ],
        creatingParent: false,
        parentId: null,
        relationship: 0,
      };
    },
    methods: {
      initialize() {
        this.readData();
      },
      refresh() {
        this.readData();
      },
      readData() {
        let self = this;

        let url = GetAPIUrl() + "SchoolContact/GetParents?userID=" + this.contactId;
        this._getData(url, () =>{
          this.loadingTable = true;
        }, (data) => {
          self.initializeData(data);
          this.loadingTable = false;
        }, (error) => {
          this.loadingTable = false;
        });
      },
      initializeData(data) {
        let list = [];
        for (let i = 0, count = data.length; i < count; i++){
          let user = data[i];
          let item = {
            id: user.UserID,
            avatar: user.AvatarUrl,
            name: user.UserName,
            gender: user.Gender,
            phone: user.Phone,
            email: user.Email,
            relationship: user.RelationshipLabel,
            detail: user
          };

          list.push(item);
        }

        this.tableData = list;
      },
      saveData(callback) {
        if (callback && typeof callback === 'function')
          callback();
      },
      handleCurrentChanged(currentRow) {

      },
      handleDeleteParent(params) {
        let self = this;

        this.$Modal.confirm({
          title: self.$t("LinkInfo.RemoveRelationshipTitle"),
          content: self.$t("LinkInfo.RemoveRelationshipContent"),
          okText: self.$t("Common.Delete"),
          cancelText: self.$t("Base.Cancel"),
          onOk: () => {
            let id = params.row.id;
            let url = GetAPIUrl() + "SchoolContact/DeleteRelationship?childID=" + this.contactId + "&parentID=" + id;

            self._deleteData(url, null, (result) => {
              self.refresh();
              self.$parent.$parent.$parent.$refs.list.refresh();//实时刷新学生列表关联的parent字段信息
            }, null);
          }
        });
      },
      handleLoadParents(query) {
        if (this.parentListTimeout) {
          clearTimeout(this.parentListTimeout);
          this.parentListTimeout = 0;
        }

        if (query === null || query === '') {
          this.parentList = [];
        }
        else {
          let self = this;

          this.parentListTimeout = setTimeout(() => {
            let url = GetAPIUrl() + "SchoolContact/SearchContact?schoolID=" + this.schoolId + '&roleID=' + auth.SchoolRole.Parents + '&keyword=' + query;
            this._getData(url, null, function (list) {
              let users = [];
              for (let i = 0; i < list.length; i++) {
                let item = list[i];
                let user = {
                  id: item.UserID,
                  avatar: item.AvatarUrl,
                  name: item.UserName,
                  phone: item.Phone,
                  role: item.Role,
                  detail: item
                };
                users.push(user);
              }

              self.parentList = users;
            });
          }, 500);
        }
      },
      handleChangeParent() {

      },
      handleLinkParent() {
        this.creatingParent = true;
      },
      handleLinkParentOK() {
        if (this.parentId === null || typeof this.parentId !== 'number') {
          this.$Modal.warning({
            title: this.$t('Common.Warning'),
            content: this.$t('LinkInfo.PleaseFindParent')
          });

          return;
        }

        let self = this;
        let url = GetAPIUrl() + "SchoolContact/AddRelationship";
        let data = {
          "ChildID": this.contactId,
          "ParentID": this.parentId,
          "Relationship": this.relationship
        };

        this._postData(url, data, null, (result) => {
          self.refresh();
          self.$parent.$parent.$parent.$refs.list.refresh();//实时刷新学生列表关联的parent字段信息
          self.creatingParent = false;
        }, null);
      },
      handleLinkParentCancel() {
        this.creatingParent = false;
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
