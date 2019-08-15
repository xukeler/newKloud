<template>
  <div id="user-profile-teacher">
    <div class="preview-part">
      <Button type="info" size="large" @click="handlePreview" :loading="loading">{{$t('TeacherInfo.Preview')}}</Button>
    </div>

    <div class="status-part">
      <div class="part-header">{{$t('TeacherInfo.Status')}}</div>
      <div style="color:#2b85e4">{{$t('TeacherInfo.Active')}}  <Button type="primary" @click="handleStatusChange" style="margin-left: 3em;" :loading="loading">{{$t('TeacherInfo.Disactive')}}</Button></div>
    </div>

    <div class="status-part">
      <div class="part-header">{{$t('TeacherInfo.ApplicationStatus')}}</div>
      <div style="color:#2b85e4">{{$t('TeacherInfo.Applicationsubmitted')}} <!-- <Button type="primary" @click="handleStatusChange" :loading="loading">Change Status</Button>--></div>
    </div>

    <div class="introduce-part">
      <div class="part-header">{{$t('TeacherInfo.OneSentenceIntroduction')}}</div>
      <Input v-model="introduction" :placeholder="$t('TeacherInfo.KeywordsAboutYourself')"></Input>
    </div>

    <div class="introduce-part">
      <div class="part-header">{{$t('TeacherInfo.Biography')}}</div>
      <Input v-model="biography" type="textarea" :autosize="{minRows: 3, maxRows: 10}" :placeholder="$t('TeacherInfo.EnterYourselfTeacher')"></Input>
    </div>

    <div class="introduce-part">
      <div class="part-header">{{$t('TeacherInfo.TeachingExperience')}}</div>
      <Input v-model="teaching" type="textarea" :autosize="{minRows: 3, maxRows: 10}" :placeholder="$t('TeacherInfo.EnterYourselfTeachingExperience')"></Input>
    </div>

    <div class="education-part">
      <div class="part-header">{{$t('TeacherInfo.Education')}}
        <div class="part-action-button">
          <Button type="text" icon="plus-round" @click="handleAddEducation">{{$t('TeacherInfo.AddEducation')}}</Button>
        </div>
      </div>
      <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
             :data="tableDataEducation" :columns="tableColumnEducation">
      </Table>

      <!--<div class="part-footer">
        <Button type="primary" shape="circle" icon="plus-round" @click="handleAddEducation">Add Education</Button>
      </div>-->
    </div>

    <div class="experience-part">
      <div class="part-header">{{$t('TeacherInfo.WorkingExperience')}}
        <div class="part-action-button">
          <Button type="text" icon="plus-round" @click="handleAddExperience">{{$t('TeacherInfo.AddExperience')}}</Button>
        </div>
      </div>
      <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
             :data="tableDataExperience" :columns="tableColumnExperience">
      </Table>

      <!--<div class="part-footer">
        <Button type="primary" shape="circle" icon="plus-round" @click="handleAddExperience">Add Experience</Button>
      </div>-->
    </div>

    <div class="qualification-part">
      <div class="part-header">{{$t('TeacherInfo.Qualification')}}
        <div class="part-action-button">
          <Button type="text" icon="plus-round" @click="handleAddQualification">{{$t('TeacherInfo.AddQualification')}}</Button>
        </div>
      </div>
      <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
             :data="tableDataQualification" :columns="tableColumnQualification">
      </Table>

      <!--<div class="part-footer">
        <Button type="primary" shape="circle" icon="plus-round" @click="handleAddQualification">Add Qualification</Button>
      </div>-->
    </div>

    <div class="interest-part">
      <div class="part-header">{{$t('TeacherInfo.AreaOfInterests')}}
        <div class="part-action-button">
          <Button type="text" icon="plus-round" @click="handleAddInterest">{{$t('TeacherInfo.AddAreaOfInterests')}}</Button>
        </div>
      </div>
      <div style="min-height: 5em; border: 1px solid #dddee1; border-radius: 3px; padding: 0.2em 0.5em;">
        <Tag v-for="item in interests" :key="item.firstId + '-' + item.secondId" :color="item.color">
          {{item.firstTitle}} <Icon type="arrow-right-a" style="margin: 0 0.3em"></Icon> {{item.secondTitle}}
        </Tag>
      </div>
    </div>

    <div class="schedule-part">
      <div class="part-header">{{$t('TeacherInfo.Schedule')}}</div>
      <table>
        <tr>
          <th>{{$t('TeacherInfo.Sun')}}</th>
          <th>{{$t('TeacherInfo.Mon')}}</th>
          <th>{{$t('TeacherInfo.Tue')}}</th>
          <th>{{$t('TeacherInfo.Wen')}}</th>
          <th>{{$t('TeacherInfo.Thu')}}</th>
          <th>{{$t('TeacherInfo.Fri')}}</th>
          <th>{{$t('TeacherInfo.Sat')}}</th>
        </tr>
        <tr>
          <td><TimePicker format="HH:mm" type="timerange" :steps="[1, 10]" placement="bottom-end" :placeholder="$t('TeacherInfo.SelectTime')" v-model="sunday"></TimePicker></td>
          <td><TimePicker format="HH:mm" type="timerange" :steps="[1, 10]" placement="bottom-end" :placeholder="$t('TeacherInfo.SelectTime')" v-model="monday"></TimePicker></td>
          <td><TimePicker format="HH:mm" type="timerange" :steps="[1, 10]" placement="bottom-end" :placeholder="$t('TeacherInfo.SelectTime')" v-model="tuesday"></TimePicker></td>
          <td><TimePicker format="HH:mm" type="timerange" :steps="[1, 10]" placement="bottom-end" :placeholder="$t('TeacherInfo.SelectTime')" v-model="wednesday"></TimePicker></td>
          <td><TimePicker format="HH:mm" type="timerange" :steps="[1, 10]" placement="bottom-end" :placeholder="$t('TeacherInfo.SelectTime')" v-model="thursday"></TimePicker></td>
          <td><TimePicker format="HH:mm" type="timerange" :steps="[1, 10]" placement="bottom-end" :placeholder="$t('TeacherInfo.SelectTime')" v-model="friday"></TimePicker></td>
          <td><TimePicker format="HH:mm" type="timerange" :steps="[1, 10]" placement="bottom-end" :placeholder="$t('TeacherInfo.SelectTime')" v-model="saturday"></TimePicker></td>
        </tr>
      </table>
    </div>

    <div class="introduce-part">
      <div class="part-header">{{$t('TeacherInfo.Announcement')}}</div>
      <Input v-model="announcement" type="textarea" :autosize="{minRows: 3, maxRows: 10}" :placeholder="$t('TeacherInfo.PolicyOrRules')"></Input>
    </div>

    <div>
      <Modal v-model="modalPreview"  class-name="teacher-preview" :title="$t('TeacherInfo.TeacherProfilePreviewTitle')" :width="90" :mask-closable="false" :styles="{top: '1em'}">
        <teacher-preview ref="preview" :user-id="useId"></teacher-preview>

        <div slot="footer">
        </div>
      </Modal>

      <Modal v-model="modalEducation" :mask-closable="false" :width="800"
             :title="$t('TeacherInfo.ChangeYourEducationTitle')">
        <div class="teacher-modal">
          <Form :model="editingEducation" label-position="right" :label-width="150">
            <FormItem :label="$t('TeacherInfo.Diploma')">
              <Input v-model="editingEducation.title"></Input>
            </FormItem>
            <FormItem :label="$t('TeacherInfo.School')">
              <Input v-model="editingEducation.place"></Input>
            </FormItem>
            <FormItem :label="$t('TeacherInfo.Date')">
              <Input v-model="editingEducation.date"></Input>
            </FormItem>
            <FormItem :label="$t('TeacherInfo.Description')">
              <Input v-model="editingExperience.description" type="textarea" :autosize="{minRows: 3, maxRows: 10}"></Input>
            </FormItem>
          </Form>
        </div>

        <div slot="footer">
          <Button type="primary" @click="handleEditingEducationOK" :loading="loading">{{$t('Base.OK')}}</Button>
          <Button @click="modalEducation = false">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalExperience" :mask-closable="false" :width="800"
             :title="$t('TeacherInfo.ChangeYourExperience')">
        <div class="teacher-modal">
          <Form :model="editingExperience" label-position="right" :label-width="150" style="padding-right: 80px;">
            <FormItem :label="$t('TeacherInfo.JobTitle')">
              <Input v-model="editingExperience.title"></Input>
            </FormItem>
            <FormItem :label="$t('TeacherInfo.Company')">
              <Input v-model="editingExperience.place"></Input>
            </FormItem>
            <FormItem :label="$t('TeacherInfo.Date')">
              <Input v-model="editingExperience.date"></Input>
            </FormItem>
            <FormItem :label="$t('TeacherInfo.Description')">
              <Input v-model="editingExperience.description" type="textarea" :autosize="{minRows: 3, maxRows: 10}"></Input>
            </FormItem>
          </Form>
        </div>

        <div slot="footer">
          <Button type="primary" @click="handleEditingExperienceOK" :loading="loading">{{$t('Base.OK')}}</Button>
          <Button @click="modalExperience = false">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalQualification" :mask-closable="false" :width="800"
             :title="$t('TeacherInfo.ChangeYourQualification')">
        <div class="teacher-modal">
          <Form :model="editingQualification" label-position="right" :label-width="150">
            <FormItem :label="$t('TeacherInfo.Type')">
              <Input v-model="editingQualification.title"></Input>
            </FormItem>
            <FormItem :label="$t('TeacherInfo.Date')">
              <Input v-model="editingQualification.date"></Input>
            </FormItem>
            <FormItem :label="$t('TeacherInfo.Note')">
              <Input v-model="editingQualification.description" type="textarea" :autosize="{minRows: 3, maxRows: 10}"></Input>
            </FormItem>
          </Form>
        </div>

        <div slot="footer">
          <Button type="primary" @click="handleEditingQualificationOK" :loading="loading">{{$t('Base.OK')}}</Button>
          <Button @click="modalQualification = false">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalInterest" :mask-closable="false" :width="800"
             :title="$t('TeacherInfo.AddAreaOfInterests')">

        <!--<Input v-model="editingInterest.searchText" placeholder="Keyword search ..." :icon='editingInterest.searchIcon' @on-change="handleInterestSearch" @on-click="handleInterestSearchCancel" style="width: 50%; margin-bottom: 1em;"></Input>-->
        <div class="teacher-interest">
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
#user-profile-teacher {
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

  .part-footer {
    margin-top: 1em;
  }

  .table-action-icon {
    margin-right: 1em;
    cursor: pointer;
    opacity: 0;
  }

  tr:hover .table-action-icon, .ivu-table-row-highlight .table-action-icon {
    opacity: 1;
  }

  .status-part, .introduce-part, .education-part, .experience-part, .qualification-part, .interest-part, .schedule-part {
    margin-bottom: 1.5em;
  }

  .introduce-part, .interest-part {
    textarea {
      resize: none;
    }
  }

  .interest-part {
    .ivu-tag {
      height: 28px;
      line-height: 28px;
      font-size: 14px;
    }
  }

  .schedule-part {
    table {
      width: 100%;
    }

    th, td {
      width: 14.2857%;
      text-align: center;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
    }

    th {
      height: 32px;
      background-color: #495060;
      color: white;
    }
    td {
      padding: 8px;
      border: 1px solid #e9eaec;
    }
  }
}

.teacher-interest {
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

.teacher-preview{
  .ivu-modal-footer {
    display: none;
  }
}
  .teacher-modal {
    textarea {
      resize: none;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import TeacherPreview from './TeacherPreview';

  export default {
    components: {
      TeacherPreview
    },
    data() {
      return {
        initialized: false,
        loading: false,
        useId: auth.getUserID(),
        introduction: '',
        biography: '',
        teaching: '',
        announcement: '',
        interests: [],
        sunday: ['', ''],
        monday: ['', ''],
        tuesday: ['', ''],
        wednesday: ['', ''],
        thursday: ['', ''],
        friday: ['', ''],
        saturday: ['', ''],
        typeEducation: 1,
        typeExperience: 2,
        typeQualification: 3,
        tableDataEducation: [],
        tableColumnEducation: [
          {
            title: this.$t('TeacherInfo.ColumnDiploma'),
            key: 'title'
          },
          {
            title: this.$t('TeacherInfo.ColumnSchool'),
            key: 'place'
          },
          {
            title: this.$t('TeacherInfo.ColumnDate'),
            key: 'date'
          },
          {
            title: ' ',
            key: 'action',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('span', { class: 'table-action-icon', attrs: { title: this.$t('Common.Edit') }, on: { click: () => { this.handleEditEducation(params); }}},
                  [h('Icon', { props: { type: 'edit', size: '16', color: '#2b85e4' }})]),
                h('span', { class: 'table-action-icon', attrs: { title: this.$t('Common.Delete') }, on: { click: () => { this.handleDeleteEducation(params); }}},
                  [h('Icon', { props: { type: 'trash-b', size: '16', color: '#ed3f14' }})])
              ]);
            }
          }
        ],
        tableDataExperience: [],
        tableColumnExperience: [
          {
            title: this.$t('TeacherInfo.ColumnJobTitle'),
            key: 'title'
          },
          {
            title: this.$t('TeacherInfo.ColumnCompany'),
            key: 'place'
          },
          {
            title: this.$t('TeacherInfo.ColumnDate'),
            key: 'date'
          },
          {
            title: ' ',
            key: 'action',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('span', { class: 'table-action-icon', attrs: { title: this.$t('Common.Edit') }, on: { click: () => { this.handleEditExperience(params); }}},
                  [h('Icon', { props: { type: 'edit', size: '16', color: '#2b85e4' }})]),
                h('span', { class: 'table-action-icon', attrs: { title: this.$t('Common.Delete') }, on: { click: () => { this.handleDeleteExperience(params); }}},
                  [h('Icon', { props: { type: 'trash-b', size: '16', color: '#ed3f14' }})])
              ]);
            }
          }
        ],
        tableDataQualification: [],
        tableColumnQualification: [
          {
            title: this.$t('TeacherInfo.ColumnType'),
            key: 'title'
          },
          {
            title:this.$t('TeacherInfo.ColumnDate'),
            key: 'description'
          },
          {
            title: this.$t('TeacherInfo.ColumnNote'),
            key: 'date'
          },
          {
            title: ' ',
            key: 'action',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('span', { class: 'table-action-icon', attrs: { title: this.$t('Common.Edit') }, on: { click: () => { this.handleEditQualification(params); }}},
                  [h('Icon', { props: { type: 'edit', size: '16', color: '#2b85e4' }})]),
                h('span', { class: 'table-action-icon', attrs: { title: this.$t('Common.Delete') }, on: { click: () => { this.handleDeleteQualification(params); }}},
                  [h('Icon', { props: { type: 'trash-b', size: '16', color: '#ed3f14' }})])
              ]);
            }
          }
        ],
        modalPreview: false,
        modalEducation: false,
        editingEducation: {id: -1, title: '', description: '', place: '', date: ''},
        modalExperience: false,
        editingExperience: {id: -1, title: '', description: '', place: '', date: ''},
        modalQualification: false,
        editingQualification: {id: -1, title: '', description: '', place: '', date: ''},
        modalInterest: false,
        editingInterest: {searchText: '', searchIcon: 'search', currentFirst: {}, currentSecond: [], interests: [], first: 0, second:[]},
        firstLevelInterest: [],
        secondLevelInterest: [],
        treeInterest: [],
      }
    },
    methods: {
      initialize() {
        if (!this.initialized) {
          this.readData();
          this.initialized = true;
        }
      },
      refresh() {
        this.readData();
      },
      readData() {
        let self = this;

        let url = GetAPIUrl() + "User/TeacherProfile";
        this._getData(url, null, (result) => {
          self.introduction = result.Introduction;
          self.biography = result.Biography;
          self.teaching = result.Teaching;
          self.announcement = result.Announcement;

          self.readSchedule(result.Schedule);

          self.tableDataEducation = [];
          for (let i = 0; i < result.Education.length; i++) {
            let item = self._readDetailItem(result.Education[i]);
            self.tableDataEducation.push(item);
          }

          self.tableDataExperience = [];
          for (let i = 0; i < result.Experience.length; i++) {
            let item = self._readDetailItem(result.Experience[i]);
            self.tableDataExperience.push(item);
          }

          self.tableDataQualification = [];
          for (let i = 0; i < result.Qualification.length; i++) {
            let item = self._readDetailItem(result.Qualification[i]);
            self.tableDataQualification.push(item);
          }

          self.interests = [];
          for (let i = 0; i < result.Concerns.length; i++) {
            let concern = result.Concerns[i];
            let item = {
              firstId: concern.FirstID,
              firstTitle: concern.FirstTitle,
              secondId: concern.SecondID,
              secondTitle: concern.SecondTitle,
              color: self.getInterestColor(self.interests, concern.FirstID)
            };

            self.interests.push(item);
          }
        }, null);
      },
      saveData(callback) {
        if (!this.initialized) {
          return;
        }

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
        let url = GetAPIUrl() + "User/UpdateTeacherProfile";
        let data = {
          "UserID": this.useId,
          "Introduction": this.introduction,
          "Biography": this.biography,
          "Teaching": this.teaching,
          "Announcement": this.announcement,
          "Schedule": this.saveSchedule(),
          "Concerns": interests
        };

        this._postData(url, data, null, (result) => {
          self.$Message.success(this.$t('TeacherInfo.TeacherInformationChangeSaved'));
          if (callback)
            callback(true);
        }, (error) => {
          if (callback)
            callback(false);
        });
      },
      readSchedule(schedule) {
        if (schedule) {
          let info = JSON.parse(schedule);
          this.sunday = info.Sunday;
          this.monday = info.Monday;
          this.tuesday = info.Tuesday;
          this.wednesday = info.Wednesday;
          this.thursday = info.Thursday;
          this.friday = info.Friday;
          this.saturday = info.Saturday;
        }
        else {
          this.sunday = '';
          this.monday = '';
          this.tuesday = '';
          this.wednesday = '';
          this.thursday = '';
          this.friday = '';
          this.saturday = '';
        }
      },
      saveSchedule() {
        let schedule = {
          'Sunday': this.sunday,
          'Monday': this.monday,
          'Tuesday': this.tuesday,
          'Wednesday': this.wednesday,
          'Thursday': this.thursday,
          'Friday': this.friday,
          'Saturday': this.saturday,
        };

        return JSON.stringify(schedule);
      },
      handlePreview() {
        this.$refs.preview.initialize();
        this.modalPreview = true;
      },
      handleStatusChange() {
        let self = this;

        this.$Modal.confirm({
          title: this.$t('TeacherInfo.QuitTitle'),
          content: this.$t('TeacherInfo.QuitContent'),
          okText: this.$t('TeacherInfo.QuitOk'),
          cancelText: this.$t('TeacherInfo.QuitCancel'),
          onOk: () => {
            //self.$parent.teacherCanceled();

            let url = GetAPIUrl() + "User/CancelTeacher";

            $.ajax({
              type: 'POST',
              url: url,
              contentType: 'application/json; charset=utf-8',
              dataType: 'text',
              data: '',
              beforeSend: function (request) {
                request.setRequestHeader("UserToken", auth.getUserToken());
              },
              success: function (resultString) {
                let result = JSON.parse(resultString);
                if (result.RetCode === 0) {
                  self.$parent.teacherCanceled();
                }
                else { // error
                  self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
                  console.log(result);
                }
              },
              error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
              }
            });
          }
        });
      },
      refreshDetail(type) {
        let self = this;

        let url = GetAPIUrl() + "User/GetProfileDetailList?detailType=" + type;
        this._getData(url, null, (result) => {
          let list = [];
          for (let i = 0; i < result.length; i++) {
            let item = self._readDetailItem(result[i]);
            list.push(item);
          }

          switch (type) {
            case self.typeEducation:
              self.tableDataEducation = list;
              break;

            case self.typeExperience:
              self.tableDataExperience = list;
              break;

            case self.typeQualification:
              self.tableDataQualification = list;
              break;
          }
        }, null);
      },
      handleAddEducation() {
        this.editingEducation.id = -1;
        this.editingEducation.title = '';
        this.editingEducation.description = '';
        this.editingEducation.place = '';
        this.editingEducation.date = '';
        this.modalEducation = true;
      },
      handleEditEducation(params) {
        this.editingEducation.id = params.row.id;
        this.editingEducation.title = params.row.title;
        this.editingEducation.description = params.row.description;
        this.editingEducation.place = params.row.place;
        this.editingEducation.date = params.row.date;
        this.modalEducation = true;
      },
      handleDeleteEducation(params) {
        let self = this;

        this.$Modal.confirm({
          title: this.$t('TeacherInfo.DeleteEducationTitle'),
          content: this.$t('TeacherInfo.DeleteEducationContent'),
          okText: this.$t('Common.Delete'),
          cancelText: this.$t('Base.Cancel'),
          onOk: () => {
            let url = GetAPIUrl() + "User/DeleteProfileDetail?detailID=" + params.row.id;
            self._deleteData(url, null, (result) => {
              self.refreshDetail(self.typeEducation);
            }, null);
          }
        });
      },
      handleEditingEducationOK() {
        let self = this;
        let creating = this.editingEducation.id <= 0;
        let url = GetAPIUrl() + (creating ? "User/CreateProfileDetail" : "User/UpdateProfileDetail");

        let data = {
          "ContactID": this.useId,
          "DetailID": this.editingEducation.id,
          "DetailType": this.typeEducation,
          "Title": this.editingEducation.title,
          "Description": this.editingEducation.description,
          "Place": this.editingEducation.place,
          "Date": this.editingEducation.date
        };

        this._postData(url, data, null, (result) => {
          self.modalEducation = false;
          self.refreshDetail(self.typeEducation);
        }, null);
      },
      handleAddExperience() {
        this.editingExperience.id = -1;
        this.editingExperience.title = '';
        this.editingExperience.description = '';
        this.editingExperience.place = '';
        this.editingExperience.date = '';
        this.modalExperience = true;
      },
      handleEditExperience(params) {
        this.editingExperience.id = params.row.id;
        this.editingExperience.title = params.row.title;
        this.editingExperience.description = params.row.description;
        this.editingExperience.place = params.row.place;
        this.editingExperience.date = params.row.date;
        this.modalExperience = true;
      },
      handleDeleteExperience(params) {
        let self = this;

        this.$Modal.confirm({
          title: this.$t('TeacherInfo.DeleteExperienceTitle'),
          content: this.$t('TeacherInfo.DeleteEducationContent') ,
          okText: this.$t('Common.Delete'),
          cancelText: this.$t('Base.Cancel'),
          onOk: () => {
            let url = GetAPIUrl() + "User/DeleteProfileDetail?detailID=" + params.row.id;
            self._deleteData(url, null, (result) => {
              self.refreshDetail(self.typeExperience);
            }, null);
          }
        });
      },
      handleEditingExperienceOK() {
        let self = this;
        let creating = this.editingExperience.id <= 0;
        let url = GetAPIUrl() + (creating ? "User/CreateProfileDetail" : "User/UpdateProfileDetail");

        let data = {
          "ContactID": this.useId,
          "DetailID": this.editingExperience.id,
          "DetailType": this.typeExperience,
          "Title": this.editingExperience.title,
          "Description": this.editingExperience.description,
          "Place": this.editingExperience.place,
          "Date": this.editingExperience.date
        };

        this._postData(url, data, null, (result) => {
          self.modalExperience = false;
          self.refreshDetail(self.typeExperience);
        }, null);
      },
      handleAddQualification() {
        this.editingQualification.id = -1;
        this.editingQualification.title = '';
        this.editingQualification.description = '';
        this.editingQualification.place = '';
        this.editingQualification.date = '';
        this.modalQualification = true;
      },
      handleEditQualification(params) {
        this.editingQualification.id = params.row.id;
        this.editingQualification.title = params.row.title;
        this.editingQualification.description = params.row.description;
        this.editingQualification.place = params.row.place;
        this.editingQualification.date = params.row.date;
        this.modalQualification = true;
      },
      handleDeleteQualification(params) {
        let self = this;

        this.$Modal.confirm({
          title: this.$t('TeacherInfo.DeleteQualificationTitle'),
          content: this.$t('TeacherInfo.DeleteEducationContent'),
          okText: this.$t('Common.Delete'),
          cancelText: this.$t('Base.Cancel'),
          onOk: () => {
            let url = GetAPIUrl() + "User/DeleteProfileDetail?detailID=" + params.row.id;
            self._deleteData(url, null, (result) => {
              self.refreshDetail(self.typeQualification);
            }, null);
          }
        });
      },
      handleEditingQualificationOK() {
        let self = this;
        let creating = this.editingQualification.id <= 0;
        let url = GetAPIUrl() + (creating ? "User/CreateProfileDetail" : "User/UpdateProfileDetail");

        let data = {
          "ContactID": this.useId,
          "DetailID": this.editingQualification.id,
          "DetailType": this.typeQualification,
          "Title": this.editingQualification.title,
          "Description": this.editingQualification.description,
          "Place": this.editingQualification.place,
          "Date": this.editingQualification.date
        };

        this._postData(url, data, null, (result) => {
          self.modalQualification = false;
          self.refreshDetail(self.typeQualification);
        }, null);
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
      _readDetailItem(detail) {
        return {
          id: detail.DetailID,
          title: detail.Title,
          description: detail.Description,
          place: detail.Place,
          date: detail.Date,
          detail: detail
        }
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
