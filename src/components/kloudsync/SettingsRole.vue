<template>
  <div class="kloudsync-settings-role">
    <div class="panel-header">
      Job role setting

      <div class="panel-header-right">
        <Icon style="vertical-align: middle; margin-right: 0.25em;" type="ios-search" color="#80848f" size="24"></Icon>

        <div class="header-search-wrap">
          <Input v-model="searchRole" placeholder="Search ..."/>
        </div>
        <Button type="success" icon="plus-round" @click="handleAddRole">Add job role</Button>
      </div>
    </div>
    <div class="panel-content-cover">
      <div class="setting-content">
        <Table :columns="roleColumns" :data="roleData" :loading="loading" no-data-text="No Job Role Created." size="large" stripe highlight-row></Table>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.kloudsync-settings-role {
  height: 100%;
  width: 100%;

  .panel-header {
    width: 100%;
    text-align: left;
    padding: 0 20px;
    height: 65px;
    line-height: 65px;
    position: relative;
    border-bottom: 1px solid #dddee1;
    font-size: 16px;
    font-weight: bold;

    .panel-header-right {
      float: right;
      font-size: 14px;
      font-weight: normal;

      .header-search-wrap {
        display: inline-block;
        width: 200px;
        vertical-align: middle;
        margin-right: 1em;

        .ivu-input {
          border-color: transparent;
        }
      }
    }
  }

  .panel-content-cover {
    padding:24px; 
    background-color: #FBFBFD; 
    min-height: calc(100% - 65px); 
    height: calc(100% - 65px);
    width:100%;
  }

  .setting-content {
    width: 100%;
    height: 100%;
    background: #fff;
    border: 1px solid #dddee1;
    border-radius: 3px;

    .ivu-table-wrapper {
      border: none;
    }

    .table-action-icon {
      opacity: 0;
      cursor: pointer;
      margin-right: 1em;
    }

    tr:hover .table-action-icon, .ivu-table-row-highlight .table-action-icon {
      opacity: 1;
    }

    .ivu-table th {
      // background-color: #495060;
      // color: white;
      background-color: white;
      color: #80848f;
      border-bottom: 1px solid #dddee1;
      text-align: center;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      loading: false,
      searchRole: '',
      roleData: [],
      roleColumns: [
        {
          title: 'JOB ROLE',
          key: 'name',
          align: 'center',
        },
        {
          title: 'DOCUMENT PRIVILEGE',
          key: 'document',
          align: 'center',
        },
        {
          title: 'MEETING PRIVILEGE',
          key: 'meeting',
          align: 'center',
        },
        {
          title: 'TOPIC PRIVILEGE',
          key: 'topic',
          align: 'center',
        },
        {
          title: " ",
          key: "action",
          width: 80,
          align:"left",
          render: (h, params) => {
            return h("Dropdown",{props:{trigger:"hover", placement: 'bottom-end'},class: 'table-action-icon'},
            [h('Icon', {props: {type: 'more', size: '16', color: 'black'}}),h('DropdownMenu',{slot:"list"},
            [ h("div",{props:{name:"edit"},style:{padding:'3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleEditRole(params);
                }
              }
              },[h('Icon', {props: {type: 'ios-compose-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Edit")]),              
              h("div",{props:{name:"delete"},style:{padding:'3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleDeleteRole(params);
                }
              }},[h('Icon', {props: {type: 'ios-trash-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Delete")])
            ])]);
          }
        }
      ],    
    };
  },
  methods: {
    handleAddRole() {

    },
    handleEditRole(params) {

    },
    handleDeleteRole(params) {

    }
  }
}
</script>

