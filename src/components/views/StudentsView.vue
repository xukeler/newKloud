<template>
  <div id="studentsView">
    <div class="paneGutter"></div>
    <div class="panelList">
      <student-list ref="list" :school-id="schoolId"></student-list>
    </div>
    <div class="panelDetail" v-show="showDetail">
      <contact-detail ref="detail" :school-id="schoolId" :on-detail-changed="onDetailChanged"></contact-detail>

      <div class="close-button" @click="hideDetailPanel">
        <Icon type="close-round" size="20" title="close"></Icon>
      </div>
    </div>
    <div class="paneGutter"></div>
  </div>
</template>

<style lang="scss">
  #studentsView{
    background-color: transparent;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    min-height: 1px;
    padding-top: 20px;
    min-width: 785px;
    min-height: 200px;
    width: 100%;

    .paneGutter {
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      box-flex: 1;
      -webkit-flex: 1 0 20px;
      -moz-flex: 1 0 20px;
      -ms-flex: 1 0 20px;
      flex: 1 0 20px;
    }

    .panelList {
      -webkit-box-flex: 5500;
      -moz-box-flex: 5500;
      box-flex: 5500;
      -webkit-flex: 5500 1 500px;
      -moz-flex: 5500 1 500px;
      -ms-flex: 5500 1 500px;
      flex: 5500 1 500px;
      max-width: 1200px;
      min-width: 500px;

      background-color: #FFFFFF;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 3px;
      padding: 28px;
    }

    .panelDetail {
      -webkit-box-flex: 0;
      -moz-box-flex: 0;
      box-flex: 0;
      -webkit-flex: 0 0 400px;
      -moz-flex: 0 0 400px;
      -ms-flex: 0 0 400px;
      flex: 0 0 400px;

      margin-left: 10px;

      background-color: #FFFFFF;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 3px;
      padding: 28px;
      position: relative;
    }

    .close-button {
      cursor: pointer;
      position: absolute;
      z-index: 1;
      right: 28px;
      top: 28px;
    }

    .ivu-table th {
      background-color: #495060;
      color: white;
    }

    .ivu-table-row-highlight td {
      background-color: #dddee1;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import StudentList from '../contacts/StudentList.vue';
  import ContactDetail from '../contacts/contactdetail.vue';

  export default {
    components: {
      StudentList,
      ContactDetail
    },
    data: function () {
      return {
        showDetail: false
      };
    },
    computed: {
      schoolId() {
        return auth.getChosenSchoolId();
      },
      isSchool() {
        return this.schoolId != auth.getCustomerID();
      }
    },
    mounted: function () {
      this.$parent.$emit("viewChanged", "students");
    },
    methods: {
      showDetailPanel(id, type) {
        this.showDetail = true;
        this.$refs.detail.readData(id, type);
      },
      hideDetailPanel() {
        this.showDetail = false;
      },
      onDetailChanged(id) {
        this.$refs.list.refresh();
      }
    }
  }
</script>
