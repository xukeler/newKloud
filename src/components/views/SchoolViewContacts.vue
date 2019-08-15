<template>
  <div id="schoolViewContacts">
    <div class="panelContactList">
      <contact-list ref="list" :show-header="false"></contact-list>
    </div>
    <div class="panelContactDetail" v-show="showDetail">
      <contact-detail ref="detail" :on-detail-changed="onDetailChanged"></contact-detail>
    </div>
  </div>
</template>

<style lang="scss">
  #schoolViewContacts {
    background-color: transparent;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    min-width: 785px;
    min-height: 200px;
    width: 100%;

    .panelContactList {
      -webkit-box-flex: 5500;
      -moz-box-flex: 5500;
      box-flex: 5500;
      -webkit-flex: 5500 1 500px;
      -moz-flex: 5500 1 500px;
      -ms-flex: 5500 1 500px;
      flex: 5500 1 500px;
      //max-width: 1200px;
      min-width: 500px;

      background-color: #FFFFFF;
      //box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      box-shadow: none;
      border-radius: 0;
    }

    .panelContactDetail {
      -webkit-box-flex: 0;
      -moz-box-flex: 0;
      box-flex: 0;
      -webkit-flex: 0 0 400px;
      -moz-flex: 0 0 400px;
      -ms-flex: 0 0 400px;
      flex: 0 0 400px;

      margin-left: 24px; //10px;

      background-color: #FFFFFF;
      padding: 0;
      //box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      box-shadow: none;
      border-radius: 0;
      border-left: 1px solid #dddee1;
      padding-left: 24px;
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
  import ContactList from '../contacts/contactlist.vue';
  import ContactDetail from '../contacts/contactdetail.vue';

  export default {
    components: {
      ContactList,
      ContactDetail
    },
    data: function () {
      return {
        showDetail: false
      };
    },
    mounted: function () {
      this.$on("viewChanged", function (view) {
        this.$parent.$emit("viewChanged", 'contacts');
      });

      this.$parent.$emit("viewChanged", 'contacts');
    },
    methods: {
      showDetailPanel(id) {
        this.showDetail = true;
        this.$refs.detail.initialize(id);
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
