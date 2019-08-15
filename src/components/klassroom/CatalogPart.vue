<template>
  <div class="calalog-part">
    <div style="float:left">
      <h3 class="header">{{$t('CatalogPart.SelectDepartment')}}</h3>
    </div>
    <div style="float:right;padding:0px 10px;cursor:pointer;" v-if="showAddSchoolNode" @click="handleAddSchoolNode" :title="$t('CatalogPart.EstablishingCustomerSchool')">
      <Icon type="ios-plus-outline" size="20"></Icon>
    </div>
    <Input style="margin: 1em 0;" v-model="searchText" icon="search" :placeholder="$t('CatalogPart.Search')"/>
    <Tree :data="catalogData" :render="calalogRender" :empty-text="$t('Common.NoData')"></Tree>

    <div>
      <Modal v-model="modalCreate" :mask-closable="false" :title="createTitle">
        <table class="table-calalog-detail">
          <tr>
            <td class="td-title">
              {{$t('CatalogPart.Parent')}}
            </td>
            <td class="td-content" style="width:28px;">
              <i class="icon" :class="createData.parentIcon"></i>
            </td>
            <td class="td-content">
              {{createData.parentTitle}}
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr>
            <td class="td-title">
              {{$t('CatalogPart.Type')}}
            </td>
            <td class="td-content">
              <i class="icon" :class="createData.typeIcon"></i>
            </td>
            <td class="td-content">
              {{createData.typeName}}
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr>
            <td class="td-title">
              {{$t('CatalogPart.Name')}}
            </td>
            <td class="td-content" colspan="2">
              <Input v-model="createData.title" :placeholder="$t('CatalogPart.PlaceHolderName')" />
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr v-show="KlassroomSettings.enableSpecialty && createData.type === 3"> 
            <!--Department Folder suppport specialty or not-->
            <td class="td-title">
            </td>
            <td class="td-content" colspan="2">
              <Checkbox v-model="createData.supportSpecialty">Support Specialty</Checkbox>
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr>
            <td class="td-title">
            </td>
            <td class="td-content">
            </td>
            <td class="td-content">
            </td>
            <td class="td-gutter">
            </td>
          </tr>
        </table>
        <div slot="footer">
          <Button style="min-width: 72px;" type="primary" @click="handleCreateOK">{{$t('Base.OK')}}</Button>
          <Button style="" @click="handleCreateCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalEdit" :mask-closable="false" :title="editTitle">
        <table class="table-calalog-detail">
          <tr>
            <td class="td-title">
              {{$t('CatalogPart.Parent')}}
            </td>
            <td class="td-content" style="width:28px;">
              <i class="icon" :class="editData.parentIcon"></i>
            </td>
            <td class="td-content">
              {{editData.parentTitle}}
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr>
            <td class="td-title">
              {{$t('CatalogPart.Type')}}
            </td>
            <td class="td-content">
              <i class="icon" :class="editData.typeIcon"></i>
            </td>
            <td class="td-content">
              {{editData.typeName}}
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr>
            <td class="td-title">
              {{$t('CatalogPart.Name')}}
            </td>
            <td class="td-content" colspan="2">
              <Input v-model="editData.title" :placeholder="$t('CatalogPart.PlaceHolderName')" />
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr v-show="KlassroomSettings.enableSpecialty && editData.type === 3"> 
            <!--Department Folder suppport specialty or not-->
            <td class="td-title">
            </td>
            <td class="td-content" colspan="2">
              <Checkbox v-model="editData.supportSpecialty">Support Specialty</Checkbox>
            </td>
            <td class="td-gutter">
            </td>
          </tr>

          <tr>
            <td class="td-title">
            </td>
            <td class="td-content">
            </td>
            <td class="td-content">
            </td>
            <td class="td-gutter">
            </td>
          </tr>
        </table>
        <div slot="footer">
          <Button style="min-width: 72px;" type="primary" @click="handleEditOK">{{$t('Base.OK')}}</Button>
          <Button style="" @click="handleEditCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalGrade" :mask-closable="false" :title="gradeTitle">
        <table class="table-calalog-detail">
          <tr>
            <td class="td-title">
              {{$t('CatalogPart.Parent')}}
            </td>
            <td class="td-content" style="width:28px;">
              <i class="icon" :class="gradeData.parentIcon"></i>
            </td>
            <td class="td-content">
              {{gradeData.parentTitle}}
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr>
            <td class="td-title">
              {{$t('CatalogPart.Type')}}
            </td>
            <td class="td-content">
              <i class="icon" :class="gradeData.typeIcon"></i>
            </td>
            <td class="td-content">
              {{gradeData.typeName}}
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr>
            <td class="td-content" colspan="3" style="">
              <Select :disabled="gradeData.id > 0" v-model="gradeData.admissionYear" style="width:80%; margin-left:20%" @on-change="handleAdmissionYearChange">
                <Option v-for="item in admissionYearList" :value="item.id" :key="item.id" :disabled="item.disabled">{{ item.name }}</Option>
              </Select>
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr>
            <td class="td-title">
              Amount of grade: 
            </td>
            <td class="td-content" colspan="2">
              <Select v-model="gradeData.gradeAmount" style="width:100%" @on-change="handleGradeAmountChange">
                <Option v-for="item in gradeAmountList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
              <!-- <InputNumber :max="12" :min="1" v-model="gradeData.gradeAmount" @on-change="handleGradeAmountChange"></InputNumber> -->
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr>
            <td class="td-title">
            </td>
            <td class="td-content">
            </td>
            <td class="td-content">
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr v-for="grade in gradeData.gradeList" :key="grade.id">
            <td class="td-title">
              {{grade.name}}
            </td>
            <td class="td-content" colspan="2">
              <InputNumber :max="12" :min="1" v-model="grade.classAmount"></InputNumber>
            </td>
            <td class="td-gutter">
            </td>
          </tr>
          <tr>
            <td class="td-title">
            </td>
            <td class="td-content">
            </td>
            <td class="td-content">
            </td>
            <td class="td-gutter">
            </td>
          </tr>
        </table>
        <div slot="footer">
          <Button style="min-width: 72px;" type="primary" @click="handleGradeOK">{{$t('Base.OK')}}</Button>
          <Button style="" @click="handleGradeCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalAddSchoolNode" :mask-closable="false" :title="$t('CatalogPart.EstablishingCustomerSchool')">
        <div>
          <Input v-model="addSchoolNode.name" :placeholder="$t('CatalogPart.PlaceHolderName')"/>
        </div>
        <div slot="close" style="display:none"></div>
        <div slot="footer">
          <Button style="min-width: 72px;" type="primary" @click="handleAddSchoolNodeOK">{{$t('Base.OK')}}</Button>
          <Button style="" @click="handleAddSchoolNodeCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
$title-color: #17233d;
$content-color: #515a6e;
$images-root: "/static/images/";

.calalog-part {
  padding: 1em;
  color: $content-color;
  text-align: left;

  .header {
    color: $title-color;
  }

  .ivu-tree ul {
    font-size: 14px;
  }

  .ivu-tree-arrow {
    vertical-align: top;
    line-height: 1em;
  }

  .catalog-node {
    display: inline-block;
    width: 100%;
    line-height: 1em;

    .catalog-node-action {
      float: right;
      margin-right: 1em;
      opacity: 0;

      ul {
        padding: 0;

        li {
          margin: 0;
          padding: 5px 15px;
        }
      }

      i {
        margin-right: 8px;
      }
    }
  }

  .catalog-node:hover {
    .catalog-node-action {
      opacity: 1;
    }
  }

  .catalog-node.catalog-node-selected {
    .ivu-tree-title {
      background: #dddee1;
    }

    .catalog-node-action {
      opacity: 1;
    }
  }
}

.table-calalog-detail {
  width: 100%;

  .td-title {
    text-align: right;
    padding: 0.5em 1em;
    width: 30%;
  }

  .td-content {
    padding: 6px 0;
  }

  .td-gutter {
    width: 10%;
  }

  .ivu-select-dropdown {
    max-height: 500px;
  }
}

.calalog-part, .table-calalog-detail {
  .icon {
    font-size: 24px;
  }
  .ivu-tree-title {
    vertical-align: top;
    padding: 4px;
    margin: -4px 20px 0 -4px;
  }

  .color-blue {
    color: #4a90e2;
  }
  .color-light-blue {
    color: #45c3d1;
  }
  .color-brown {
    color: #d18c45;
  }

  .campus {
    background-image: url($images-root+"catalog-campus.png");
  }
  .college {
    background-image: url($images-root+"catalog-college.png");
  }
  .department {
    background-image: url($images-root+"catalog-department.png");
  }
  .class {
    background-image: url($images-root+"catalog-class.png");
  }
}
</style>

<script>
import auth from "../../authenticator";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import CatalogNode from "./CatalogNode.vue";

export default {
  components: {
    CatalogNode
  },
  data() {
    return {
      loading: false,
      customerId: auth.getChosenSchoolId(),
      searchText: "",
      catalogData: [],

      modalCreate: false,
      createTitle: "",
      createData: { title: "", id: "", type: 0, parent: null },

      modalEdit: false,
      editTitle: "",
      editData: { title: "", id: "", type: 0, item: null, parent: null },

      modalGrade: false,
      gradeTitle: "",
      gradeData: { title: "", id: "", type: 0, parent: null, gradeAmount: 0, gradeList: [] },
      admissionYearList: [],
      gradeAmountList: [],

      modalAddSchoolNode: false,
      addSchoolNode: { name: '' },
    };
  },
  computed: {
    ...mapState(["Klassroom", "KlassroomSettings"]),

    showAddSchoolNode(){
      return this.catalogData.length <=0;
    },
    currentTermYear() {
      return this.Klassroom.currentTerm.year;
    },
    showGrade() {
      let name = this.$route.name;
      return name === "klassroom-courses" || name === "klassroom-students";
    },
    isSchool() {
      return this.Klassroom.type == 1;
    }
  },
  watch: {
    showGrade(to, from) {
      this.$nextTick(() => {
        this.loadCatalog();
      });
    },
    currentTermYear(to, from) {
      this.$nextTick(() => {
        this.loadCatalog();
      });
    },
  },
  mounted() {
    this.loadCatalog();
  },
  methods: {
    loadCatalog() {
      let self = this;

      let url = GetAPIUrl() + "BusinessHierarchy/GetFolderTree";
      url += "?customerId=" + this.customerId;
      if (this.showGrade && this.currentTermYear)
        url += "&termYear=" + this.currentTermYear;
      else 
        url += "&termYear=-1";

      this._getData(url, null, data => {
          self.catalogData = self._readFolderData(data);
        }, null);
    },
    _readFolderData(data) {
      let list = [];
      let current = this.Klassroom.currentFolder;
      data.forEach(folder => {
        let item = {
          id: folder.FolderID,
          parent: folder.ParentFolderID,
          title: folder.FolderName,
          type: folder.FolderType,
          supportSpecialty: folder.SupportSpecialty == 1,
          admissionYear: folder.AdmissionYear,
          gradeAmount: folder.GradeAmount,
          gradeYear: folder.GradeYear,
          classAmount: folder.ClassAmount,
          children: this._readFolderData(folder.Children),
          expand: true,
          selected: folder.FolderID == current
        };

        list.push(item);
      });

      return list;
    },
    calalogRender(h, { root, node, data }) {
      return h(CatalogNode, {
        props: { data: data },
        on: {
          selected: item => {
            this.Klassroom.currentFolder = item.type == 0 ? -1 : item.id;
            //alert(item.title);
          },
          action: obj => {
            this.onActions(obj.name, obj.item, obj.parent);
          }
        }
      });
    },
    onActions(name, item, parent) {
      let type = 0;
      switch (name) {
        case "add-sibling":
          this.handleCreate(parent);
          break;

        case "add-child":
          this.handleCreate(item);
          break;

        case "edit":
          this.handleEdit(item, parent);
          break;

        case "delete":
          this.handleDelete(item, parent);
          break;
      }
    },
    handleAddSchoolNode(){
      this.modalAddSchoolNode = true;
    },
    handleAddSchoolNodeOK(){
      if(!this.addSchoolNode.name){
        this.$Message.warning({
          content: this.$t('CatalogPart.PleaseEnterNameOfCustomerSchool'),
          duration: 3
        });
        return;
      };
      let url = GetAPIUrl() + "BusinessHierarchy/CreateFolder";
      let data = {
        CustomerID: this.customerId,
        ParentFolderID: 0,
        FolderType: 0,
        FolderName: this.addSchoolNode.name,
      };
      
      let self = this;
      this._postData(url, data, null, (result) => {
        self.handleAddSchoolNodeCancel();
        self.loadCatalog();
      }, null);
      
    },
    handleAddSchoolNodeCancel(){
      this.addSchoolNode = { name: '' };
      this.modalAddSchoolNode = false;
    },
    handleDelete(item, parent) {
      let type = this._typeName(item.type);
      this.$Modal.confirm({
        title: this.$t('CatalogPart.Delete') + type,
        content: this.$t('CatalogPart.AreYouSureDeleteThis') + type + "?",
        okText: this.$t('Base.Delete'),
        cancelText: this.$t('Base.Cancel'),
        onOk: () => {
          let url = GetAPIUrl() + "BusinessHierarchy/DeleteFolder";
          url += "?customerId=" + this.customerId;
          url += "&folderId=" + item.id;

          this._deleteData(url, null, (result) => {
            if (parent.children) {
              let index = parent.children.indexOf(item);
              parent.children.splice(index, 1);
            }
            else {
              let index = parent.indexOf(item);
              parent.splice(index, 1);
            }
          }, null);
        }
      });
    },
    handleCreate(parent) {
      let type = this._childType(parent);
      if (type >= 10) {
        if (this.isSchool) {
          this.handleCreateGrade(parent);
          return;
        }
        else {
          return;
        }
      }

      this.createData.id = -1;
      this.createData.title = "";
      this.createData.type = this._childType(parent);
      this.createData.parent = parent;

      this.createData.parentTitle = parent.title;
      this.createData.parentIcon = this._typeIconClass(parent.type);
      this.createData.typeIcon = this._typeIconClass(type);
      this.createData.typeName = this._typeName(type);
      this.createData.supportSpecialty = this.KlassroomSettings.enableSpecialty;

      this.createTitle = this.$t('CatalogPart.Add') + this._typeName(this.createData.type);

      this.modalCreate = true;
    },
    _childType(parent) {
      let type = parent.type;
      let childtype = type + 1;
        
      if (childtype === 1 && !this.KlassroomSettings.enableCampus) // Campus
        childtype += 1;

      if (childtype === 2 && !this.KlassroomSettings.enableCollege) // College
        childtype += 1;

      if (childtype === 3 && !this.KlassroomSettings.enableDepartment) // Department
        childtype += 1;

      if (childtype === 4 && !(this.KlassroomSettings.enableSpecialty && parent.supportSpecialty)) // Specialty
        childtype += 1;

      if (childtype > 4)
        childtype = 10;

      return childtype;
    },
    _typeName(type) {
      switch (type) {
        case 0: // School
          return this.$t('CatalogPart.School');
        case 1: // Campus
          return this.$t('CatalogPart.Campus');
        case 2: // College
          return this.$t('CatalogPart.College');
        case 3: // Department
          return this.$t('CatalogPart.Department');
        case 4: // Specialty
          return this.$t('CatalogPart.Specialty');
        case 11: // Grade
          return this.$t('CatalogPart.Grade');
        case 12: // Class
          return this.$t('CatalogPart.Class');
        default:
          return this.$t('CatalogPart.Unknown');
      }
    },
    _typeIconClass(type) {
      switch (type) {
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
    },
    handleCreateOK() {
      let self = this;

      let url = GetAPIUrl() + "BusinessHierarchy/CreateFolder";
      let data = {
        CustomerID: this.customerId,
        FolderID: -1,
        ParentFolderID: this.createData.parent.id,
        FolderType: this.createData.type,
        FolderName: this.createData.title,
        SupportSpecialty: this.createData.supportSpecialty ? 1 : 0,
      };

      this._postData(url, data, null, (result) => {
        const parent = self.createData.parent;
        const children = parent.children || [];
        children.push({
          id: result,
          parent: parent.id,
          title: self.createData.title,
          type: self.createData.type,
          supportSpecialty: self.createData.supportSpecialty,
          gradeYear: self.createData.gradeYear,
          gradeAmount: self.createData.gradeAmount,
          classAmount: self.createData.classAmount,
          expand: true
        });
        self.$set(parent, "children", children);
        self.modalCreate = false;        
      }, null);
    },
    handleCreateCancel() {
      this.modalCreate = false;
    },
    handleEdit(item, parent) {
      let type = item.type;
      if (type >= 10) {
        this.handleEditGrade(item, parent);
        return;
      }

      this.editData.item = item;

      this.editData.id = item.id;
      this.editData.title = item.title;
      this.editData.type = item.type;
      this.editData.parent = parent;

      this.editData.parentTitle = this.editData.parent.title;
      this.editData.parentIcon = this._typeIconClass(this.editData.parent.type);
      this.editData.typeIcon = this._typeIconClass(this.editData.type);
      this.editData.typeName = this._typeName(this.editData.type);
      this.editData.supportSpecialty = item.supportSpecialty;

      this.editTitle = this.$t('CatalogPart.Edit') + this._typeName(this.editData.type);

      this.modalEdit = true;
    },
    handleEditOK() {
      let self = this;

      let url = GetAPIUrl() + "BusinessHierarchy/UpdateFolder";
      let data = {
        CustomerID: this.customerId,
        FolderID: this.editData.item.id,
        ParentFolderID: this.editData.item.parent,
        FolderType: this.editData.item.type,
        FolderName: this.editData.title,
        SupportSpecialty: this.editData.supportSpecialty ? 1 : 0,
      };

      this._postData(url, data, null, (result) => {
        self.$set(self.editData.item, "title", self.editData.title);
        self.editData.item.supportSpecialty = self.editData.supportSpecialty;
        self.modalEdit = false;
      }, null);        
    },
    handleEditCancel() {
      this.modalEdit = false;
    },
    handleCreateGrade(parent) {
      let self = this;

      let url = GetAPIUrl() + "BusinessHierarchy/GetExistedAdmissionYear";
      url += "?customerId=" + this.customerId;
      url += "&folderId=" + parent.id;

      this._getData(url, null, data => {
          self._handleCreateGrade(parent, data);
        }, null);
    },
    _handleCreateGrade(parent, existed) {
      this.gradeData.id = -1;
      this.gradeData.title = "";
      this.gradeData.parent = parent;

      this.gradeData.parentTitle = parent.title;
      this.gradeData.parentIcon = this._typeIconClass(parent.type);
      this.gradeData.typeIcon = this._typeIconClass(12); //this._typeIconClass(type);
      this.gradeData.typeName = this._typeName(12);//this._typeName(type);

      this.gradeData.gradeAmount = 4;
      this.gradeData.classAmount = 2;
      this.gradeData.gradeGroup = null;

      this._admissionYearList(existed);
      this._gradeAmountList();
      this.gradeData.gradeList = [];
      this._resetGradeList();

      this.gradeTitle = "Create Classes";

      this.modalGrade = true;
    },
    handleEditGrade(item, parent) {
      let self = this;

      let url = GetAPIUrl() + "BusinessHierarchy/GetFolderAndChildren";
      url += "?customerId=" + this.customerId;
      url += "&folderId=" + item.parent;

      this._getData(url, null, data => {
        let folder = self._readFolderData([data]);
        self._handleEditGrade(item, parent, folder[0]);
      }, null);
    },
    _handleEditGrade(item, parent, gradeGroup) {
      this.gradeData.id = gradeGroup.id;
      this.gradeData.title = "";
      this.gradeData.parent = parent;

      this.gradeData.parentTitle = parent.title;
      this.gradeData.parentIcon = this._typeIconClass(parent.type);
      this.gradeData.typeIcon = this._typeIconClass(12); //this._typeIconClass(type);
      this.gradeData.typeName = this._typeName(12);//this._typeName(type);

      this.gradeData.gradeAmount = gradeGroup.gradeAmount;
      this.gradeData.classAmount = 2;

      this.gradeData.gradeGroup = gradeGroup;

      this.admissionYearList.push({id: gradeGroup.admissionYear, name: gradeGroup.admissionYear});
      this.gradeData.admissionYear = gradeGroup.admissionYear;
      this._gradeAmountList();
      this.gradeData.gradeList = [];
      this._resetGradeList();

      this.gradeTitle = "Edit Classes";

      this.modalGrade = true;
    },
    _admissionYearList(existed) {
      let now = new Date();
      let year = now.getFullYear();

      this.admissionYearList = [];
      for (let i = year - 4; i <= year + 4; i++) {
        this.admissionYearList.push({id: i, name: i, disabled: existed.indexOf(i) >= 0});
      }

      let current = 0;
      for (let i = year; i <= year + 4; i++) {
        if (existed.indexOf(i) < 0) {
          current = i;
          break;
        }
      }
      if (current === 0) {
        for (let i = year; i >= year - 4; i--) {
          if (existed.indexOf(i) < 0) {
            current = i;
            break;
          }
        }
      }

      this.gradeData.admissionYear = current;
    },
    _gradeAmountList() {
      let list = [];
      list.push({id: 6, name: 'Six years'});
      list.push({id: 5, name: 'Five years'});
      list.push({id: 4, name: 'Four years'});
      list.push({id: 3, name: 'Three years'});
      list.push({id: 2, name: 'Two years'});
      list.push({id: 1, name: 'One year'});

      this.gradeAmountList = list;
    },
    _resetGradeList() {
      let year = this.gradeData.admissionYear;
      let list = [];

      let existed = 0;
      if (this.gradeData.gradeGroup) {
        let grades = this.gradeData.gradeGroup.children;
        existed = Math.min(grades.length, this.gradeData.gradeAmount);
        for (let i = 0; i < existed; i++) {
          list.push({
            id: grades[i].id,
            name: grades[i].title + ' - ' + (grades[i].gradeYear),
            gradeYear: grades[i].gradeYear,
            classAmount: grades[i].classAmount
          });
        }
      }

      for (let i = existed; i < this.gradeData.gradeAmount; i++) {
        list.push({
          id: -i,
          name: "Grade " + (i + 1) + ' - ' + (year + i),
          gradeYear: year + i,
          classAmount: this.gradeData.classAmount
        });
      }

      this.gradeData.gradeList = list;
    },
    handleAdmissionYearChange(current) {
      this._resetGradeList();
    },
    handleGradeAmountChange(current) {
      this._resetGradeList();
    },
    handleGradeOK() {
      let self = this;

      let url = ''
      if (this.gradeData.id > 0) {
        url = GetAPIUrl() + "BusinessHierarchy/UpdateClassFolder";
      }
      else {
        url = GetAPIUrl() + "BusinessHierarchy/CreateClassFolder";
      }

      let gradeList = [];
      for (let i = 0; i < this.gradeData.gradeList.length; i++) {
        gradeList.push({FolderID: this.gradeData.gradeList[i].id, GradeYear: this.gradeData.gradeList[i].gradeYear, ClassAmount: this.gradeData.gradeList[i].classAmount});
      }
      let data = {
        CustomerID: this.customerId,
        FolderID: this.gradeData.id,
        ParentFolderID: this.gradeData.parent.id,
        AdmissionYear: this.gradeData.admissionYear,
        GradeAmount: this.gradeData.gradeAmount,
        GradeList: gradeList,
      };

      this._postData(url, data, null, (result) => {
        self.loadCatalog();
        self.modalGrade = false;        
      }, null);
    },
    handleGradeCancel() {
      this.modalGrade = false;
    },
    _getData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            // self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          // self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _postData(url, data, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: JSON.stringify(data),
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(resultString) {
          let result = JSON.parse(resultString);
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _deleteData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "DELETE",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    }
  }
};
</script>
