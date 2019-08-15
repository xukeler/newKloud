<template>
  <div class="course-list-action" style="width:20px;">
    <Dropdown placement="bottom-end" @on-click="actionOnClick">
      <a href="javascript:void(0)">
        <Icon type="more" size="16"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="view"><Icon type="document-text" size="16"></Icon> View</DropdownItem>
        <DropdownItem name="edit"><Icon type="compose" size="16"></Icon> Edit</DropdownItem>
        <DropdownItem name="delete"><Icon type="trash-a" size="16"></Icon> Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  props: ["listType", "courseId"],
  methods: {
    actionOnClick(name) {
      switch (name) {
        case "view":
          break;

        case "edit":
          break;

        case "delete":
          break;
      }

      alert(name + ": " + this.courseId + " in " + this.listType);
    }
  }
};
</script>
