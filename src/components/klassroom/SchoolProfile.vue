<template>
  <div class="klassroom-school">
    <div class="header-part">
      School Profile

      <div style="float:right">
        <Button type="primary" @click="handleSave">Save</Button>
        <Button>Cancel</Button>
      </div>
    </div>

    <div style="padding:0 12px;">
      <school-info-school-profile ref="SchoolInfoSchoolProfile" :school-id="schoolId"></school-info-school-profile>
    </div>
  </div>
</template>

<style lang="scss">
.klassroom-school {
  padding: 1em 1.5em;

  .header-part {
    text-align: left;
    color: #1c2438;
    font-size: 24px;
    font-weight: bold;
    padding: 0.5em;
    border-bottom: 1px solid #5cadff;
    margin-bottom: 1em;
  }
}
</style>

<script>
import auth from "../../authenticator";
import SchoolInfoSchoolProfile from "../profile/SchoolInfoSchoolProfile";
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  components: {
    SchoolInfoSchoolProfile
  },
  data() {
    return {
      schoolId: auth.getChosenSchoolId()
    };
  },
  computed: {
    ...mapState(["Klassroom"]),
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.SchoolInfoSchoolProfile.initialize();
    });
  },
  methods: {
    handleSave() {
      this.$refs.SchoolInfoSchoolProfile.saveData(result => {
      });
    }
  }
};
</script>
