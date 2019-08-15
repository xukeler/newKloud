<template>
  <div id="user-profile-school">
    <div class="preview-part">
      <Button type="info" size="large" @click="handlePreview">{{$t('TeacherInfo.Preview')}}</Button>
    </div>

    <div class="status-part">
      <div class="part-header">{{$t('TeacherInfo.Status')}}</div>
      <div style="color:#2b85e4">{{$t('TeacherInfo.Active')}}  <Button type="primary" style="margin-left: 3em;" @click="handleStatusChange" :loading="loading">{{$t('TeacherInfo.Disactive')}}</Button></div>
    </div>

    <div class="status-part">
      <div class="part-header">{{$t('TeacherInfo.ApplicationStatus')}}</div>
      <div style="color:#2b85e4">{{$t('TeacherInfo.Applicationsubmitted')}}  <!--<Button type="primary" @click="handleStatusChange">Withdraw application</Button>--></div>
    </div>

    <div v-show="!isKlassroom" class="info-part">
      <school-info-block :school="school" :schoolId="schoolId" ref="schoolInfo"></school-info-block>
    </div>

    <div class="introduce-part">
      <div class="part-header">{{$t('SchoolInfoSchoolProfile.Slogan')}}</div>
      <Input v-model="slogan" type="textarea" :autosize="{minRows: 3, maxRows: 10}"></Input>
    </div>

    <div class="introduce-part">
      <div class="part-header">{{$t('SchoolInfoSchoolProfile.AboutOurSchool')}}</div>
      <textarea id="schoolDesc"  v-model="introduction" style="height:400px;" :placeholder="$t('SchoolInfoSchoolProfile.PlaceholderSomeDescriptionAboutScholl')"></textarea>
    </div>

    <div class="interests-part">
      <div class="part-header">{{$t('SchoolInfoSchoolProfile.TeachingSubjects')}}
        <div class="part-action-button">
          <Button type="text" icon="plus-round" @click="handleAddInterest">{{$t('SchoolInfoSchoolProfile.AddSubject')}}</Button>
        </div>
      </div>
      <div style="min-height: 5em; border: 1px solid #dddee1; border-radius: 3px; padding: 0.2em 0.5em;">
        <Tag v-for="item in interests" :key="item.firstId + '-' + item.secondId" :color="item.color">
          {{item.firstTitle}} <Icon type="arrow-right-a" style="margin: 0 0.3em"></Icon> {{item.secondTitle}}
        </Tag>
      </div>
    </div>

    <div class="picture-part">
      <div class="part-header">{{$t('SchoolInfoSchoolProfile.FrontPagePicture')}}</div>

      <Upload :action="picture.action"
              :headers="picture.headers"
              :show-upload-list="false"
              :default-file-list="picture.list"
              :before-upload="handleChangePictureBeforeUpload"
              :on-progress="handleChangePictureProgress"
              :on-success="handleChangePictureSuccess"
              :on-error="handleChangePictureError"
              accept="image/jpeg,image/png" type="drag">
        <div class="school-picture" v-if="picture.file">
          <img style="width: 100%;" :src="picture.file">
          <div class="school-picture-cover">
            <div style="padding-top: 100px">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>{{$t('SchoolInfoSchoolProfile.ClickOrDragPictureChange')}}</p>
            </div>
          </div>
        </div>
        <div class="school-picture" v-else>
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>{{$t('SchoolInfoSchoolProfile.ClickOrDragPictureUpload')}}</p>
          </div>
        </div>
      </Upload>
    </div>

    <div>
      <Modal v-model="modalPreview"  class-name="school-preview" :title="$t('SchoolInfoSchoolProfile.SchoolPreview')" :width="90" :mask-closable="false" :styles="{top: '1em'}">
        <div>
          <school-preview ref="preview" :school-id="schoolId"></school-preview>
        </div>

        <div slot="footer">
        </div>
      </Modal>

      <Modal v-model="modalInterest" :mask-closable="false" :width="640" :title="$t('SchoolInfoSchoolProfile.AddTeachingSubject')">

        <!--<Input v-model="editingInterest.searchText" placeholder="Keyword search ..." :icon='editingInterest.searchIcon' @on-change="handleInterestSearch" @on-click="handleInterestSearchCancel" style="width: 50%; margin-bottom: 1em;"></Input>-->
        <div class="school-interests">
          <div style="display: inline-block">
            <Menu theme="light" @on-select="handleInterestSelected">
              <MenuItem v-for="item in firstLevelInterest" :name="item.id" :key="item.id">
                <table>
                  <tr>
                    <td>
                      {{item.title}}
                    </td>
                    <td>
                      <Icon type="chevron-right" size="16"></Icon>
                    </td>
                  </tr>
                </table>
              </MenuItem>
            </Menu>
          </div>

          <div style="display: inline-block; vertical-align: top; width:340px; padding-left: 1em;">
            <CheckboxGroup v-model="editingInterest.second" @on-change="handleInterestChanged">
              <div v-for="item in secondLevelInterest" :key="item.id" style="padding: 0.5em 0;"><Checkbox size="large" :label="item.id" :value="item.id">{{item.title}}</Checkbox></div>
            </CheckboxGroup>
          </div>
        </div>

        <div style="border-top: 1px solid #dddee1; padding: 1em 0;">
          <strong>{{$t('TeacherInfo.Selected')}}</strong>
          <div style="min-height: 5em; border: 1px solid #dddee1; border-radius: 3px; padding: 0.2em 0.5em;">
            <Tag v-for="item in editingInterest.interests" :key="item.firstId + '-' + item.secondId" :color="item.color">
              {{item.firstTitle}} <Icon type="arrow-right-a" style="margin: 0 0.3em"></Icon> {{item.secondTitle}}
            </Tag>
          </div>
        </div>

        <div slot="close">
          <Button type="primary" @click="handleEditingInterestOK" :loading="loading">{{$t('Base.OK')}}</Button>
          <Button @click="modalInterest = false">{{$t('Base.Cancel')}}</Button>
        </div>
        <div slot="footer" style="display:none">
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
#user-profile-school {
  position: relative;
  text-align: left;

  .preview-part {
    position: absolute;
    top: 0;
    right: 0;
  }

  .part-header {
    font-size: larger;
    font-weight: bold;
    margin-bottom: 0.2em;
    color: #1c2438;
  }

  .part-action-button {
    float: right;
    .ivu-btn-text {
      padding: 3px;
    }
  }

  .info-detail {
    width: auto;

    td:first-of-type {
      padding-left: 2em;
      text-align: right;
    }

    td:nth-of-type(2) {
      padding: 5px 20px;
      text-align: left;
      width: 300px;
    }
  }

  .status-part, .info-part, .introduce-part, .interests-part, .picture-part {
    margin-bottom: 1.5em;
  }

  .introduce-part, .interests-part {
    textarea {
      resize: none;
    }
  }

  .interests-part {
    .ivu-tag {
      height: 28px;
      line-height: 28px;
      font-size: 14px;
    }
  }

  .school-picture {
    background: white;
    position: relative;
    text-align: center;
    border: 1px dotted #dddee1;
    border-radius: 5px;

    img {
      border: 1px solid #dddee1;
    }

    .school-picture-cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .5);
      display: none;
      color: white;
      text-align: center;
      cursor: pointer;
    }
  }
  .school-picture:hover .school-picture-cover {
    display: block;
  }
}

.school-interests {
  padding: 1em;
  //border-top: 1px solid #dddee1;

  .ivu-menu-vertical .ivu-menu-item {
    padding: 6px 12px 6px 0;

    table {
      width: 100%;
    }

    td:last-of-type {
      width: 20px;
      text-align: center;
    }
  }
}

.school-preview{
  .ivu-modal-footer {
    display: none;
  }
}
</style>

<script>
  import auth from '../../authenticator';
  import SchoolInfoBlock from './SchoolInfoBlock';
  import SchoolPreview from './SchoolPreview';
  import util from "../../common/util.js";

  export default {
    components: { SchoolInfoBlock, SchoolPreview },
    props: {
      schoolId: Number
    },
    data() {
      return {
        //schoolId:auth.getSchoolID(),
        initialized: false,
        loading: false,
        school: {
          type0: 0,
          type1: 0,
          name: '',
          owner: 0,
          admin: 0
        },
        slogan: '',
        introduction: '',
        interests: [],
        modalPreview: false,
        modalInterest: false,
        editingInterest: {searchText: '', searchIcon: 'search', currentFirst: {}, currentSecond: [], interests: [], first: 0, second:[]},
        firstLevelInterest: [],
        secondLevelInterest: [],
        treeInterest: [],
        picture: {
          action: GetAPIUrl() + 'ProfilePicture?schoolID=' + this.schoolId + "&typeID=0",
          headers: {"UserToken": auth.getUserToken()},
          file: '',
          list: [],
        },
      }
    },
    computed: {
      isKlassroom() {
        return IsKlassroom();
      },
    },
    mounted() {
      util.LoadKendoFiles().then(()=>{
        $("#schoolDesc").kendoEditor({
          resizable: {
            content: false,
            //toolbar: true,
            min: 400
          },
          tools: [
            "formatting",
            "cleanFormatting",
            "fontName",
            "fontSize",
            "foreColor",
            "backColor",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "justifyFull",
            "insertUnorderedList",
            "insertOrderedList",
            "indent",
            "outdent",
            "createLink",
            "unlink",
            "insertImage",
            "insertFile",
            "subscript",
            "superscript",
            "tableWizard",
            "createTable",
            "addRowAbove",
            "addRowBelow",
            "addColumnLeft",
            "addColumnRight",
            "deleteRow",
            "deleteColumn",
            "viewHtml"
          ]
        });
      });
    },
    methods: {
      initialize() {
        if (!this.initialized) {
          this.readData();
          this.$refs.schoolInfo.readData();
          this.initialized = true;
        }
      },
      readData() {
        let self = this;

        let url = GetAPIUrl() + "School/SchoolInfo?schoolID=" + this.schoolId;
        this._getData(url, null, (result) => {
          if (self.schoolId == auth.getCustomerID()) {
            self.school.name = self.$t('SchoolInfoSchoolProfile.MySchoolIndependentTutor');
          }else{
            self.school.name = result.SchoolName;
          }

          if (result == null) {
            result = {
              Category1: 0,
              Category2: 0,
              OwnerID: auth.getUserID(),
              AdminID: auth.getUserID(),
              Concerns: [],
            };
          }
          
          self.school.type0 = result.Category1;
          self.school.type1 = result.Category2;
          self.school.owner = result.OwnerID;
          self.school.admin = result.AdminID;

          self.slogan = result.Slogan;
          self.introduction = result.Introduction;
          self.picture.file = result.MainPictureUrl;

          self.interests = [];
          for(let i = 0; i < result.Concerns.length; i++) {
            let concern = result.Concerns[i];
            let item = {
              firstId: concern.FirstID,
              firstTitle: concern.FirstTitle,
              secondId: concern.SecondID,
              secondTitle: concern.SecondTitle,
              color: self.getInterestColor(self.interests,concern.FirstID)
            };

            self.interests.push(item);
          }

          let editor = $("#schoolDesc").data("kendoEditor");
          editor.value(self.introduction);
        }, null);
      },
      saveData(callback) {
        if (!this.initialized) {
          if (callback)
            callback(true);
          return;
        }

        if (this.school.type1 === '')
          this.school.type1 = 0;

        let editor = $("#schoolDesc").data("kendoEditor");
        this.introduction = editor.value();

        let interests = [];
        for(let i = 0; i < this.interests.length; i++) {
          let item = {
            "FirstID": this.interests[i].firstId,
            "SecondID": this.interests[i].secondId,
            "ThirdID": 0
          };

          interests.push(item);
        }

        let self = this;

        let url = GetAPIUrl() + "School/UpdateSchool";
        let data = {
          "SchoolID": this.schoolId,
          "SchoolName": this.school.name,
          "Category1": this.school.type0,
          "Category2": this.school.type1,
          "IsFull": 1,
          "OwnerID": this.school.owner,
          "AdminID": this.school.admin,
          "Slogan": this.slogan,
          "Introduction": this.introduction,
          "Concerns": interests
        };

        this._postData(url, data, null, (result) => {
          self.$Message.success(self.$t('SchoolInfoSchoolProfile.SchoolInformationChangeSaved'));
          auth.setSchoolType(self.school.type0);
          if (callback)
            callback(true);
        }, (error) => {
          if (callback)
            callback(false);
        });
      },
      handlePreview() {
        this.$refs.preview.initialize();
        this.modalPreview = true;
      },
      handleStatusChange() {
        let self = this;

        this.$Modal.confirm({
          title: this.$t('SchoolInfoSchoolProfile.QuitSchoolTitle'),
          content: this.$t('SchoolInfoSchoolProfile.QuitSchoolContent'),
          okText: this.$t('SchoolInfoSchoolProfile.QuitOk'),
          cancelText: this.$t('SchoolInfoSchoolProfile.QuitCancel'),
          onOk: () => {
            let url = GetAPIUrl() + "School/DeactivateSchool?SchoolID=" + this.schoolId;

            self._deleteData(url, null, (result) => {
              // self.$parent.schoolCanceled();
            }, null);
          }
        });
      },
      handleAddInterest() {
        this.modalInterest = true;
        this.editingInterest.interests = this.copyInterests(this.interests);

        if (this.treeInterest.length === 0) {
          let self = this;
          let url = GetAPIUrl() + "ConcernHierarchy/GetConcernTree";
          this._getData(url, null, (result) => {
            self.treeInterest = self.initializeInterestTree(result);
            self.firstLevelInterest = self.treeInterest;
          }, null);
        }
      },
      initializeInterestTree(data){
        let list = [];
        for (let i = 0; i < data.length; i++) {
          let item = {
            id: data[i].ID,
            title: data[i].Name,
            type: data[i].NodeType,
            children: this.initializeInterestTree(data[i].Children)
          };

          list.push(item);
        }

        return list;
      },
      handleInterestSearch() {
        this.editingInterest.searchIcon = this.editingInterest.searchText ? 'close-round' : 'search';
      },
      handleInterestSearchCancel() {
        this.editingInterest.searchText = '';
        this.handleInterestSearch();
      },
      handleInterestSelected(name) {
        this.editingInterest.first = name;
        this.editingInterest.second = [];

        for (let i = 0; i < this.firstLevelInterest.length; i++) {
          if (this.firstLevelInterest[i].id === name) {
            this.secondLevelInterest = this.firstLevelInterest[i].children;
            this.editingInterest.currentFirst = this.firstLevelInterest[i];
            this.editingInterest.currentSecond = [];

            for (let j = 0; j < this.editingInterest.interests.length; j++) {
              if (this.editingInterest.interests[j].firstId === name) {
                this.editingInterest.currentSecond.push(this.editingInterest.interests[j]);
                this.editingInterest.second.push(this.editingInterest.interests[j].secondId);
              }
            }
            return;
          }
        }
      },
      handleInterestChanged(second) {
        //debugger;
        if (second.length > this.editingInterest.currentSecond.length) {
          // Add new one;
          let last = second.length - 1;
          let newId = second[last];
          for (let i = 0; i < this.secondLevelInterest.length; i++) {
            if (this.secondLevelInterest[i].id === newId) {
              let item = {
                firstId: this.editingInterest.currentFirst.id,
                firstTitle: this.editingInterest.currentFirst.title,
                secondId: this.secondLevelInterest[i].id,
                secondTitle: this.secondLevelInterest[i].title,
                color: this.getInterestColor(this.editingInterest.interests, this.editingInterest.currentFirst.id)
              };

              this.editingInterest.currentSecond.push(item);
              this.editingInterest.interests.push(item);
            }
          }
        }
        else {
          let index = 0;
          let id = 0;
          for (let i = 0; i < this.editingInterest.currentSecond.length; i++) {
            id = this.editingInterest.currentSecond[i].secondId;
            index = second.indexOf(id);
            if (index < 0) {
              index = i;
              break;
            }
          }
          this.editingInterest.currentSecond.splice(index, 1);

          for (let i = 0; i < this.editingInterest.interests.length; i++) {
            if (this.editingInterest.interests[i].firstId === this.editingInterest.currentFirst.id && this.editingInterest.interests[i].secondId === id) {
              index = i;
              break;
            }
          }
          this.editingInterest.interests.splice(index, 1);
        }
      },
      copyInterests(data){
        let json = JSON.stringify(data);
        return JSON.parse(json);
      },
      getInterestColor(list, firstId) {
        let firstList = [];
        for (let i = 0; i < list.length; i++) {
          if (firstList.indexOf(list[i].firstId) < 0) {
            firstList.push(list[i].firstId);
          }
        }

        let index = firstList.indexOf(firstId);
        if (index < 0)
          index = firstList.length;

        index = index % 4;
        switch (index) {
          case 0:
            return 'blue';
          case 1:
            return 'green';
          case 2:
            return 'red';
          case 3:
            return 'yellow';
        }
      },
      handleEditingInterestOK() {
        this.modalInterest = false;
        this.interests = this.copyInterests(this.editingInterest.interests);
      },
      handleChangePictureBeforeUpload(file) {
        this.loading = true;
        this.$Loading.start();
      },
      handleChangePictureProgress() {

      },
      handleChangePictureSuccess(result, file) {
        this.loading = false;
        if (result.RetCode === 0) {
          this.picture.file = result.RetData;
          this.$Loading.finish();
        }
        else {
          this.$Loading.error();
          this.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
        }
      },
      handleChangePictureError(error, file, fileList) {
        this.loading = false;
        this.$Loading.error();
        this.$Message.error({content: error.status + ': ' + error.statusText,duration: 0,closable: true});
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
              if (success && typeof success === 'function') {
                success(result.RetData);
              }

              self.loading = false;
              self.$Loading.finish();
            }
            else { // error
              if (error && typeof error === 'function') {
                error(result);
              }

              self.loading = false;
              self.$Loading.error();
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);
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
              if (success && typeof success === 'function') {
                success(result.RetData);
              }

              self.loading = false;
              self.$Loading.finish();
            }
            else { // error
              if (error && typeof error === 'function') {
                error(result);
              }

              self.loading = false;
              self.$Loading.error();
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);
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
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
              console.log(result);

              if (error && typeof error === 'function') {
                error(result);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
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
