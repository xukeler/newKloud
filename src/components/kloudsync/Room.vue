<template>
   <div class="kloudsync-room">
     <div class="paneGutter"></div>
    <div class="panelDetail">
      <div class="syncroomtab">
          <Tabs value="name1" size="default">
            <TabPane label="SyncRoom" name="name1" ></TabPane>
        </Tabs>
      </div>
      <div class="ivu-table-wrapper">        
        <div class="ivu-table ivu-table-stripe tablehoverstyle">
          <div class="ivu-table-header">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">              
              <thead>
                <tr>
                  <th style="width:200px;"><div class="ivu-table-cell"><span class="">Title</span></div></th>
                  <th style="width:170px;"><div class="ivu-table-cell"><span class="">Time</span></div></th>
                  <th style="width:100px;"><div class="ivu-table-cell"><span class="">Host</span> </div></th>
                  <th style=""><div class="ivu-table-cell"><span class="">Attends</span> </div></th>
                  <th style="width:50px;"><div class="ivu-table-cell"><span class=""></span> </div></th>
              </tr>
              </thead>
            </table>
          </div>
          <div class="ivu-table-body">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">             
              <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row" :key="item.id" :id="item.id" v-for="item in syncRoomList">
                  <td style="width:200px;"><div class="ivu-table-cell"><span><a @click.stop="clickLessonTitle(item.id);">{{item.title}}</a></span></div></td>
                  <td style="width:170px;"><div class="ivu-table-cell"><span>{{item.time}}</span></div></td>
                  <td style="width:100px;"><div class="ivu-table-cell"><span>{{item.host}}</span> </div></td>
                  <td style=""><div class="ivu-table-cell"><span style="max-height: 104px;display: inline-block;overflow: hidden;">{{item.attend}}</span></div></td>
                  <td style="width:50px;"><div class="ivu-table-cell"><span></span></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>                                     
      </div>
    </div>
     <div class="paneGutter"></div>
  </div>
</template>
<style lang="scss">
.kloudsync-room
{
  width:100%;
  text-align: ceter;
  display: flex;
  padding-top: 20px;

  .paneGutter {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    -webkit-flex: 1 0 20px;
    -moz-flex: 1 0 20px;
    -ms-flex: 1 0 20px;
    flex: 1 0 20px;
  }
  .panelDetail {
    -webkit-box-flex: 5500;
    -moz-box-flex: 5500;
    box-flex: 5500;
    -webkit-flex: 5500 1 500px;
    -moz-flex: 5500 1 500px;
    -ms-flex: 5500 1 500px;
    flex: 5500 1 500px;
    max-width: 1500px;
    min-width: 500px;

    background-color: #ffffff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 3px;

    padding: 28px;
  }
  .tablehoverstyle .ivu-table-row:hover td{
    background-color: #f1f3f7 !important;
  }

  .tablehoverstyle .ivu-table-header th {
      background-color: #495060;
      color: white;
      height: 32px;
  }
  .syncroomtab .ivu-tabs-tab
  {
    padding: 8px 16px 8px 8px;
    font-size: 20px;
    font-weight: bold;
  }
}
</style>

<script>
import auth from "../../authenticator";
import webapi from "../../webapi/webapi.js";
import loger from "../../common/log.js";
import util from "../../common/util.js";
export default {
  components: {

  },
  data() {
    return {     
      syncRoomList:[],
    };
  },
  mounted () {
    this.InitList();
  },
  computed: {
   
  },
  watch: {
    
  },
  methods: {
    InitList(){
      this.syncRoomList=[];
      webapi.getSyncRoomLessons().then(res=>{
          if(!res) return;
          //console.log(res);
          for(var lesson of res)
          {
            let start = new Date(parseInt(lesson.PlanedStartDate));
            let show={
              id:lesson.LessonID,
              title:lesson.Title,
              attend:lesson.StudentNames,
              host:lesson.TeacherNames,
              time:start.toLocaleString()
            };
            this.syncRoomList.push(show);
          }
      });

    },
    clickLessonTitle(id){
      //alert(id);
      this.$router.push({ name: "syncroom", params: { id: id } });
    }
  }
}
</script>
