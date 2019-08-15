<template>
  <div class="kloudsync-topic-task-tree-item">
    <div class="topic-task-title">
      {{data.title}}
    </div>
    <div class="topic-task-detail">
      <div>
        <Icon v-if="data.type == 2" type="ios-grid-view" size="20" color="#2b85e4"></Icon>
        <Icon v-else type="document" size="20" color="#2d8cf0"></Icon>
        <span>{{data.id}}</span>
      </div>
      <div>{{data.owner}}</div>
      <div>{{data.spent}} / {{data.total}}</div>
    </div>
  </div>
</template>

<style lang="scss">
.kloudsync-topic-task-tree-item {
  display: inline-block;
  width: 100%;
  font-size: 14px;
  white-space: normal;
  padding: 0 24px 1em 0.5em;

  .topic-task-title {
    font-weight: bold;
  }
  .topic-task-detail {
    display:flex;
    align-items: center;
    justify-content: space-between;
    color:#80848f;

    div {
      display: inline-block;
    }
  }
}
</style>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
}
</script>
