<template>
    <div id="ctl-seletfilefromspace">
       <Modal
        v-model="selectLectureModal"
        title="Select lectures"
        width="800"
        :closable="false"
        :mask-closable="false"
        @on-ok="selectLecturesOK"
        @on-cancel="selectLecturesCancel"
        style="z-index:40000;position: absolute;"
        class-name="hideModalFooter"
    >
        <div slot="header" style=" height:30px;">
            <span
                style="font-size:16px; font-weight:bold;"
            >{{$t("AddLesson.SelectLectures")}}</span>
            <span style="float:right;">
                <Button type="primary" @click="selectLecturesOK">{{$t("Base.OK")}}</Button>
                <Button type="text" @click="selectLecturesCancel">{{$t("Base.Cancel")}}</Button>
            </span>
        </div>
        <div style="padding: 0px 0px 10px;">
            <span>
                 <Input v-model="searchKey" :placeholder="$t('Base.Search')" style="width: 200px;" @on-enter="onSearch"></Input>
            </span>
            <span>
                 <Button type="primary" icon="ios-search" @click="onSearch" >{{$t("Base.Search")}}</Button>
            </span>
            <!-- <div style="float:right; padding:0px 0px 5px;display:inline-block;"><Page :total="total" :current="currentPage" :page-size="15" size="small" @on-change="onChangePageIndex"></Page></div> -->
        </div>
        <div style="clear:both;"></div>
        <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
            <Col span="2">&nbsp;</Col>
            <Col span="9">{{$t('Base.Title')}}</Col>
            <Col span="9">{{$t('Common.LessonCount')}}</Col>
            <Col span="4">{{$t('Common.Status')}}</Col>
        </Row>
        <div id="lectureList" style="height:300px; overflow:auto;">
            <div class="favList" :key="item.id" v-for="item in lectureList">
                <Row style="min-height:26px;" type="flex" align="middle">
                    <Col span="2">
                        <input
                            type="checkbox"
                            :value="item.id"
                            @click="onSelectedLectureClick(item.checked,$event);"
                            :disabled="item.checked"
                            :checked="item.checked"
                        >
                    </Col>
                    <Col span="9">{{item.title}}</Col>
                    <Col span="9">{{item.lessonCount}}</Col>
                    <Col span="4">{{item.status}}</Col>
                </Row>
            </div>
        </div>
        <div slot="footer" style="display:none;"></div>
    </Modal>
    </div>
</template>
<style lang="scss">

</style>

<script>
import webapi from "../../webapi/webapi.js";
export default {
  components: {

  },
  data() {
    return {     
        selectLectureModal:false,
        lectureList:[],
        allLectureList:[],
        selectedLectures: [],
        total:1,
        currentPage:1,
        searchKey:"",
        courseId:0,
        existLectures:[],
    };
  },
  computed: {
   
  },
  watch: {
    
  },
  mounted () {
    
  },
  methods: {
    ShowLectures(lessonId){
    //   console.log("meetingInfo",meetingInfo);
        this.searchKey="";
        this.selectedLectures=[];
        this.selectLectureModal=true;
        this.currentPage=1;
        webapi.getmeetinginfo(lessonId, meetingInfo => {
            if(meetingInfo.RetData && meetingInfo.RetData.CourseID){
                this.courseId = meetingInfo.RetData.CourseID;
                this.existLectures = meetingInfo.RetData.LectureIDs.split(",");
                this.initselectLectureList(this.courseId);
            }

        })
    },
    onSelectedLectureClick(disabled,evt){
        if(disabled){
            return;
        }

        var tar = evt.currentTarget;
        if (tar.checked) {
            this.selectedLectures.push($(tar).val());
        } else {
            var nindex = FindStrInArr(this.selectedLectures, $(tar).val());
            if (nindex > -1) {
                this.selectedLectures.splice(nindex, 1);
            }
        }
    },
    initselectLectureList(courseId){
        this.showLectureList(courseId);
    },
    onSearch(){
        if(this.courseId){
            if(this.searchKey){
                let searchStr = new RegExp(this.searchKey,'i');
                this.lectureList = this.allLectureList.filter(item=>{
                    return item.title.search(searchStr)>=0;
                })
            }else{
                this.lectureList = this.allLectureList;
            }
        }
    },
    showLectureList(courseId){
      this.lectureList=[];
      this.allLectureList = [];
      webapi.getLectureList(courseId).then(data=>{
          if(data)
          {
             for (let i = 0; i < data.length; i++) {
                let lecture = {
                    index: this.$t('Common.Lecture') + ' ' + (i + 1),
                    id: data[i].LectureID,
                    title: data[i].Title,
                    lessonCount: data[i].LessonCount,
                    status: this.$t('AddLesson.Ready'),
                    checked:this.existLectures.includes(data[i].LectureID+"")
                };
                this.allLectureList.push(lecture);
            }
            this.lectureList = this.allLectureList;
          }
      });
    },
    onChangePageIndex(page){
        console.log("page:"+page);
        this.showLectureList(this.courseId);
    },
    selectLecturesOK(){
        if (this.selectedLectures.length < 1) {
            return;
        }
        this.selectLectureModal=false;
        this.$emit("onOK",this.selectedLectures);
    },
    selectLecturesCancel(){
        this.selectLectureModal = false;
    },
  }
}
</script>


