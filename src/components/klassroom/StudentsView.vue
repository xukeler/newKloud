<template>
  <div id="klassroom-students">
    <div class="header-part">
      {{headerLabel}}
    </div>
    <div class="action-part">
      <Input style="float:right; width:250px;" v-model="searchText" icon="search" placeholder="Search"/>
      <add-contact type="student" :school-id="schoolId" :is-klassroom="true" :folder-id="folderId" :onContactAdded="handleContactAdded"></add-contact>
    </div>
    <contact-list-generic ref="list" list-type="student" :school-id="schoolId" :folder-id="folderId"></contact-list-generic>
    <!-- <contact-list-from-courses ref="list" list-type="student" :school-id="schoolId" :folder-id="folderId" :cohort-id="cohortId" :term-id="termId"></contact-list-from-courses> -->
  </div>
</template>

<style lang="scss">
#klassroom-students {
  padding: 1em 1.5em;
  text-align: left;

  .header-part {
    color:#2b85e4;
    font-size: 16px;
    font-weight: bold;
    padding: 0.5em;
    border-bottom: 1px solid #5cadff
  }
  .action-part {
    padding: 1em 0;
    min-height: 60px;
  }
}
</style>

<script>
import auth from "../../authenticator";
import AddContact from  '../contacts/AddContact';
import ContactListGeneric from  '../contacts/ContactListGeneric';
// import ContactListFromCourses from  '../contacts/ContactListFromCourses';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  components: {
    ContactListGeneric,
    //ContactListFromCourses,
    AddContact
  },
  data() {
    return {
      showDetail: false,
      searchText: '',
    };
  },
  computed: {
    ...mapState(["Klassroom"]),

    headerLabel() {
      return "Students";
    },
    schoolId() {
      return auth.getChosenSchoolId();
    },
    folderId() {
      return this.Klassroom.currentFolder;
    },
    cohortId() {
      return this.Klassroom.currentCohort;
    },
    termId() {
      return this.Klassroom.currentTerm.id;
    }
  },
  watch: {
    folderId(to, from) {
      this.$nextTick(() => {
        this.refresh();
      });
    },
    // cohortId(to, from) {
    //   this.$nextTick(() => {
    //     this.refresh();
    //   });
    // },
    // termId(to, from) {
    //   this.$nextTick(() => {
    //     this.refresh();
    //   });
    // }
  },
  mounted() {
    this.$refs.list.initialize();
  },
  methods: {
    refresh() {
      this.$refs.list.reset();
      this.$refs.list.refresh();
    },
    showContactDetail(id) {
      this.$parent.showContactDetail(id);
    },
    handleContactAdded() {
      this.$refs.list.refresh();
    }
  }
};
</script>
