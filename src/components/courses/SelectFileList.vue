<template>
  <div class="select-file-list">
    <Table ref="list" size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true"
           :data="filesData" :columns="filesColumn" :loading="loading">
    </Table>

    <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
      <Select v-model="pageSize" style="width:150px;" @on-change="pageSizeChange">
        <Option :value="10">{{$t('Common.Page10')}}</Option>
        <Option :value="25">{{$t('Common.Page25')}}</Option>
        <Option :value="50">{{$t('Common.Page50')}}</Option>
        <Option :value="100">{{$t('Common.Page100')}}</Option>
      </Select>

      <div style="float: right; display: flex; align-items: center;">
        <div style="display: inline-block; margin-right: 1em;">{{dataTotal}} {{$t("Files.TotalFiles")}}</div>
        <div style="display: inline-block">
          <Page :total="dataTotal" :current="pageIndex" :page-size="pageSize" @on-change="pageIndexChange"></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.select-file-list {

  .ivu-table th {
    background-color: #495060;
    color: white;
    //text-align: center;
  }

  // .ivu-table td {
  //   text-align: left;
  // }

  .ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td {
    background-color: #aad5ff;
    //color: white;
  }

  .ivu-table .bought-row td{
    background-color: #ff9900;
    color: #fff;
  }

  .table-action-icon {
    opacity: 0;
    cursor: pointer;
  }

  .ivu-table tr:hover .table-action-icon, .ivu-table .ivu-table-row-highlight .table-action-icon {
    opacity: 1;
  }
}
</style>

<script>
import auth from '../../authenticator';

export default {
  props: { 
    schoolId: {
      required: true
    },
    isVideo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      filesData: [],
      filesColumn: [
        {
          type: 'selection',
          width: 100,
          // align: 'center'
        },
        {
          title: this.$t('Files.FileName'),
          key: 'name',
          width: 250,
        },
        {
          title: this.$t('Common.Type'),
          key: 'type'
        },
        {
          title: this.$t('Files.Size'),
          key: 'size'
        },
        {
          title: this.$t('Files.Date'),
          key: 'date',
          width: 170
        },
      ],
      dataTotal: 0,
      pageSize: 10,
      pageIndex: 1,
      selection: []
    };
  },
  methods: {
    loadData() {
      this.pageIndex = 1;
      this.selection = [];
      this.readData();
    },
    readData() {
      let self = this;
      let url = GetAPIUrl() + "FavoriteAttachment/MyFavoriteAttachmentsNew?schoolID=" + this.schoolId;
      url += "&type=" + (this.isVideo ? 2 : 1);
      url += "&pageIndex=" + (this.pageIndex - 1);
      url += "&pageSize=" + this.pageSize;

      this._getData(url, () => {
        self.filesData = [];
      }, (data) => {
        self.dataTotal = data.Count;
        let list = data.List;

        for(let i = 0; i < list.length; i++) {
          let attachment = list[i];
          let file = self._attachment2File(attachment);
          file._checked = self.selection.indexOf(file.id) >= 0;

          self.filesData.push(file);
        }
      }, null);
    },
    pageIndexChange(page) {      
      this.mergeSelection();

      this.pageIndex = page;
      this.readData();
    },
    pageSizeChange(data) {
      this.pageIndex = 1;
      this.readData();
    },
    mergeSelection() {
      for (let i = 0; i < this.filesData.length; i++) {
        this.changeSelection(this.filesData[i].id, false);
      }

      let selection = this.$refs.list.getSelection();
      for (let i = 0; i < selection.length; i++) {
        this.changeSelection(selection[i].id, true);
      }
    },
    changeSelection(id, add){
      if (add) {
        if (!this.selection.includes(id))
          this.selection.push(id);
      }
      else {
        let index = this.selection.indexOf(id);
        if (index >= 0) 
          this.selection.splice(index, 1);
      }
    },
    getSelection() {
      this.mergeSelection();

      return this.selection;
    },
    _attachment2File: function (attachment) {
      let date = new Date(parseInt(attachment.CreatedDate));

      return {
        id: attachment.ItemID,
        title: attachment.Title,
        name: attachment.Title,
        date: date.Format("yyyy-MM-dd hh:mm:ss"),
        download: attachment.SourceFileUrl,
        detail: attachment
      };
    },
    _getData(url, before, success, error) {
      this.loading = true;
      this.$Loading.start();

      if (before && typeof before === 'function') {
        before();
      }

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
  }
}
</script>
