<template>
  <div class="role-list">
    <Table ref="tableSystem" no-data-text="No Data" :stripe="true" :highlight-row="true"
           :data="tableDataSystem" :columns="tableColumnSystem"
           @on-sort-change="tableSortChange" @on-row-click="tableSystemRowClick">
    </Table>

    <div style="height: 50px;"></div>

    <Table ref="tableEmployee" no-data-text="No Data" :stripe="true" :highlight-row="true"
           :data="tableDataEmployee" :columns="tableColumnEmployee"
           @on-sort-change="tableSortChange" @on-row-click="tableEmployeeRowClick">
    </Table>

    <div style="margin: 20px 2px 40px; text-align: left">
      <Button type="text" icon="plus-round" @click="addRole" size="large" style="color: #2b85e4; font-weight: bold;">Add Roles</Button>
    </div>

  </div>
</template>

<style lang="scss">
  .role-list {
    .ivu-table {
      font-size: 13px;
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
  import auth from '../../authenticator';
  import friends from '../../friends';

  export default {
    props: {
      onRoleSelected: Function
    },
    data () {
      return {
        listType: 0, // Prospect
        dataTotal: 0,
        pageSize: 10,
        pageIndex: 1,
        sortKey: 0,
        sortOrder: 1,
        tableDataSystem: [
          { id: -1, name: 'Student' },
          { id: -2, name: 'Teacher' },
          { id: -3, name: 'Parent' }
        ],
        tableColumnSystem: [
          {
            title: 'System Role',
            key: 'name',
            sortable: false,
          }
        ],
        tableDataEmployee: [
          { id: 1, name: 'Business Manager' },
          { id: 2, name: 'Employee Teacher' },
          { id: 3, name: 'Office Manager Assistant' },
          { id: 4, name: 'Adviser'}
        ],
        tableColumnEmployee: [
          {
            title: 'Employee Job Role',
            key: 'name',
            sortable: false,
          }
        ]
      };
    },
    methods: {
      readData() {
      },
      initializeData(data) {
      },
      initialize() {
      },
      tableSortChange(params) {
      },
      tableSystemRowClick(row) {
        this.$refs.tableEmployee.clearCurrentRow();
        if (this.onRoleSelected) {
          this.onRoleSelected(row.id);
        }
      },
      tableEmployeeRowClick(row) {
        this.$refs.tableSystem.clearCurrentRow();
        if (this.onRoleSelected) {
          this.onRoleSelected(row.id);
        }
      },
      addRole() {

      }
    }
  }
</script>
