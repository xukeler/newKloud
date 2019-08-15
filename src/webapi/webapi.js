import auth from "../authenticator";
import friends from "../friends/index.js";
import axios from '../common/axios.js';

export default {
    //_livedocurl: "https://192.168.22.151/TxLiveDocumentApi/api/",
    _livedocurl: "https://livedoc.peertime.cn/TxLiveDocumentApi/api/",
    _jiaxing:"https://jiaxing.techexcel.com.cn/devspecapi/",
    getLiveToken()
    { 
        var token = WEBAPI_ROOTURL_HTTPS.indexOf("test") > -1 ? "01427aa4-396e-44b7-82ab-84d802099bb0" : "02912174-3dcb-49eb-b9fa-6d90b390d495";
        return token;
    },
    getToken()
    {
        return auth.getUserToken();
    },
    getUserID()
    {
        return auth.getUserID();
    },
    getUserName()
    {
        return auth.getUserName();
    },
    getSchoolID()
    {
        return auth.getSchoolID();
    },
    getAjax(url)
    {
        return new Promise((resolve, reject) => {
            axios.get(url).then(res =>
            {
                resolve(res.data);
            }).catch(err =>
            { 
                console.log(err);
                resolve(null);
            });
        });
        // return new Promise((resolve, reject) =>
        // {
        //     var sessionid = this.getToken();
        //     $.ajax({
        //         type: "GET",
        //         url: url,
        //         beforeSend: function (request)
        //         {
        //             request.setRequestHeader("UserToken", sessionid);
        //         },
        //         success: function (data)
        //         {
        //             resolve(data);
        //         },
        //         error: function (xhr, ajaxOptions, thrownError)
        //         {
        //             console.log(xhr);
        //             resolve(null);
        //         }
        //     });
        // });
    },
    getAjax4Live(url){
        return new Promise((resolve, reject) =>
        {
            var token = this.getLiveToken();
            var userid = this.getUserID();
            $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                timeout:15000,
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + token + "");
                    request.setRequestHeader("peertime-user", userid);
                },
                success: function (data)
                {
                    resolve(data);
                },
                error: function (xhr, ajaxOptions, thrownError)
                {
                    resolve(null);
                }
            });
        });
    },
    getAjaxSync(url){        
        var sessionid = this.getToken();
        var result = null;
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            beforeSend: function (request)
            {
                request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
                result = data;
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
                console.log(xhr);
            }
        });
        return result;
    },
    postAjax(url,obj)
    {
        return new Promise((resolve, reject) => {
            axios.post(url,obj).then(res =>
            {
                resolve(res.data);
            }).catch(err =>
            { 
                resolve(null);
            });
        });
    },
    postAjax4Obj(url,obj,timeOut=60000)
    {
        return new Promise((resolve, reject) =>
        {
            var sessionid = this.getToken();
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: obj,
                timeout:timeOut,
                beforeSend: function (request)
                {
                    request.setRequestHeader("UserToken", sessionid);
                },
                success: function (data)
                {
                    resolve(data);
                },
                error: function (xhr, ajaxOptions, thrownError)
                {
                    console.log(xhr);
                    resolve(null);
                }
            });
        });
    },
    postAjax4Live(url,obj,cancel=null)
    {
        return new Promise((resolve, reject) =>
        {
            var token = this.getLiveToken();
            var userid = this.getUserID();
            var jq=$.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                data: obj?JSON.stringify(obj):"",
                dataType: "json",
                timeout:15000,
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + token + "");
                    request.setRequestHeader("peertime-user", userid);
                },
                success: function (data)
                {
                    resolve(data);
                },
                error: function (xhr, ajaxOptions, thrownError)
                {
                    // if (thrownError && thrownError == "timeout")
                    // {
                        
                    // }
                    if (thrownError && thrownError == "abort")
                    {
                        reject("abort");
                    }
                    else
                    {
                        console.log(thrownError);
                        resolve(null);
                    }
                }
            });
            if (cancel)
            {
                cancel.Cancel=()=> { 
                    jq.abort();
                }
            }
        });
    },
    delAjax(url)
    {
        return new Promise((resolve, reject) => {
            axios.delete(url).then(res =>
            {
                resolve(res.data);
            }).catch(err =>
            { 
                console.log(err);
                resolve(null);
            });
        });
        // return new Promise((resolve, reject) =>
        // {
        //     var sessionid = this.getToken();
        //     $.ajax({
        //         type: "DELETE",
        //         url: url,
        //         beforeSend: function (request)
        //         {
        //             request.setRequestHeader("UserToken", sessionid);
        //         },
        //         success: function (data)
        //         {
        //             resolve(data);
        //         },
        //         error: function (xhr, ajaxOptions, thrownError)
        //         {
        //             console.log(xhr);
        //             resolve(null);
        //         }
        //     });
        // });
    },
    async getClassRoomLessonID(id)
    {
        var url = GetAPIUrl() + "Lesson/GetClassRoomLessonID?classroomID=" + id;
        var result = await this.getAjax(url);
        if (!result || result.RetData == "")
        {
            return 0;
        } else
        {
            return parseInt(result.RetData);
        }        
    },
    async getClassRoomTeacherID(id)
    {
        var url = GetAPIUrl() + "Lesson/GetClassRoomTeacherID?classroomID=" + id;
        var result = await this.getAjax(url);
        if (!result || result.RetData == "")
        {
            return 0;
        } else
        {
            return parseInt(result.RetData);
        }      
    },
    async getAttachmentDetail(id)
    {
        var url = GetAPIUrl() + "Attachment/GetAttachmentInfoByID?attachmentID=" + id;
        var result = await this.getAjax(url);
        if (!result || result.RetData == "")
        {
            return null;
        }
        return result.RetData;
    },
    async getFavoriteAttachmentDetail(id)
    {
        var url = GetAPIUrl() + "FavoriteAttachment/GetFavoriteAttachmentByID?itemID=" + id;
        var result = await this.getAjax(url);
        if (!result || result.RetData == "")
        {
            return null;
        }
        return result.RetData;
    },
    async getSpaceAttachmentDetail(id)
    {
        var url = GetAPIUrl() + "SpaceAttachment/Item?itemID=" + id;
        var result = await this.getAjax(url);
        if (!result || result.RetData == "")
        {
            return null;
        }
        return result.RetData;
    },
    async getAttachmentDetailByItemID(itemid)
    {
        var url = GetAPIUrl() + "Attachment/GetAttachmentByItemID?itemID=" + itemid;
        var result = await this.getAjax(url);
        if (!result || result.RetData == "")
        {
            return null;
        }
        else
        {
            result.RetData.ItemID = itemid;
            result.RetData.Title = result.RetData.SourceFileName;
            return result.RetData;
        }
    },
    async getLessonAttachmentDetail(id)
    {
        var url =GetAPIUrl() + "EventAttachment/GetLessonAttachmentByID?itemID=" + id;
        var result = await this.getAjax(url);
        if (!result || result.RetData == "")
        {
            return null;
        }
        return result.RetData;
    },
    async addInstantLesson(id,addBlankPage=1)
    {
        var url = GetAPIUrl() + "Lesson/AddInstantLesson?classroomID=" + id + "&addBlankPage=" + addBlankPage;
        var result = await this.postAjax(url,null);
        if (!result || result.RetData == "")
        {
            return 0;
        } else
        {
            return parseInt(result.RetData);
        } 
    },
    async addBlankPage(id)
    {
        var url = GetAPIUrl() + "EventAttachment/AddBlankPage?lessonID=" + id;
        var result = await this.postAjax(url);
        if (!result)
        {
            return null;
        }
        return result.RetData;
    },
    async SaveAsFavorite(attachmentID,title)
    {
        title = encodeURIComponent(base64encode(utf16to8(title)));
        var url = GetAPIUrl() + "FavoriteAttachment/SaveAsFavorite?attachmentID=" + attachmentID + "&title=" + title;
        var result = await this.postAjax(url);
        if (!result)
        {
            return null;
        }
        return result;
    },
    async RemoveAttachmentsFromLesson(itemIDs)
    {
        var url = GetAPIUrl() + "EventAttachment/RemoveAttachments?itemIDs=" + itemIDs;
        var result = await this.delAjax(url);
        if (!result)
        {
            return null;
        }
        return result.RetData;
    },
    async getPageObject(lessonid, fileid, pageid,showsync=1)
    {
        if (
            lessonid + "" == "" ||
            fileid + "" == "" ||
            pageid + "" == "" ||
            pageid + "" == "0"
        )
        {
            return null;
        }
        var sessionid = this.getToken();
        var url = GetAPIUrl() + "PageObject/GetPageObjects?lessonID=" + lessonid + "&itemID=" + fileid + "&pageNumber=" + pageid;
        var result = await this.getAjax(url);
        if (!result || result.RetData == "" || result.RetData.length < 1)
        {
            return null;
        }
        else
        {
            var arr = result.RetData;
            var arrresult = new Array();
            for (var obj of arr)
            {
                if (showsync == 0 && obj.IsLessonSyncDrawing == 1)
                {
                    continue;
                }
                arrresult.push(utf8to16(base64decode(obj.Data)));
            }
            return arrresult;
        }
    },
    async getAttachmentOrSyncPageObject(pageid,attachmentID=0,soundtrackID=0,displayDrawingLine=0)
    {
        var lessonid = 0;
        var itemid = 0;
        var url = GetAPIUrl() + "PageObject/GetPageObjects?lessonID=" + lessonid + "&itemID=" + itemid + "&pageNumber=" + pageid +"&attachmentID="+attachmentID+"&soundtrackID="+soundtrackID;
        url += "&displayDrawingLine=" + displayDrawingLine;
        var result = await this.getAjax(url);
        if (!result || result.RetData == "" || result.RetData.length < 1)
        {
            return null;
        }
        else
        {
            var arr = result.RetData;
            var arrresult = new Array();
            for (var obj of arr)
            {
                arrresult.push(utf8to16(base64decode(obj.Data)));
            }
            return arrresult;
        }
    },
    async getLecturePageObject(lectureID, fileid, pageid)
    {
        if (
            lectureID + "" == "" ||
            fileid + "" == "" ||
            pageid + "" == "" ||
            pageid + "" == "0"
        )
        {
            return null;
        }
        var url = GetAPIUrl() + "PageObject/GetLecturePageObjects?lectureID=" + lectureID + "&itemID=" + fileid + "&pageNumber=" + pageid;
        var result = await this.getAjax(url);
        if (!result || result.RetData == "" || result.RetData.length < 1)
        {
            return null;
        }
        else
        {
            var arr = result.RetData;
            var arrresult = new Array();
            for (var obj of arr)
            {
                arrresult.push(utf8to16(base64decode(obj.Data)));
            }
            return arrresult;
        }
    },
    async getLecturePageObjectEx(lectureID, fileid, pageid)
    {
        if (lectureID + "" == "" ||fileid + "" == "" ||pageid + "" == "" ||pageid + "" == "0")
        {
            return null;
        }
        var url = GetAPIUrlEx() + "lecture_page_object/list?lectureId=" + lectureID + "&itemId=" + fileid + "&pageNumber=" + pageid;
        var result = await this.getAjax(url);
        if (!result || result.data == "" || result.data.length < 1)
        {
            return null;
        }
        else
        {
            var arr = result.data;
            var arrresult = new Array();
            for (var obj of arr)
            {
                arrresult.push(utf8to16(base64decode(obj)));
            }
            return arrresult;
        }
    },
    async getSyncObject(lessonid, itemid, audioid, starttime, endtime)
    {
        var url = GetAPIUrl() + "Lesson/AudioActions?lessonID=" + lessonid + "&docItemID=" + itemid + "&audioItemID=" + audioid + "&startTime=" + starttime + "&endTime=" + endtime;
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        } 
    },
    async getVoiceInfo(lessonid, itemid, audioid)
    {
        var url = GetAPIUrl() + "Lesson/GetLessonRecordedVoice?LessonID=" + lessonid + "&DocItemID=" + itemid + "&AudioItemID=" + audioid;
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        } 
    },
    async getMyFavorite(
        type = 1,//type 1普通  2 Video 0是全部
        schoolID = -1, 
        pageIndex = -1,
        pageSize = 15,
        searchText=""
    )
    {
        var url = GetAPIUrl() + "FavoriteAttachment/MyFavoriteAttachments?pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&type=" + type + "&schoolID=" + schoolID;
        if (searchText != "")
        {
            url += "&searchText=" + encodeURIComponent(base64encode(utf16to8(Trim(searchText))));
        }
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getVideoList(
        pageIndex,
        schoolID,
        searchText = "" //type 1普通  2 Video 0是全部
    )
    {
        var url =GetAPIUrl() +"FavoriteAttachment/MyFavoriteAttachmentsNew?type=2&pageSize=10&pageIndex=" +pageIndex +"&schoolID=" +schoolID;
        if (searchText != "")
        {
            url += "&searchText=" + encodeURIComponent(base64encode(utf16to8(searchText)));
        }
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getAudioList(
        pageIndex,
        schoolID,
        searchText = "" //type 1普通  2 Video 0是全部  3 音频
    )
    {
        var url =GetAPIUrl() +"FavoriteAttachment/MyFavoriteAttachmentsNew?type=3&pageSize=10&pageIndex=" +pageIndex +"&schoolID=" +schoolID;
        if (searchText != "")
        {
            url += "&searchText=" + encodeURIComponent(base64encode(utf16to8(searchText)));
        }
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        } 
    },
    async getUpcomingLessonList(id)
    {
        id = id || -1;
        var url = GetAPIUrl() + "Lesson/UpcomingLessonList?teacherID=" + id;
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        } 
    },
    async getCourseList()
    {
        var url = GetAPIUrl() + "Course/List?listType=1&pageIndex=-1";
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        } 
    },
    async getStudentCourseList(teachid, studentid)
    {
        var url =
                GetAPIUrl() +
                "Course/List?listType=2&pageIndex=-1&studentID=" +
                studentid +
                "&schoolID=" +
                this.getSchoolID(); //&teacherID=" + teachid + "
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getMyCourseTempList()
    {
	//All = 0,
            //System = 1,
            //Personal = 2,
            //School = 3,
        var url =GetAPIUrl() + "Course/List?listType=1&templateType=2&pageIndex=-1";
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getSchoolCourseTempList(schoolid)
    {
        var url = GetAPIUrl() + "Course/List?listType=1&templateType=3&pageIndex=-1&SchoolID=" + schoolid;
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getLectureList(id)
    {
        var url = GetAPIUrl() + "Lecture/List?courseID=" + id;
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getLectureInfo(id)
    {
        var url = GetAPIUrl() + "Lecture/Item?lectureID=" + id;
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async createLesson(lesson)
    {
        var url = GetAPIUrl() + "Lesson/CreateOrUpdateLessons";
        var result = await this.postAjax(url, lesson);
        if(!result)
        {
            return 0;
        }
        else
        {
            return parseInt(result.RetData)
        }
    },
    async approveItem(obj){
        var url = GetAPIUrl() + "SyncRoom/ApproveItem";
        var result = await this.postAjax(url, obj);
        if(!result)
        {
            return 0;
        }
        else
        {
            return result
        }
    },
    async createLessonEx(lesson)
    {
        var url = GetAPIUrl() + "Lesson/CreateLesson";
        var result = await this.postAjax(url, lesson);
        if(!result)
        {
            return 0;
        }
        else
        {
            return parseInt(result.RetData)
        }
    },
    async getUserListBasicInfo(arr)
    {
        var url = GetAPIUrl() + "User/UserListBasicInfo?userIds=" + arr.join(",");
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async addFav2Meeting(meetingid, attachmentids)
    {
        var url =
                GetAPIUrl() +
                "EventAttachment/UploadFromFavorite?lessonID=" +
                meetingid +
                "&itemIDs=" +
            attachmentids.join(",");
        var result = await this.postAjax(url, null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async addFav2Space(spaceid, itemids)
    {
        var url = GetAPIUrl() + "SpaceAttachment/UploadFromFavorite?spaceID=" + spaceid + "&itemIDs=" + itemids.join(",");
        var result = await this.postAjax(url, null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async addFav2Topic(topicid, itemids)
    {
        var url = GetAPIUrl() + "TopicAttachment/UploadFromFavorite?TopicID=" + topicid + "&itemIDs=" + itemids.join(",");
        var result = await this.postAjax(url, null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async addSpace2Topic(topicid, itemids) {
        var url = GetAPIUrl() + "TopicAttachment/UploadFromSpace?TopicID=" + topicid + "&itemIDs=" + itemids.join(",");
        var result = await this.postAjax(url, null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async removeTopicAttachment(itemID) {
        var url = GetAPIUrl() + "TopicAttachment/RemoveDocument?itemID=" + itemID;
        var result = await this.delAjax(url);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getLectureSequence()
    {
        var url = GetAPIUrl() + "Lecture/Sequence";
        var result = await this.getAjax(url);
        if(!result)
        {
            return 0;
        }
        else
        {
            return parseInt(result.RetData)
        }
    },
    async getLessonSequence()
    {
        var url = GetAPIUrl() + "Lesson/Sequence";
        var result = await this.getAjax(url);
        if(!result)
        {
            return 0;
        }
        else
        {
            return parseInt(result.RetData)
        }
    },
    async createCourse(course)
    {
        var url = GetAPIUrl() + "Course/CreateCourse";
        var result = await this.postAjax(url, course);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async createLecture(lecture)
    {
        var url = GetAPIUrl() + "Lecture/CreateLecture";
        var result = await this.postAjax(url, lecture);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async createConferenceCall(data)
    {
        var url = GetAPIUrl() + "Twilio/CreateTempConference";
        var result = await this.postAjax(url, data);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getRongCloudUserToken()
    {
        var url = GetAPIUrl() + "RongCloudUserToken";
        var result = await this.getAjax(url);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getUserInfoByRongID(arr)
    {
        var url =
                GetAPIUrl() +
                "User/UserListBasicInfoByRongCloud?rongCloudIDs=" +
            arr.join(",");
        var result = await this.getAjax(url);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getRoomTeacherSetting(roomid, settingid)
    {
        var url =
                GetAPIUrl() +
                "User/TeacherResolutionSetting?classroomID=" +
                roomid +
                "&settingID=" +
            settingid;
        var result = await this.getAjax(url);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async setUserSettingToServer(setting)
    {
        var url = GetAPIUrl() + "User/CreateOrUpdateUserSetting";
        var result = await this.postAjax(url, setting);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    /*
    1001-mic, 1002-speaker, 1003-Camera, 1004-SecondCamera, 1005-Resolution
    2001-default team,2002-default space,2003-default team for syncroom
    */
    async getUserSettingFromServer(ids)
    {
        var url = GetAPIUrl() + "User/UserSettings?settingIDs=" + ids.join(",");
        var result = await this.getAjax(url);
        if(!result || result.RetData == "")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getTencentSig(userinfo, roomid)
    {
        var url = GetAPIUrl() + "TencentCloud/GenerateSig";
        var data = { UserID: userinfo, RoomID: roomid };
        var result = await this.postAjax(url, data);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getRoomVideoList(id, callback)
    {
        var sessionid = this.getToken();
        var url = GetAPIUrl() + "Lesson/VideoList?lessonID=" + id;
        var result = await this.getAjax(url);
        if(!result || result.RetData == "")
        {
            callback(null);
            return null;
        }
        else
        {
            callback(result.RetData);
            return result.RetData;
        }
    },
    async getmeetinginfo(meetingid, callback)
    {
        var sessionid = this.getToken();
        var url = GetAPIUrl() + "Lesson/Item?lessonID=" + meetingid;
        var result = await this.getAjax(url);
        if(!result || result.RetData == "")
        {
            callback(null);
            return null;
        }
        else
        {
            callback(result);
            return result;
        }
    },
    async getRecordAttachmentList(lessonid,soundtrackID, callback)
    {
        var sessionid = this.getToken();
        var url = GetAPIUrl() + "Soundtrack/ShareRecordLessonAttachments?lessonID=" + lessonid + "&soundtrackID=" + soundtrackID;
        var result = await this.getAjax(url);
        if(!result || result.RetData == "")
        {
            callback(null);
            return null;
        }
        else
        {
            callback(result);
            return result;
        }
    },
    async getUsersInfo(userlist, meetingid)
    {
        var sessionid = this.getToken();
        var url =
            GetAPIUrl() +
            "User/UserRoleAndInfo?serviceID=" +
            meetingid +
            "&userIds=" +
            userlist.join(",");
        var result = await this.getAjax(url);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getAttachmentConvertingPercentage(ids)
    {
        var url = GetAPIUrl() + "Attachment/AttachmentConvertingPercentage?attachmentIDs=" + ids.join(",");
        var result = await this.getAjax(url);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    getInstantAccount(id, callback)
    {
        var url = GetAPIUrl() + "User/GetInstantAccount?guid=" + id;
        var result = this.getAjaxSync(url);
        if (!result)
        {
            return "";
        }
        else
        {
            return result.RetData;
        }
    },
    isMeetingIDExist(id)
    {
        var url = GetAPIUrl() + "User/CheckLessonOrClassroomExist?id=" + id;
        var result = this.getAjaxSync(url);
        if (!result)
        {
            return false;
        }
        else
        {
            return result.RetData==1;
        }
    },
    async createInstantAccout(guid, username)
    {
        var url = GetAPIUrl() + "User/CreateOrUpdateInstantAccout";
        var result = await this.postAjax(url, { Guid: guid, UserName: username });
        if(!result)
        {
            return null;
        }
        else
        {
            return result;
        }
    },
    async SaveInstantLesson(id)
    {
        var url = GetAPIUrl() + "Lesson/SaveInstantLesson?lessonID=" + id;
        var result = await this.postAjax(url,null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async UploadFileWithHash(lessonid, filename, hash)
    {
        var uname = encodeURIComponent(base64encode(utf16to8(filename)));
        var url = GetAPIUrl() + "EventAttachment/UploadFileWithHash?LessonID=" + lessonid + "&FileName=" + uname + "&Title=" + uname + "&Description=&Hash=" + hash;
        var result = await this.postAjax(url,null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result;
        }
    },
    async UploadFile2FavWithHash(school, folder, filename, hash)
    {
        var uname = encodeURIComponent(base64encode(utf16to8(filename)));
        var url;
        if (school == -1)
        {
            url =
                GetAPIUrl() +
                "FavoriteAttachment/UploadFileWithHash?Title=" +
                uname +
                "&Description=&Hash=" +
                hash;
        } else
        {
            url =
                GetAPIUrl() +
                "FavoriteAttachment/UploadFileWithHash?schoolID=" +
                school +
                "&folderID=" +
                folder +
                "&Title=" +
                uname +
                "&Description=&Hash=" +
                hash;
        }
        var result = await this.postAjax(url,null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result;
        }
    },
    async UploadFileKwEventAttachmentHash(eventId, filename, hash, points, parentID)

    {
        var uname = encodeURIComponent(base64encode(utf16to8(filename)));
        var url;
        if (eventId == -1)
        {
            url =
                GetAPIUrl() +
                "KWEventAttachment/UploadFileWithHash?FileName=" +
                uname +
                "&Description=&Hash=" +
                hash;
        } else
        {
            url =
                GetAPIUrl() +
                "KWEventAttachment/UploadFileWithHash?EventID=" +
                eventId +
                "&Title=" +
                uname +
                "&Description=&Hash=" +
                hash;
        }

        if (points && parentID){
            url += "&Points=" +points
            url += "&ParentID=" + parentID
        }
        var result = await this.postAjax(url,null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result;
        }
    },
    async UploadUpdateFileKwEventAttachmentHash(eventId, itemId, filename, hash)
    {
        var uname = encodeURIComponent(base64encode(utf16to8(filename)));
        var url;
        url =
            GetAPIUrl() +
            "KWEventAttachment/UpdateFileWithHash?EventID=" +
            eventId +
            "&itemID=" +
            itemId +
            "&Title=" +
            uname +
            "&Description=&Hash=" +
            hash;
        var result = await this.postAjax(url,null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result;
        }        
    },
    async AddTempLesson(id,title)
    {
        var url = GetAPIUrl() + "Lesson/AddTempLesson?attachmentID=" + id + "&Title=" + encodeURIComponent(base64encode(utf16to8(title)));
        var result = await this.postAjax(url,null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result;
        }        
    },
    async AddStartMeetingLesson(id,title)
    {
        var url = GetAPIUrl() + "Lesson/AddStartMeetingLesson?attachmentID=" + id + "&Title=" + encodeURIComponent(base64encode(utf16to8(title)));
        var result = await this.postAjax(url,null);
        if(!result)
        {
            return null;
        }
        else
        {
            return result;
        }        
    },
    async AddTempLessonWithOriginalDoc(id,title)
    {
        var url = GetAPIUrl() + "Lesson/AddTempLessonWithOriginalDocument?attachmentID=" + id+"&Title="+encodeURIComponent(base64encode(utf16to8(title)));
        var result = await this.postAjax(url,null);
        return result;
    },
    async　CreateSoundtrack(info)
    {
        var url = GetAPIUrl() + "Soundtrack/CreateSoundtrack";
        var result = await this.postAjax(url,info);
        return result;
    },
    async　EditSoundtrack(info)
    {
        var url = GetAPIUrl() + "Soundtrack/UpdateSoundtrack";
        var result = await this.postAjax(url,info);
        return result;        
    },
    async　GetSoundtrack(id)
    {
        var url = GetAPIUrl() + "Soundtrack/Item?soundtrackID=" + id;
        var result = await　this.getAjax(url);
        if (!result ||result.RetData == "")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    GetSoundtrackEx(id)
    {
        var result = null;
        var sessionid = this.getToken();
        var url = GetAPIUrl() + "Soundtrack/Item?soundtrackID=" + id;
        var result = this.getAjaxSync(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async DelSoundtrack(id)
    {
        var url = GetAPIUrl() + "Soundtrack/Delete?soundtrackID=" + id;
        var result = await　this.delAjax(url);
        if (!result ||result.RetData == "")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async GetSoundtrackList(id,isPublic=0)
    {
        var url = GetAPIUrl() + "Soundtrack/List?attachmentID=" + id + "&isPublic=" + isPublic;
        var result = await　this.getAjax(url);
        if (!result ||result.RetData == "")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async GetSoundtrackListCount(id)
    {
        var url = GetAPIUrl() + "Soundtrack/ListCount?attachmentID=" + id;
        var result = await　this.getAjax(url);
        if (!result ||result.RetData == "")
        {
            return 0;
        }
        else
        {
            return result.RetData;
        }
    },
    async AddSoundtrack2Lesson(lessonid,ids)
    {
        var url = GetAPIUrl() + "LessonSoundtrack/ImportSoundtracks?lessonID=" + lessonid + "&soundtrackIDs=" + ids.join(",");
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }        
    },
    async GetLessonSoundtrackList(lessonid,id)
    {
        var url = GetAPIUrl() + "LessonSoundtrack/List?attachmentID=" + id + "&lessonID=" + lessonid;
        var result = await　this.getAjax(url);
        if (!result ||result.RetData == "")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async UpdateSoundAudioAttachmentID(soundid,audioid)
    {
        var url = GetAPIUrl() + "Soundtrack/UpdateAudioAttachmentID?soundtrackID=" + soundid + "&audioAttachmentID=" + audioid;
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }       
    },
    async GetSoundtrackActions(soundid, starttime, endtime)
    {
        var url = GetAPIUrl() + "Soundtrack/SoundtrackActions?soundtrackID=" + soundid + "&startTime=" + starttime + "&endTime=" + endtime;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    async GetShareDocumentKey(attid, touserid, title)
    {
        var url = GetAPIUrl() + "ShareDocument/Share?attachmentID=" + attid + "&toShareUserID=" + touserid + "&title=" + encodeURIComponent(base64encode(utf16to8(title)));
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        } 
    },
    GetSharedTempLessonID(key)
    {
        var url = GetAPIUrl() + "ShareDocument/SharedTempLesson?shareKey=" + key;
        var result = this.getAjaxSync(url);
        if (!result)
        {
            return -1;
        }
        else
        {
            return result.RetData;
        }        
    },
    async UpgradeToNormalLesson(lessonid)
    {
        var url = GetAPIUrl() + "Lesson/UpgradeToNormalLesson?lessonID=" + lessonid;
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }       
    },
    async getOnlineStatus()
    {
        var url = GetAPIUrl() + "RongCloud/OnlineStatus";
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    async startConverting(obj)
    {
        var url = this._livedocurl + "startConverting";
        var result = await this.postAjax4Live(url, obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }       
    },
    async queryBatchSending(obj){
        var url = this._livedocurl + "querySending?token="+obj
        var result = await this.getAjax4Live(url);
        if (!result)
        {
            return null;
        } else
        {
            return result;
        }        
    },
    async ReqChangeItemList(obj){
        var url = GetAPIUrl()+ "SyncRoom/Item?itemID="+obj
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        } else
        {
            return result;
        }        
    },
    async ReqChangeApprovalEventList(syncRoom,linkedItem){
        var url = GetAPIUrl()+ "SyncRoom/ReqChangeApprovalEventList?syncRoomID="+syncRoom+"&linkedItemID="+linkedItem
        var result = await this.getAjax(url);
        if (!result)
        {
            return null;
        } else
        {
            return result;
        }        
    },
    async finishConverting(obj)
    {
        var url = this._livedocurl + "finishConverting";
        var result = await this.postAjax4Live(url, obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }          
    },
    async queryConvertPercentage(obj)
    { 
        var url = this._livedocurl + "queryConverting";
        var result = await this.postAjax4Live(url, obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        } 
    },
    async UploadNewFile(obj)
    {
        var url = GetAPIUrl() + "EventAttachment/UploadNewFile";
        var result = await this.postAjax(url, obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async UploadHomeworkNewFile(obj)
    {
        var url = GetAPIUrl() + "HomeworkAttachment/UploadNewFile";
        var result = await this.postAjax(url, obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }      
    },
    async BusinessUploadHomeworkFileFavWithHash(assignmentID, fileID, filename, hash)
    {
        var uname = encodeURIComponent(base64encode(utf16to8(filename)));
        var url = url = GetAPIUrl() + "Homework/UploadFileWithHashFromStudent?AssignmentID=" + assignmentID + "&FileID=" + fileID + "&Title=" + uname + "&Description=&Hash=" + hash;
        var result = await this.postAjax(url, null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }       
    },
    async UploadSpaceNewFile(obj)
    {
        var url = GetAPIUrl() + "SpaceAttachment/UploadNewFile";
        var result = await this.postAjax(url, obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }       
    },
    async UploadFavNewFile(obj)
    {
        var url = GetAPIUrl() + "FavoriteAttachment/UploadNewFile";
        var result = await this.postAjax(url, obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }       
    },
    async UploadSoundtrackNewFile(obj)
    {
        var url = GetAPIUrl() + "Soundtrack/UploadNewFile";
        var result = await this.postAjax(url, obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    prepareUploading(ip)
    {
        var result = null;
        var url = this._livedocurl + "prepareUploading?clientIp=" + ip;
        var token = this.getLiveToken();
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            contentType: "application/json; charset=utf-8",
            timeout:15000,
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", "Bearer "+token+"");
            },
            success: function (data)
            {
                result=data;
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
                console.log(xhr);
                result=null;
            }
        });
        return result;
    },
    async prepareDownloading(obj)
    {
        var url = this._livedocurl + "prepareDownloading";
        var result = await this.postAjax4Live(url, obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }       
    },
    async queryDownloading(obj)
    {
        var url = this._livedocurl + "queryDownloading";
        var result = await this.postAjax4Live(url, obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        } 
    },
    async queryDownloadingFromPT(fileID)
    {
        var url = GetAPIUrl() + "Attachment/CheckDocumentExist?fileID=" + fileID;
        var result = await　this.getAjax(url);
        if (!result || result.RetData == "")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    async queryDocument(obj,cancel=null)
    {
        var url = this._livedocurl + "queryDocument";
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
        {
            url += "?ip=47.254.218.88";
        }
        var result = await this.postAjax4Live(url, obj,cancel);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        } 
    },
    async queryDocumentEx(obj,cancel=null)
    {
        var url = this._livedocurl + "deepQueryDocument";
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
        {
            url += "?ip=4.4.4.4";
        }
        var result = await this.postAjax4Live(url, obj,cancel);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        } 
    },
    notifyUploaded(obj)
    {
        var url = this._livedocurl + "notifyUploaded";
        this.postAjax4Live(url, obj);
    },
    async CreateDocumentProviderCache(fileID,serviceProviderID)
    {
        var url = GetAPIUrl() + "Attachment/CreateDocumentProviderCache?fileID=" + fileID + "&serviceProviderID=" + serviceProviderID;
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }          
    },
    async TransferOrConvertFile(schoolID,filename,hash,token,ossname)
    {
        filename = encodeURIComponent(base64encode(utf16to8(filename)))
        var url = GetAPIUrl() + "FavoriteAttachment/TransferOrConvertFile?schoolID=" + schoolID + "&Title=" + filename + "&Hash=" + hash + "&Token=" + token + "&OssObjectName=" + ossname;
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    //copy源文件
    async CopyOssFile(name)
    {
        var url = GetAPIUrl() + "Attachment/SourceFileKey?objectKey=" + name;
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }         
    },
    async MergeSoundtrack(lessonid, recordid, meetingID)
    {
        var url = GetAPIUrl() + "Soundtrack/CheckAndMerge?lessonID=" + lessonid + "&recordingID=" + recordid + "&meetingID=" + meetingID;
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }         
    },
    async UpdateTitleAndVisibility(obj)
    {
        var url = GetAPIUrl() + "Soundtrack/UpdateTitleAndVisibility"
        var result = await　this.postAjax(url,obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    async kloudsyncUploadFileFavWithHash(spaceID, folder, filename, hash)
    {
        var uname = encodeURIComponent(base64encode(utf16to8(filename)));
        var url = url = GetAPIUrl() + "SpaceAttachment/UploadFileWithHash?spaceID=" + spaceID + "&folderID=" + folder + "&Title=" + uname + "&Description=&Hash=" + hash;
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }
    },
    async kloudsyncUploadTopicFileWithHash(topicId, folder, filename, hash)
    {
        var uname = encodeURIComponent(base64encode(utf16to8(filename)));
        var url = GetAPIUrl() + "TopicAttachment/UploadFileWithHash?topicID=" + topicId + "&folderID=" + folder + "&Title=" + uname + "&Description=&Hash=" + hash;
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }       
    },
    async GetSpaceTeamList(companyID)
    {
        var url = GetAPIUrl() + "TeamSpace/List?type=1&companyID=" + companyID;
        var result = await　this.getAjax(url);
        if (!result || result.RetData=="")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }         
    },
    async GetSyncRoomTeamList(companyID)
    {
        var url = GetAPIUrl() + "Topic/List?type=1&companyID=" + companyID;
        var result = await　this.getAjax(url);
        if (!result || result.RetData=="")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async GetSpaceList(companyID,teamID)
    {
        var url = GetAPIUrl() + "TeamSpace/List?type=2&companyID=" + companyID + "&parentID=" + teamID;
        var result = await　this.getAjax(url);
        if (!result || result.RetData=="")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }       
    },
    async GetSpaceAttachmentList(spaceID,pageIndex,pageSize,searchText="")
    {
        var url = GetAPIUrl() + "SpaceAttachment/List?spaceID=" + spaceID + "&type=0&pageIndex=" + pageIndex + "&pageSize=" + pageSize;
        if (searchText != "")
        {
            url += "&searchText=" + encodeURIComponent(base64encode(utf16to8(Trim(searchText))));
        }
        var result = await　this.getAjax(url);
        if (!result || result.RetData=="")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }         
    },
    async UploadFromSpace(lessonID,itemIDs)
    {
        var url = GetAPIUrl() + "EventAttachment/UploadFromSpace?lessonID=" + lessonID + "&itemIDs=" + itemIDs
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }         
    },
    async GetSyncPageActionsByTime(soundtrackID,time,pagenumber=0)
    {
        var url = GetAPIUrl() + "Soundtrack/PageActions?soundtrackID=" + soundtrackID + "&time=" + time+"&pageNumber="+pagenumber;
        var result = await　this.getAjax(url);
        if (!result || result.RetData=="")
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    async GetSyncTimeByPage(soundtrackID,pageNumber)
    {
        var url = GetAPIUrl() + "Soundtrack/PageActionStartTime?soundtrackID=" + soundtrackID + "&pageNumber=" + pageNumber;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getRecordLessonInfo(soundtrackID)
    {
        var url = GetAPIUrl() + "Soundtrack/RecordLessonAndAttachment?soundtrackID=" + soundtrackID;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }       
    },
    async getRecordLessonPageActions(soundtrackID,time) {
        var url = GetAPIUrl() + "Soundtrack/RecordLessonPageActions?soundtrackID=" + soundtrackID + "&time=" + time;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    async getRecordLessonPageActionStartTime(soundtrackID, attachmentID, pageNumber)
    {
        var url = GetAPIUrl() + "Soundtrack/RecordLessonPageActionStartTime?soundtrackID=" + soundtrackID + "&attachmentID=" + attachmentID + "&pageNumber=" + pageNumber;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }       
    },
    /***
     * direction 1 向前翻页 2 向后翻页
     */
    async getRecordLessonSwitchDocumentInfo(soundtrackID, attachmentID, time, direction)
    {
        var url = GetAPIUrl() + "Soundtrack/RecordLessonSwitchDocumentInfo?soundtrackID=" + soundtrackID + "&attachmentID=" + attachmentID + "&time=" + time + "&direction=" + direction;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    async InviteToSyncRoom(obj)
    {
        var url = GetAPIUrl() + "LessonMember/InviteToSyncRoom";
        var result = await　this.postAjax(url,obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }       
    },
    async getSyncRoomLessons() {
        var url = GetAPIUrl() + "Lesson/SyncRoomLessons";
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }         
    },
    async getLessonMember(lessonID)
    {
        var url = GetAPIUrl() + "LessonMember/List?lessonID=" + lessonID;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    async getTopicMember(topicid)
    {
        var url = GetAPIUrl() + "Topic/MemberList?TeamTopicID=" + topicid;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }         
    },
    async getSchoolContact(schoolId)
    {
        var url = GetAPIUrl() + "SchoolContact/List?schoolID=" + schoolId + "&roleType=0,1,2,3,4,5,6,7,8,9&pageIndex=-1";
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }         
    },
    async getSyncRoomList(companyID, teamID = 0, spaceID = 0)
    {
        var url = GetAPIUrl() + "SyncRoom/List?companyID=" + companyID + "&teamID=" + teamID + "&spaceID=" + spaceID;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }         
    },
    async AddSyncRoomLesson(obj)
    {
        var url = GetAPIUrl() + "SyncRoom/CreateSyncRoom";
        var result = await　this.postAjax(url,obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }         
    },
    async ShareToSyncRoom(obj)
    {
        var url = GetAPIUrl() + "TopicAttachment/ShareToSyncRoom";
        var result = await　this.postAjax(url,obj);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }         
    },
    async CreateMeetingFromSyncRoom(syncroomid)
    {
        var url = GetAPIUrl() + "CreateMeetingFromSyncRoom?syncRoomID=" + syncroomid;
        var result = await　this.postAjax(url,null);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }        
    },
    async getSyncRoomAttachmentList(topicID)
    {
        var url = GetAPIUrl() + "TopicAttachment/List?topicID=" + topicID;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }
    },
    async getCourseLectureAttachmentList(lectureID)
    {
        var url = GetAPIUrl() + "Lecture/Item?lectureID=" + lectureID;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result;
        }        
    },
    getSchoolContactAndMyFriends(schoolId){
        return new Promise((resolve, reject) => {
            this.getSchoolContact(schoolId).then((data) => {
                let schoolContacts = [];
                for (let item of data.RetData) {
                    let person = { id: parseInt(item.UserID), name: item.UserName, role: 3 };
                    schoolContacts.push(person);
                }
                friends.getFriends((result) => {
                    let friendsList = [];
                    for (let f of result) {
                        let fPerson = { id: parseInt(f.UserID), name: f.Name, role: 3 };
                        friendsList.push(fPerson)
                    }
                    let newContacts = schoolContacts.concat(friendsList);

                    let newJson = []; //盛放去重后数据的新数组
                    for (let item1 of newContacts) { 
                        let flag = true;  //建立标记，判断数据是否重复，true为不重复
                        for (let item2 of newJson) {  //循环新数组的内容
                            if (item1.id == item2.id) { //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                                flag = false;
                            }
                        }
                        if (flag) { //判断是否重复
                            newJson.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。
                        }
                    }
                    resolve(newJson);
                })
            })
        });
        
    },
    getLessonIDByItemIDEx(itemID)
    {
        // return new Promise((resolve, reject) => {
        //     var url = GetAPIUrl() + "Lesson/GetLessonIDByItemID";
        //     axios.get(url,{params:{itemID:itemID}).then(res =>
        //     {
        //         resolve(res.data.RetData);
        //     });
        // });
    },
    async getLessonIDByItemID(itemID)
    {
        var url = GetAPIUrl() + "Lesson/GetLessonIDByItemID?itemID=" + itemID;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getMyRongYunGroupList()
    {
        var url = GetAPIUrl() + "ChatGroup/SyncRoomGroups";
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async getCourseProperty(courseID)
    {
        var url = GetAPIUrl() + "Course/Item?courseID=" + courseID;
        var result = await　this.getAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    async removeLectureAttachment(itemID)
    {
        var url = GetAPIUrl() + "KWEventAttachment/RemoveAttachments?itemIDs=" + itemID;
        var result = await　this.delAjax(url);
        if (!result)
        {
            return null;
        }
        else
        {
            return result.RetData;
        }
    },
    getMeetingRoomUserCount(meetingid){
        var url = GetAPIUrlEx() + "member/onstage_student_count?meetingId=" + meetingid;
        var result = this.getAjaxSync(url);
        if(!result)
        {
            return "";
        }
        else
        {
            return result;
        }
    },
    getMeetingRoomJoinRole(meetingid){
        var url = GetAPIUrlEx() + "member/join_role?meetingId=" + meetingid;
        var result = this.getAjaxSync(url);
        if(!result)
        {
            return "";
        }
        else
        {
            return result;
        }        
    },
    async getMeetingAudienceList(meetingid)
    {
        var url = GetAPIUrlEx() + "member/audience_list?meetingId=" + meetingid;
        var result = await this.getAjax(url);
        if (result) return result.data;
        else return null;
    },
    async getLectureSyncState(ItemID){
        var url = GetAPIUrlEx() + "course_attachment/template_sync_status?itemId=" + ItemID;
        var result = await this.getAjax(url);
        if (!result) {
            return null;
        }
        else {
            return result.data;
        }
    },
    async preparationLectureSyncNow(lectureID, ItemID){
        var url = GetAPIUrlEx() + "course_attachment/sync_with_template?lectureId=" + lectureID + "&itemId=" + ItemID;
        var result = await this.postAjax(url,null);
        if (!result) {
            return null;
        }
        else {
            return result;
        }
    },
    async getCourseState(CourseID) {
        var url = GetAPIUrlEx() + "course/template_sync_status?courseId=" + CourseID;
        var result = await this.getAjax(url);
        if (!result) {
            return null;
        }
        else {
            return result.data;
        }
    },
    async syncCourseNow(CourseID) {
        var url = GetAPIUrlEx() + "course_attachment/sync_with_template?courseId=" + CourseID;
        var result = await this.postAjax(url, null);
        if (!result) {
            return null;
        }
        else {
            return result;
        }
    },

    async UploadFromSelectLectures(lessonID, courseId ,itemIDs) {
        if (!itemIDs){
            return;
        }
        let lectureIDs = itemIDs.join(",");
        var url = GetAPIUrl() + "Lesson/AddLecturesToLesson?lessonID=" + lessonID + "&courseID=" + courseId + "&lectureIDs=" + lectureIDs;
        var result = await 　this.postAjax(url, null);
        if (!result) {
            return null;
        }
        else {
            return result.RetData;
        }
    },
};
