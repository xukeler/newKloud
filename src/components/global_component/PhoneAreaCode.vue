<template>
  <div class="phone-area-code">
     <Button @click="handleSelectCountry" style="width:90px;"><span class="flag-icon" :class="createAccount.phoneCountryFlag"></span>{{createAccount.phoneCountry}}</Button>
     <Modal v-model="selectCountry.modal" :title="$t('Register.PleaseSelectCountry')" :mask-closable="false" :width="600" class-name="register-select-country-modal" style="z-index: 4000; position: absolute;">
        <p style="font-weight:700">{{$t("Common.CommonCountries")}}</p>
        <div style="text-align:left;">
         <span style="display:inline-block;" v-for="(item,index) in commonCountrieData" :key="index" @mousedown="selcetCommonCountrie(item)">
           <Tag type="border">
            <span class="flag-icon" :class="item.flag" style="font-size: larger; margin-right: 0.5em;"></span><span style="color: #1c2438; font-weight: bold;">{{item.name}} ({{item.dial_code}})</span>
          </Tag>
         </span>
        </div>
        <Input v-model="selectCountry.searchText" :placeholder="$t('Register.PlaceholderSearchCountry')" :icon='selectCountry.searchIcon' @on-change="handleSelectCountrySearch" @on-click="handleSelectCountrySearchCancel" style="width: 50%; margin: 15px 0px 1em;"></Input>
        <p style="font-weight:700">{{$t("Common.AllCountries")}}</p>
        <Table size="small" :stripe="true" :highlight-row="true" :height="360" :no-data-text="$t('Register.CannotFindAnyCountry')" @on-current-change="handleSelectCountryCurrentChange"
                :data="selectCountry.tableData" :columns="selectCountry.tableColumns" :loading="loading">
        </Table>
        <div slot="footer">
          <span style="float: left;">{{$t('Register.YouSelected')}} <span class="flag-icon" :class="selectCountry.current.flag" style="font-size: larger; margin-right: 0.5em;"></span><span style="color: #1c2438; font-weight: bold;">{{selectCountry.current.name}} ({{selectCountry.current.dial_code}})</span></span>

          <Button type="primary" :loading="loading" @click="handleSelectCountryOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleSelectCountryCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
  </div>
</template>
<style lang="scss">
  .phone-area-code{
    float:left;
    .register-select-country-modal{
      display: flex;
      align-items: center;
      justify-content: center;

      .ivu-modal{
        top: 0;
      }

      .ivu-table th {
        background-color: #495060;
        color: white;
      }

      .ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td {
        background-color: #dddee1;
      }
    }
  }
</style>
<script>
import util from "../../common/util.js";

  export default {
    data: function ()
    {
      return {
        loading: false,
        countryData: [],
        selectCountry: {
          modal: false,
          current: {
            name: 'China', //'United States',
            dial_code: '+86',//'+1',
            flag: 'flag-icon-cn', //'flag-icon-us'
          },
          searchText: '',
          searchIcon: 'search',
          tableData: [],
          tableColumns: [
            {
              title: this.$t('Register.CountryName'),
              key: 'name',
              render: (h, params) => {
                return h('div', [
                  h('span', {class: 'flag-icon ' + params.row.flag, style: {marginRight: '1em', fontSize: 'larger' }}),
                  h('strong', params.row.name)
                ]);
              }
            },
            {
              title: this.$t('Register.Code'),
              width: 150,
              key: 'dial_code'
            }
          ],
        },
        createAccount: {
          phoneCountryFlag: 'flag-icon-cn',//'flag-icon-us'
          phoneCountry: '+86' //'+1',
        },
        commonCountrieData:[{name: 'China',dial_code: '+86',flag: 'flag-icon-cn'},
         {name: 'United States',dial_code: '+1',flag: 'flag-icon-us'},
         {name: 'Japan',dial_code: '+81',flag: 'flag-icon-jp'},
         {name: 'Germany',dial_code: '+49',flag: 'flag-icon-de'},
         {name: 'United Kingdom',dial_code: '+44',flag: 'flag-icon-gb'},
        ],
      };
    },
    props:{
      createNewCompany:{
        type:Boolean,
        default:false,
      }
    },
    mounted: function ()
    {
      if(this.createNewCompany){
        this.initialAreaCode();
      }
    },
    components: {
    },
    computed:
    {
    },
    methods: {
      initialAreaCode(){
        util.LoadCssFiles(["/static/country-flags/css/flag-icon.min.css"]).then(()=>{
          util.LoadJsFiles(["/static/country-phone-code.js?v=201810011501"]).then(()=>{
            this.countryData = JSON.parse(JSON.stringify(countryPhoneCodeList));
            this.countryData.forEach((item) => {
              item.flag = "flag-icon-" + item.code.toLowerCase();
            });
            this.countryData.sort((a, b) => {
              let x = a.name.toLowerCase();
              let y = b.name.toLowerCase();
              if (x < y) {
                return -1;
              }
              else if (x > y) {
                return 1;
              }
              else {
                return 0;
              }
            });

            this.selectCountry.tableData = this.getCountryData();
          });
        });
        this.$emit("getAreaCode",this.createAccount.phoneCountry);
        
      },
      getCountryData() {
        let result = this.countryData.filter((item) => {
          if (this.selectCountry.searchText) {
            let name = item.name ? item.name.toLowerCase() : '';
            let number = item.dial_code ? item.dial_code.toLowerCase() : '';
            let code = item.code ? item.code.toLowerCase() : '';
            let search = this.selectCountry.searchText.toLowerCase();
            return name.includes(search) || number.includes(search) || code.includes(search);
          }
          else {
            return true;
          }
        });

        for (let i = 0; i < result.length; i++) {
          result[i]._highlight = result[i].dial_code === this.selectCountry.current.dial_code;
        }

        return result;
      },
      handleSelectCountry() {
        this.selectCountry.modal = true;

        if (this.createAccount.phoneCountry === '+86' && !this.selectCountry.searchText) {
          this.$nextTick(() => {
            $('.ivu-table-body').scrollTop(1500);
          });
        }
      },
      handleSelectCountryCurrentChange(currentRow) {
        this.selectCountry.current.name = currentRow.name;
        this.selectCountry.current.dial_code = currentRow.dial_code;
        this.selectCountry.current.flag = currentRow.flag;
      },
      selcetCommonCountrie(item){
        this.selectCountry.current.name = item.name;
        this.selectCountry.current.dial_code = item.dial_code;
        this.selectCountry.current.flag = item.flag;
      },
      handleSelectCountrySearch() {
        this.selectCountry.tableData = this.getCountryData();

        this.selectCountry.searchIcon = this.selectCountry.searchText ? 'close-round' : 'search';
      },
      handleSelectCountrySearchCancel() {
        this.selectCountry.searchText = '';
        this.handleSelectCountrySearch();
      },
      handleSelectCountryOK() {
        this.createAccount.phoneCountryFlag = this.selectCountry.current.flag;
        this.createAccount.phoneCountry = this.selectCountry.current.dial_code.replace(" ", "");
        this.$emit("getAreaCode",this.createAccount.phoneCountry);
        this.selectCountry.modal = false;
      },
      handleSelectCountryCancel() {
        this.selectCountry.modal = false;
      },
    },
  }
</script>
