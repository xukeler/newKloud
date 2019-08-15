<template>
  <div class="student-list">

    <Tabs @on-click="tabOnClick" v-model="currentTab">
      <TabPane :label="$t('StudentsView.Prospects')" name="prospect">
      </TabPane>
      
      <TabPane :label="$t('StudentsView.Students')" name="student">
      </TabPane>

      <TabPane :label="$t('StudentsView.Parents')" name="parent">
      </TabPane>

      <!-- <TabPane label="Classes" name="class">
      </TabPane> -->

      <add-contact :type="currentTab" :onContactAdded="handleContactAdded" slot="extra" :school-id="schoolId" @seleted-stu="changeData"></add-contact>
    </Tabs>

    <div style="margin-top:1em;">
      <div v-show="currentTab === 'prospect'">
        <contact-list-generic list-type="prospect" ref="listProspect" :school-id="schoolId" :on-contact-selected="showContactDetail" :hide-detail-panel="hideDetailPanel"></contact-list-generic>
      </div>
      <div v-show="currentTab === 'student'">
        <contact-list-generic list-type="student" ref="listStudent" :school-id="schoolId" :on-contact-selected="showContactDetail" :hide-detail-panel="hideDetailPanel"></contact-list-generic>
      </div>
      <div v-show="currentTab === 'parent'">
        <contact-list-generic list-type="parent" ref="listParent" :school-id="schoolId" :on-contact-selected="showContactDetail" :hide-detail-panel="hideDetailPanel"></contact-list-generic>
      </div>
      <!-- <div v-show="currentTab === 'class'">
        <classes-list list-type="class" ref="listClass" :school-id="schoolId" :on-contact-selected="showContactDetail"></classes-list>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss">
  .student-list {
    //padding: 28px;
    text-align: left;

    .ivu-tabs-nav-container {
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import AddContact from './AddContact';
  import ContactListGeneric from  './ContactListGeneric';
  import ClassesList from  './ClassesList';

  export default {
    components: {
      AddContact,
      ContactListGeneric,
      ClassesList
    },
    props: {
      schoolId: Number
    },
    data() {
      return {
        currentTab: "student",
      }
    },
    mounted() {
      let tab = localStorage.getItem('StudentListCurrentTab');
      if (!tab)
        tab = 'student';

      this.currentTab = tab;

      this.$nextTick(() => {
        this.initializeTab(this.currentTab);
      });
    },
    methods: {
      refresh(type) {
        let tab = this.currentTab;
        if (type)
          tab = type;

        switch (tab) {
          case "prospect":
            this.$refs.listProspect.refresh();
            break;

          default:
          case "student":
            this.$refs.listStudent.refresh();
            break;

          case "parent":
            this.$refs.listParent.refresh();
            break;

          case "class":
            this.$refs.listClass.refresh();
            break;
        }
      },
      initializeTab(name) {
        switch (name) {
          case "prospect":
            this.$refs.listProspect.initialize();
            break;

          default:
          case "student":
            this.$refs.listStudent.initialize();
            break;

          case "parent":
            this.$refs.listParent.initialize();
            break;

          case "class":
            this.$refs.listClass.initialize();
            break;
        }

        this.currentTab = name;
        localStorage.setItem('ContactListCurrentTab', name);
      },
      tabOnClick(name) {
        this.$parent.hideDetailPanel();
        this.initializeTab(name);
      },
      hideDetailPanel(){
        this.$parent.hideDetailPanel();
      },
      showContactDetail(id) {
        this.$parent.showDetailPanel(id);
      },
      handleContactAdded(type) {
        this.refresh(type);
      },
      changeData(val){
        this.currentTab="student";
      }
    }
  }
</script>
