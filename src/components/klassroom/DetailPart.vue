<template>
  <div class="detail-part">
    <contact-detail ref="detail" :school-id="schoolId" :on-detail-changed="onDetailChanged"></contact-detail>
  </div>
</template>

<style lang="scss">
.detail-part {
  padding: 1em 1.5em;
  text-align: left;
}
</style>

<script>
import auth from "../../authenticator";
import ContactDetail from '../contacts/contactdetail.vue';

export default {
  components: {
    ContactDetail
  },
  computed: {
    schoolId() {
      return auth.getChosenSchoolId();
    },
    isSchool() {
      return this.schoolId != auth.getCustomerID();
    }
  },
  methods: {
    showContactDetail(id) {
      this.$refs.detail.initialize(id);
    },
    onDetailChanged() {

    }
  }
}
</script>
