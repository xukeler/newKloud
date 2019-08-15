<template>
  <div id="klassroom-customers">
    <div class="header-part">
      Customers
    </div>
    <div class="action-part">
      <Button type="primary" shape="circle" icon="plus-round">Add Customer</Button>
      <Input style="float:right; width:250px;" v-model="searchText" icon="search" placeholder="Search"></Input>
    </div>
    <contact-list-generic ref="list" list-type="customer" :school-id="schoolId" :on-contact-selected="showContactDetail"></contact-list-generic>
  </div>
</template>

<style lang="scss">
#klassroom-customers {
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
  }
}
</style>

<script>
import auth from "../../authenticator";
import ContactListGeneric from  '../contacts/ContactListGeneric';

export default {
  components: {
    ContactListGeneric
  },
  data() {
    return {
      showDetail: false,
      searchText: '',
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
  mounted() {
    this.$refs.list.initialize();
  },
  methods: {
    showContactDetail(id) {
      this.$parent.showContactDetail(id);
    }
  }
};
</script>
