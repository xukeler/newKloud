<template>
  <div class="kloudsync-settings-topic-type">
    <div class="panel-header">
      Topic type setting

      <div class="panel-header-right">
        <Icon style="vertical-align: middle; margin-right: 0.25em;" type="ios-search" color="#80848f" size="24"></Icon>

        <div class="header-search-wrap">
          <Input v-model="searchTopicType" placeholder="Search ..."/>
        </div>
        <Button type="success" icon="plus-round" @click="handleAddTopicType">Create new type</Button>
      </div>
    </div>

    <div class="topic-type-list">
      <div class="topic-type-item" v-for="item in topicTypeList" :key="item.Id">
        <div style="float:right">
          <a href="javascript:void(0)" @click="handleEditTopicType(item)"><b>Edit</b></a>
        </div>
        <div>
          <p class="label-part">Type name:</p>
          <p><b>{{item.Name}}</b></p>
        </div>
        <div style="margin-top: 1em;">
          <p class="label-part">Type note:</p>
          <p>{{item.Note}}</p>
        </div>
        <div style="margin-top: 1em;">
          <p class="label-part">Open for adding new Customer Contacts:</p>
          <p><b>{{item.Customer ? 'Enable' : 'Disable'}}</b></p>
        </div>
      </div>
    </div>

    <div>
      <Modal v-model="modalTopicTypeDialog" :mask-closable="false" :title="topicTypeDialog.Title" width="640">
      <div>
        <div style="padding: 8px 24px; line-height:1.8em;">
          <b>Name: </b>
          <Input v-model="topicTypeDialog.Name" placeholder="Enter Type Name"/>
        </div>
        <div style="padding: 8px 24px; line-height:1.8em;">
          <b>Note: </b>
          <Input v-model="topicTypeDialog.Note" type="textarea" :autosize='{minRows:"4",maxRows:"8"}' placeholder="Enter Company Note" />
        </div>
        <div style="padding: 8px 24px; line-height:1.8em;">
          <b>Open for adding new Customer Contacts: </b> <i-switch v-model="topicTypeDialog.Customer" size="large" style="margin-left:3em;"></i-switch>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handleTopicTypeDialogOK">{{$t('Base.OK')}}</Button>
        <Button @click="handleTopicTypeDialogCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
    </div>
  </div>
</template>

<style lang="scss">
.kloudsync-settings-topic-type {
  height: 100%;
  width: 100%;
  background-color: #FBFBFD; 

  .panel-header {
    width: 100%;
    text-align: left;
    padding: 0 20px;
    height: 65px;
    line-height: 64px;
    position: relative;
    background-color: white; 
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

  .topic-type-list {
    padding: 24px;
    //min-height: calc(100% - 65px); 
    //height: calc(100% - 65px);
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;

    .topic-type-item {
      display: inline-block;
      width: 320px;
      min-height: 200px;
      margin: 24px;
      background: white;
      border: 1px solid #dddee1;
      border-radius: 5px;
      padding: 10px 16px;
      text-align: left;
      line-height: 1.8em;

      .label-part {
        color: #80848f;
      }
    }
  }
}
</style>

<script>
let sampleTopicTypeList = [
  {
    Id: 1,
    Name: 'Customer Service',
    Note: 'Customer service project is designed for seleted team members to perform a customer specific service or development project.',
    Customer: true
  },
  {
    Id: 2,
    Name: 'Customer Requirement Discussion',
    Note: 'Customer service project is designed for seleted team members to perform a customer specific service or development project.',
    Customer: false
  },
  {
    Id: 3,
    Name: 'Customer Leads',
    Note: 'Customer service project is designed for seleted team members to perform a customer specific service or development project.',
    Customer: false
  }
];
export default {
  data() {
    return {
      loading: false,
      searchTopicType: '',
      topicTypeList: sampleTopicTypeList,
      modalTopicTypeDialog: false,
      topicTypeDialog: {Title: 'Create Type', Id: 0, Name: '', Note: '', Customer: false}
    }
  },
  methods: {
    handleAddTopicType() {
      this.topicTypeDialog = {
        Title: 'Create Type', Id: 0, Name: '', Note: '', Customer: false, Detail: {}
      }
      this.modalTopicTypeDialog = true;
    },
    handleEditTopicType(item) {
      this.topicTypeDialog = {
        Title: 'Edit Type',
        Id: item.Id,
        Name: item.Name, 
        Note: item.Note, 
        Customer: item.Customer,
        Detail: item
      }
      this.modalTopicTypeDialog = true;
    },
    handleTopicTypeDialogOK() {
      let item = this.topicTypeDialog.Detail;
      item.Name = this.topicTypeDialog.Name;
      item.Note = this.topicTypeDialog.Note;
      item.Customer = this.topicTypeDialog.Customer;

      if (this.topicTypeDialog.Id <= 0) {
        item.Id = this.topicTypeList.length;
        this.topicTypeList.push(item);
      }

      this.modalTopicTypeDialog = false;
    },
    handleTopicTypeDialogCancel() {
      this.modalTopicTypeDialog = false;
    }
  }
}
</script>

