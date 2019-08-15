<template>
  <div class="kloudsync-topic-tasks">
    <div style="padding: 24px 24px 0;">
      <div class="topic-action-header">
        Story & Task

        <div class="topic-task-add">
          <Icon type="ios-plus-outline" size="24"></Icon>
        </div>
      </div>
    </div> 

    <div class="task-summary">
      <div class="task-summary-line" style="border-bottom: 1px solid #dddee1;">
        <div>
          <p>Stories</p>
          <p>80</p>
        </div>
        <div>
          <p>Tasks</p>
          <p>140</p>
        </div>
        <div>
          <p>Finished</p>
          <p>10.4%</p>
        </div>
      </div>
      <div class="task-summary-line">
        <div>
          <span>Time spent: </span><span>40h</span>
        </div>
        <div>
          <span>Time Remaining: </span><span>343h</span>
        </div>
      </div>
    </div>

    <div class="task-tree">
      <Tree :data="taskTreeData" :render="taskTreeRender" empty-text="No Task"></Tree>
    </div>
  </div>  
</template>

<style lang="scss">
.kloudsync-topic-tasks {
  .topic-task-add {
    float: right;
    cursor: pointer;
  }

  .task-summary {
    padding: 0 24px 1em;
    border-bottom: 1px solid #dddee1;

    .task-summary-line  {
      padding: 0.75em 1em;
      display:flex;
      align-items: center;
      justify-content: space-between;

      div {
        display: inline-block;
        text-align: center;

        p:first-of-type, span:first-of-type {
          color:#80848f;
        }
        p:last-of-type, span:last-of-type {
          font-weight: bold;
        }
      }
    }
  }

  .task-tree {
    padding: 24px;

    .ivu-tree-arrow {
      padding-top: 3px;
      vertical-align: top;
    }
  }
}
</style>

<script>
import auth from "../../authenticator";
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import TopicTaskTreeItem from "./TopicTaskTreeItem";

export default {
  props:["catalogId", "catalogTypeName", "catalogName"],
  data() {
    return {
      loading: false,
      taskTreeData: [],
    }
  },
  computed: {
    ...mapState(['kloudsyncTopic']),

    schoolId() {
      return auth.getChosenSchoolId();
    },
    currentTeam() {
      return this.kloudsyncTopic.currentTeam;
    },
    currentTopic() {
      return this.kloudsyncTopic.currentTopic;
    },
    teamId(){
      return this.kloudsyncTopic.currentTeam.id;
    },
    topicId(){
      return this.kloudsyncTopic.currentTopic.id;
    },
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    initialize() {
      this.taskTreeData = [];
      this.taskTreeData.push({
        id: 7,
        type: 2,
        title: 'EMEA ServiceWise and CustomerWise push for Reseller and Sales',
        owner: 'Chris Drake',
        spent: '12h',
        remaining: '8h',
        total: '20h',
        expand: true,
        children: [{
          id: 798,
          type: 1,
          title: 'Life Advice Looking Through A Window',
          owner: 'Chris Drake',
          spent: '12h',
          remaining: '8h',
          total: '20h',
        }]
      });
      this.taskTreeData.push({
        id: 18,
        type: 2,
        title: 'Where Can You Find Unique Myspace Layouts Nowadays',
        owner: 'Chris Drake',
        spent: '12h',
        remaining: '8h',
        total: '20h',
        expand: true,
      });
    },
    taskTreeRender(h, { root, node, data }) {
      return h(TopicTaskTreeItem, {
        props: { data: data }
      });
    },
    _getData(url, before, success, error) {
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    },
    _postData(url, data, before, success, error) {
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        data: JSON.stringify(data),
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (resultString) {
          let result = JSON.parse(resultString);
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    },
    _deleteData(url, before, success, error) {
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'DELETE',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    }
  }
}
</script>
