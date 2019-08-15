<template>
  <div class="team-space-tree-item" :class="data.selected ? 'tree-item-selected' : ''" @click="handleClick()">
    <Icon v-if="data.type == 1" type="ios-people" size="24" style="margin-right:8px;"></Icon>
    <Icon v-else-if="data.type == 2" type="ios-checkmark" size="24" style="margin-right:8px;"></Icon>
    
    <span v-show="data.type == 0" class="ivu-tree-title" style="padding: 2px;max-width: 250px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" :style="data.type == 0 ? 'font-weight:bold': ''">{{$t('KloudSyncAccountContact.Teams')}}</span>
    <span v-show="data.type != 0" class="ivu-tree-title" style="padding: 2px;max-width: 250px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{data.name}}</span>
  </div>
</template>

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
   methods: {
    handleClick() {
      if (this.data.type > 0) {
        $(".contact-team-tree")
          .find(".tree-item-selected")
          .removeClass("tree-item-selected");
        $(this.$el).addClass("tree-item-selected");

        this.$emit("selected", this.data);
      }
    }
  }
}
</script>
