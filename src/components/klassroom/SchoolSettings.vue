<template>
  <div id="klassroom-setting">
    <div class="header-part">
      Setting

      <div style="float:right">
        <Button type="primary" @click="handleSave">Save</Button>
        <Button>Cancel</Button>
      </div>
    </div>

    <div>
      <row type="flex" justify="center">
        <i-col :md="24" :lg="12">
          <div style="padding:2em;">
            <school-info-block :school="school" :schoolId="schoolId" ref="schoolInfo"></school-info-block>
          </div>
          <div class="content-part">
            <table style="border-top: 1px solid #5cadff; padding-top:2em;">
              <tr>
                <td><i class="icon icon-campus color-blue"></i></td>
                <td>
                  <h3>Multi-Campus Support</h3>
                  <p>Allow manage courses, teachers, students across campus when enable</p>
                </td>
                <td></td>
                <td>
                  <i-switch v-model="enableCampus" size="large">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                  </i-switch>
                </td>
              </tr>
              <tr>
                <td><i class="icon icon-deparment color-brown"></i></td>
                <td>
                  <h3>Create Department directly under university or campus</h3>
                  <p>Allow create department under university or campus</p>
                </td>
                <td></td>
                <td>
                  <i-switch v-model="disableCollege" size="large">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                  </i-switch>
                </td>
              </tr>
            </table>
          </div>
        </i-col>
        <i-col :md="24" :lg="12" v-show="school.type0 == 1">
          <div style="border-left: 1px solid #5cadff; margin-top:2em;">
            <div class="content-part">
              <div>
                <table>
                  <tr>
                    <td style="text-align:center"><Icon type="calendar" size="36" color="#2b85e4"></Icon></td>
                    <td>
                      <h3>Academic Schedule</h3>
                      <p>How does your school divide the academic year to different terms?</p>
                      <p>
                      </p>
                    </td>
                    <td></td>
                    <td>
                    </td>
                  </tr>
                  <tr class="no-top-padding">
                    <td></td>
                    <td>
                      <Select v-model="termCount" style="width:200px">
                        <Option :value="0">Don't need term.</Option>
                        <Option :value="2">Semester</Option>
                        <Option :value="3">Trimester</Option>
                        <Option :value="4">Quarter</Option>
                      </Select>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr class="no-top-padding">
                    <td></td>
                    <td>
                      <table class="table-detail" v-if="termCount == 2">
                        <tr>
                          <td><b>1st Semester: </b></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Input v-model="semester1" style="width:150px"/></td>
                          <td><DatePicker v-model="semester1Start" type="date" placeholder="Select Start Date" style="width: 150px"></DatePicker></td>
                          <td><DatePicker v-model="semester1End" type="date" placeholder="Select End Date" style="width: 150px"></DatePicker></td>
                        </tr>
                        <tr>
                          <td><b>2nd Semester: </b></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Input v-model="semester2" style="width:150px"/></td>
                          <td><DatePicker v-model="semester2Start" type="date" placeholder="Select Start Date" style="width: 150px"></DatePicker></td>
                          <td><DatePicker v-model="semester2End" type="date" placeholder="Select End Date" style="width: 150px"></DatePicker></td>
                        </tr>
                      </table>

                      <table class="table-detail" v-else-if="termCount == 3">
                        <tr>
                          <td><b>1st Trimester: </b></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Input v-model="trimester1" style="width:150px"/></td>
                          <td><DatePicker v-model="trimester1Start" type="date" placeholder="Select Start Date" style="width: 150px"></DatePicker></td>
                          <td><DatePicker v-model="trimester1End" type="date" placeholder="Select End Date" style="width: 150px"></DatePicker></td>
                        </tr>
                        <tr>
                          <td><b>2nd Trimester: </b></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Input v-model="trimester2" style="width:150px"/></td>
                          <td><DatePicker v-model="trimester2Start" type="date" placeholder="Select Start Date" style="width: 150px"></DatePicker></td>
                          <td><DatePicker v-model="trimester2End" type="date" placeholder="Select End Date" style="width: 150px"></DatePicker></td>
                        </tr>
                        <tr>
                          <td><b>3th Trimester: </b></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Input v-model="trimester3" style="width:150px"/></td>
                          <td><DatePicker v-model="trimester3Start" type="date" placeholder="Select Start Date" style="width: 150px"></DatePicker></td>
                          <td><DatePicker v-model="trimester3End" type="date" placeholder="Select End Date" style="width: 150px"></DatePicker></td>
                        </tr>
                      </table>

                      <table class="table-detail" v-else-if="termCount == 4">
                        <tr>
                          <td><b>1st Quarter: </b></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Input v-model="quarter1" style="width:150px"/></td>
                          <td><DatePicker v-model="quarter1Start" type="date" placeholder="Select Start Date" style="width: 150px"></DatePicker></td>
                          <td><DatePicker v-model="quarter1End" type="date" placeholder="Select End Date" style="width: 150px"></DatePicker></td>
                        </tr>
                        <tr>
                          <td><b>2nd Quarter: </b></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Input v-model="quarter2" style="width:150px"/></td>
                          <td><DatePicker v-model="quarter2Start" type="date" placeholder="Select Start Date" style="width: 150px"></DatePicker></td>
                          <td><DatePicker v-model="quarter2End" type="date" placeholder="Select End Date" style="width: 150px"></DatePicker></td>
                        </tr>
                        <tr>
                          <td><b>3th Quarter: </b></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Input v-model="quarter3" style="width:150px"/></td>
                          <td><DatePicker v-model="quarter3Start" type="date" placeholder="Select Start Date" style="width: 150px"></DatePicker></td>
                          <td><DatePicker v-model="quarter3End" type="date" placeholder="Select End Date" style="width: 150px"></DatePicker></td>
                        </tr>
                        <tr>
                          <td><b>4th Quarter: </b></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td><Input v-model="quarter4" style="width:150px"/></td>
                          <td><DatePicker v-model="quarter4Start" type="date" placeholder="Select Start Date" style="width: 150px"></DatePicker></td>
                          <td><DatePicker v-model="quarter4End" type="date" placeholder="Select End Date" style="width: 150px"></DatePicker></td>
                        </tr>
                      </table>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td style="text-align:center"><Icon type="ios-people" size="36" color="#2b85e4"></Icon></td>
                    <td>
                      <h3>Student Body (Cohort)</h3>
                      <p>What are the types of students in your school?</p>
                      <p>
                      </p>
                    </td>
                    <td></td>
                    <td>
                    </td>
                  </tr>
                  <tr class="no-top-padding">
                    <td></td>
                    <td>
                      <Select v-model="cohortCount" style="width:200px">
                        <Option :value="0">Don't need.</Option>
                        <Option :value="2">2</Option>
                        <Option :value="3">3</Option>
                        <Option :value="4">4</Option>
                        <Option :value="5">5</Option>
                      </Select>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr class="no-top-padding">
                    <td></td>
                    <td>
                      <table class="table-detail" v-if="cohortCount > 0">
                        <tr>
                          <td>1st Cohort: </td>
                          <td><Input v-model="cohort1" style="width:200px"/></td>
                        </tr>
                        <tr>
                          <td>2nd Cohort: </td>
                          <td><Input v-model="cohort2" style="width:200px"/></td>
                        </tr>
                        <tr v-if="cohortCount > 2">
                          <td>3th Cohort: </td>
                          <td><Input v-model="cohort3" style="width:200px"/></td>
                        </tr>
                        <tr v-if="cohortCount > 3">
                          <td>4th Cohort: </td>
                          <td><Input v-model="cohort4" style="width:200px"/></td>
                        </tr>
                        <tr v-if="cohortCount > 4">
                          <td>5th Cohort: </td>
                          <td><Input v-model="cohort5" style="width:200px"/></td>
                        </tr>
                      </table>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </i-col>
      </row>
    </div>
  </div>
</template>

<style lang="scss">
#klassroom-setting {
  padding: 1em 1.5em;
  text-align: left;

  .header-part {
    color: #1c2438;
    font-size: 24px;
    font-weight: bold;
    padding: 0.5em;
    border-bottom: 1px solid #5cadff;
  }

  .content-part {
    table {
      margin: auto;

      td {
        padding: 1em;
      }

      .no-top-padding {
        td {
          padding: 0 1em;
        }
      }
    }

    .table-detail, .no-top-padding .table-detail {
      margin: 0;
      margin-top: 1em;

      td {
        padding: 0.5em;
      }
    }

    h3 {
      color: #17233d;
    }

    .icon {
      font-size: 48px;
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
  }
}
</style>

<script>
import auth from "../../authenticator";
import SchoolInfoBlock from '../profile/SchoolInfoBlock';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  components: {
    SchoolInfoBlock
  },
  data() {
    return {
      schoolId: auth.getChosenSchoolId(),
      school: {
        type0: 0,
        type1: 0,
        name: '',
        owner: 0,
        admin: 0
      },
      enableCampus: true,
      disableCollege: false,
      enableShare: true,
      termCount: 0,
      semester1: 'Autumn',
      semester2: 'Sprint',
      trimester1: 'Autumn',
      trimester2: 'Winter',
      trimester3: 'Spring',
      quarter1: 'Autumn',
      quarter2: 'Winter',
      quarter3: 'Spring',
      quarter4: 'Summer',
      semester1Start: '',
      semester2Start: '',
      trimester1Start: '',
      trimester2Start: '',
      trimester3Start: '',
      quarter1Start: '',
      quarter2Start: '',
      quarter3Start: '',
      quarter4Start: '',
      semester1End: '',
      semester2End: '',
      trimester1End: '',
      trimester2End: '',
      trimester3End: '',
      quarter1End: '',
      quarter2End: '',
      quarter3End: '',
      quarter4End: '',
      cohortCount: 0,
      cohort1: "Undergraduate",
      cohort2: "Graduate",
      cohort3: "Postgraduate",
      cohort4: "Adult Education",
      cohort5: "Online",
    };
  },
  computed: {
    ...mapState(['Klassroom', 'KlassroomSettings']),
  },
  mounted() {
    this.enableCampus = this.KlassroomSettings.enableCampus;
    this.disableCollege = !this.KlassroomSettings.enableCollege;

    this.initDates();
    this.loadSchoolData();
    this.loadSettings();
  },
  methods: {
    initDates() {
      let date = new Date();
      let year = date.getFullYear();

      this.semester1Start = new Date(year, 8, 1);
      this.semester1End= new Date(year, 11, 15);
      this.semester2Start= new Date(year + 1, 0, 10);
      this.semester2End= new Date(year + 1, 4, 20);

      this.trimester1Start= new Date(year, 8, 1);
      this.trimester1End= new Date(year, 11, 15);
      this.trimester2Start= new Date(year + 1, 0, 10);
      this.trimester2End= new Date(year + 1, 3, 30);
      this.trimester3Start= new Date(year + 1, 4, 1);
      this.trimester3End= new Date(year + 1, 7, 30);

      this.quarter1Start= new Date(year, 8, 1);
      this.quarter1End= new Date(year, 10, 1);
      this.quarter2Start= new Date(year, 11, 1);
      this.quarter2End= new Date(year + 1, 1, 1);
      this.quarter3Start= new Date(year + 1, 2, 1);
      this.quarter3End= new Date(year + 1, 4, 1);
      this.quarter4Start= new Date(year + 1, 5, 1);
      this.quarter4End= new Date(year + 1, 7, 1);
    },
    loadSchoolData() {
      let self = this;

      let url = GetAPIUrl() + "School/SimpleSchoolInfo?schoolID=" + this.schoolId;
      this._getData(url, null, (result) => {
        self.school.name = result.SchoolName;
        self.school.type0 = result.Category1;
        self.school.type1 = result.Category2;
      }, null);
        
      this.$refs.schoolInfo.readData();
    },
    loadSettings() {
      let self = this;

      let url = GetAPIUrl() + "School/GetSettingList";
      url += "?SchoolID=" + this.schoolId;

      this._getData(url, null,
        data => {
          for (let i = 0; i < data.length; i++) {
            self._readSettingItem(data[i]);
          }
        }, null
      );
    },
    _readSettingItem(item) {
      switch (item.SettingID) {
        case 1001:
          this.enableCampus = item.SettingValue == 1;
          break;
        case 1002:
          this.disableCollege = item.SettingValue != 1;
          break;
        
        case 2000:
          this.termCount = item.SettingValue;
          break;
        case 2001:
          if (this.termCount == 2) 
            this.semester1 = item.SettingText;
          else if (this.termCount == 3)
            this.trimester1 = item.SettingText;
          else if (this.termCount == 4)
            this.quarter1 = item.SettingText;
          break;
        case 2002:
          if (this.termCount == 2) 
            this.semester2 = item.SettingText;
          else if (this.termCount == 3)
            this.trimester2 = item.SettingText;
          else if (this.termCount == 4)
            this.quarter2 = item.SettingText;
          break;
        case 2003:
          if (this.termCount == 3)
            this.trimester3 = item.SettingText;
          else if (this.termCount == 4)
            this.quarter3 = item.SettingText;
          break;
        case 2004:
          this.quarter4 = item.SettingText;
          break;

        case 2011:
          if (this.termCount == 2) 
            this.semester1Start = new Date(parseInt(item.SettingText));
          else if (this.termCount == 3)
            this.trimester1Start = new Date(parseInt(item.SettingText));
          else if (this.termCount == 4)
            this.quarter1Start = new Date(parseInt(item.SettingText));
          break;
        case 2012:
          if (this.termCount == 2) 
            this.semester2Start = new Date(parseInt(item.SettingText));
          else if (this.termCount == 3)
            this.trimester2Start = new Date(parseInt(item.SettingText));
          else if (this.termCount == 4)
            this.quarter2Start = new Date(parseInt(item.SettingText));
          break;
        case 2013:
          if (this.termCount == 3)
            this.trimester3Start = new Date(parseInt(item.SettingText));
          else if (this.termCount == 4)
            this.quarter3Start = new Date(parseInt(item.SettingText));
          break;
        case 2014:
          this.quarter4Start = new Date(parseInt(item.SettingText));
          break;

        case 2021:
          if (this.termCount == 2) 
            this.semester1End = new Date(parseInt(item.SettingText));
          else if (this.termCount == 3)
            this.trimester1End = new Date(parseInt(item.SettingText));
          else if (this.termCount == 4)
            this.quarter1End = new Date(parseInt(item.SettingText));
          break;
        case 2022:
          if (this.termCount == 2) 
            this.semester2End = new Date(parseInt(item.SettingText));
          else if (this.termCount == 3)
            this.trimester2End = new Date(parseInt(item.SettingText));
          else if (this.termCount == 4)
            this.quarter2End = new Date(parseInt(item.SettingText));
          break;
        case 2023:
          if (this.termCount == 3)
            this.trimester3End = new Date(parseInt(item.SettingText));
          else if (this.termCount == 4)
            this.quarter3End = new Date(parseInt(item.SettingText));
          break;
        case 2024:
          this.quarter4End = new Date(parseInt(item.SettingText));
          break;

        case 3000:
          this.cohortCount = item.SettingValue;
          break;
        case 3001:
          this.cohort1 = item.SettingText;
          break;
        case 3002:
          this.cohort2 = item.SettingText;
          break;
        case 3003:
          this.cohort3 = item.SettingText;
          break;
        case 3004:
          this.cohort4 = item.SettingText;
          break;
        case 3005:
          this.cohort5 = item.SettingText;
          break;
      }
    },
    saveSettings() {
      let list = [];
      let item = this._writeSettingItem(1001, this.enableCampus ? 1 : 0, null, null);
      list.push(item);
      item = this._writeSettingItem(1002, this.disableCollege ? 0 : 1, null, null);
      list.push(item);
      
      item = this._writeSettingItem(2000, this.termCount, null, null);
      list.push(item);
      if (this.termCount == 2) {
        item = this._writeSettingItem(2001, 0, this.semester1, null);
        list.push(item);
        item = this._writeSettingItem(2002, 0, this.semester2, null);
        list.push(item);

        item = this._writeSettingItem(2011, 0, this.semester1Start.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2012, 0, this.semester2Start.getTime(), null);
        list.push(item);

        item = this._writeSettingItem(2021, 0, this.semester1End.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2022, 0, this.semester2End.getTime(), null);
        list.push(item);
      }
      else if (this.termCount == 3) {
        item = this._writeSettingItem(2001, 0, this.trimester1, null);
        list.push(item);
        item = this._writeSettingItem(2002, 0, this.trimester2, null);
        list.push(item);
        item = this._writeSettingItem(2003, 0, this.trimester3, null);
        list.push(item);

        item = this._writeSettingItem(2011, 0, this.trimester1Start.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2012, 0, this.trimester2Start.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2013, 0, this.trimester3Start.getTime(), null);
        list.push(item);

        item = this._writeSettingItem(2021, 0, this.trimester1End.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2022, 0, this.trimester2End.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2023, 0, this.trimester3End.getTime(), null);
        list.push(item);
      }
      else if (this.termCount == 4) {
        item = this._writeSettingItem(2001, 0, this.quarter1, null);
        list.push(item);
        item = this._writeSettingItem(2002, 0, this.quarter2, null);
        list.push(item);
        item = this._writeSettingItem(2003, 0, this.quarter3, null);
        list.push(item);
        item = this._writeSettingItem(2004, 0, this.quarter4, null);
        list.push(item);

        item = this._writeSettingItem(2011, 0, this.quarter1Start.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2012, 0, this.quarter2Start.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2013, 0, this.quarter3Start.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2014, 0, this.quarter4Start.getTime(), null);
        list.push(item);

        item = this._writeSettingItem(2021, 0, this.quarter1End.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2022, 0, this.quarter2End.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2023, 0, this.quarter3End.getTime(), null);
        list.push(item);
        item = this._writeSettingItem(2024, 0, this.quarter4End.getTime(), null);
        list.push(item);
      }

      item = this._writeSettingItem(3000, this.cohortCount, null, null);
      list.push(item);
      item = this._writeSettingItem(3001, 0, this.cohort1, null);
      list.push(item);
      item = this._writeSettingItem(3002, 0, this.cohort2, null);
      list.push(item);
      item = this._writeSettingItem(3003, 0, this.cohort3, null);
      list.push(item);
      item = this._writeSettingItem(3004, 0, this.cohort4, null);
      list.push(item);
      item = this._writeSettingItem(3005, 0, this.cohort5, null);
      list.push(item);

      let data = {
        SchoolID: this.schoolId,
        Settings: list
      }

      let self = this;

      let url = GetAPIUrl() + "School/SetSettings";

      this._postData(url, data, null,
        () => {
          self.KlassroomSettings.enableCampus = self.enableCampus;
          self.KlassroomSettings.enableCollege = !self.disableCollege;
          self.KlassroomSettings.termCount = self.termCount;
          if (self.termCount == 2) {
            self.KlassroomSettings.term1 = self.semester1;
            self.KlassroomSettings.term2 = self.semester2;
            self.KlassroomSettings.term1Start = self.semester1Start;
            self.KlassroomSettings.term2Start = self.semester2Start;
            self.KlassroomSettings.term1End = self.semester1End;
            self.KlassroomSettings.term2End = self.semester2End;
          }
          else if (self.termCount == 3) {
            self.KlassroomSettings.term1 = self.trimester1;
            self.KlassroomSettings.term2 = self.trimester2;
            self.KlassroomSettings.term3 = self.trimester3;
            self.KlassroomSettings.term1Start = self.trimester1Start;
            self.KlassroomSettings.term2Start = self.trimester2Start;
            self.KlassroomSettings.term3Start = self.trimester3Start;
            self.KlassroomSettings.term1End = self.trimester1End;
            self.KlassroomSettings.term2End = self.trimester2End;
            self.KlassroomSettings.term3End = self.trimester3End;
          }
          else if (self.termCount == 4) {
            self.KlassroomSettings.term1 = self.quarter1;
            self.KlassroomSettings.term2 = self.quarter2;
            self.KlassroomSettings.term3 = self.quarter3;
            self.KlassroomSettings.term4 = self.quarter4;
            self.KlassroomSettings.term1Start = self.quarter1Start;
            self.KlassroomSettings.term2Start = self.quarter2Start;
            self.KlassroomSettings.term3Start = self.quarter3Start;
            self.KlassroomSettings.term4Start = self.quarter4Start;
            self.KlassroomSettings.term1End = self.quarter1End;
            self.KlassroomSettings.term2End = self.quarter2End;
            self.KlassroomSettings.term3End = self.quarter3End;
            self.KlassroomSettings.term4End = self.quarter4End;
          }
          self.KlassroomSettings.cohortCount = self.cohortCount;
          self.KlassroomSettings.cohort1 = self.cohort1;
          self.KlassroomSettings.cohort2 = self.cohort2;
          self.KlassroomSettings.cohort3 = self.cohort3;
          self.KlassroomSettings.cohort4 = self.cohort4;
          self.KlassroomSettings.cohort5 = self.cohort5;
        }, null);
    },
    _writeSettingItem(id, value, text, notes) {
      return {
        SettingID: id,
        SettingValue: value,
        SettingText: text,
        SettingNotes: notes,
      }
    },
    saveSchool() {
      let self = this;

      let url = GetAPIUrl() + "School/UpdateSchool";
      let data = {
        "SchoolID": this.schoolId,
        "SchoolName": this.school.name,
        "Category1": this.school.type0,
        "Category2": this.school.type1,
        "IsFull": 0,
      };

      this._postData(url, data, null, (result) => {
        self.Klassroom.name = self.school.name;
        self.Klassroom.type = self.school.type0;
        self.$Message.success('School information change saved!');
      }, null);
    },
    handleSave() {
      this.saveSchool();
      this.saveSettings();
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
  }
};
</script>
