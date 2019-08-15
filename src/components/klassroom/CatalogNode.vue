<template>
  <div class="catalog-node" :class="data.selected ? 'catalog-node-selected' : ''" @click="handleClick()">
    <div class="catalog-node-action">
      <Dropdown placement="bottom-end" @on-click="actionOnClick">
        <a href="javascript:void(0)">
          <Icon type="android-more-vertical" size="16"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem v-if="canAddSibling" name="add-sibling"><Icon size="16" type="arrow-return-left"></Icon>{{$t('CatalogPart.AddSibling')}}</DropdownItem>
          <DropdownItem v-if="canAddChild" name="add-child"><Icon size="16" type="plus-round"></Icon>{{$t('CatalogPart.AddChild')}}</DropdownItem>
          <DropdownItem name="edit" :disabled="data.type > 10 && data.type != 11"><Icon size="16" type="edit"></Icon> {{$t('Base.Edit')}}</DropdownItem>
          <DropdownItem name="delete" :disabled="data.type > 10"><Icon size="16" type="trash-a"></Icon> {{$t('Base.Delete')}}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>

    <!--<span class="k-sprite" :class="data.icon"></span>-->
    <i class="icon" :class="iconClass"></i>
    <span class="ivu-tree-title" :style="data.type == 0 ? 'font-weight:bold': ''">{{data.title}}</span>
  </div>
</template>

<style lang="scss">

</style>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    ...mapState(["Klassroom", "KlassroomSettings"]),

    isSchool() {
      return this.Klassroom.type == 1;
    },
    canAddSibling() {
      return this.data.type > 0 && this.data.type < 10;
    },
    canAddChild() {
      if (this.isSchool) {
        return this.data.type < 10;
      }
      else {
        return this.data.type < 4;
      }
    },
    iconClass() {
      switch (this.data.type) {
        case 0: // School
          return "";
        case 1: // Campus
          return "icon-campus color-blue";
        case 2: // College
          return "icon-colledge color-light-blue";
        case 3: // Department
          return "icon-deparment color-brown";
        case 4: // Specialty
          return "icon-organization color-blue";
        case 11: // Grade
          return "icon-organization color-brown";
        case 12: // Class
          return "icon-organization color-light-blue";
        default:
          return "";
      }
    }
  },
  methods: {
    handleClick() {
      $(".calalog-part")
        .find(".catalog-node-selected")
        .removeClass("catalog-node-selected");
      $(this.$el).addClass("catalog-node-selected");

      this.$emit("selected", this.data);
    },
    actionOnClick(name) {
      let parent = this.$parent.$parent.data;
      this.$emit("action", { name: name, item: this.data, parent: parent });
    }
  }
};
</script>


