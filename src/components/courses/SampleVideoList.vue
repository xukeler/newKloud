<template>
  <div class="sample-video-list">
    <div class="list-header">
      {{$t("SampleVideoList.RecordedSamples")}}
      <div style="float: right;">
        <Button type="primary" shape="circle" icon="plus-round" @click="createSample">{{$t("SampleVideoList.AddSample")}}</Button>
      </div>
    </div>
    <Table size="small" :no-data-text="$t('Common.NoData')" :loading="loading"
           :data="tableData" :columns="tableColumn"
           @on-sort-change="tableSortChange" @on-row-click="tableRowClick">
    </Table>

    <Modal v-model="modalItem" :title="$t('SampleVideoList.AlertRecordedSampleTitle')" :mask-closable="false" width="800">
      <sample-video-item ref="sampleVideoItem" :course-id="courseId" :is-school="isSchool" :school-id="schoolId" @on-save-remove="afterItemSaveOrRemove"></sample-video-item>
      <div slot="footer" style="height:35px;">
        <div style="float: left">
          <button type="button" class="k-button" style="color:darkred" @click="handleItemRemove">{{$t("SampleVideoList.DeleteSample")}}</button>
        </div>
        <div style="float: right">
          <button type="button" class="k-button k-primary" @click="handleItemOK">{{$t('Base.OK')}}</button>
          <button type="button" class="k-button" @click="handleItemCancel">{{$t('Base.Cancel')}}</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss">
  .sample-video-list{

    .list-header{
      font-size: 20px;
      padding-bottom: 16px;
    }

    .ivu-table-wrapper {
      border-left: 0;
    }
    .ivu-table::after {
      width: 0;
    }

    td {
      cursor: pointer;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import SampleVideoItem from './SampleVideoItem.vue';

  export default {
    components: {
      SampleVideoItem
    },
    props:{
      courseId: {
        required: true
      },
      isSchool: {
        type: Boolean,
        default: false
      },
      schoolId: {
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        initialized: false,
        loading: false,
        modalItem: false,
        tableData: [],
        tableColumn: [
          {
            title: this.$t('CourseProperty.Title'),
            key: 'title',
            sortable: true
          },
          {
            title: this.$t('Common.Type'),
            key: 'type',
            sortable: true
          }
        ]
      };
    },
    methods: {
      initialize() {
        if (!this.initialized) {
          this.readData();
          this.initialized = true;
        }
      },
      refresh(){
        this.readData();
      },
      readData() {
        let self = this;

        let url = GetAPIUrl() + "SampleVideo/List?courseID=" + this.courseId;
        this._getData(url, null, (result) => {
          self._initSampleList(result);
        }, null);
      },
      _initSampleList(data) {
        let samples = [];
        for (let i = 0; i < data.length; i++) {
          let sample = {
            id: data[i].SampleVideoID,
            title: data[i].Title,
            type: data[i].TypeID === 1 ? this.$t('SampleVideoList.ExternalVideoURL') : this.$t('SampleVideoList.PeertimeRecordedLesson') 
          };

          samples.push(sample);
        }

        this.tableData = samples;
      },
      createSample() {
        this.$refs.sampleVideoItem.readData(-1);
        this.modalItem = true;
      },
      tableSortChange(params) {

      },
      tableRowClick(row) {
        this.$refs.sampleVideoItem.readData(row.id);
        this.modalItem = true;
      },
      handleItemRemove(){
        this.$refs.sampleVideoItem.removeData();
      },
      handleItemOK() {
        this.$refs.sampleVideoItem.saveData();
      },
      handleItemCancel(){
        this.modalItem = false;
      },
      afterItemSaveOrRemove() {
        this.refresh();
        this.modalItem = false;
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
              self.$Message.error(result.ErrorMessage);
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);
          }
        });
      },
    }
  }
</script>
