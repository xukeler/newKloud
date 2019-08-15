<template>
  <div class="admin-detail">
    <div class="close-button" @click="handleClose">
      <Icon type="close-round" size="20" title="close"></Icon>
    </div>

    <div class="header">
      Privileges
    </div>

    <div v-show="isStudent">
      <Checkbox size="large" v-model="addTeacher">Can add teachers as a contact</Checkbox>
      <Checkbox size="large" v-model="addStudent">Can add other students as a contact</Checkbox>
      <Checkbox size="large" v-model="addEmployee">Can add office staff as a contact</Checkbox>
    </div>

    <div v-show="isTeacher">
      <Checkbox size="large" v-model="addTeacher">Can add other teachers as a contact</Checkbox>
      <Checkbox size="large" v-model="addStudent">Can add students as a contact</Checkbox>
      <Checkbox size="large" v-model="addEmployee">Can add office staff as a contact</Checkbox>
    </div>

    <div v-show="isParent">
      <Checkbox size="large" v-model="addTeacher">Can add teachers as a contact</Checkbox>
      <Checkbox size="large" v-model="addStudent">Can add students as a contact</Checkbox>
      <Checkbox size="large" v-model="addParent">Can add other parents as a contact</Checkbox>
      <Checkbox size="large" v-model="viewLive">Can view live lessons</Checkbox>
      <Checkbox size="large" v-model="viewFinished">Can view finished lessons</Checkbox>
    </div>

    <div v-show="isEmployee">
      <Checkbox size="large" v-model="addTeacher">Can add teachers as a contact</Checkbox>
      <Checkbox size="large" v-model="addStudent">Can add students as a contact</Checkbox>
      <Checkbox size="large" v-model="addEmployee">Can add other employees as a contact</Checkbox>
      <Checkbox size="large" v-model="viewLive">Can view live lessons</Checkbox>
      <Checkbox size="large" v-model="viewFinished">Can view finished lessons</Checkbox>
    </div>
  </div>
</template>

<style lang="scss">
  .admin-detail {
    text-align: left;
    padding: 12px 24px;
    position: relative;

    .close-button {
      cursor: pointer;
      position: absolute;
      z-index: 1;
      right: 15px;
      top: 12px;
    }

    .header {
      font-size: 20px;
      text-align: left;
      color: #1c2438;
      border-bottom: 1px solid #dddee1;
      padding: 10px;
      margin-bottom: 20px;
    }

    label {
      line-height: 2.5em;
    }

    .ivu-checkbox {
      margin-right: 0.6em;
    }
  }

</style>

<script>
  import auth from '../../authenticator';

  export default {
    data() {
      return {
        isStudent: false,
        isTeacher: false,
        isParent: false,
        isEmployee: false,
        addStudent: false,
        addTeacher: false,
        addParent: false,
        addEmployee: false,
        viewLive: false,
        viewFinished: false,
      };
    },
    methods: {
      readData(id) {
        let type = id;

        this.isStudent = type === -1;
        this.isTeacher = type === -2;
        this.isParent = type === -3;
        this.isEmployee = type > 0;
      },
      handleClose() {
        this.$parent.hideDetailPanel();
      }
    }
  }
</script>
