'use strict';
function createEl(name)
{
    return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function GUID()
{
    var guid = "";
    for (var i = 1; i <= 32; i++)
    {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}
function gid(id) { return document.getElementById(id); }
function Trim(s) { if (s == null) return null; var m = s.match(/^\s*(\S+(\s+\S+)*)\s*$/); return (m == null) ? "" : m[1]; }
function getAngle(x1, y1, x2, y2)
{
    var x = Math.abs(x1 - x2);
    var y = Math.abs(y1 - y2);
    var z = Math.sqrt(x * x + y * y);
    var result = Math.round((Math.asin(y / z) / Math.PI * 180));
    if (x2 >= x1)
    {
        if (y2 >= y1) return result;
        else return -result;
    }
    else
    {
        if (y2 >= y1) return 180 - result;
        else return 180 + result;
    }
}
function FindItemInArr(arr, str)
{
  var j = arr.length;
  if (j == 0) return -1;
  for (var i = 0; i < j; i++)
  {
    if (arr[i] == str) return i;
  }
  return -1;
}
var __sto = setTimeout;
function setTimeoutEx(callback, timeout, param)
{
  var args = Array.prototype.slice.call(arguments, 2);
  var _cb = function () { callback.apply(null, args); }
  __sto(_cb, timeout);
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str)
{
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while (i < len)
    {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
function base64decode(str)
{
    if (str == null || typeof (str) == "undefined" || str == "") return "";

    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while (i < len)
    {
        /* c1 */
        do
        {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;

        /* c2 */
        do
        {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do
        {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do
        {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
function utf16to8(str)
{
    var out, i, len, c;

    out = "";
    len = str.length;
    for (i = 0; i < len; i++)
    {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F))
        {
            out += str.charAt(i);
        } else if (c > 0x07FF)
        {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else
        {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
function utf8to16(str)
{
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while (i < len)
    {
        c = str.charCodeAt(i++);
        switch (c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}
function JsMap()
{
    this.container = {};
    this.set = function (key, value)
    {
        try
        {
            if (key != null && key != "")
                this.container[key] = value;
            return true;
        } catch (e)
        {
            return false;
        }
    };
    this.get = function (key)
    {
        try
        {
            return this.container[key];
        } catch (e)
        {
            return null;
        }
    };
    this.containsKey = function (key)
    {
        try
        {
            for (var p in this.container)
            {
                if (p == key)
                    return true;
            }
            return false;

        } catch (e)
        {
            return false;
        }
    };
    this.containsValue = function (value)
    {
        try
        {
            for (var p in this.container)
            {
                if (this.container[p] === value)
                    return true;
            }
            return false;

        } catch (e)
        {
            return false;
        }
    };
    this.remove = function (key)
    {
        try
        {
            delete this.container[key];
            return true;
        } catch (e)
        {
            return false;
        }
    };
    this.clear = function ()
    {
        try
        {
            delete this.container;
            this.container = {};
            return true;

        } catch (e)
        {
            return false;
        }
    };
    this.isEmpty = function ()
    {
        if (this.keySet().length == 0)
            return true;
        else
            return false;
    };
    this.size = function ()
    {
        return this.keySet().length;
    };
    //返回map中的key值数组
    this.keySet = function ()
    {
        var keys = new Array();
        for (var p in this.container)
        {
            keys.push(p);
        }

        return keys;
    };
    this.values = function ()
    {
        var valuesArray = new Array();
        var keys = this.keySet();
        for (var i = 0; i < keys.length; i++)
        {
            valuesArray.push(this.container[keys[i]]);
        }
        return valuesArray;
    };
    //返回 map 中的 entrySet 对象
    this.entrySet = function ()
    {
        var array = new Array();
        var keys = this.keySet();
        for (var i = 0; i < keys.length; i++)
        {
            array.push(keys[i], this.container[keys[i]]);
        }
        return array;
    };

    //返回 map 中的 value值的和(当值是 Nunmber 类型时有效)
    this.sumValues = function ()
    {
        var values = this.values();
        var result = 0;
        for (var i = 0; i < values.length; i++)
        {
            result += Number(values[i]);
        }
        return result;
    };
}
function HistoryHelper() {
    this.HistoryGroup = new JsMap();
    this.PointGroup = new JsMap();
    //this.RedoHistoryGroup = new JsMap();
    this.RedoPointGroup = new JsMap();
    this.RedoHistoryGroup = new JsMap();

    this.Clear = function(id) {
        this.HistoryGroup.remove(id);
        this.PointGroup.remove(id);
        //this.RedoHistoryGroup.remove(id);
        this.RedoPointGroup.remove(id);
    };
    this.ClearRedo = function(id) {
        this.RedoPointGroup.remove(id);
    };

    this.AddHistory = function(id, arr) {
        var old = this.HistoryGroup.get(id);
        if (old == null) {
            var newarr = new Array();
            newarr.push(arr);
            this.HistoryGroup.set(id, newarr);
        } else {
            old.push(arr);
            this.HistoryGroup.set(id, old);
        }
    };
    this.Undo = function(id) {
        var old = this.HistoryGroup.get(id);
        if (old == null) {
            return null;
        } else {
            var last = old.pop();
            this.HistoryGroup.set(id, old);
            return last;
        }
    };
    this.AddPoints = function(id, arr) {
        var old = this.PointGroup.get(id);
        if (old == null) {
            var newarr = new Array();
            newarr.push(arr);
            this.PointGroup.set(id, newarr);
        } else {
            old.push(arr);
            this.PointGroup.set(id, old);
        }
    };
    this.UndoPoints = function(id) {
        var old = this.PointGroup.get(id);
        if (old == null) {
            return null;
        } else {
            var last = old.pop();
            this.PointGroup.set(id, old);
            return last;
        }
    };
    this.AddRedoPoints = function(id, arr) {
        var old = this.RedoPointGroup.get(id);
        if (old == null) {
            var newarr = new Array();
            newarr.push(arr);
            this.RedoPointGroup.set(id, newarr);
        } else {
            old.push(arr);
            this.RedoPointGroup.set(id, old);
        }
    };
    this.RedoPoints = function(id) {
        var old = this.RedoPointGroup.get(id);
        if (old == null) {
            return null;
        } else {
            var last = old.pop();
            this.RedoPointGroup.set(id, old);
            return last;
        }
    };
    this.AddRedoHistory = function(id, arr) {
        var old = this.RedoHistoryGroup.get(id);
        if (old == null) {
            var newarr = new Array();
            newarr.push(arr);
            this.RedoHistoryGroup.set(id, newarr);
        } else {
            old.push(arr);
            this.RedoHistoryGroup.set(id, old);
        }
    };
    this.RedoHistory = function(id) {
        var old = this.RedoHistoryGroup.get(id);
        if (old == null) {
            return null;
        } else {
            var last = old.pop();
            this.RedoHistoryGroup.set(id, old);
            return last;
        }
    };
}

//player start-------------------------------------------------------------------------------------------------------------------------------------------
function PlayBase(name, data)
{
    this.name = name;
    this.data = data;
    this.target = null;//svg
    this.container = null;
    this.main = null;
    this.pagenumber = 0;
    this.canEdit = true;

    this.EVENTSTART = "mousedown";
    this.EVENTMOVE = "mousemove";
    this.EVENTEND = "mouseup";
    this.EVENTCLICK = "click";
    this.ImagePath = "/static/images/";
    this.deviceType = 0;

    this.SetParamter = function (target, container, main, pagenumber,deviceType)
    {
        this.target = target;
        this.container = container;
        this.main = main;
        this.pagenumber = pagenumber;
        this.deviceType = deviceType;

        if (this.deviceType != 0) {
            this.EVENTSTART = "touchstart";
            this.EVENTMOVE = "touchmove";
            this.EVENTEND = "touchend";
            this.EVENTCLICK = "click";
            this.EVENTRESIZE = "ontouchstart";
            this.ImagePath = "img/";
        }
    }
    this.SetCanEdit = function (canedit)
    {
        this.canEdit = canedit;
    }

    this.Play = function ()
    {
        console.log(this.name + ":Play not done");
    }
    this.getContainerWidth = function ()
    {
        return this.container.width();
    };
    this.getContainerHeight = function ()
    {
        return this.container.height();
    }
    this.getViewHeight = function ()
    {
        return this.main.height();
    }
    this.getViewWidth = function ()
    {
        return this.main.width();
    }
    this.GetFixedPageNumber = function (pageid)
    {
        return (pageid + "").replace(".", "\\.");
    }
    this.FixPoz = function (s, o, c)
    {
        var newv = parseFloat((s * c / o).toFixed(1));
        if (isNaN(newv))
        {
            return s;
        }
        else
        {
            return newv;
        }
        
    }
    this.FixLinePoz = function (d, owidth, oheight, cwidth, cheight)
    {
        var arr = d.split(" ");//M44,244 L46,244 L48,243 L52,240 L57,237 L62,234
        var index = -1;
        var x = 0;
        var y = 0;
        var result = "";
        for (var i = 0, j = arr.length; i < j; i++)
        {
            if (Trim(arr[i]) == "")
            {
                continue;
            }
            index = arr[i].indexOf(",");
            x = parseInt(arr[i].substr(1, index));
            y = parseInt(arr[i].substring(index + 1));
            if (isNaN(x) || isNaN(y))
            {
                console.error("x:"+x+",y:"+y);
                result += arr[i][0] + arr[i].substr(1, index) + "," + arr[i].substring(index + 1);
            }
            else
            {
                result += arr[i][0] + this.FixPoz(x, owidth, cwidth) + "," + this.FixPoz(y, owidth, cwidth);
            }
            if (i < j - 1)
            {
                result += " ";
            }
        }
        return result;
    }
    this.FixArrayPoz = function (d, owidth, oheight, cwidth, cheight,isnew=true)
    {
        var result = "";//M567,137 L567,137
        for (var i = 0, j = d.length; i < j; i++)
        {
            if (i == 0 && isnew)
            {
                result += "M" + this.FixPoz(d[i][0], owidth, cwidth) + "," + this.FixPoz(d[i][1], owidth, cwidth);
            }
            else
            {
                result += " L" + this.FixPoz(d[i][0], owidth, cwidth) + "," + this.FixPoz(d[i][1], owidth, cwidth);
            }
            // if (j == 1 && isnew)
            // {
            //     result += " L" + this.FixPoz(d[i][0], owidth, cwidth) + "," + this.FixPoz(d[i][1], owidth, cwidth);
            // }
        }
        return result;
    }
    this.FixLinePozEx = function (d, owidth, oheight, cwidth, cheight)
    {
        //M 843.000,106.000 C 839.000,107.500 838.992,107.479 835.000,109.000
        var re = /\d+\.?\d*/ig;
        var arr;
        var i = 0;
        var lastIndex = 0;
        var result = "";
        while ((arr = re.exec(d)) != null)
        {
            //loger.log(arr.index + "-" + arr.lastIndex + "\t" + arr + "         ");
            var oldv = parseFloat(arr[0]);
            var newv = 0;
            if (i == 0 || i % 2 == 0)
            {
                newv = this.FixPoz(oldv, owidth, cwidth);
            }
            else
            {
                newv = this.FixPoz(oldv, owidth, cwidth);
            }
            if (i == 0)
            {
                result += d.substr(0, arr.index) + newv;
            }
            else
            {
                result += d.substring(lastIndex, arr.index) + newv;
            }
            lastIndex = arr.index + arr[0].length;
            i++;
        }
        if (i >= 1)
        {
            result += d.substr(lastIndex);
        }
        return result;
    }
    this.GetNumberRange = function (d, min, max)
    {
        return Math.min(Math.max(d, min), max);
    }
    this.Append = function (ele, tar)
    {
        this.target = tar || this.target;
        if (this.target[0].firstChild)
        {
            var paths = this.target.find(">path");
            if (paths.length == 0)
            {
                this.target[0].insertBefore(ele, this.target[0].firstChild);
            }
            else
            {
                paths.last().after($(ele));
            }
        }
        else
        {
            this.target[0].appendChild(ele);
        }
    }
    this.CreateEle = function (name, options)
    {
        var result = createEl(name);
        if (options)
        {
            for (var key in options)
            {
                result.setAttribute(key, options[key]);
            }
        }
        return result;
    }
    this.ShowArrow = function (fRect)
    {
        var g = $("#g_" + fRect.attr("id"));
        var line = g.find(">line");
        var to = g.find(">rect");
        var arrow = $(g).find("path");

        var fromx = parseInt(fRect.attr("x"));
        var fromy = parseInt(fRect.attr("y"));
        var fromwidth = parseInt(fRect.attr("width"));
        var fromheight = parseInt(fRect.attr("height"));
        var tox = parseInt(to.attr("x"));
        var toy = parseInt(to.attr("y"));
        var towidth = parseInt(to.attr("width"));
        var toheight = parseInt(to.attr("height"));
        var linefromx, linefromy, linetox, linetoy;
        if (fromy > toy + toheight)//上
        {
            linefromx = fromx + fromwidth / 2;
            linefromy = fromy;
            linetox = tox + towidth / 2;
            linetoy = toy + toheight;
        }
        else if (toy > fromy + fromheight)//下
        {
            linefromx = fromx + fromwidth / 2;
            linefromy = fromy + fromheight;
            linetox = tox + towidth / 2;
            linetoy = toy;
        }
        else//中
        {
            if (tox + towidth / 2 > fromx + fromwidth / 2)//右
            {
                if (fromx > tox)
                {
                    linefromx = fromx;
                    linefromy = fromy + fromheight / 2;
                    linetox = tox;
                    linetoy = toy + toheight / 2;
                }
                else
                {
                    linefromx = fromx + fromwidth;
                    linefromy = fromy + fromheight / 2;
                    linetox = tox;
                    linetoy = toy + toheight / 2;
                }
            }
            else//左
            {
                if (fromx > tox + towidth)
                {
                    linefromx = fromx;
                    linefromy = fromy + fromheight / 2;
                    linetox = tox + towidth;
                    linetoy = toy + toheight / 2;
                }
                else
                {
                    linefromx = fromx + fromwidth;
                    linefromy = fromy + fromheight / 2;
                    linetox = tox + towidth;
                    linetoy = toy + toheight / 2;
                }
            }
        }
        line.attr("x1", linefromx);
        line.attr("y1", linefromy);
        line.attr("x2", linetox);
        line.attr("y2", linetoy);

        arrow.attr('d', String.format("M{0} {1} L{2} {3} L{4} {5} Z",
            linetox, linetoy, linetox + 10, linetoy + 5, linetox + 10, linetoy - 5));
        arrow.attr('transform', String.format("rotate({0},{1},{2})",
            getAngle(linetox, linetoy, linefromx, linefromy), linetox, linetoy));
        arrow.css("z-index", "103");
    }
    this.SplitText = function (txt, width)
    {
        var len = (width / 8) | 0;
        var result = new Array();
        var str = txt;
        var temp = "";
        var splitline = function (strText)
        {
            var lines = new Array();
            while (strText.indexOf("\r\n") > -1 || strText.indexOf("\n") > -1)
            {
                if (strText.indexOf("\r\n") > -1)
                {
                    lines.push(strText.substring(0, strText.indexOf("\r\n") + 1));
                    strText = strText.substr(strText.indexOf("\r\n") + 1);
                }
                else if (strText.indexOf("\n") > -1)
                {
                    lines.push(strText.substring(0, strText.indexOf("\n") + 1));
                    strText = strText.substr(strText.indexOf("\n") + 1);
                }
            }
            if (strText != "")
            {
                lines.push(strText);
            }
            return lines;
        };
        var splitlong = function (strText)
        {
            var lines = new Array();
            while (strText.length > len)
            {
                temp = strText.substring(0, len);
                lines.push(temp);
                strText = strText.substr(len);
            }
            if (strText != "")
            {
                lines.push(strText);
            }
            return lines;
        };

        var arr = splitline(str);
        return arr;
    }
    this.SplitTextEx = function (txt, width,fontsize,font)
    {
        //console.log("SplitTextEx",width,fontsize);
        var result = new Array();
        if (!txt || txt == "") return result;
        var container = $("#divforwhiteboardgetlines");
        var lineheight = Math.round(fontsize * 1.2);
        //console.log(fontsize,lineheight);
        if (container.length == 0)
        {
            var html = `<div id='divforwhiteboardgetlines' style="width:${width}px;font-family:${font};word-wrap:break-word;word-break:break-all;padding:0px;margin:0px;line-height:${lineheight}px;font-size:${fontsize}px;position:absolute;top:-550px;left:-550px;"></div>`;
            $(document.body).append(html);
            container = $("#divforwhiteboardgetlines");
        }
        else
        {
            container.css({"width":width+"px","font-size":fontsize+"px","line-height":lineheight+"px","font-family":font});

        }
        var splitline = function (strText)
        {
            var lines = new Array();
            while (strText.indexOf("\r\n") > -1 || strText.indexOf("\n") > -1)
            {
                if (strText.indexOf("\r\n") > -1)
                {
                    lines.push(strText.substring(0, strText.indexOf("\r\n") + 1));
                    strText = strText.substr(strText.indexOf("\r\n") + 1);
                }
                else if (strText.indexOf("\n") > -1)
                {
                    lines.push(strText.substring(0, strText.indexOf("\n") + 1));
                    strText = strText.substr(strText.indexOf("\n") + 1);
                }
            }
            if (strText != "")
            {
                lines.push(strText);
            }
            return lines;
        };
        var splitbywidth = function (strText)
        {
            container.html("");
            var temp = "";
            var pre = "";
            var lines = new Array();
            while(strText.length>0)
            {
                temp += strText[0];
                container.html(temp);
                if(container.height()>=lineheight*2)
                {
                    temp = "";
                    lines.push(pre);
                    pre = "";
                }
                else
                {
                    strText = strText.substr(1);
                    pre = temp;
                }
            }
            if(temp!="")
            {
                lines.push(temp);
            }
            return lines;
        };
        var arr = splitline(txt);
        for (var i = 0; i < arr.length; i++)
        {
            var t = splitbywidth(arr[i]);
            for (var j = 0; j < t.length; j++)
            {
                result.push(t[j]);
            }
        }
        return result;

    }
}
function PlayPen(data)
{
    PlayBase.call(this, "PlayPen", data);
    var a = data;

    this.Play = function ()
    {
        //console.log(this.name + ":Play done=>" + JSON.stringify(data));

        if (gid(a.id))
        {
            if (a.d.indexOf("C") > -1)
            {
                gid(a.id).setAttribute('d', this.FixLinePozEx(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));
            }
            else
            {
                gid(a.id).setAttribute('d', this.FixLinePoz(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));
            }
        }
        else
        {
            var path = createEl("path");
            path.setAttribute('tp', 'line');
            path.setAttribute('isdraw', 'true');
            path.setAttribute('id', a.id);
            if (a.w)
            {
                path.setAttribute('stroke-width', this.GetNumberRange(this.FixPoz(a.w, a.CW, this.getContainerWidth()),0.5,50));
            }
            else
            {
                path.setAttribute('stroke-width', 1);
            }
            if (a.d.indexOf("C") > -1)
            {
                path.setAttribute('d', this.FixLinePozEx(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));
            }
            else
            {
                path.setAttribute('d', this.FixLinePoz(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));
            }

            if (a.color)
            {
                path.setAttribute('stroke', a.color);
            }
            else
            {
                path.setAttribute('stroke', "red");
            }
            if (a.op)
            {
                path.setAttribute("stroke-opacity", a.op);
            }
            path.setAttribute('style', "fill:white;fill-opacity:0;stroke-linecap:round;");

            if (!a.tar || a.tar == "" || a.tar == "main" || a.tar == "body" || a.tar == "app")
            {
                if (this.target)
                {
                    this.Append(path);
                }
            }
            else
            {
                if ($("#" + a.tar).find(">svg")[0])
                {
                    //$("#" + a.tar).find(">svg")[0].appendChild(path);
                    //console.log("target:"+$("#" + a.tar).find(">svg").length);
                    this.Append(path, $("#" + a.tar).find(">svg"))
                }
            }
        }
    }
}
Object.setPrototypeOf(PlayPen.prototype, PlayBase.prototype)

function PlayPenEx(data)
{
    PlayBase.call(this, "PlayPen", data);
    var a = data;

    this.Play = function ()
    {
        //console.log(this.name + ":Play done=>" + JSON.stringify(data));

        if (gid(a.id))
        {
            gid(a.id).setAttribute('d', gid(a.id).getAttributeNode("d").nodeValue+this.FixArrayPoz(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight(),false));
        }
        else
        {
            var path = createEl("path");
            path.setAttribute('tp', 'line');
            path.setAttribute('isdraw', 'true');
            path.setAttribute('id', a.id);
            if (a.w)
            {
                path.setAttribute('stroke-width', this.FixPoz(a.w, a.CW, this.getContainerWidth()));
            }
            else
            {
                path.setAttribute('stroke-width', 1);
            }
            path.setAttribute('d', this.FixArrayPoz(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));

            if (a.color)
            {
                path.setAttribute('stroke', a.color);
            }
            else
            {
                path.setAttribute('stroke', "red");
            }
            if (a.op)
            {
                path.setAttribute("stroke-opacity", a.op);
            }
            path.setAttribute('style', "fill:white;fill-opacity:0;stroke-linecap:round;");

            if (!a.tar || a.tar == "" || a.tar == "main" || a.tar == "body" || a.tar == "app")
            {
                if (this.target)
                {
                    this.Append(path);
                }
            }
            else
            {
                if ($("#" + a.tar).find(">svg")[0])
                {
                    //$("#" + a.tar).find(">svg")[0].appendChild(path);
                    //console.log("target:"+$("#" + a.tar).find(">svg").length);
                    this.Append(path, $("#" + a.tar).find(">svg"))
                }
            }
        }
    }
}
Object.setPrototypeOf(PlayPenEx.prototype, PlayBase.prototype)

function PlayLine(data)
{
    PlayBase.call(this, "PlayLine", data);
    var a = data;
    this.Play = function ()
    {
        //console.log(this.name + ":Play done");

        if (gid(a.id))
        {
            if (a.d.indexOf("C") > -1)
            {
                gid(a.id).setAttribute('d', this.FixLinePozEx(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));
            }
            else
            {
                gid(a.id).setAttribute('d', this.FixLinePoz(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));
            }
        }
        else
        {
            var path = this.CreateEle("path", { "tp": 'line', "isdraw": "true", "id": a.id });
            if (a.w)
            {
	       path.setAttribute('stroke-width', this.GetNumberRange(this.FixPoz(a.w, a.CW, this.getContainerWidth()),0.5,50));
            }
            else
            {
                path.setAttribute('stroke-width', 1);
            }
            if (a.d.indexOf("C") > -1)
            {
                path.setAttribute('d', this.FixLinePozEx(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));
            }
            else
            {
                path.setAttribute('d', this.FixLinePoz(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));
            }

            if (a.color)
            {
                path.setAttribute('stroke', a.color);
            }
            else
            {
                path.setAttribute('stroke', "red");
            }
            if (a.op)
            {
                path.setAttribute("stroke-opacity", a.op);
            }
            path.setAttribute('style', "fill:white;fill-opacity:0;stroke-linecap:round;");
            if (!a.tar || a.tar == "" || a.tar == "main" || a.tar == "body" || a.tar == "app")
            {
                if (this.target)
                {
                    this.Append(path);
                }
            }
            else
            {
                if ($("#" + a.tar).find(">svg")[0])
                {
                    this.Append(path, $("#" + a.tar).find(">svg")[0])
                }
            }
        }
    }
}
Object.setPrototypeOf(PlayLine.prototype, PlayBase.prototype)

function PlayBrush(data)
{
    PlayBase.call(this, "PlayBrush", data);
    this.Play = function ()
    {
        //console.log(this.name + ":Play done");
        var a = data;
        if (gid(a.id))
        {
            gid(a.id).setAttribute('d', this.FixLinePoz(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));
        }
        else
        {
            var path = this.CreateEle("path", { "tp": 'brush', "isdraw": "true", "id": a.id });
            path.setAttribute('d', this.FixLinePoz(a.d, a.CW, a.CH, this.getContainerWidth(), this.getContainerHeight()));
            path.setAttribute('style', "fill-opacity:0;stroke-opacity:0.5;stroke-linecap:round;");//stroke-dasharray:0,50;
            if (a.w)
            {
                path.setAttribute('stroke-width', this.GetNumberRange(this.FixPoz(a.w, a.CW, this.getContainerWidth()),1,200));
            }
            else
            {
                path.setAttribute('stroke-width', 30);
            }
            if (a.color)
            {
                path.setAttribute('stroke', a.color);
            }
            else
            {
                path.setAttribute('stroke', "yellow");
            }
            this.Append(path);
        }
    }
}
Object.setPrototypeOf(PlayBrush.prototype, PlayBase.prototype)

function PlayText(data)
{
    PlayBase.call(this, "PlayText", data);
    var a = data;
    var _onEdit = null;
    function getDiffSize(fsize, family)
    {
        //var dsize = fsize >= 20 ? 2 : 2;
        if(family=="sans-serif")
        {
            return fsize >= 26 ? -2 : -1;
        }
        var result = 2;
        if (fsize >= 20)
        {
            switch (family)
            {
                case "consolas":
                    result = 2;
                    break;
                case "monospace":
                    result = 4;
                    break;
                case "sans-serif":
                    result = -2;
                    break;
                case "serif":
                    result = 4;
                    break;
                case "cursive":
                    result = 4;
                    break;
            }
        }
        else
        {
            switch (family)
            {
                case "consolas":
                    result = 1;
                    break;
                case "monospace":
                    result = 2;
                    break;
                case "sans-serif":
                    result = 0;
                    break;
                case "serif":
                    result = 2;
                    break;
                case "cursive":
                    result = 2;
                    break;
            }
        }
        return result;
    }

    this.SetOnEdit = function (callback)
    {
        _onEdit = callback;
    }
    this.Play = function ()
    {
        //console.log(this.name + ":Play done:"+JSON.stringify(a));
        var drawg = () =>
        {
            var g = this.CreateEle("g", { "id": "g_" + a.id, "isdraw": "true" });
            this.Append(g);
            var rectx = this.FixPoz(a.x, a.CW, this.getContainerWidth());
            var recty = this.FixPoz(a.y, a.CW, this.getContainerWidth());
            var fsize = a.Rect && a.Rect.size ? this.FixPoz(a.Rect.size, a.CW, this.getContainerWidth()) : 14;
            var font = a.Rect&&a.Rect.font ? a.Rect.font : "consolas";
            var text = this.CreateEle("text", { "x": rectx + 1, "y": recty + 1, "style": "fill:"+(a.Rect && a.Rect.color?a.Rect.color:"red")+";font-size:"+fsize+"px;font-family:"+font+";" });
            text.innerHTML = "";
            g.appendChild(text);
            if (a.Rect.text != "")
            {
                gid(a.id).setAttribute('style', "fill:blue;stroke:blue;stroke-width:0;fill-opacity:0;");
            }
            var lines = this.SplitTextEx(utf8to16(base64decode(a.Rect.text)), this.FixPoz(a.width, a.CW, this.getContainerWidth()), fsize,font);
            var dsize = getDiffSize(fsize,font);

            var lineheight = Math.round(fsize * 1.2);
            for (var i = 0; i < lines.length; i++)
            {
                var span = this.CreateEle("tspan", { "x": rectx -0.5, "y": recty + fsize-dsize + lineheight * i });
                span.innerHTML = lines[i];
                text.append(span);
            }

        };
        if (gid(a.id))
        {
            var path = gid(a.id);
            path.setAttribute('style', "fill:blue;stroke:blue;stroke-width:1;fill-opacity:0.1;");
            path.setAttribute('x', this.FixPoz(a.x, a.CW, this.getContainerWidth()));
            path.setAttribute('y', this.FixPoz(a.y, a.CW, this.getContainerWidth()));
            path.setAttribute('width', this.FixPoz(a.width, a.CW, this.getContainerWidth()));
            path.setAttribute('height', this.FixPoz(a.height, a.CW, this.getContainerWidth()));
            if (a.Rect)
            {
                if (!gid("g_" + a.id))
                {
                    drawg();
                    return;
                }
                var rectx = this.FixPoz(a.x, a.CW, this.getContainerWidth());
                var recty = this.FixPoz(a.y, a.CW, this.getContainerWidth());
                var text = $("#g_" + a.id).find(">text")[0];
                if (a.Rect && a.Rect.color)
                {
                    $(text).css("fill",a.Rect.color);
                }
                if (a.Rect && a.Rect.font)
                {
                    $(text).css("font-family",a.Rect.font);
                }
                text.setAttribute('x', rectx + 1);
                text.setAttribute('y', recty + 1);
                text.innerHTML = "";
                if (a.Rect.text != "")
                {
                    gid(a.id).setAttribute('style', "fill:blue;stroke:blue;stroke-width:0;fill-opacity:0;");
                }
                var fsize = a.Rect && a.Rect.size ? this.FixPoz(a.Rect.size, a.CW, this.getContainerWidth()) : 14;
                var font = a.Rect&&a.Rect.font ? a.Rect.font : "consolas";
                var dsize = getDiffSize(fsize,font);
                var lineheight = Math.round(fsize * 1.2);
                var lines = this.SplitTextEx(utf8to16(base64decode(a.Rect.text)), this.FixPoz(a.width, a.CW, this.getContainerWidth()), fsize, font);
                $(text).css("font-size",fsize+"px");
                for (var i = 0; i < lines.length; i++)
                {
                    var span = this.CreateEle("tspan", { "x": rectx -0.5, "y": recty + fsize-dsize + lineheight * i});
                    span.innerHTML = lines[i];
                    text.append(span);
                }
            }
        }
        else
        {
            var path = this.CreateEle("rect", { "id": a.id, "isdraw": "true", "tp": "text", "style": "fill:blue;stroke:blue;stroke-width:1;fill-opacity:0.1;" });
            path.setAttribute('x', this.FixPoz(a.x, a.CW, this.getContainerWidth()));
            path.setAttribute('y', this.FixPoz(a.y, a.CW, this.getContainerWidth()));
            path.setAttribute('width', this.FixPoz(a.width, a.CW, this.getContainerWidth()));
            path.setAttribute('height', this.FixPoz(a.height, a.CW, this.getContainerWidth()));
            this.Append(path);
            if (a.Rect)
            {
                drawg();
            }
            var g = $("#" + a.id);
            $("#" + a.id + ",#g_" + a.id).bind(this.EVENTCLICK, (e) =>
            {
                //EidtText(g, false);
                if (_onEdit) _onEdit(g, false);
            });
        }

    }
}
Object.setPrototypeOf(PlayText.prototype, PlayBase.prototype)

function PlayNote(data)
{
    PlayBase.call(this, "PlayNote", data);
    var a = data;
    var _onEdit = null;
    function getDiffSize(fsize, family)
    {
        //var dsize = fsize >= 20 ? 2 : 2;
        if(family=="sans-serif")
        {
            return fsize >= 26 ? -2 : -1;
        }
        var result = 2;
        if (fsize >= 20)
        {
            switch (family)
            {
                case "consolas":
                    result = 2;
                    break;
                case "monospace":
                    result = 4;
                    break;
                case "sans-serif":
                    result = -2;
                    break;
                case "serif":
                    result = 4;
                    break;
                case "cursive":
                    result = 4;
                    break;
            }
        }
        else
        {
            switch (family)
            {
                case "consolas":
                    result = 1;
                    break;
                case "monospace":
                    result = 2;
                    break;
                case "sans-serif":
                    result = 0;
                    break;
                case "serif":
                    result = 2;
                    break;
                case "cursive":
                    result = 2;
                    break;
            }
        }
        return result;
    }
    this.SetOnEdit = function (callback)
    {
        _onEdit = callback;
    }

    var _onRecord = null;
    this.SetOnRecord = function (callback)
    {
        _onRecord = callback;
    }
    this.Play = function ()
    {
        //console.log(this.name + ":Play done");
        var drawg = () =>
        {
            var g = this.CreateEle("g", { "id": "g_" + a.id, "isdraw": "true","tp":"note" });
            this.Append(g)
            var rectx = this.FixPoz(a.Rect.x, a.CW, this.getContainerWidth());
            var recty = this.FixPoz(a.Rect.y, a.CW, this.getContainerWidth());
            var fsize = a.Rect && a.Rect.size ? this.FixPoz(a.Rect.size, a.CW, this.getContainerWidth()) : 14;
            var font = a.Rect&&a.Rect.font ? a.Rect.font : "consolas";
            var rect = this.CreateEle("rect", { "style": "fill:white;stroke:blue;stroke-width:1;fill-opacity:0.3;", "x": rectx, "y": recty });
            rect.setAttribute('width', this.FixPoz(a.Rect.width, a.CW, this.getContainerWidth()));
            rect.setAttribute('height', this.FixPoz(a.Rect.height, a.CW, this.getContainerWidth()));
            g.appendChild(rect);

            var text = this.CreateEle("text", { "x": rectx + 5, "y": recty + 15, "style": "fill:"+(a.Rect && a.Rect.color?a.Rect.color:"black")+";font-size:"+fsize+"px;font-family:"+font+";" });
            text.innerHTML = "";
            g.appendChild(text);
            var lines = this.SplitTextEx(utf8to16(base64decode(a.Rect.text)), this.FixPoz(a.Rect.width, a.CW, this.getContainerWidth()), fsize,font);
            var dsize = getDiffSize(fsize,font);

            var lineheight = Math.round(fsize * 1.2);
            for (var i = 0; i < lines.length; i++)
            {
                var span = this.CreateEle("tspan", { "x": rectx -0.5, "y": recty + fsize-dsize + lineheight * i });
                span.innerHTML = lines[i];
                text.append(span);
            }

            var line = this.CreateEle("line", { "style": "stroke-width:1; stroke:blue;" });
            line.setAttribute('x1', this.FixPoz(a.Rect.x1, a.CW, this.getContainerWidth()));
            line.setAttribute('y1', this.FixPoz(a.Rect.y1, a.CW, this.getContainerWidth()));
            line.setAttribute('x2', this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()));
            line.setAttribute('y2', this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth()));
            g.appendChild(line);

            var toArrow = this.CreateEle("path");
            toArrow.setAttribute('d', String.format("M{0} {1} L{2} {3} L{4} {5} Z",
                this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()) + 10, this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth()) + 5, this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()) + 10, this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth()) - 5));
            toArrow.setAttribute('transform', String.format("rotate({0},{1},{2})",
                getAngle(this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.x1, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.y1, a.CW, this.getContainerWidth())), this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth())));
            toArrow.setAttribute("style", "fill:blue;stroke:blue;stroke-width:1");
            g.appendChild(toArrow);
            if (a.Rect.show == true)
            {
                $(g).show();
            }
            else
            {
                $(g).hide();
            }

        };
        if (gid(a.id))
        {
            var path = gid(a.id);
            path.setAttribute('x', this.FixPoz(a.x, a.CW, this.getContainerWidth()));
            path.setAttribute('y', this.FixPoz(a.y, a.CW, this.getContainerWidth()));
            path.setAttribute('width', this.FixPoz(a.width, a.CW, this.getContainerWidth()));
            path.setAttribute('height', this.FixPoz(a.height, a.CW, this.getContainerWidth()));
            if (a.Rect)
            {
                if (!gid("g_" + a.id))
                {
                    drawg();
                    return;
                }
                var rect = $("#g_" + a.id).find(">rect")[0];
                var rectx = this.FixPoz(a.Rect.x, a.CW, this.getContainerWidth());
                var recty = this.FixPoz(a.Rect.y, a.CW, this.getContainerWidth());
                rect.setAttribute('x', rectx);
                rect.setAttribute('y', recty);
                rect.setAttribute('width', this.FixPoz(a.Rect.width, a.CW, this.getContainerWidth()));
                rect.setAttribute('height', this.FixPoz(a.Rect.height, a.CW, this.getContainerWidth()));

                var text = $("#g_" + a.id).find(">text")[0];
                if (a.Rect && a.Rect.color)
                {
                    $(text).css("fill",a.Rect.color);
                }
                if (a.Rect && a.Rect.font)
                {
                    $(text).css("font-family",a.Rect.font);
                }

                text.setAttribute('x', rectx + 5);
                text.setAttribute('y', recty + 15);
                text.innerHTML = "";
                var fsize = a.Rect && a.Rect.size ? this.FixPoz(a.Rect.size, a.CW, this.getContainerWidth()) : 14;
                var font = a.Rect&&a.Rect.font ? a.Rect.font : "consolas";
                var dsize = getDiffSize(fsize,font);
                var lineheight = Math.round(fsize * 1.2);
                var lines = this.SplitTextEx(utf8to16(base64decode(a.Rect.text)), this.FixPoz(a.Rect.width, a.CW, this.getContainerWidth()), fsize, font);
                $(text).css("font-size",fsize+"px");
                //var lines = this.SplitText(utf8to16(base64decode(a.Rect.text)), this.FixPoz(a.Rect.width, a.CW, this.getContainerWidth()));
                for (var i = 0; i < lines.length; i++)
                {
                    var span = this.CreateEle("tspan", { "x": rectx -0.5, "y": recty + fsize-dsize + lineheight * i});
                    span.innerHTML = lines[i];
                    text.appendChild(span);
                }

                var line = $("#g_" + a.id).find(">line")[0];
                line.setAttribute('x1', this.FixPoz(a.Rect.x1, a.CW, this.getContainerWidth()));
                line.setAttribute('y1', this.FixPoz(a.Rect.y1, a.CW, this.getContainerWidth()));
                line.setAttribute('x2', this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()));
                line.setAttribute('y2', this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth()));
                line.setAttribute('style', "stroke-width:1; stroke:blue;");

                var toArrow = $("#g_" + a.id).find(">path")[0];
                toArrow.setAttribute('d', String.format("M{0} {1} L{2} {3} L{4} {5} Z",
                    this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()) + 10, this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth()) + 5, this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()) + 10, this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth()) - 5));
                toArrow.setAttribute('transform', String.format("rotate({0},{1},{2})",
                    getAngle(this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.x1, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.y1, a.CW, this.getContainerWidth())), this.FixPoz(a.Rect.x2, a.CW, this.getContainerWidth()), this.FixPoz(a.Rect.y2, a.CW, this.getContainerWidth())));
                toArrow.setAttribute("style", "fill:blue;stroke:blue;stroke-width:1");

                if (a.Rect.show == true)
                {
                    $("#g_" + a.id).show();
                }
                else
                {
                    $("#g_" + a.id).hide();
                }
            }
        }
        else
        {
            var path = this.CreateEle("rect", { "id": a.id, "isdraw": "true", "tp":"note","style": "fill:blue;stroke:blue;stroke-width:1;fill-opacity:0.1;" });
            path.setAttribute('x', this.FixPoz(a.x, a.CW, this.getContainerWidth()));
            path.setAttribute('y', this.FixPoz(a.y, a.CW, this.getContainerWidth()));
            path.setAttribute('width', this.FixPoz(a.width, a.CW, this.getContainerWidth()));
            path.setAttribute('height', this.FixPoz(a.height, a.CW, this.getContainerWidth()));
            this.Append(path);
            if (a.Rect)
            {
                drawg();
            }
            $("#" + a.id).bind(this.EVENTCLICK, (e) =>
            {
                $("#g_" + a.id).toggle();
                //Record_rectangle(gid(a.id));
                if (_onRecord) _onRecord(gid(a.id));
            });
            $("#g_" + a.id).bind(this.EVENTCLICK, (e) =>
            {
                //EidtAnnotation($("#g_" + a.id), false);
                if (_onEdit) _onEdit(a.id, false);
            });
        }
    }
}
Object.setPrototypeOf(PlayNote.prototype, PlayBase.prototype)

function PlayBoard(data)
{
    PlayBase.call(this, "PlayBoard", data);
    var a = data;
    var _onEdit = null;
    this.SetOnEdit = function (callback)
    {
        _onEdit = callback;
    }
    var _onRecord = null;
    this.SetOnRecord = function (callback)
    {
        _onRecord = callback;
    }
    this.Play = function ()
    {
        var self = this;
        //console.log(this.name + ":Play done");
        var drawg = function() {
            var g = createEl("g");
            g.setAttribute("id", "g_" + a.id);
            g.setAttribute("isdraw", "true");
            self.Append(g);

            var boardhtml =
                "<div id='div_" +a.id +"' isdraw='true' tabindex='41' style='box-sizing:border-box;border:solid 1px blue; background-color:white; z-index:100; position: absolute; top: " +
                self.FixPoz(a.Rect.y, a.CW, self.getContainerWidth()) +"px; left: " +self.FixPoz(a.Rect.x, a.CW, self.getContainerWidth()) +"px; width: " +
                self.FixPoz(a.Rect.width, a.CW, self.getContainerWidth()) +"px; height: " +self.FixPoz(a.Rect.height, a.CW, self.getContainerWidth()) +"px; '>";
            boardhtml +="<svg id='svg_" +a.id +"' width='100%' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'></svg >";
            boardhtml += "</div>";
            //$(svg).parent().append(boardhtml);
            this.target.parent().append(boardhtml);

            var line = createEl("line");
            line.setAttribute("x1", self.FixPoz(a.Rect.x1, a.CW, self.getContainerWidth()));
            line.setAttribute("y1", self.FixPoz(a.Rect.y1, a.CW, self.getContainerWidth()));
            line.setAttribute("x2", self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()));
            line.setAttribute("y2", self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth()));
            line.setAttribute("style", "stroke-width:1; stroke:blue;");
            g.appendChild(line);

            var toArrow = createEl("path");
            toArrow.setAttribute("d",String.format("M{0} {1} L{2} {3} L{4} {5} Z",
            self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()),
            self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth()),
            self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()) + 10,
            self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth()) + 5,
            self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()) + 10,
            self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth()) - 5
                )
            );
            toArrow.setAttribute("transform",String.format("rotate({0},{1},{2})",
                    getAngle(
                        self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()),
                        self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth()),
                        self.FixPoz(a.Rect.x1, a.CW, self.getContainerWidth()),
                        self.FixPoz(a.Rect.y1, a.CW, self.getContainerWidth())
                    ),
                    self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()),
                    self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth())
                )
            );
            toArrow.setAttribute("style", "fill:blue;stroke:blue;stroke-width:1");
            g.appendChild(toArrow);

            if (a.Rect.show == true) {
                $(g).show();
                $("#div_" + a.id).show();
            } else {
                $(g).hide();
                $("#div_" + a.id).hide();
            }
        };
        var drawb = function() {
            if (a.mode == 0) {
                return;
            }
            if (a.mode == 1) {
                if (_onEdit) _onEdit(gid(a.id),a.id,true);//self.EidtWhiteBoard(a.id, true);
            } else if (a.mode == 2) {
                var div = $("#edit_" + a.id).hide();
                // ToPointer();
                // BoardTool = null;
                // SetWBMode(false);
            }
        };
        if (gid(a.id)) {
            var path = gid(a.id);
            if (a.x && a.CW)
            {
                path.setAttribute("x", self.FixPoz(a.x, a.CW, self.getContainerWidth()));
                path.setAttribute("y", self.FixPoz(a.y, a.CW, self.getContainerWidth()));
                path.setAttribute("width", self.FixPoz(a.width, a.CW, self.getContainerWidth()));
                path.setAttribute("height", self.FixPoz(a.height, a.CW, self.getContainerWidth())
                );
            }
            drawb();
            if (a.Rect) {
                if (!gid("g_" + a.id)) {
                    drawg();
                    return;
                }
                //var rect = $("#g_" + a.id).find(">rect")[0];
                var rectx = self.FixPoz(a.Rect.x, a.CW, self.getContainerWidth());
                var recty = self.FixPoz(a.Rect.y, a.CW, self.getContainerWidth());
                var div = $("#div_" + a.id);
                div.css({
                    top: recty,
                    left: rectx,
                    width: self.FixPoz(a.Rect.width, a.CW, self.getContainerWidth()),
                    height: self.FixPoz(a.Rect.height, a.CW, self.getContainerWidth())
                });

                var line = $("#g_" + a.id).find(">line")[0];
                line.setAttribute("x1",self.FixPoz(a.Rect.x1, a.CW, self.getContainerWidth()));
                line.setAttribute("y1",self.FixPoz(a.Rect.y1, a.CW, self.getContainerWidth()));
                line.setAttribute("x2",self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()));
                line.setAttribute("y2",self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth()));
                line.setAttribute("style", "stroke-width:1; stroke:blue;");

                var toArrow = $("#g_" + a.id).find(">path")[0];
                toArrow.setAttribute("d",String.format(
                        "M{0} {1} L{2} {3} L{4} {5} Z",
                        self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()),
                        self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth()),
                        self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()) + 10,
                        self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth()) + 5,
                        self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()) + 10,
                        self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth()) - 5
                    )
                );
                toArrow.setAttribute("transform",String.format(
                        "rotate({0},{1},{2})",getAngle(
                            self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()),
                            self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth()),
                            self.FixPoz(a.Rect.x1, a.CW, self.getContainerWidth()),
                            self.FixPoz(a.Rect.y1, a.CW, self.getContainerWidth())
                        ),
                        self.FixPoz(a.Rect.x2, a.CW, self.getContainerWidth()),
                        self.FixPoz(a.Rect.y2, a.CW, self.getContainerWidth())
                    )
                );
                toArrow.setAttribute("style","fill:blue;stroke:blue;stroke-width:1");

                if (a.Rect.show == true) {
                    $("#g_" + a.id).show();
                    $("#div_" + a.id).show();
                } else {
                    $("#g_" + a.id).hide();
                    $("#div_" + a.id).hide();
                }
            }
        } else {
            var path = createEl("rect");
            path.setAttribute("id", a.id);
            path.setAttribute("isdraw", "true");
            path.setAttribute("tp", "board");
            path.setAttribute("style","fill:blue;stroke:blue;stroke-width:1;fill-opacity:0.1;");
            if (a.x && a.CW) {
                path.setAttribute("x", self.FixPoz(a.x, a.CW, self.getContainerWidth()));
                path.setAttribute("y", self.FixPoz(a.y, a.CW, self.getContainerWidth()));
                path.setAttribute("width",self.FixPoz(a.width, a.CW, self.getContainerWidth()));
                path.setAttribute("height",self.FixPoz(a.height, a.CW, self.getContainerWidth()));
            }
            this.Append(path);//svg.appendChild(path);

            drawb();
            self.container.append(self.GetWBContainer(a.id))//$("#pageContainer" + PageNumber).append(self.GetWBContainer(a.id));

            $("#" + a.id).bind(self.EVENTCLICK, function(e) {
                if (!self.canEdit) return;
                if (_onRecord) _onRecord(gid(a.id),true,1);//self.Record(true,1);//Record_whiteboard(gid(a.id), false, 1, true);

                if (_onEdit) _onEdit(gid(a.id),a.id, true);//self.EidtWhiteBoard(a.id, true);
            });
        }
    }
    this.GetWBContainer=function(id) {
        var width = this.getViewWidth(); // GetPageContainer(PageNumber).width();
        var height = this.getViewHeight(); // GetPageContainer(PageNumber).height();
        var cheight = this.getContainerHeight();
        var html =
            "<div id='edit_" +
            id +
            "' class='boardcontainer' tabindex='11' style='position: absolute;box-sizing:border-box;  z-index:103;top:0px; left:0px;width:100%;height:100%;";
        html +=
            "background-color:white; border:1px solid #d3d3d3; border-radius:10px; box-shadow: 5px 5px 3px #d3d3d3;display:none;'>";
        html +=
            "<div class='boardhead' style='height:50px;border-bottom:1px solid #d3d3d3;border-left:1px solid #d3d3d3;border-right:1px solid #d3d3d3;width:100%; z-index:102;background-color:white;position: fixed;display: inline-block;top: 0px;left:0px;'><div style='float:left;height:100%;line-height:50px;padding-top:3px;'><span id='WBTool_Hand_" +
            id +
            "' class='WBTool_btn'><img width='20px;' title='Hand' src='"+this.ImagePath+"wb_hand.png' /></span>";
        html +=
            "<span id='WBTool_Pen_" +
            id +
            "' class='WBTool_btn selected'><img width='20px;' title='Pen' src='"+this.ImagePath+"wb_pen.png' /></span><span id='WBTool_Brush_" +
            id +
            "' class='WBTool_btn'><img width='20px;' title='Brush' src='"+this.ImagePath+"wb_brush.png' /></span>";
        html +=
            "<span id='WBTool_Del_" +
            id +
            "' class='WBTool_btn'><img width='20px;' title='Delete' src='"+this.ImagePath+"wb_delete.png' /></span>";
        html +=
            "<span id='WBTool_Undo_" +
            id +
            "' class='WBTool_btn'><img width='20px;' title='Undo' src='"+this.ImagePath+"wb_undo.png' /></span><span id='WBTool_Redo_" +
            id +
            "' class='WBTool_btn'><img width='20px;' title='Redo' src='"+this.ImagePath+"wb_redo.png' /></span>";
        //html += "<span id='WBTool_Large_" + id + "' class='WBTool_btn'><img width='20px;' title='Large' src='/static/images/wb_large.png' /></span><span id='WBTool_Small_" + id + "' class='WBTool_btn'><img width='20px;' title='Small' src='/static/images/wb_small.png' /></span>";
        html += "</div>";
        html +=
            "<div style='float:left;height:100%;line-height:50px;padding:2px 0px 0px 10px;'><span id='WBTool_Close_" +
            id +
            "' style='cursor:pointer; padding-right:10px;'><img width='20px;' title='Close' src='"+this.ImagePath+"wb_close.png' /></span></div></div><div style='height: 50px;'></div>";
        html +=
            "<div id='div_" +
            id +
            "' style='height:calc(100% - 50px);width:100%;overflow:hidden;position:relative;padding-top:0px;'>";
        html +=
            "<svg id='svg_" +
            id +
            "' width='100%' height='" +
        cheight * 3 +
            "px' version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'></svg>";
        //html += "<canvas id='canvas_" + id + "' width='" + (width - 4) + "' height='" + (height - 58) + "' style='position:absolute; left:0px; top:0px; z-index:102;'></canvas>";
        html += "</div></div>";
        return html;
    }
}
Object.setPrototypeOf(PlayBoard.prototype, PlayBase.prototype)

function PlayVideo(data)
{
    PlayBase.call(this, "PlayVideo", data);
    var a = data;
    var _onEdit = null;
    this.SetOnEdit = function (callback)
    {
        _onEdit = callback;
    }
    this.Play = function ()
    {
        //console.log(this.name + ":Play done");
        _onEdit(a.id,this.FixPoz(a.Left, a.CW, this.getContainerWidth()),this.FixPoz(a.Top, a.CW, this.getContainerWidth()),a.Info ? JSON.stringify(a.Info) : "");
    }
}
Object.setPrototypeOf(PlayVideo.prototype, PlayBase.prototype)

function PlayMouseMove(data)
{
    PlayBase.call(this, "PlayMouseMove", data);

    var MouseTimer = null;
    var a = data;

    this.Play = function ()
    {
        //console.log(this.name + ":Play done");
        if (MouseTimer)
        {
            clearTimeout(MouseTimer);
            MouseTimer = null;
        }
        if (a.show == 0)
        {
            this.container.find("div.liveMouse").hide();
            return;
        }
        else
        {
            if (this.container.find("div.liveMouse").length == 0)
            {
                var html = `<div class="liveMouse" style="position: absolute; left: 0px; top: 0px; z-index: 112; margin: -8px 0px 0px -3px; opacity: 0.6; display: none;"><i class="ivu-icon ivu-icon-mouse" style="font-size: 20px; color: red;"></i></div>`;
                this.container.append(html);
                //$(document.body).append(html);
            }
            this.container.find("div.liveMouse").show();
        }
        if (a.delay == 0)
        {
            this.PlayOnePointer(this.target, a, a.poz.length - 1);
        }
        else
        {
            for (var i = 0; i < a.poz.length; i++)
            {
                window.setTimeoutEx(this.PlayOnePointer, a.sleep * i, this.target, a, i);
            }
        }
    }
    this.PlayOnePointer = (svg, a, i) =>
    {
        if (i < a.poz.length)
        {
            var container = this.container[0];
            var top = 0;
            var left = 0;
            if (a.bd == 1)
            {
                top = this.FixPoz(a.poz[i][1] - 50, a.CW, this.getContainerWidth()) + 50;//+ this.FixPoz(a.ST, a.VW, this.getViewWidth())
                left = this.FixPoz(a.poz[i][0], a.CW, this.getContainerWidth());//+ this.FixPoz(a.SL, a.VW, this.getViewWidth());
            }
            else
            {
                top = this.FixPoz(a.poz[i][1], a.CW, this.getContainerWidth());//+ this.FixPoz(a.ST, a.VW, this.getViewWidth());
                left = this.FixPoz(a.poz[i][0], a.CW, this.getContainerWidth());// + this.FixPoz(a.SL, a.VW, this.getViewWidth());
            }



            if (top > this.getViewHeight() + container.scrollTop)
            {
                container.scrollTop = top - this.getViewHeight() + 100;
            }
            else if (top < container.scrollTop)
            {
                container.scrollTop = Math.max(0, top - 100);
            }
            //console.log(a.poz[i]);
            //console.log("top:"+top+",container.scrollTop:"+container.scrollTop);
            if (a.delay == 0)
            {
                this.container.find("div.liveMouse").stop().css({ "top": top, "left": left, "opacity": 0 });
                this.container.find("div.liveMouse").animate({ "opacity": 0.6 }, 300);
            }
            else
            {
                this.container.find("div.liveMouse").animate({ "top": top, "left": left , "opacity": 0.6 }, a.sleep * 0.95);
            }
        }
        else
        {
            MouseTimer = setTimeout(()=>
            {
                this.container.find("div.liveMouse").fadeOut("slow");
            }, 1000);

        }
    }
}
Object.setPrototypeOf(PlayMouseMove.prototype, PlayBase.prototype)

function PlayMouseClick(data)
{
    PlayBase.call(this, "PlayMouseClick", data);
    var HideClickTime = null;
    var a = data;
    this.Play = function ()
    {
        //console.log(this.name + ":Play done");
        var container = this.main[0];
        var top = 0;
        var left = 0;
        if (a.bd == 1)
        {
            top = this.FixPoz(a.poz[1] - 50, a.CW, this.getContainerWidth())  + 50;//+ this.FixPoz(a.ST, a.VW, this.getViewWidth())
            left = this.FixPoz(a.poz[0], a.VW, this.getContainerWidth());// + this.FixPoz(a.SL, a.VW, this.getViewWidth());
        }
        else
        {
            top = this.FixPoz(a.poz[1], a.CW, this.getContainerWidth());// + this.FixPoz(a.ST, a.VW, this.getViewWidth());
            left = this.FixPoz(a.poz[0], a.CW, this.getContainerWidth());// + this.FixPoz(a.SL, a.VW, this.getViewWidth());
        }
        //console.log(`top:${top} ,viewheight:${this.getViewHeight()} ,scrolltop: ${container.scrollTop}`);
        if (top > this.getViewHeight() + container.scrollTop)
        {
            container.scrollTop = top - this.getViewHeight() + 100;
        }
        else if (top < container.scrollTop)
        {
            container.scrollTop = Math.max(0, top - 100);
        }
        if (HideClickTime)
        {
            clearTimeout(HideClickTime);
            HideClickTime = null;
        }
        this.container.find("div.liveMouse").stop().css({ "top": top, "left": left, "opacity": 0.6 });
        if (this.container.find("div.liveMouseClick").length == 0)
        {
            var html = `<div class="liveMouseClick" style="position:absolute; left: 0px; top: 0px;z-index:113;"><div class="liveMouseContainer"></div></div>`;
            this.container.append(html);
            //$(document.body).append(html);
        }
        this.container.find("div.liveMouseClick").css({ "display": "block", "top": top, "left": left  });
        this.container.find("div.liveMouseContainer").removeClass("liveMouseShowAnimation").addClass("liveMouseShowAnimation");
        HideClickTime = setTimeout(()=>
        {
            this.container.find("div.liveMouseContainer").removeClass("liveMouseShowAnimation");
            this.container.find("div.liveMouseClick").hide();
        }, 300);
    }
}
Object.setPrototypeOf(PlayMouseClick.prototype, PlayBase.prototype)

function PlayChangePage(data)
{
    PlayBase.call(this, "PlayChangePage", data);
    this.Play = function ()
    {
        console.log(this.name + ":Play not done");
    }
}
Object.setPrototypeOf(PlayChangePage.prototype, PlayBase.prototype)

function PlayChangeView(data,scale,sizeMode)
{
    PlayBase.call(this, "PlayChangeView", data);
    var a = data;
    var _onZoom = null;
    this.SetOnZoom = function (callback)
    {
        _onZoom = callback;
    }
    this.Play = function ()
    {
        //console.log(this.name + ":Play done");
        var current = new Object();
        current.CW = this.getContainerWidth();
        current.CH = this.getContainerHeight();
        current.VW = this.getViewWidth();
        current.VH = this.getViewHeight();
        current.ST = this.main.scrollTop() | 0;
        current.SL = this.main.scrollLeft() | 0;
        var obj = getDiffZoom(a, current,sizeMode);
        if (Math.abs(obj.Zoom - scale) < 0.01) {
            if (obj.Left >= 0) {
                this.main.scrollLeft(obj.Left);
            }
            if (obj.Top >= 0) {
                this.main.scrollTop(obj.Top);
            }
        } else {
            //loger.log(obj);
            _onZoom(obj.Zoom, () =>
            {
                if (obj.Left >= 0) {
                    this.main.scrollLeft(obj.Left);
                }
                if (obj.Top >= 0) {
                    this.main.scrollTop(obj.Top);
                }
            });
        }
    }
    function getDiffZoom(teacher, student,sizeMode) {
        var result = Object();
        if (sizeMode == 0)
        {
            result.Zoom = teacher.CW / teacher.VW;
            if (teacher.ST > 0)
            {
                result.Top = (teacher.ST * student.CW) / teacher.CW;
            } else
            {
                result.Top = 0;
            }
            if (teacher.SL > 0)
            {
                result.Left = (teacher.SL * student.CH) / teacher.CH;
            } else
            {
                result.Left = 0;
            }
        }
        else
        {
            result.Zoom = teacher.CH / teacher.VH;
            if (teacher.ST > 0)
            {
                result.Top = (teacher.ST * student.CW) / teacher.CW;
            } else
            {
                result.Top = 0;
            }
            if (teacher.SL > 0)
            {
                result.Left = (teacher.SL * student.CH) / teacher.CH;
            } else
            {
                result.Left = 0;
            }
        }
        return result;
    }
}
Object.setPrototypeOf(PlayChangeView.prototype, PlayBase.prototype)

function PlayHide(data)
{
    PlayBase.call(this, "PlayHide", data);
    var a = data;

    this.Play = function ()
    {
        //console.log(this.name + ":Play done");
        $("#" + this.GetFixedPageNumber(a.id)).hide();
    }
}
Object.setPrototypeOf(PlayHide.prototype, PlayBase.prototype)

function PlayDelete(data)
{
    PlayBase.call(this, "PlayDelete", data);
    this.Play = function ()
    {
        //console.log(this.name + ":Play done");
        $("#" + this.GetFixedPageNumber(data.id)).remove();
        $("#g_" + this.GetFixedPageNumber(data.id)).remove();
    }
}
Object.setPrototypeOf(PlayDelete.prototype, PlayBase.prototype)

function PlayClear(data)
{
    PlayBase.call(this, "PlayClear", data);
    var a = data;
    this.Play = function ()
    {
        //console.log(this.name + ":Play done");

        $("#" + this.GetFixedPageNumber(a.id)).find("path,g,circle").remove();
        $("#" + this.GetFixedPageNumber(a.id)).find("rect").each(function (i)
        {
            if ($(this).attr("tp") == "board")
            {
                $("#edit_" + $(this).attr("id")).remove();
            }
            $(this).remove();
        });
        this.container.find("div.live-video-tool-container").remove();
    }
}
Object.setPrototypeOf(PlayClear.prototype, PlayBase.prototype)

function PlaySelect(data)
{
    PlayBase.call(this, "PlaySelect", data);
    var a = data;
    this.Play = function ()
    {
        if (a.stat == 1)
        {
            var tar = $("#" + a.id);
            var rect = gid(a.id).getBoundingClientRect();
            if (rect.width+rect.height<10)
            {
                tar.attr("class", "WB_SelectPathSmall");
            }
            else
            {
                tar.attr("class", "WB_SelectPath");
            }
            //$("#"+a.id).attr("class", "WB_SelectPath");
        }
        else
        {
            $("#"+a.id).removeAttr("class");
        }
    }
}
Object.setPrototypeOf(PlaySelect.prototype, PlayBase.prototype)

function PlayResize(data)
{
    PlayBase.call(this, "PlayResize", data);
    var a = data;
    this.Play = function ()
    {
        //console.log(this.name + ":Play done");
        var tar = $("#" + this.GetFixedPageNumber(a.id));
        if (a.size == 1)
        {
            tar.height(tar.height() + tar.parent().height() * 0.5);
        }
        else if (a.size == -1)
        {
            if (tar.height() < tar.parent().height())
            {
                return;
            }
            tar.height(tar.height() - tar.parent().height() * 0.5);
        }
    }
}
Object.setPrototypeOf(PlayResize.prototype, PlayBase.prototype)

function PlayScroll(data)
{
    PlayBase.call(this, "PlayScroll", data);
    this.Play = function ()
    {
        //console.log(this.name + ":Play done");
        var tar = gid(data.id);
        tar.scrollTop = data.poz * parseFloat($(tar).width());

    }
}
Object.setPrototypeOf(PlayScroll.prototype, PlayBase.prototype)


//player end------------------------------------------------------------------------------------------------------------------------------------------------
//tool start------------------------------------------------------------------------------------------------------------------------------------------------
function ToolBase(name)
{
    this.name = name;
    this.onReocrd = null;
    this.onSetTool = null;
    this.onSetActiveTool = null;
    this.onRecordHistory = null;
    this.target = null;
    this.container = null;
    this.main = null;
    this.pagenumber = null;
    this.ele = null;
    this.canEdit = true;
    this.getCanEdit = null;
    this.onError = null;
    this.deviceType = 0;
    this.EVENTSTART = "mousedown pointerdown";
    this.EVENTMOVE = "mousemove pointermove";
    this.EVENTEND = "mouseup pointerup";
    this.EVENTRESIZE = "onpointerdown";
    this.EVENTCLICK = "click";
    this.EVENTOUT="pointerleave";
    this.ImagePath = "/static/images/";
    var privatename = name;
    var preNode = [0,0];
    this.Text = { "Delete": "Delete", "Edit": "Edit", "Cancel": "Cancel", "Save": "Save" }

    this.SetParamter = function (onReocrd, target, container, main, pagenumber,deviceType, onSetTool,onSetActiveTool,onRecordHistory)
    {
        this.onReocrd = onReocrd;
        this.target = target;
        this.container = container;
        this.main = main;
        this.pagenumber = pagenumber;
        this.deviceType = deviceType;
        this.onSetTool = onSetTool;
        this.onSetActiveTool = onSetActiveTool;
        this.onRecordHistory = onRecordHistory;

        if (this.deviceType != 0) {
            this.EVENTSTART = "touchstart";
            this.EVENTMOVE = "touchmove";
            this.EVENTEND = "touchend";
            this.EVENTCLICK = "click";
            this.EVENTRESIZE = "ontouchstart";
            this.EVENTOUT="touchcancel";
            this.ImagePath = "img/";
        }
        this.Init();
    }
    this.Init = function ()
    {
        //console.log(this.name + " init");
        if(this.deviceType == 0 && this.target) this.target.css({ "cursor": "default" });
    }
    this.Destroy = function ()
    {
        if (this.deviceType == 0 && this.target) this.target.css({ "cursor": "default" });
        this.SetTool("");
        this.SetActiveTool(null);
    }

    this.SetCanEdit = function (canedit)
    {
        this.canEdit = canedit;
    }
    this.SetCanEditFun = function (caneditfun)
    {
        this.getCanEdit = caneditfun;
    }
    this.SetOnError = function (onerror)
    {
        this.onError = onerror;
    }
    this.SetEle = function (ele)
    {
        this.ele = ele;
    }
    this.SetTool = function (tool)
    {
        if (this.onSetTool)
        {
            this.onSetTool(tool);
        }
    }
    this.SetActiveTool = function (tool)
    {
        if (this.onSetActiveTool)
        {
            this.onSetActiveTool(tool);
        }
    }

    this.onStart = function (x, y)
    {
        console.log(this.name + ":onStart not done");
    };
    this.onMove = function (x, y)
    {
        console.log(this.name + ":onMove not done");
    };
    this.onEnd = function (x, y)
    {
        console.log(privatename + ":onEnd not done");
    };
    this.onClick = function (x, y)
    {
        //console.log(privatename + ":onClick not done");
        return false;
    };
    this.Record = function (save)
    {
        console.log(privatename + ":Record not done");
    };
    this.Delete = function ()
    {
        return false;
    }
    this.Record_delete = function (id, save)
    {
        var obj = new Object();
        obj.type = 102;
        obj.page = this.pagenumber;
        obj.save = 1;
        obj.id = id;
        this.RecordHandle(obj);
        return obj;
    }
    this.Record_clear = function (id, save)
    {
        var obj = new Object();
        obj.type = 103;
        obj.page = this.pagenumber;
        obj.save = 1;
        obj.id = id;
        this.RecordHandle(obj);
        return obj;
    }
    this.Record_resize=function(id, size) {
        var obj = new Object();
        obj.type = 201;
        obj.page = this.pagenumber;
        obj.id = id;
        obj.size = size;
        obj.CW = this.getContainerWidth();
        obj.CH = this.getContainerHeight();
        this.RecordHandle(obj);
        return obj;
    }
    this.Record_scroll=function(id) {
        var obj = new Object();
        obj.type = 202;
        obj.page = this.pagenumber;
        obj.id = id;
        obj.poz = gid(id).scrollTop / $("#" + id).width();
        obj.CW = this.getContainerWidth();
        obj.CH = this.getContainerHeight();
        this.RecordHandle(obj);
        return obj;
    }
    this.Record_select=function(id,stat)
    {
        var obj = new Object();
        obj.type = 104;
        obj.id = id;
        obj.page = this.pagenumber;
        obj.stat = stat;
        this.RecordHandle(obj);
        return obj;
    }
    this.RecordHistory_delete = function (id, save)
    {
        var obj = new Object();
        obj.type = 102;
        obj.page = this.pagenumber;
        obj.save = 1;
        obj.id = id;
        return obj;
    }
    this.Append = function ()
    {
        if (this.target[0].firstChild)
        {
            var paths = this.target.find(">path");
            if (paths.length == 0)
            {
                this.target[0].insertBefore(this.ele, this.target[0].firstChild);
            }
            else
            {
                paths.last().after($(this.ele));
            }
        }
        else
        {
            this.target[0].appendChild(this.ele);
        }
    };
    this.getContainerWidth = function ()
    {
        return this.container.width();
    };
    this.getContainerHeight = function ()
    {
        return this.container.height();
    }
    this.getViewHeight = function ()
    {
        return this.main.height();
    }
    this.getViewWidth = function ()
    {
        return this.main.width();
    }
    this.GetFixedPageNumber = function (pageid)
    {
        return (pageid + "").replace(".", "\\.");
    }
    this.getLastNode = function(txt) {
        //L414.3,395.2 L414.3,395.2
        //loger.log(txt);
        return txt.substr(txt.lastIndexOf("L") + 1);
    };
    /**
     * 判断rect是否与x, y, width, height所定义的矩形相交
     * 原名：isInRect
     */
    this.isIntersectRect = function(x, y, width, height, rect)
    {
        // bottom: 504
        // height: 401
        // left: 357.5
        // right: 968.5
        // top: 103
        // width: 611
        // x: 357.5
        // y: 103
        // if ((rect.x >= x && rect.x <= x + width) || (rect.x+rect.width >= x && rect.x+rect.width <= x + width))
        // {
        //     if ((rect.y >= y && rect.y <= y + height) || (rect.y + rect.height >= y && rect.y + rect.height <= y + height))
        //     {
        //         return true;
        //     }
        // }
        // if (rect.x <= x + width || rect.x + rect.width >= x)
        // {
        //     if (rect.y <= y + height || rect.y + rect.height >= y)
        //     {
        //         return true;
        //     }
        // }
        //     !(endY2 < startY1 || endY1 < startY2 || startX1 > endX2 || startX2 > endX1)
        return !(rect.y + rect.height < y || y + height < rect.y || x > rect.x + rect.width || rect.x > x + width);
        // return false;
    }
    /**
     * 判断rect是否在x, y, width, height所定义的矩形内部
     */
    this.isInsideRect = function (x, y, width, height, rect)
    {
        return rect.x >= x && rect.y >= y
            && rect.x + rect.width <= x + width
            && rect.y + rect.height <= y + height;
    }
    /**
     * 判断line1是否与Line2相交
     */
    this.isIntersectLine = function (line1, line2)
    {
        var crossProduct2D = function (a1, a2, b1, b2)
        {
            return a1 * b2 - a2 * b1;
        }
        // (a1, a2) = (line1.x1, line1.y1)
        var a1 = line1.x1;
        var a2 = line1.y1;
        // (b1, b2) = (line1.x2, line1.y2)
        var b1 = line1.x2;
        var b2 = line1.y2;
        // (c1, c2) = (line2.x1, line2.y1)
        var c1 = line2.x1;
        var c2 = line2.y1;
        // (d1, d2) = (line2.x2, line2.y2)
        var d1 = line2.x2;
        var d2 = line2.y2;
        // (cb1, cb2) = (b1-c1, b2-c2)
        var cb1 = b1 - c1;
        var cb2 = b2 - c2;
        // (cd1, cd2) = (d1-c1, d2-c2)
        var cd1 = d1 - c1;
        var cd2 = d2 - c2;
        // (ca1, ca2) = (a1-c1, a2-c2)
        var ca1 = a1 - c1;
        var ca2 = a2 - c2;
        // (bd1, bd2) = (d1-b1, d2-b2)
        var bd1 = d1 - b1;
        var bd2 = d2 - b2;
        // (ba1, ba2) = (a1-b1, a2-b2)
        var ba1 = a1 - b1;
        var ba2 = a2 - b2;
        // (bc1, bc2) = (c1-b1, c2-b2)
        var bc1 = c1 - b1;
        var bc2 = c2 - b2;
        // 当cb×cd与cd×ca同号且bd×ba与ba×bc同号时：ab和cd是相交的，否则不相交
        // 其中，cbxcd与cdxca同号相当于：线段ab和直线cd相交
        //      bd×ba与ba×bc同号相当于：线段cd和直线ab相交
        return crossProduct2D(cb1, cb2, cd1, cd2) * crossProduct2D(cd1, cd2, ca1, ca2) > 0
            && crossProduct2D(bd1, bd2, ba1, ba2) * crossProduct2D(ba1, ba2, bc1, bc2) > 0;
    }
    this._drawGetTop = function ()
    {
        return $(document).scrollTop() + this.main.scrollTop() - this._drawGetBoundingTop();
    }
    this._drawGetLeft = function ()
    {
        return $(document).scrollLeft() + this.main.scrollLeft() - this._drawGetBoundingLeft();
    }
    this._drawGetBoundingLeft = function ()
    {
        var bleft = this.container[0].getBoundingClientRect().left;
        bleft = Math.max(bleft, 0);
        return bleft;
    }
    this._drawGetBoundingTop = function ()
    {
        var bleft = this.container[0].getBoundingClientRect().top;
        bleft = Math.max(bleft, 0);
        return bleft;
    }
    this.CheckRecordStep=function(x, y,diff=100)
    {
        var sum = Math.abs(x - preNode[0]) + Math.abs(y - preNode[1]);
        var result = sum >= diff;
        if (result)
        {
            preNode = [x,y];
        }
        return result;
    }
    this.ShowArrow = function (fRect)
    {
        var g = $("#g_" + fRect.attr("id"));
        var line = g.find(">line");
        var to = g.find(">rect");
        var arrow = $(g).find("path");

        var fromx = parseInt(fRect.attr("x"));
        var fromy = parseInt(fRect.attr("y"));
        var fromwidth = parseInt(fRect.attr("width"));
        var fromheight = parseInt(fRect.attr("height"));
        var tox = parseInt(to.attr("x"));
        var toy = parseInt(to.attr("y"));
        var towidth = parseInt(to.attr("width"));
        var toheight = parseInt(to.attr("height"));
        var linefromx, linefromy, linetox, linetoy;
        if (fromy > toy + toheight)//上
        {
            linefromx = fromx + fromwidth / 2;
            linefromy = fromy;
            linetox = tox + towidth / 2;
            linetoy = toy + toheight;
        }
        else if (toy > fromy + fromheight)//下
        {
            linefromx = fromx + fromwidth / 2;
            linefromy = fromy + fromheight;
            linetox = tox + towidth / 2;
            linetoy = toy;
        }
        else//中
        {
            if (tox + towidth / 2 > fromx + fromwidth / 2)//右
            {
                if (fromx > tox)
                {
                    linefromx = fromx;
                    linefromy = fromy + fromheight / 2;
                    linetox = tox;
                    linetoy = toy + toheight / 2;
                }
                else
                {
                    linefromx = fromx + fromwidth;
                    linefromy = fromy + fromheight / 2;
                    linetox = tox;
                    linetoy = toy + toheight / 2;
                }
            }
            else//左
            {
                if (fromx > tox + towidth)
                {
                    linefromx = fromx;
                    linefromy = fromy + fromheight / 2;
                    linetox = tox + towidth;
                    linetoy = toy + toheight / 2;
                }
                else
                {
                    linefromx = fromx + fromwidth;
                    linefromy = fromy + fromheight / 2;
                    linetox = tox + towidth;
                    linetoy = toy + toheight / 2;
                }
            }
        }
        line.attr("x1", linefromx);
        line.attr("y1", linefromy);
        line.attr("x2", linetox);
        line.attr("y2", linetoy);

        arrow.attr('d', String.format("M{0} {1} L{2} {3} L{4} {5} Z",
            linetox, linetoy, linetox + 10, linetoy + 5, linetox + 10, linetoy - 5));
        arrow.attr('transform', String.format("rotate({0},{1},{2})",
            getAngle(linetox, linetoy, linefromx, linefromy), linetox, linetoy));
        arrow.css("z-index", "103");
    }
    this.SplitText = function (txt, width)
    {
        var len = (width / 8) | 0;
        var result = new Array();
        var str = txt;
        var temp = "";
        var splitline = function (strText)
        {
            var lines = new Array();
            while (strText.indexOf("\r\n") > -1 || strText.indexOf("\n") > -1)
            {
                if (strText.indexOf("\r\n") > -1)
                {
                    lines.push(strText.substring(0, strText.indexOf("\r\n") + 1));
                    strText = strText.substr(strText.indexOf("\r\n") + 1);
                }
                else if (strText.indexOf("\n") > -1)
                {
                    lines.push(strText.substring(0, strText.indexOf("\n") + 1));
                    strText = strText.substr(strText.indexOf("\n") + 1);
                }
            }
            if (strText != "")
            {
                lines.push(strText);
            }
            return lines;
        };
        var splitlong = function (strText)
        {
            var lines = new Array();
            while (strText.length > len)
            {
                temp = strText.substring(0, len);
                lines.push(temp);
                strText = strText.substr(len);
            }
            if (strText != "")
            {
                lines.push(strText);
            }
            return lines;
        };
        var realLength=function(val) { return val.replace(/[^\x00-\xff]/g, "**").length; }
        var splitlength = function(strText) {
            var lines = new Array();
            var temp="";
            while(strText.length>0)
            {
                temp +=strText[0];
                strText=strText.substr(1);
                if(realLength(temp)>=len)
                {
                    lines.push(temp);
                    temp="";
                }
            }
            if(temp!="")
            {
                lines.push(temp);
            }
            return lines;
        };

        var arr = splitline(str);
        //return arr;
        for (var i = 0; i < arr.length; i++)
        {
            var t = splitlength(arr[i]);
            for (var j = 0; j < t.length; j++)
            {
                result.push(t[j]);
            }
        }
        return result;
    }
    this.SplitTextEx = function (txt, width,fontsize,font)
    {
        //console.log("SplitTextEx",width,fontsize);
        var result = new Array();
        if (!txt || txt == "") return result;
        var container = $("#divforwhiteboardgetlines");
        var lineheight = Math.round(fontsize * 1.2);
        //console.log(fontsize,lineheight);
        if (container.length == 0)
        {
            var html = `<div id='divforwhiteboardgetlines' style="width:${width}px;font-family:${font};word-wrap:break-word;word-break:break-all;padding:0px;margin:0px;line-height:${lineheight}px;font-size:${fontsize}px;position:absolute;top:-550px;left:-550px;"></div>`;
            $(document.body).append(html);
            container = $("#divforwhiteboardgetlines");
        }
        else
        {
            container.css({"width":width+"px","font-size":fontsize+"px","line-height":lineheight+"px","font-family":font});

        }
        var splitline = function (strText)
        {
            var lines = new Array();
            while (strText.indexOf("\r\n") > -1 || strText.indexOf("\n") > -1)
            {
                if (strText.indexOf("\r\n") > -1)
                {
                    lines.push(strText.substring(0, strText.indexOf("\r\n") + 1));
                    strText = strText.substr(strText.indexOf("\r\n") + 1);
                }
                else if (strText.indexOf("\n") > -1)
                {
                    lines.push(strText.substring(0, strText.indexOf("\n") + 1));
                    strText = strText.substr(strText.indexOf("\n") + 1);
                }
            }
            if (strText != "")
            {
                lines.push(strText);
            }
            return lines;
        };
        var splitbywidth = function (strText)
        {
            container.html("");
            var temp = "";
            var pre = "";
            var lines = new Array();
            while(strText.length>0)
            {
                temp += strText[0];
                container.html(temp);
                if(container.height()>=lineheight*2)
                {
                    temp = "";
                    lines.push(pre);
                    pre = "";
                }
                else
                {
                    strText = strText.substr(1);
                    pre = temp;
                }
            }
            if(temp!="")
            {
                lines.push(temp);
            }
            return lines;
        };
        var arr = splitline(txt);
        for (var i = 0; i < arr.length; i++)
        {
            var t = splitbywidth(arr[i]);
            for (var j = 0; j < t.length; j++)
            {
                result.push(t[j]);
            }
        }
        return result;

    }
    this.RecordHandle = function (obj)
    {
        if (this.onReocrd)
        {
            this.onReocrd(obj);
        }
    }
    this.CreateRecordBaseInfo = function (type, options,path)
    {
        path = path || this.ele;
        var obj = new Object();
        obj.type = type;
        obj.page = this.pagenumber;

        obj.CW = this.getContainerWidth();
        obj.CH = this.getContainerHeight();
        obj.VW = this.getViewWidth();
        obj.VH = this.getViewHeight();

        if (path)
        {
            obj.id = path.getAttributeNode("id").nodeValue;
        }
        if (options && path)
        {
            for (var key in options)
            {
                if (path.getAttributeNode(options[key]))
                {
                    obj[key] = path.getAttributeNode(options[key]).nodeValue;
                }
            }
        }
        return obj;
    }
    this.CreateEle = function (name, options)
    {
        var result = createEl(name);
        result.setAttribute('id', GUID());
        if (options)
        {
            for (var key in options)
            {
                result.setAttribute(key, options[key]);
            }
        }
        return result;
    }
    this.ShowSetting = function (isshow)
    {
        //console.log(this.name + ":no setting or not done");
    }
    this.ShowColorSizeSetting = function (size, color, isshow,isboard=false,font="")
    {

        if (!isshow)
        {
            $("#WBTool_Setting").remove();
            return;
        }
        //${size}
        var html = `<div id="WBTool_Setting" tabindex="100" class="WBTool_Setting">
            <div tabindex="100" style="width:100%; height:25px; padding-top:5px;">
                <div style="cursor:pointer; float:right;padding-right:10px;" class="WBTool_Close"><img width="20px" title="Close" src="${this.ImagePath}wb_close.png"></div>
            </div>
            <div style="clear:both;"></div>
            <div id="WBTool_Setting_Size" tabindex="100" style="width:100%; height:42px;line-height:42px;" title="Select Size">
                <span tabindex="100" class="WBTool_selectsizecontainer" val="1" ><span class="WBTool_selectsize" style="width:6px; height:6px;margin: 17px;"></span></span>
                <span tabindex="100" class="WBTool_selectsizecontainer" val="2" ><span class="WBTool_selectsize" style="width:10px; height:10px;margin: 15px;"></span></span>
                <span tabindex="100" class="WBTool_selectsizecontainer" val="3" ><span class="WBTool_selectsize" style="width:14px; height:14px;margin: 13px;"></span></span>
                <span tabindex="100" class="WBTool_selectsizecontainer" val="6" ><span class="WBTool_selectsize" style="width:18px; height:18px;margin: 11px;"></span></span>
                <span tabindex="100" class="WBTool_selectsizecontainer" val="10" ><span class="WBTool_selectsize" style="width:22px; height:22px;margin: 9px;"></span></span>
            </div>
            <div tabindex="100" style="width:100%; height:40px;">
                <span tabindex="100" class="WBTool_sizetextcontainer">01</span>
                <span tabindex="100" class="WBTool_sizetextcontainer">02</span>
                <span tabindex="100" class="WBTool_sizetextcontainer">03</span>
                <span tabindex="100" class="WBTool_sizetextcontainer">05</span>
                <span tabindex="100" class="WBTool_sizetextcontainer">09</span>
            </div>
            <div tabindex="100" style="width:100%; height:10px;border-bottom:1px solid #d3d3d3; margin:0px 0px 10px;">
            </div>
            <div id="WBTool_Setting_Color" tabindex="100" style="width:100%;" title="Select Color">
                <div tabindex="100" style="width:100%; height:60px; line-height:60px;">
                <span tabindex="100" class="WBTool_selectcolorcontainer" style=" border-color:#ff0000;" val="#ff0000" ><span class="WBTool_selectcolor" style="background-color:#ff0000;"></span></span>
                <span tabindex="100" class="WBTool_selectcolorcontainer" style=" border-color:#db5347;" val="#db5347" ><span class="WBTool_selectcolor" style="background-color:#db5347;"></span></span>
                <span tabindex="100" class="WBTool_selectcolorcontainer" style=" border-color:#edb34b;" val="#edb34b" ><span class="WBTool_selectcolor" style="background-color:#edb34b;"></span></span>
                <span tabindex="100" class="WBTool_selectcolorcontainer" style=" border-color:#ffff00;" val="#ffff00" ><span class="WBTool_selectcolor" style="background-color:#ffff00;"></span></span>
                <span tabindex="100" class="WBTool_selectcolorcontainer" style=" border-color:#95e27c;" val="#95e27c" ><span class="WBTool_selectcolor" style="background-color:#95e27c;"></span></span>
                </div>
                <div tabindex="100" style="width:100%; height:60px;line-height:60px;">
                <span tabindex="100" class="WBTool_selectcolorcontainer" style=" border-color:#551e79;" val="#551e79" ><span class="WBTool_selectcolor" style="background-color:#551e79;"></span></span>
                <span tabindex="100" class="WBTool_selectcolorcontainer" style=" border-color:#010101;" val="#010101" ><span class="WBTool_selectcolor" style="background-color:#010101;"></span></span>
                <span tabindex="100" class="WBTool_selectcolorcontainer" style=" border-color:#b8b8ba;" val="#b8b8ba" ><span class="WBTool_selectcolor" style="background-color:#b8b8ba;"></span></span>
                <span tabindex="100" class="WBTool_selectcolorcontainer" style=" border-color:#458df3;" val="#458df3" ><span class="WBTool_selectcolor" style="background-color:#458df3;"></span></span>
                <span tabindex="100" class="WBTool_selectcolorcontainer" style=" border-color:#8cdbf8;" val="#8cdbf8" ><span class="WBTool_selectcolor" style="background-color:#8cdbf8;"></span></span>
                </div>
            </div>`
        if (font != "")
        {
            html += `<div tabindex="100" style="width:100%; height:10px;border-bottom:1px solid #d3d3d3; margin:0px 0px 20px;"></div>
                    <div id="WBTool_Setting_Font" tabindex="100" style="width:100%;" title="Select Font">
                    <span tabindex="100" class="WBTool_selectfontcontainer" val="consolas" ><span class="WBTool_selectfont" style="font-family:Consolas;">Consolas</span></span>
                    <span tabindex="100" class="WBTool_selectfontcontainer" val="monospace" ><span class="WBTool_selectfont" style="font-family:monospace;">Mono</span></span>
                    <span tabindex="100" class="WBTool_selectfontcontainer" val="sans-serif" ><span class="WBTool_selectfont" style="font-family:sans-serif;">Sans</span></span>
                    <span tabindex="100" class="WBTool_selectfontcontainer" val="serif" ><span class="WBTool_selectfont" style="font-family:sans-serif;">Serif</span></span>
                    <span tabindex="100" class="WBTool_selectfontcontainer" val="cursive" ><span class="WBTool_selectfont" style="font-family:cursive;">Cursive</span></span>
                </div>`
        }
        html += `</div>`

        if ($("#WBTool_Setting").length > 0)
        {
            $("#WBTool_Setting").remove();
        }
        this.main.append(html);
        if (this.deviceType == 0)
        {
            if (isboard)
            {
                $("#WBTool_Setting").css({ "left": "50px", "top": "50px" });
            }
        }
        else
        {
            if (isboard)
            {
                $("#WBTool_Setting").css({ "left": "5px", "top":"50px" });
            }
            else
            {
                $("#WBTool_Setting").css({ "left": "auto", "right": "40px", "top": "0px" });
            }
        }
        $("#WBTool_Setting").show();
        if(font!="")
        {
            $("#WBTool_Setting").css("height","330px");
            $("#WBTool_Setting_Font").find("span[val='" + font + "']").addClass("selected");
        }
        $("#WBTool_Setting_Size").find("span[val='" + size + "']").addClass("selected");
        $("#WBTool_Setting_Color").find("span[val='" + color + "']").addClass("selected");


        $("#WBTool_Setting").find("div.WBTool_Close").bind(this.EVENTCLICK, (evt) =>
        {
            $("#WBTool_Setting").remove();
            this.AfterCloseColorSizeSetting();
            evt.originalEvent.preventDefault();
            evt.originalEvent.stopPropagation();
        });
        $("#WBTool_Setting").find("span.WBTool_selectsizecontainer").bind(this.EVENTCLICK, (evt) =>
        {
            var tar = $(evt.currentTarget);
            tar.parent().find("span.selected").removeClass("selected");
            tar.addClass("selected");
            var v = parseFloat(tar.attr("val"));

            this.AfterSelectSizeSetting(v);

            evt.originalEvent.preventDefault();
            evt.originalEvent.stopPropagation();
        });
        $("#WBTool_Setting").find("span.WBTool_selectcolorcontainer").bind(this.EVENTCLICK, (evt) =>
        {
            var tar = $(evt.currentTarget);
            tar.parent().parent().find("span.selected").removeClass("selected");
            tar.addClass("selected");
            var v = tar.attr("val");

            this.AfterSelectColorSetting(v);
            evt.originalEvent.preventDefault();
            evt.originalEvent.stopPropagation();
        });
        $("#WBTool_Setting").find("span.WBTool_selectfontcontainer").bind(this.EVENTCLICK, (evt) =>
        {
            var tar = $(evt.currentTarget);
            tar.parent().parent().find("span.selected").removeClass("selected");
            tar.addClass("selected");
            var v = tar.attr("val");

            this.AfterSelectFontSetting(v);
            evt.originalEvent.preventDefault();
            evt.originalEvent.stopPropagation();
        });
    }
    this.AfterSelectSizeSetting = function (size)
    {
        console.log(this.name + ":AfterSelectSizeSetting not done");
    }
    this.AfterSelectColorSetting = function (color)
    {
        console.log(this.name + ":AfterSelectSizeSetting not done");
    }
    this.AfterSelectFontSetting = function (font)
    {
        console.log(this.name + ":AfterSelectFontSetting not done");
    }
    this.AfterCloseColorSizeSetting = function ()
    {
        console.log(this.name + ":AfterCloseColorSizeSetting not done");
    }

}

function ToolPen()
{
    ToolBase.call(this, "ToolPen");
    var _selSize = 1;
    var _selColor = "#ff0000";
    var _lastPoz = [0,0];

    function createPath()
    {
        var result = createEl("path");
        result.setAttribute('id', GUID());
        result.setAttribute('isdraw', 'true');
        result.setAttribute('tp', 'line');
        result.setAttribute('style', "fill:white;fill-opacity:0;stroke-linecap:round;");
        result.setAttribute('stroke-width', _selSize);
        result.setAttribute('stroke', _selColor);
        return result;
    }
    this.Init = function ()
    {
        //console.log("ToolPen init");
        if(this.deviceType == 0 && this.target) this.target.css({ "cursor": "url('" + this.ImagePath + "pencil.cur" + "'),default" });

    }
    this.onStart = function (x, y)
    {
        //console.log(this.name + ":onStart done");
        this.ele = this.CreateEle("path", { "isdraw": 'true', "tp": 'line', "style": 'fill:white;fill-opacity:0;stroke-linecap:round;', "stroke-width": _selSize, "stroke": _selColor });
        this.ele.setAttribute('d', "M" + x + "," + y);
        _lastPoz = [x, y];
        //svg.appendChild(path);
        this.Append();
        this.Record();
    };
    this.onMove = function (x, y)
    {
        //console.log(this.name + ":onMove done");
        if (_lastPoz[0] == x && _lastPoz[1] == y)
        {
            return true;
        }
        _lastPoz = [x, y];
        var oldValue = this.ele.getAttributeNode("d").nodeValue;
        if (oldValue.length > 7870)
        {
            var obj = this.Record(true);
            if (this.onRecordHistory) this.onRecordHistory(this.RecordHistory_delete(obj.id),obj);
            this.ele = this.CreateEle("path", { "isdraw": 'true', "tp": 'line', "style": 'fill:white;fill-opacity:0;stroke-linecap:round;', "stroke-width": _selSize, "stroke": _selColor });
            this.ele.setAttribute('d', "M"+ this.getLastNode(oldValue) +" L" + x + "," + y);
            this.Append();
            this.Record();
        }
        else
        {
            this.ele.setAttribute('d', oldValue + " L" + x + "," + y);
        }
        if (this.CheckRecordStep(x, y))
        {
            this.Record();
        }
        return true;

    };
    this.onEnd = function (x, y)
    {
        //console.log(this.name + ":onEnd done");


        var oldValue = this.ele.getAttributeNode("d").nodeValue;
        if (oldValue.indexOf("L") == -1)
        {
            this.ele.setAttribute('d', oldValue + " L" + oldValue.substr(oldValue.indexOf("M") + 1));
        }
        var obj = this.Record(true);
        if (this.onRecordHistory) this.onRecordHistory(this.RecordHistory_delete(obj.id), obj);
        return true;
    };
    this.Record = function (save)
    {
        //var tar = this.ele;
        var obj = this.CreateRecordBaseInfo(21, { "d": "d", "w": "stroke-width", "color": "stroke", "op": "stroke-opacity" });
        if (save)
        {
            obj.save = 1;
        }
        obj.tar = "";
        this.RecordHandle(obj);
        //console.log(this.name + ":Record done");
        return obj;
    }
    this.ShowSetting = function (isshow)
    {
        //console.log(this.name + ":ShowSetting:"+_selSize+","+_selColor);
        this.ShowColorSizeSetting(_selSize, _selColor, isshow);
    }
    this.AfterSelectSizeSetting = function (size)
    {
        _selSize = size;
    }
    this.AfterSelectColorSetting = function (color)
    {
        _selColor = color;
    }
}
Object.setPrototypeOf(ToolPen.prototype, ToolBase.prototype)

function ToolPenEx()
{
    ToolBase.call(this, "ToolPenEx");
    var _selSize = 1;
    var _selColor = "#ff0000";
    var _lastPoz = [0,0];
    var _nodeList = [];

    this.Init = function ()
    {
        //console.log("ToolPen init");
        if(this.deviceType == 0 && this.target) this.target.css({ "cursor": "url('" + this.ImagePath + "pencil.cur" + "'),default" });

    }
    this.onStart = function (x, y)
    {
        //console.log(this.name + ":onStart done");
        this.ele = this.CreateEle("path", { "isdraw": 'true', "tp": 'line', "style": 'fill:white;fill-opacity:0;stroke-linecap:round;', "stroke-width": _selSize, "stroke": _selColor });
        this.ele.setAttribute('d', "M" + x + "," + y);
        _lastPoz = [x, y];
        _nodeList=[[x, y]];
        //svg.appendChild(path);
        this.Append();
        this.CheckRecordStep(x, y);
        this.Record();
    };
    this.onMove = function (x, y)
    {
        //console.log(this.name + ":onMove done");
        if (_lastPoz[0] == x && _lastPoz[1] == y)
        {
            return true;
        }
        _lastPoz = [x, y];
        _nodeList.push([x, y]);
        var oldValue = this.ele.getAttributeNode("d").nodeValue;
        this.ele.setAttribute('d', oldValue + " L" + x + "," + y);

        if (this.CheckRecordStep(x, y))
        {
            this.Record();
        }
        return true;

    };
    this.onEnd = function (x, y)
    {
        //console.log(this.name + ":onEnd done");

        var oldValue = this.ele.getAttributeNode("d").nodeValue;
        if (oldValue.indexOf("L") == -1)
        {
            _nodeList.push([x, y]);
            this.ele.setAttribute('d', oldValue + " L" + oldValue.substr(oldValue.indexOf("M") + 1));
        }
        var obj = this.Record(true);
        if (this.onRecordHistory) this.onRecordHistory(this.RecordHistory_delete(obj.id), obj);
        _nodeList=[];
        return true;
    };
    this.Record = function (save)
    {
        //var tar = this.ele;
        var obj = null;
        if (save || _nodeList.length==0)
        {
            obj = this.CreateRecordBaseInfo(21, {"d":"d","w": "stroke-width", "color": "stroke", "op": "stroke-opacity" });

        }
        else
        {
            obj = this.CreateRecordBaseInfo(22, {"w": "stroke-width", "color": "stroke", "op": "stroke-opacity" });
            obj.d = _nodeList;
            _nodeList = [];
        }
        if (save)
        {
            obj.save = 1;
        }
        obj.tar = "";
        this.RecordHandle(obj);
        //console.log(this.name + ":Record done");
        return obj;
    }
    this.ShowSetting = function (isshow)
    {
        //console.log(this.name + ":ShowSetting:"+_selSize+","+_selColor);
        this.ShowColorSizeSetting(_selSize, _selColor, isshow);
    }
    this.AfterSelectSizeSetting = function (size)
    {
        _selSize = size;
    }
    this.AfterSelectColorSetting = function (color)
    {
        _selColor = color;
    }
}
Object.setPrototypeOf(ToolPenEx.prototype, ToolBase.prototype)


function ToolLine()
{
    ToolBase.call(this, "ToolLine");
    var _selLineColor = "#ff0000";
    var _selLineSize = 1;
    this.Init = function ()
    {
        if(this.deviceType == 0 && this.target) this.target.css({ "cursor": "url('" + this.ImagePath + "line.cur" + "'),default" });

    }
    this.onStart = function (x, y)
    {
        //console.log(this.name + ":onStart done");
        //this.ele = createPath();
        this.ele = this.CreateEle("path", { "isdraw": 'true', "tp": 'sline', "style": 'fill:white;fill-opacity:0;', "stroke-width": _selLineSize, "stroke": _selLineColor });
        this.ele.setAttribute('d', "M" + x + "," + y);
        this.Append();
        this.Record();
    };
    this.onMove = function (x, y)
    {
        //console.log(this.name + ":onMove done");
        var oldValue = this.ele.getAttributeNode("d").nodeValue;
        if (oldValue.indexOf("L") > -1)
        {
            oldValue = oldValue.substr(0, oldValue.indexOf("L") - 1);
        }
        this.ele.setAttribute('d', oldValue + " L" + x + "," + y);
        if (this.CheckRecordStep(x, y))
        {
            this.Record();
        }
        return true;
    };
    this.onEnd = function (x, y)
    {
        //console.log(this.name + ":onEnd done");
        var oldValue = this.ele.getAttributeNode("d").nodeValue;
        if (oldValue.indexOf("L") == -1)
        {
            this.ele.setAttribute('d', oldValue + " L" + oldValue.substr(oldValue.indexOf("M") + 1));
        }
        var obj = this.Record(true);
        if (this.onRecordHistory) this.onRecordHistory(this.RecordHistory_delete(obj.id),obj);
        return true;
    };
    this.Record = function (save)
    {
        //var tar = this.ele;
        var obj = this.CreateRecordBaseInfo(24, { "d": "d", "w": "stroke-width", "color": "stroke" });

        if (save)
        {
            obj.save = 1;
        }
        this.RecordHandle(obj);
        //console.log(this.name + ":Record done");
        return obj;
    };
    this.ShowSetting = function (isshow)
    {
        //console.log(this.name + ":ShowSetting:"+_selSize+","+_selColor);
        this.ShowColorSizeSetting(_selLineSize, _selLineColor, isshow);
    }
    this.AfterSelectSizeSetting = function (size)
    {
        _selLineSize = size;
    }
    this.AfterSelectColorSetting = function (color)
    {
        _selLineColor = color;
    }
}
Object.setPrototypeOf(ToolLine.prototype, ToolBase.prototype)

function ToolBrush()
{
    ToolBase.call(this, "ToolBrush");
    var _selSize = 6;
    var _selColor = "#ffff00";
    var _lastPoz = [0,0];

    this.Init = function ()
    {
        if(this.deviceType == 0 && this.target) this.target.css({ "cursor": "url('" + this.ImagePath + "brush.cur" + "'),default" });

    }
    this.onStart = function (x, y)
    {
        //console.log(this.name + ":onStart done");
        _lastPoz = [x, y];
        this.ele = this.CreateEle("path", { "isdraw": 'true', "tp": 'brush', "style": 'fill-opacity:0;stroke-opacity:0.5;stroke-linecap:round;', "stroke-width": (1 + _selSize * 4), "stroke": _selColor });
        this.ele.setAttribute('d', "M" + x + "," + y);
        //svg.appendChild(path);
        this.Append();
        this.Record();
    };
    this.onMove = function (x, y)
    {
        //console.log(this.name + ":onMove done");
        if (_lastPoz[0] == x && _lastPoz[1] == y)
        {
            return true;
        }
        _lastPoz = [x, y];
        var oldValue = this.ele.getAttributeNode("d").nodeValue;
        if (oldValue.length > 7870)
        {
            var obj = this.Record(true);
            if (this.onRecordHistory) this.onRecordHistory(this.RecordHistory_delete(obj.id),obj);
            this.ele = this.CreateEle("path", { "isdraw": 'true', "tp": 'brush', "style": 'fill-opacity:0;stroke-opacity:0.5;stroke-linecap:round;', "stroke-width": (1 + _selSize * 4), "stroke": _selColor });
            this.ele.setAttribute('d', "M"+ this.getLastNode(oldValue) +" L" + x + "," + y);
            this.Append();
            this.Record();
        }
        else
        {
            this.ele.setAttribute('d', oldValue + " L" + x + "," + y);
        }

        if (this.CheckRecordStep(x, y))
        {
            this.Record();
        }
        return true;
    };
    this.onEnd = function (x, y)
    {
        //console.log(this.name + ":onEnd done");

        var oldValue = this.ele.getAttributeNode("d").nodeValue;
        if (oldValue.indexOf("L") == -1)
        {
            this.ele.setAttribute('d', oldValue + " L" + oldValue.substr(oldValue.indexOf("M") + 1));
        }
        var obj = this.Record(true);
        if (this.onRecordHistory) this.onRecordHistory(this.RecordHistory_delete(obj.id),obj);
        return true;
    };
    this.Record = function (save)
    {
        //var tar = this.ele;
        var obj = this.CreateRecordBaseInfo(25, { "d": "d", "w": "stroke-width", "color": "stroke" });
        if (save)
        {
            obj.save = 1;
        }
        obj.tar = "";
        this.RecordHandle(obj);
        //console.log(this.name + ":Record done");
        return obj;
    }
    this.ShowSetting = function (isshow)
    {
        //console.log(this.name + ":ShowSetting:"+_selSize+","+_selColor);
        this.ShowColorSizeSetting(_selSize, _selColor, isshow);
    }
    this.AfterSelectSizeSetting = function (size)
    {
        _selSize = size;
    }
    this.AfterSelectColorSetting = function (color)
    {
        _selColor = color;
    }
}
Object.setPrototypeOf(ToolBrush.prototype, ToolBase.prototype)

function ToolText()
{
    ToolBase.call(this, "ToolText");

    var _selSize = 2;
    var _selColor = "#ff0000";
    var _selFont = "consolas";
    var _blurTimer = null;
    var _blurInputTimer = null;

    function moveEnd(obj){
        obj.focus();
        var len = obj.value.length;
        if (document.selection) {
            var sel = obj.createTextRange();
            sel.moveStart('character',len);
            sel.collapse();
            sel.select();
        } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
            obj.selectionStart = obj.selectionEnd = len;
        }
    }

    function setBaseSizeColor(size, color)
    {
        switch (size)
        {
            case 12:
                _selSize = 1;
                break;
            case 14:
                _selSize = 2;
                break;
            case 16:
                _selSize = 3;
                break;
            case 22:
                _selSize = 6;
                break;
            case 30:
                _selSize = 10;
                break;
            default:
                _selSize = 2;
        }
        switch (color)
        {
            case "rgb(149, 226, 124)":
                _selColor = "#95e27c";
                break;
        }
        var reg = /rgb\((\d*),\s?(\d*),\s(\d*)\)/ig;
        var arr = reg.exec(color);
        if (arr.length>=4)
        {
            //_selColor = "#" + parseInt(arr[1]).toString(16) + parseInt(arr[2]).toString(16) + parseInt(arr[3]).toString(16);
            _selColor= "#" + (arr[1]=="0"?"00": parseInt(arr[1]).toString(16)) + (arr[2]=="0"?"00": parseInt(arr[2]).toString(16)) + (arr[3]=="0"?"00": parseInt(arr[3]).toString(16));
        }
        else
        {
            _selColor = color;
        }
    }
    function getDiffSize(fsize, family)
    {
        //var dsize = fsize >= 20 ? 2 : 2;
        if(family=="sans-serif")
        {
            return fsize >= 26 ? -2 : -1;
        }
        var result = 2;
        if (fsize >= 20)
        {
            switch (family)
            {
                case "consolas":
                    result = 2;
                    break;
                case "monospace":
                    result = 4;
                    break;
                case "sans-serif":
                    result = -2;
                    break;
                case "serif":
                    result = 4;
                    break;
                case "cursive":
                    result = 4;
                    break;
            }
        }
        else
        {
            switch (family)
            {
                case "consolas":
                    result = 1;
                    break;
                case "monospace":
                    result = 2;
                    break;
                case "sans-serif":
                    result = 0;
                    break;
                case "serif":
                    result = 2;
                    break;
                case "cursive":
                    result = 2;
                    break;
            }
        }
        return result;
    }

    this.getFontSize=function()
    {
        if (_selSize == 1)
        {
            return "12px";
        }
        else if (_selSize == 2)
        {
            return "14px";
        }
        else if (_selSize == 3)
        {
            return "16px";
        }
        else if (_selSize == 6)
        {
            return "22px";
        }
        else if (_selSize == 10)
        {
            return "30px";
        }
        else
        {
            return "14px";
        }
    }

    this.Init = function ()
    {
        if(this.deviceType == 0 && this.target) this.target.css({ "cursor": "url('" + this.ImagePath + "text.cur" + "'),text" });

    }

    this.onClick = function (x, y)
    {
        this.SetTool("");
        var fsize = this.getFontSize();
        var lineheight = Math.round(parseFloat(fsize) * 1.2);
        this.ele = this.CreateEle("rect", { "isdraw": 'true', "tp": 'text', "style": 'fill:blue;stroke:blue;stroke-width:0;fill-opacity:0;' });
        this.ele.setAttribute('x', x);
        this.ele.setAttribute('y', y);
        this.ele.setAttribute('width', 200);
        this.ele.setAttribute('height', lineheight);
        this.Append();
        var id = this.ele.getAttributeNode("id").nodeValue;
        this.addNote(x, y, 200, lineheight, id);
        var g = $("#" + id);
        $("#" + id + ",#g_" + id).bind(this.EVENTCLICK, (e) => { this.ToEditMode(id); });
        this.Record();
        this.ToInputText(id, x, y, 200, lineheight);
        return true;
    }
    this.onStart = function (x, y)
    {

        //console.log(this.name + ":onStart done");
        this.ele = this.CreateEle("rect", { "isdraw": 'true', "tp": 'text', "style": 'fill:blue;stroke:blue;stroke-width:1;fill-opacity:0.1;', "width": 0, "height": 0 });
        this.ele.setAttribute('x', x);
        this.ele.setAttribute('y', y);
        this.ele.setAttribute('sx', x);
        this.ele.setAttribute('sy', y);

        this.Append();
        this.Record();
    };
    this.onMove = function (x, y)
    {
        //console.log(this.name + ":onMove done");

        var oldx = parseInt(this.ele.getAttributeNode("sx").nodeValue);
        var oldy = parseInt(this.ele.getAttributeNode("sy").nodeValue);

        var diffx = x - oldx;
        var diffy = y - oldy;

        if (diffx >= 0 && diffy >= 0)
        {
            this.ele.setAttribute('width', diffx);
            this.ele.setAttribute('height', diffy);
        }
        else if (diffx < 0 && diffy < 0)
        {
            this.ele.setAttribute('x', oldx + diffx);
            this.ele.setAttribute('y', oldy + diffy);
            this.ele.setAttribute('width', - diffx);
            this.ele.setAttribute('height', - diffy);
        }
        else if (diffx >= 0 && diffy < 0)
        {
            this.ele.setAttribute('y', oldy + diffy);
            this.ele.setAttribute('width', diffx);
            this.ele.setAttribute('height', - diffy);
        }
        else if (diffx < 0 && diffy >= 0)
        {
            this.ele.setAttribute('x', oldx + diffx);
            this.ele.setAttribute('width', - diffx);
            this.ele.setAttribute('height', diffy);
        }
        //this.Record();
        return true;
    };
    this.onEnd = function (x, y)
    {
        //console.log(this.name + ":onEnd done");
        this.ele.setAttribute('style', "fill:blue;stroke:blue;stroke-width:0;fill-opacity:0;");
        var x = parseInt(this.ele.getAttributeNode("x").nodeValue);
        var y = parseInt(this.ele.getAttributeNode("y").nodeValue);
        var width = parseInt(this.ele.getAttributeNode("width").nodeValue);
        var height = parseInt(this.ele.getAttributeNode("height").nodeValue);
        var fsize = this.getFontSize();
        var lineheight = Math.round(parseFloat(fsize) * 1.2);
        if (width < 20 && height < 20)
        {
            $(this.ele).remove();
            return false;
        }
        else
        {
            var id = this.ele.getAttributeNode("id").nodeValue;
            this.addNote(x, y, width, lineheight, id);
            var g = $("#" + id);
            $("#" + id + ",#g_" + id).bind(this.EVENTCLICK, (e) => { this.ToEditMode(id); });
        }
        //var obj = this.Record(true);
        // if (this.onRecordHistory)
        // {
        //     var arr = new Array();
        //     arr.push(this.RecordHistory_delete(obj.id));
        //     arr.push(this.RecordHistory_delete("g_"+obj.id));
        //     this.onRecordHistory(arr, obj);
        // }
        //this.EidtText($("#" + id), true);
        this.SetTool("");
        this.Record();

        this.ToInputText(id, x, y, width, lineheight);
        return true;
    };

    this.SaveInputText = function (id)
    {
        var objOld = this.Record(true,false);
        var fsize = $("#textarea-" + id).css("font-size").replace("px", "");
        var txt = $("#textarea-" + id).val();
        //console.log(txt);
        if(Trim(txt)=="")
        {
            $("#edit_" + id).remove();
            $("#g_" + id + ",#" + id).show();
            this.Delete();
            return;
        }
        var lines = this.SplitTextEx(txt,$("#textarea-" + id).width(),parseFloat(fsize),$("#textarea-" + id).css("font-family"));
        //console.log(lines);
        this.SaveText(lines,id);
        $("#edit_" + id).remove();
        $("#g_" + id + ",#" + id).show();
        var objNew =this.Record(true);
        if (objOld != null)
        {
            this.onRecordHistory(objOld, objNew);
            objOld = null;
        }
        this.SetActiveTool(null);
    };

    this.ToInputText=function(id,x,y,width,height)
    {
        $("#g_" + id+",#"+id).hide();
        var text = $("#g_" + id).find("text");
        //var fsize = this.getFontSize();
        var fsize = parseFloat(text.css("font-size").replace("px", ""));
        var fcolor = text.css("fill");
        var font = text.css("font-family");
        //console.log(fsize);
        var lineheight = Math.round(parseFloat(fsize) * 1.2);
        //console.log(text.find("tspan").text());
        var txt = text.find("tspan").text();
        var html = "<div id='edit_" + id + "' tabindex='21' style='position: absolute;background-color:white;border:dashed 2px #7d7b7b;touch-action: none;padding:1px; z-index:100; box-sizing:border-box; top: " + (y-3) + "px; left: " + (x-3) + "px; width: " + (width + 6) + "px;'>";
        html += "<textarea id='textarea-"+id+"' rows='1' placeholder='input text...' style='outline: none;overflow: hidden;resize: none;width:100%;box-sizing:border-box;font-family: "+font+";color:"+fcolor+";font-size:"+fsize+"px;line-height:"+lineheight+"px;border:0px;'>" + txt + "</textarea>";
        html += "</div>";
        this.container.append(html);
        var oldlines = this.SplitTextEx($("#textarea-" + id).val(), $("#textarea-" + id).width(), parseFloat(fsize),font);
        gid("textarea-" + id).rows = Math.max(oldlines.length,1);
        $("#textarea-" + id).focus();
        moveEnd(gid("textarea-" + id));
        var lastlen = 0, newlen = 0;
        var save = () =>
        {
            var fsize = $("#textarea-" + id).css("font-size").replace("px", "");
            var txt = $("#textarea-" + id).val();
            //console.log(txt);
            if(Trim(txt)=="")
            {
                $("#edit_" + id).remove();
                $("#g_" + id + ",#" + id).show();
                this.Delete();
                return;
            }
            var lines = this.SplitTextEx(txt,$("#textarea-" + id).width(),parseFloat(fsize),$("#textarea-" + id).css("font-family"));
            //console.log(lines);
            this.SaveText(lines,id);
            $("#edit_" + id).remove();
            $("#g_" + id + ",#" + id).show();
            var objNew =this.Record(true);
            if (objOld != null)
            {
                this.onRecordHistory(objOld, objNew);
                objOld = null;
            }
            this.SetActiveTool(null);
        };
        $("#textarea-" + id).bind("input", () =>
        {
            try
            {
                newlen = gid("textarea-" + id).value.length;
                if (newlen < lastlen)
                {
                    gid("textarea-" + id).rows = Math.max(gid("textarea-" + id).rows - 1, 1);
                }
                lastlen = newlen;
                //console.log("on input");
                if (gid("textarea-" + id).scrollHeight > gid("textarea-" + id).clientHeight)
                {
                    //console.log("on changline");
                    //("#edit_" + id).height($("#edit_" + id).height() + 20);
                    gid("textarea-" + id).rows += 1;
                }
                else if (gid("textarea-" + id).scrollHeight < gid("textarea-" + id).clientHeight)
                {
                    //console.log("on changline");
                    //$("#edit_" + id).height($("#edit_" + id).height() - 20);
                    gid("textarea-" + id).rows -= 1;
                }
            }
            catch (ex)
            {
                console.log(ex);
            }
        }).bind("blur", () =>
        {
            if (_blurInputTimer) clearTimeout(_blurInputTimer);
            _blurInputTimer = setTimeout(()=>{this.SaveInputText(id)}, 300);
        }).bind("focus", function ()
        {
            if (_blurInputTimer) clearTimeout(_blurInputTimer);
        });
        this.SetActiveTool(this);
    }
    this.ToEditMode = function (id)
    {
        //console.log("ToEditMode:" + id);
        var g = $("#g_" + id);
        var text = $("#g_" + id).find("text");
        var rect = $("#" + id);
        var BoxSize = 3;
        var x = parseInt(rect.attr("x"));
        var y = parseInt(rect.attr("y"));
        var width = parseInt(rect.attr("width"));
        var height = parseInt(rect.attr("height"));
        var fsize = parseFloat(text.css("font-size").replace("px", ""));
        var fcolor = text.css("fill");
        var font = text.css("font-family");
        setBaseSizeColor(fsize, fcolor);
        var lineheight = Math.round(fsize * 1.2);
        var txt = text.find("tspan").text().replace(/\n/ig, "<br>").replace(/\r\n/ig, "<br>");
        var html = "<div id='move_" + id + "' tabindex='21' style='position: absolute;border:solid 2px blue;touch-action: none;background-color: white;padding:1px; z-index:100; box-sizing:border-box; top: " + (y-BoxSize) + "px; left: " + (x-BoxSize) + "px; width: " + (width + BoxSize*2) + "px;'>";
        html += "<div "+this.EVENTRESIZE+"=\"Resize(document.getElementById('move_" + id + "'), event, 'w', 80, 80);\" style='position: absolute;cursor:w-resize;left: -9px;top: calc(50% - 8px);background-color: blue;width: 16px;height: 16px;padding:0px;border:0px;display: inline-block;border-radius: 50%;'></div>";
        html +=" <div "+this.EVENTRESIZE+"=\"Resize(document.getElementById('move_" + id + "'), event, 'e', 80, 80);\" style='position: absolute;cursor:e-resize;right: -9px;top: calc(50% - 8px);background-color: blue;width: 16px;height: 16px;padding:0px;border:0px;display: inline-block;border-radius: 50%;'></div>";
        html += "<div id='text_" + id + "' style='cursor:move;text-align:left;width:100%;box-sizing:border-box;word-wrap:break-word;word-break:break-all;font-family: "+font+";color:" + fcolor + ";font-size:" + fsize + "px;line-height:" + lineheight + "px;border:0px;'>" + txt + "</div>";
        html += "</div>";
        this.container.append(html);
        rect.hide();
        $("#g_" + id).hide();
        var div = gid("move_" + id);
        Drag.init(gid("text_" + id), div, 5, null, 5, null);
        var objOld = null;
        var ismove = false;
        div.onDrag = () =>
        {
            //console.log("on drag");
            ismove = true;
            if (objOld == null) objOld = this.Record(true, false);

        };
        div.onDragEnd = () =>
        {
            //ismove = false;
            //console.log("on dragend");
            // var oldx = parseInt(rect.attr("x"));
            // var oldy = parseInt(rect.attr("y"));
            var newX = parseInt(div.style.left) + BoxSize;
            var newY = parseInt(div.style.top) + BoxSize;
            // var diffx = newX - oldx;
            // var diffy = newY - oldy;
            rect.attr("x", newX);
            rect.attr("y", newY);
            text.attr("x", newX);
            text.attr("y", newY);
            //console.log("onDragEnd:" + diffx + "," + diffy);
            //console.log(g.find("tspan").length);
            var fsize = parseFloat(text.css("font-size").replace("px", ""));
            var font = text.css("font-family");
            var dsize = getDiffSize(fsize,font);

            var lineheight = Math.round(fsize * 1.2);
            g.find("tspan").each(function(i)
            {
                //console.log($(this).attr("id"));
                $(this).attr("x", newX-0.5);
                $(this).attr("y",newY+fsize-dsize + lineheight * i);
            });

            var objNew = this.Record(true);
            if (objOld != null)
            {
                this.onRecordHistory(objOld, objNew);
                objOld = null;
            }
        };
        div.onSizeChanging = () =>
        {
            //console.log("onSizeChange");
            ismove = true;
            if (objOld == null) objOld = this.Record(true, false);
        };
        div.onSizeChanged = () =>
        {
            var newX = parseInt(div.style.left) + BoxSize;
            var newY = parseInt(div.style.top) + BoxSize;
            var newWidth = parseInt(div.style.width)-BoxSize*2;
            var newHeight = $("#text_" + id).height();
            rect.attr("x", newX);
            rect.attr("y", newY);
            rect.attr("width", newWidth);
            rect.attr("height", newHeight);
            text.attr("x", newX);
            text.attr("y", newY);
            var fsize = $("#text_" + id).css("font-size").replace("px", "");
            var font = $("#text_" + id).css("font-family");
            var txt = $("#text_" + id).html().replace(/<br>/ig,"\n").replace(/<br \/>/ig,"\n");
            var lines = this.SplitTextEx(txt,$("#text_" + id).width(),parseFloat(fsize),font);
            this.SaveText(lines, id);
            var objNew = this.Record(true);
            if (objOld != null)
            {
                this.onRecordHistory(objOld, objNew);
                objOld = null;
            }
        };

        var save = () =>
        {
            $("#move_" + id).remove();
            $("#g_" + id + ",#" + id).show();
            this.SetActiveTool(null);
            this.ShowSetting(false);
        }

        $(div).bind("blur", function ()
        {
            if (_blurTimer) clearTimeout(_blurTimer);
            _blurTimer = setTimeout(save, 300);
        }).bind("focus", function ()
        {
            if (_blurTimer) clearTimeout(_blurTimer);
        }).bind(this.EVENTCLICK, () =>
        {
            //console.log("to edit text mode:"+ismove);
            if (ismove == false)
            {
                //console.log("to edit text mode");
                $("#move_" + id).remove();
                var newX = parseInt(div.style.left) + BoxSize;
                var newY = parseInt(div.style.top) + BoxSize;
                var newWidth = $(div).width() - BoxSize * 2;
                var newHeight = $(div).height() - BoxSize * 2;
                this.ToInputText(id,newX,newY,newWidth,newHeight);

            }
            ismove = false;
        });
        $(div).focus();
        this.SetActiveTool(this);
    }
    this.SaveText=function (lines,id){
        var text = $("#g_" + id).find("text");
        var rect = $("#" + id);
        text.html("");
        var x = text.attr("x");
        var y = text.attr("y");
        var fsize = parseFloat(text.css("font-size").replace("px", ""));
        var font = text.css("font-family");
        var dsize = getDiffSize(fsize,font);
        var lineheight = Math.round(fsize * 1.2);
        rect[0].setAttribute('height', lineheight*lines.length);
        for (var i = 0; i < lines.length; i++)
        {
            var span = this.CreateEle("tspan");
            span.setAttribute('x', parseInt(x, 10)-0.5);
            span.setAttribute('y', parseInt(y, 10) + fsize-dsize + lineheight * i);
            span.innerHTML = lines[i];
            text.append(span);
        }
    }
    this.SaveColor = function (color)
    {
        var objOld = this.Record(true, false);
        var id = $(this.ele).attr("id");
        $("#g_" + id).find("text").css("fill", color);
        $("#text_"+id).css("color", color);

        var objNew = this.Record(true);
        this.onRecordHistory(objOld, objNew);
    }
    this.SaveSize = function (size)
    {
        var objOld = this.Record(true, false);
        var id = $(this.ele).attr("id");
        var text = $("#g_" + id).find("text");
        var strFsize = this.getFontSize();
        text.css("font-size", strFsize);
        var fsize = parseFloat(strFsize.replace("px", ""));
        var font = text.css("font-family");
        var lineheight = Math.round(fsize * 1.2);
        $("#text_" + id).css({ "font-size":strFsize, "line-height":lineheight+"px"});
        var txt = text.find("tspan").text();
        var lines = this.SplitTextEx(txt,$("#" + id).width(),fsize,font);
        this.SaveText(lines, id);
        var objNew = this.Record(true);
        if (objOld != null)
        {
            this.onRecordHistory(objOld, objNew);
            objOld = null;
        }
    }
    this.SaveFont = function (font)
    {
        var objOld = this.Record(true, false);
        var id = $(this.ele).attr("id");
        var text = $("#g_" + id).find("text");
        var strFsize = this.getFontSize();
        text.css("font-family", font);
        var fsize = parseFloat(strFsize.replace("px", ""));
        var lineheight = Math.round(fsize * 1.2);
        $("#text_" + id).css({ "font-family":font});
        var txt = text.find("tspan").text();
        var lines = this.SplitTextEx(txt,$("#" + id).width(),fsize,font);
        this.SaveText(lines, id);
        var objNew = this.Record(true);
        if (objOld != null)
        {
            this.onRecordHistory(objOld, objNew);
            objOld = null;
        }
    }

    this.Delete = function ()
    {
        this.SetActiveTool(null);
        if (!this.ele) return false;
        var obj = this.Record(true,false);
        if (this.onRecordHistory)
        {
            var arr = new Array();
            arr.push(this.RecordHistory_delete(obj.id));
            arr.push(this.RecordHistory_delete("g_"+obj.id));
            this.onRecordHistory(obj,arr);
        }
        var id = this.ele.id;
        this.Record_delete(id);
        this.Record_delete("g_" + id);
        $("#" + id).remove();
        $("#edit_" + id).remove();
        $("#g_" + id).remove();
        $("#editnote").hide();
        return true;
    }
    this.addNote = function (x, y, width, height, pid)
    {
        var g = this.CreateEle("g", { "isdraw": 'true', "id": "g_" + pid });
        this.target.append(g);
        var text = this.CreateEle("text", { "x": x, "y": y , "style": "fill:"+_selColor+";font-size:"+this.getFontSize()+";font-family:"+_selFont+";" });
        text.innerHTML = "";
        g.appendChild(text);
    };
    this.EidtText = function (g, toedittext)
    {
        //console.log("EidtText");

        var BoxSize = 12;
        if (this.deviceType != 0)
        {
            BoxSize = 25;
        }
        var text = $("#g_" + $(g).attr("id")).find("text");
        var rect = $(g);
        var x = parseInt(rect.attr("x"));
        var y = parseInt(rect.attr("y"));
        var width = parseInt(rect.attr("width"));
        var height = parseInt(rect.attr("height"));
        var pozdiff = 50;
        var menuhtml = `<div id="editnote" style="position:absolute; left:10px; top:10px; float:left; z-index:201;">
        <div class="editnotemenu" style="background-color:black;border-radius:5px; color:white; height:24px;">
          <ul>
            <li id="editnote_delete">${this.Text.Delete}</li>
            <li id="editnote_edit">${this.Text.Edit}</li>
          </ul>
        </div>
        <div style="padding:8px 0px 0px 20px; text-align:left;">
          <span style="width:0;height:0;border-left: 5px solid transparent;border-right: 5px solid transparent;border-top: 10px solid black;"></span>
        </div>
      </div>`;
        if ($("#editnote").length > 0)
        {
            $("#editnote").remove();
        }
        this.main.append(menuhtml);
        $("#editnote").attr("tar", g.attr("id")).attr("tp", "text").css({ "left": x - this._drawGetLeft() + "px", "top": y - this._drawGetTop() - pozdiff+ this.main.scrollTop() + "px" }).show();

        var html = "<div id='edit_" + $(g).attr("ID") + "' tabindex='21' style='position: absolute;touch-action: none; z-index:100; box-sizing:border-box; top: " + (y - BoxSize) + "px; left: " + (x - BoxSize) + "px; width: " + (width + BoxSize * 2) + "px; height: " + (height + BoxSize * 2) + "px; '><table style='width:100%;height:100%;' cellspacing='0' cellpadding='0' border='0'><tr style='height:" + BoxSize + "px;'><td "+this.EVENTRESIZE+"=\"Resize(document.getElementById('edit_" + $(g).attr("ID") + "'), event, 'nw', 80, 80);\" style='width:" + BoxSize + "px;' class='resizebg_nw'></td><td></td><td style='width:" + BoxSize + "px;' class='resizebg_ne' "+this.EVENTRESIZE+"=\"Resize(document.getElementById('edit_" + $(g).attr("ID") + "'), event, 'ne', 80, 80);\"></td></tr><tr><td></td><td style='height:100%;'><div style=\"cursor:move;width:100%;height:100%;border:1px solid blue; text-align:left; padding:0px 0px 0px 2px;background-color:white;box-sizing:border-box;word-break:break-all; font-size:14px;font-family: 'Consolas';\" class='container'>";
        //html += "<div class='editor' style='width:100%; height:" + (height) + "px;'><textarea name='textarea-1' id='textarea-1' style='width:100%; height:100%;box-sizing:border-box;font-size:12px;border:0px;'>" + text.text() + "</textarea></div>";
        html += text.text().replace(/\r\n/ig, "<br />").replace(/\n/ig, "<br />");
        html += "</div>";
        html += "</td><td></td></tr><tr style='height:" + BoxSize + "px;'><td "+this.EVENTRESIZE+"=\"Resize(document.getElementById('edit_" + $(g).attr("ID") + "'), event, 'sw', 80, 80);\" style='width:" + BoxSize + "px;' class='resizebg_sw'></td><td></td><td style='width:" + BoxSize + "px;' class='resizebg_se' "+this.EVENTRESIZE+"=\"Resize(document.getElementById('edit_" + $(g).attr("ID") + "'), event, 'se', 80, 80);\"></td></tr><table></div></div>"
        this.container.append(html);
        var div = $("#edit_" + $(g).attr("ID"));

        Drag.init(div.find("div.container")[0], div[0], -BoxSize, null, -BoxSize, null);
        var objOld = null;
        div[0].onDrag = () =>
        {
            if (objOld == null)objOld = this.Record(true,false);
            $("#editnote").hide();
            var newX = parseInt(div[0].style.left) + BoxSize;
            var newY = parseInt(div[0].style.top) + BoxSize;
            var newWidth = parseInt(div[0].style.width) - BoxSize * 2;
            var newHeight = parseInt(div[0].style.height) - BoxSize * 2;
            rect.attr("x", newX);
            rect.attr("y", newY);
            rect.attr("width", newWidth);
            rect.attr("height", newHeight);
            //Record_text($(g)[0]);
            //this.Record(true);
        };
        div[0].onDragEnd = () =>
        {
            var newX = parseInt(div[0].style.left) + BoxSize;
            var newY = parseInt(div[0].style.top) + BoxSize;
            var newWidth = parseInt(div[0].style.width) - BoxSize * 2;
            var newHeight = parseInt(div[0].style.height) - BoxSize * 2;
            rect.attr("x", newX);
            rect.attr("y", newY);
            rect.attr("width", newWidth);
            rect.attr("height", newHeight);
            text.attr("x", newX + 1);
            text.attr("y", newY + 1);
            //alert(text.find("tspan").length);
            text.find("tspan").each(function (i)
            {
                $(this).attr("x", newX + 1);
                $(this).attr("y", newY + 10 + 20 * i);
            });
            $("#editnote").css({ "left": newX - this._drawGetLeft() + "px", "top": (newY - pozdiff - this._drawGetTop()+ this.main.scrollTop()) + "px" }).show();

            //Record_text($(g)[0],false,true);
            var objNew = this.Record(true);
            if (objOld != null)
            {
                this.onRecordHistory(objOld, objNew);
                objOld = null;
            }
        };
        div[0].onSizeChange = () =>
        {
            if (objOld == null)objOld = this.Record(true,false);
            $("#editnote").hide();
            height = parseInt(div[0].style.height);
            div.find("div.editor").height(height - 43);
        };
        div[0].onSizeChanged = () =>
        {
            if (objOld == null)objOld = this.Record(true,false);
            $("#editnote").hide();
            var newX = parseInt(div[0].style.left);
            var newY = parseInt(div[0].style.top);
            var newWidth = parseInt(div[0].style.width);
            var newHeight = parseInt(div[0].style.height);

            rect.attr("x", newX + BoxSize);
            rect.attr("y", newY + BoxSize);
            rect.attr("width", newWidth - BoxSize * 2);
            rect.attr("height", newHeight - BoxSize * 2);
            $("#editnote").css({ "left": newX + BoxSize - this._drawGetLeft() + "px", "top": (newY + BoxSize - pozdiff - this._drawGetTop()+ this.main.scrollTop()) + "px" }).show();
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_text($(g)[0],false,true);
            var objNew =this.Record(true);
            if (objOld != null)
            {
                this.onRecordHistory(objOld, objNew);
                objOld = null;
            }
        };

        $("#g_" + $(g).attr("id")).hide();
        $(g).hide();

        var save = () =>
        {
            //console.log("text save");
            var newtext = text.text();
            if (Trim(newtext) == "")
            {
                deletenote();
                return;
            }
            x = rect.attr("x");
            y = rect.attr("y");
            var width = parseInt(rect.attr("width"));
            //alert(newtext);
            //$(g).find("text").html(newtext);
            var lines = this.SplitText(newtext, width);
            //alert(lines[0]);
            //alert(lines[1]);
            text.html("");
            for (var i = 0; i < lines.length; i++)
            {
                var span = this.CreateEle("tspan");
                span.setAttribute('x', parseInt(x, 10) + 1);
                span.setAttribute('y', parseInt(y, 10) + 10 + 20 * i);
                span.innerHTML = lines[i];
                text.append(span);
            }
            div.remove();
            g.show();
            $("#g_" + $(g).attr("id")).show();
            $("#editnote").hide();
            //Record_text($(g)[0],false,true);
            var obj = this.Record(true);
            // if (this.onRecordHistory)
            // {
            //     var arr = new Array();
            //     arr.push(this.RecordHistory_delete(obj.id));
            //     arr.push(this.RecordHistory_delete("g_"+obj.id));
            //     this.onRecordHistory(arr, obj);
            // }
            this.SetActiveTool(null);
        };
        var deletenote = () =>
        {
            var obj = this.Record(true,false);
            if (this.onRecordHistory)
            {
                var arr = new Array();
                arr.push(this.RecordHistory_delete(obj.id));
                arr.push(this.RecordHistory_delete("g_"+obj.id));
                this.onRecordHistory(obj,arr);
            }
            if (timer) clearTimeout(timer);
            this.Record_delete($(g).attr("id"));
            this.Record_delete("g_" + $(g).attr("id"));
            div.remove();
            g.remove();
            $("#g_" + $(g).attr("id")).remove();
            $("#editnote").hide();
            this.SetActiveTool(null);
        };
        var SaveNote = (e) =>
        {
            var objOld =this.Record(true,false);
            $("#editnotetext").hide();
            var txt = $("#editnote_content").val();
            var rectid = $("#editnote").attr("tar");
            var tp = $("#editnote").attr("tp");
            var rect = $("#" + rectid);
            var width = parseInt(rect.attr("width"));
            var lines = this.SplitText(txt, width);
            var text = $("#g_" + rectid).find("text");
            var x = text.attr("x");
            var y = text.attr("y");
            text.html("");
            for (var i = 0; i < lines.length; i++)
            {
                var span = this.CreateEle("tspan");
                span.setAttribute('x', parseInt(x, 10) + 5);
                span.setAttribute('y', parseInt(y, 10) + 5 + 20 * i);
                span.innerHTML = lines[i];
                text.append(span);
            }
            var objNew =this.Record(true);
            this.onRecordHistory(objOld, objNew);
            $("#editnotetext").remove();
            this.SetActiveTool(null);
        }
        var editnote = (e) =>
        {
            if (timer) clearTimeout(timer);
            div.remove();
            g.show();
            $("#g_" + $(g).attr("id")).show();
            $("#editnote").hide();
            var html = `<div id="editnotetext" tabindex="51" style="position:absolute; z-index:20000; left:0px; top:0px; width:500px; height:400px; padding:2px; background-color:white; border:solid 1px #000;">
                <div style="width:100%; height:100%;">
                <div style="height:40px; width:100%; text-align:left;">
                    <span style="border:1px solid #ccc;border-radius: 4px;cursor:pointer;display:inline-block;padding:5px;" id="btnCancelNote">${this.Text.Cancel}</span>
                    <span style=" float:right;border:1px solid #ccc;border-radius:4px;cursor:pointer;display:inline-block;padding:5px;" id="btnSaveNote">${this.Text.Save}</span>
                </div>
                <div style="width:100%;">
                    <textarea style="width:100%; height:360px;resize:none;overflow-y:auto;font-family: 'Consolas';" rows="10" id="editnote_content"></textarea>
                </div>
                </div>
            </div>`;
            if ($("#editnotetext").length > 0)
            {
                $("#editnotetext").remove();
            }
            this.main.append(html);
            var showx = x;
            var showy = -this._drawGetTop() + y;
            showx = Math.max(0, showx);
            showy = Math.max(0, showy);
            showx = Math.min(this.getViewWidth() - 510, showx);
            showy = Math.min(this.getViewHeight() - 410, showy);

            $("#editnotetext").show().css({ "left": showx + "px", "top": showy + "px" });
            if (this.deviceType != 0)
            {
                $("#editnotetext").css({ "left": "0px","top":"0px","width":"calc(100% - 8px)", "height": "100%" });
            }
            $("#editnote_content").val(text.text()).focus();
            $("#btnSaveNote").bind(this.EVENTCLICK, SaveNote);
            $("#btnCancelNote").bind(this.EVENTCLICK, (evt) =>
            {
                $("#editnotetext").remove();
            });
            this.SetActiveTool(null);
        };
        var timer = null;
        div.bind("blur", function ()
        {
            if (timer) clearTimeout(timer);
            timer = setTimeout(save, 300);
        }).bind("focus", function ()
        {
            if (timer) clearTimeout(timer);
        });

        $("#editnote").unbind().bind("click", function (e)
        {
            var tar = $(e.originalEvent.target);
            switch (tar.attr("id"))
            {
                case "editnote_delete":
                    deletenote();
                    break;
                case "editnote_edit":
                    editnote(e);
                    break;
                case "editnote_color":
                    break;
                case "editnote_fontsize":
                    break;
                default:
                    if (timer) clearTimeout(timer);
                    break;
            }
        });

        div.focus();
        this.SetActiveTool(this);

    }
    this.Record = function (save,handle=true)
    {
        //var tar = this.ele;
        var obj = this.CreateRecordBaseInfo(28, { "x": "x", "y": "y", "width": "width", "height": "height" });
        if (gid("g_" + obj.id))
        {
            var g = $("#g_" + obj.id);
            var rect = g.find("text");
            obj.Rect = new Object();
            obj.Rect.x = parseInt(rect.attr("x"));
            obj.Rect.y = parseInt(rect.attr("y"));
            obj.Rect.text = base64encode(utf16to8(g.find("text").text()));
            obj.Rect.color = g.find("text").css("fill");
            obj.Rect.size = parseFloat(g.find("text").css("font-size").replace("px", ""));
            obj.Rect.font = g.find("text").css("font-family");
        }
        if (save)
        {
            obj.save = 1;
        }
        obj.tar = "";
        if (handle)
        {
            this.RecordHandle(obj);
        }
        //console.log(this.name + ":Record done");
        return obj;
    }
    this.ShowSetting = function (isshow)
    {
        //console.log(this.name + ":ShowSetting:"+_selSize+","+_selColor);
        this.ShowColorSizeSetting(_selSize, _selColor, isshow,false,_selFont);
    }
    this.SetActive=function()
    {
        if (_blurTimer) clearTimeout(_blurTimer);
        _blurTimer = null;
        //console.log(_blurInputTimer);
        if (_blurInputTimer)
        {
            clearTimeout(_blurInputTimer);
            _blurInputTimer = null;
            if (this.ele)
            {
                var id = $(this.ele).attr("id");
                if ($("#edit_" + id).length > 0)
                {
                    this.SaveInputText(id);
                    this.ToEditMode(id);
                }
            }
        }

        //console.log("SetActive:"+$(this.ele).attr("id"))
        $("#move_"+$(this.ele).attr("id")).focus();
    }

    this.AfterSelectSizeSetting = function (size)
    {
        //console.log("AfterSelectSizeSetting:"+size);
        _selSize = size;
        if (this.ele)
        {
            this.SetActive();
            this.SaveSize(size);
        }
    }
    this.AfterSelectColorSetting = function (color)
    {
        //console.log("AfterSelectColorSetting:"+color);
        _selColor = color;
        if (this.ele)
        {
            this.SetActive();
            this.SaveColor(color);
        }

    }
    this.AfterSelectFontSetting = function (font)
    {
        //console.log("AfterSelectFontSetting:" + font);
        _selFont = font;
        if (this.ele)
        {
            this.SetActive();
            this.SaveFont(font);
        }
    }
}
Object.setPrototypeOf(ToolText.prototype, ToolBase.prototype)

function ToolNote()
{
    ToolBase.call(this, "ToolNote");

    var _selSize = 14;
    var _selColor = "#000000";
    var _selFont = "consolas";
    var _blurTimer = null;
    var _blurInputTimer = null;

    function moveEnd(obj){
        obj.focus();
        var len = obj.value.length;
        if (document.selection) {
            var sel = obj.createTextRange();
            sel.moveStart('character',len);
            sel.collapse();
            sel.select();
        } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
            obj.selectionStart = obj.selectionEnd = len;
        }
    }
    function setBaseSizeColor(size, color)
    {
        //console.log("setBaseSizeColor:"+color);
        switch (size)
        {
            case 12:
                _selSize = 1;
                break;
            case 14:
                _selSize = 2;
                break;
            case 16:
                _selSize = 3;
                break;
            case 22:
                _selSize = 6;
                break;
            case 30:
                _selSize = 10;
                break;
            default:
                _selSize = 2;
        }
        switch (color)
        {
            case "rgb(149, 226, 124)":
                _selColor = "#95e27c";
                break;
        }
        var reg = /rgb\((\d*),\s?(\d*),\s(\d*)\)/ig;
        var arr = reg.exec(color);
        if (arr.length>=4)
        {
            _selColor= "#" + (arr[1]=="0"?"00": parseInt(arr[1]).toString(16)) + (arr[2]=="0"?"00": parseInt(arr[2]).toString(16)) + (arr[3]=="0"?"00": parseInt(arr[3]).toString(16));
        }
        else
        {
            _selColor = color;
        }
    }
    function getDiffSize(fsize, family)
    {
        //var dsize = fsize >= 20 ? 2 : 2;
        if(family=="sans-serif")
        {
            return fsize >= 26 ? -2 : -1;
        }
        var result = 2;
        if (fsize >= 20)
        {
            switch (family)
            {
                case "consolas":
                    result = 2;
                    break;
                case "monospace":
                    result = 4;
                    break;
                case "sans-serif":
                    result = -2;
                    break;
                case "serif":
                    result = 4;
                    break;
                case "cursive":
                    result = 4;
                    break;
            }
        }
        else
        {
            switch (family)
            {
                case "consolas":
                    result = 1;
                    break;
                case "monospace":
                    result = 2;
                    break;
                case "sans-serif":
                    result = 0;
                    break;
                case "serif":
                    result = 2;
                    break;
                case "cursive":
                    result = 2;
                    break;
            }
        }
        return result;
    }

    this.getFontSize=function()
    {
        if (_selSize == 1)
        {
            return "12px";
        }
        else if (_selSize == 2)
        {
            return "14px";
        }
        else if (_selSize == 3)
        {
            return "16px";
        }
        else if (_selSize == 6)
        {
            return "22px";
        }
        else if (_selSize == 10)
        {
            return "30px";
        }
        else
        {
            return "14px";
        }
    }
    this.onClick = function (x, y)
    {
        this.SetTool("");
        var fsize = this.getFontSize();
        var lineheight = Math.round(parseFloat(fsize) * 1.2);
        this.ele = this.CreateEle("rect", { "isdraw": 'true', "tp": 'note', "style": 'fill:blue;stroke:blue;stroke-width:1;fill-opacity:0.1;z-index:102;'});
        this.ele.setAttribute('x', x-50);
        this.ele.setAttribute('y', y-25);
        this.ele.setAttribute('width', 100);
        this.ele.setAttribute('height', 50);
        this.Append();
        var id = this.ele.getAttributeNode("id").nodeValue;
        this.addNote(x-50, y-25, 100, 50, id);
        var g = $("#g_" + id);
        $("#" + id).bind(this.EVENTCLICK, (e) =>
        {
            $("#g_" + id).toggle();
            this.Record(true);
        });
        $(g).bind(this.EVENTCLICK, (e) => { this.EidtAnnotation(g, false); });

        var obj = this.Record(true);
        if (this.onRecordHistory)
        {
            this.onRecordHistory(this.RecordHistory_delete(obj.id), obj);
        }
        this.EidtAnnotation($("#g_" + id), true);
        this.SetTool("");
        return true;
    }
    this.onStart = function (x, y)
    {
        //console.log(this.name + ":onStart done");
        this.ele = this.CreateEle("rect", { "isdraw": 'true', "tp": 'note', "style": 'fill:blue;stroke:blue;stroke-width:1;fill-opacity:0.1;z-index:102;', "width": 0, "height": 0 });
        this.ele.setAttribute('x', x);
        this.ele.setAttribute('y', y);
        this.ele.setAttribute('sx', x);
        this.ele.setAttribute('sy', y);

        this.Append();
        this.Record();
    };
    this.onMove = function (x, y)
    {
        //console.log(this.name + ":onMove done");

        var oldx = parseInt(this.ele.getAttributeNode("sx").nodeValue);
        var oldy = parseInt(this.ele.getAttributeNode("sy").nodeValue);

        var diffx = x - oldx;
        var diffy = y - oldy;

        if (diffx >= 0 && diffy >= 0)
        {
            this.ele.setAttribute('width', diffx);
            this.ele.setAttribute('height', diffy);
        }
        else if (diffx < 0 && diffy < 0)
        {
            this.ele.setAttribute('x', oldx + diffx);
            this.ele.setAttribute('y', oldy + diffy);
            this.ele.setAttribute('width', - diffx);
            this.ele.setAttribute('height', - diffy);
        }
        else if (diffx >= 0 && diffy < 0)
        {
            this.ele.setAttribute('y', oldy + diffy);
            this.ele.setAttribute('width', diffx);
            this.ele.setAttribute('height', - diffy);
        }
        else if (diffx < 0 && diffy >= 0)
        {
            this.ele.setAttribute('x', oldx + diffx);
            this.ele.setAttribute('width', - diffx);
            this.ele.setAttribute('height', diffy);
        }
        //this.Record();
        return true;
    };
    this.onEnd = function (x, y)
    {
        //console.log(this.name + ":onEnd done");
        var x = parseInt(this.ele.getAttributeNode("x").nodeValue);
        var y = parseInt(this.ele.getAttributeNode("y").nodeValue);
        var width = parseInt(this.ele.getAttributeNode("width").nodeValue);
        var height = parseInt(this.ele.getAttributeNode("height").nodeValue);
        if (width < 20 && height < 20)
        {
            $(this.ele).remove();
            return false;
        }
        else
        {
            var id = this.ele.getAttributeNode("id").nodeValue;
            this.addNote(x, y, width, height, id);
            var g = $("#g_" + id);
            $("#" + id).bind(this.EVENTCLICK, (e) =>
            {
                $("#g_" + id).toggle();
                this.Record(true);
            });
            $(g).bind(this.EVENTCLICK, (e) => { this.EidtAnnotation(g, false); });
        }
        var obj = this.Record(true);
        if (this.onRecordHistory)
        {
            this.onRecordHistory(this.RecordHistory_delete(obj.id), obj);
        }
        this.EidtAnnotation($("#g_" + id), true);
        this.SetTool("");
        return true;
    };
    this.Delete = function ()
    {
        this.SetActiveTool(null);
        if (!this.ele) return false;
        var obj = this.Record(true,false);
        if (this.onRecordHistory)
        {
            this.onRecordHistory(obj,this.RecordHistory_delete(obj.id));
        }
        var id = this.ele.id;
        this.Record_delete(id);
        $("#" + id).remove();
        $("#orp_" + id).remove();
        $("#or_" + id).remove();
        $("#g_" + id).remove();
        $("#eidt_" + id).remove();
        $("#editnote").hide();
        return true;
    }
    this.addNote = function (x, y, width, height, pid)
    {
        var left = 0;//this._drawGetLeft();
        var top = 0;//this._drawGetTop();
        var rectx = 0, recty = 0, rectwidth = 200, rectheight = 120;
        var bWidth = this.getContainerWidth();// $(document.body).width();
        //console.log("addNote left:"+left);
        var fromx, fromy, tox, toy;
        if (y - top >= 270)//上
        {
            if (x + width / 2 - left > bWidth / 2)//左
            {
                rectx = x + width - left - rectwidth;
                if (rectx < 10) rectx = 10;
                recty = y - rectheight - 50;
            }
            else//右
            {
                rectx = x + width / 2 ;
                if (rectx + rectwidth + 10 > bWidth)
                {
                    rectx = bWidth - rectwidth - 10;
                }
                recty = y - rectheight - 50;
            }
            tox = rectx + rectwidth / 2;
            toy = recty + rectheight;
            fromx = x + width / 2;
            fromy = y;
        }
        else//下
        {
            if (x + width / 2 - left > bWidth / 2)//左
            {
                rectx = x + width  - left - rectwidth ;
                if (rectx < 10) rectx = 10;
                recty = y + height + 50;
            }
            else//右
            {
                rectx = x + width / 2 ;
                if (rectx + rectwidth + 10 > bWidth)
                {
                    rectx = bWidth - rectwidth - 10;
                }
                recty = y + height + 50;
            }
            tox = rectx + rectwidth / 2;
            toy = recty;
            fromx = x + width / 2;
            fromy = y + height;
        }
        var g = this.CreateEle("g");
        g.setAttribute('id', "g_" + pid);
        g.setAttribute('isdraw', 'true');
        this.target.append(g);
        var path = this.CreateEle("rect");
        path.setAttribute('style', "fill:white;stroke:blue;stroke-width:1;fill-opacity:0.3;");
        path.setAttribute('x', rectx);
        path.setAttribute('y', recty);
        path.setAttribute('width', rectwidth);
        path.setAttribute('height', rectheight);
        g.appendChild(path);

        var text = this.CreateEle("text");
        text.setAttribute('x', rectx);
        text.setAttribute('y', recty);
        text.setAttribute('style', "fill:"+_selColor+";font-size:"+this.getFontSize()+";font-family:"+_selFont+";");
        text.innerHTML = "";
        g.appendChild(text);
        var lines = this.SplitText("", rectwidth);
        for (var i = 0; i < lines.length; i++)
        {
            var span = this.CreateEle("tspan");
            span.setAttribute('x', rectx);
            span.setAttribute('y', recty + 20 * i);
            span.innerHTML = lines[i];
            text.append(span);
        }

        var line = this.CreateEle("line");
        line.setAttribute('x1', fromx);
        line.setAttribute('y1', fromy);
        line.setAttribute('x2', tox);
        line.setAttribute('y2', toy);
        line.setAttribute('style', "stroke-width:1; stroke:blue;");
        g.appendChild(line);

        var toArrow = this.CreateEle("path");
        toArrow.setAttribute('d', String.format("M{0} {1} L{2} {3} L{4} {5} Z",
            tox, toy, tox + 10, toy + 5, tox + 10, toy - 5));
        toArrow.setAttribute('transform', String.format("rotate({0},{1},{2})",
            getAngle(tox, toy, fromx, fromy), tox, toy));
        toArrow.setAttribute("style", "fill:blue;stroke:blue;stroke-width:1");
        g.appendChild(toArrow);
    };
    this.ToInputText = function (id, x, y, width, height)
    {
        $("#g_" + id).find("rect").hide();
        var text = $("#g_" + id).find("text");
        //var fsize = this.getFontSize();
        var fsize = parseFloat(text.css("font-size").replace("px", ""));
        var fcolor = text.css("fill");
        var font = text.css("font-family");
        //console.log(fsize);
        var lineheight = Math.round(parseFloat(fsize) * 1.2);
        //console.log(text.find("tspan").text());
        var txt = text.find("tspan").text();
        var html = "<div id='edit_" + id + "' tabindex='21' style='position: absolute;background-color:white;border:dashed 2px #7d7b7b;touch-action: none;padding:1px; z-index:100; box-sizing:border-box; top: " + (y - 0) + "px; left: " + (x - 0) + "px; width: " + (width + 6) + "px;height: " + (height + 6) + "px;'>";
        html += "<textarea id='textarea-" + id + "' placeholder='input text...' style='outline: none;overflow: hidden;resize: none;width:100%;height:100%;box-sizing:border-box;font-family: " + font + ";color:" + fcolor + ";font-size:" + fsize + "px;line-height:" + lineheight + "px;border:0px;'>" + txt + "</textarea>";
        html += "</div>";
        this.container.append(html);
        var oldlines = this.SplitTextEx($("#textarea-" + id).val(), $("#textarea-" + id).width(), parseFloat(fsize), font);
        //gid("textarea-" + id).rows = Math.max(oldlines.length,1);
        $("#textarea-" + id).focus();
        moveEnd(gid("textarea-" + id));
        var lastlen = 0, newlen = 0;
        var save = () =>
        {
            var fsize = $("#textarea-" + id).css("font-size").replace("px", "");
            var txt = $("#textarea-" + id).val();
            //console.log(txt);
            if (Trim(txt) == "")
            {
                $("#edit_" + id).remove();
                $("#g_" + id + ",#" + id).show();
                this.Delete();
                return;
            }
            var lines = this.SplitTextEx(txt, $("#textarea-" + id).width(), parseFloat(fsize), $("#textarea-" + id).css("font-family"));
            //console.log(lines);
            this.SaveText(lines, id);
            $("#edit_" + id).remove();
            $("#g_" + id + ",#" + id).show();
            var objNew = this.Record(true);
            if (objOld != null)
            {
                this.onRecordHistory(objOld, objNew);
                objOld = null;
            }
            this.SetActiveTool(null);
        };
        $("#textarea-" + id).bind("input", () =>
        {
            return;
            newlen = gid("textarea-" + id).value.length;
            if (newlen < lastlen)
            {
                gid("textarea-" + id).rows = Math.max(gid("textarea-" + id).rows - 1, 1);
            }
            lastlen = newlen;
            //console.log("on input");
            if (gid("textarea-" + id).scrollHeight > gid("textarea-" + id).clientHeight)
            {
                //console.log("on changline");
                //("#edit_" + id).height($("#edit_" + id).height() + 20);
                gid("textarea-" + id).rows += 1;
            }
            else if (gid("textarea-" + id).scrollHeight < gid("textarea-" + id).clientHeight)
            {
                //console.log("on changline");
                //$("#edit_" + id).height($("#edit_" + id).height() - 20);
                gid("textarea-" + id).rows -= 1;
            }
        }).bind("blur", () =>
        {
            if (_blurInputTimer) clearTimeout(_blurInputTimer);
            _blurInputTimer = setTimeout(()=>{this.SaveInputText(id)}, 300);
        }).bind("focus", function ()
        {
            if (_blurInputTimer) clearTimeout(_blurInputTimer);
        });
        this.SetActiveTool(this);
    };
    this.SaveInputText = function (id)
    {
        if ($("#textarea-" + id).length == 0)
        {
            this.SetActiveTool(null);
            $("#edit_" + id).remove();
            $("#g_" + id).find("rect").show();
            return;
        }
        var objOld = this.Record(true,false);
        var fsize = $("#textarea-" + id).css("font-size").replace("px", "");
        var txt = $("#textarea-" + id).val();
        //console.log(txt);
        // if(Trim(txt)=="")
        // {
        //     $("#edit_" + id).remove();
        //     //$("#g_" + id + ",#" + id).show();
        //     $("#g_" + id).find("rect").show();
        //     this.Delete();
        //     return;
        // }
        var lines = this.SplitTextEx(txt,$("#textarea-" + id).width(),parseFloat(fsize),$("#textarea-" + id).css("font-family"));
        //console.log(lines);
        this.SaveText(lines,id);
        $("#edit_" + id).remove();
        //$("#g_" + id + ",#" + id).show();
        $("#g_" + id).find("rect").show();
        var objNew =this.Record(true);
        if (objOld != null)
        {
            this.onRecordHistory(objOld, objNew);
            objOld = null;
        }
        this.SetActiveTool(null);
    };
    this.SaveText = function (lines, id)
    {
        var text = $("#g_" + id).find("text");
        var rect = $("#g_" + id).find("rect");
        text.html("");
        var x = text.attr("x");
        var y = text.attr("y");
        var fsize = parseFloat(text.css("font-size").replace("px", ""));
        var font = text.css("font-family");
        var dsize = getDiffSize(fsize, font);
        var lineheight = Math.round(fsize * 1.2);
        if (rect.height() < lineheight * lines.length)
        {
            rect[0].setAttribute('height', lineheight * lines.length);
            if ($("#edit_"+ id).length > 0)
            {
                $("#edit_" + id).height(lineheight * lines.length);
            }

        }
        // console.log("fsize:" + fsize);
        // console.log("dsize:" + dsize);
        // console.log("lineheight:"+lineheight);
        for (var i = 0; i < lines.length; i++)
        {
            var span = this.CreateEle("tspan");
            span.setAttribute('x', parseInt(x, 10)+2);
            span.setAttribute('y', parseInt(y, 10)+2 + fsize-dsize+ lineheight * i);
            span.innerHTML = lines[i];
            text.append(span);
        }
    };
    this.SaveColor = function (color)
    {
        var objOld = this.Record(true, false);
        var id = $(this.ele).attr("id");
        $("#g_" + id).find("text").css("fill", color);
        $("#text_"+id).css("color", color);

        var objNew = this.Record(true);
        this.onRecordHistory(objOld, objNew);
    }
    this.SaveSize = function (size)
    {
        var objOld = this.Record(true, false);
        var id = $(this.ele).attr("id");
        var text = $("#g_" + id).find("text");
        var strFsize = this.getFontSize();
        text.css("font-size", strFsize);
        var fsize = parseFloat(strFsize.replace("px", ""));
        var font = text.css("font-family");
        var lineheight = Math.round(fsize * 1.2);
        $("#text_" + id).css({ "font-size":strFsize, "line-height":lineheight+"px"});
        var txt = text.find("tspan").text();
        var lines = this.SplitTextEx(txt,$("#g_" + id).find("rect").width(),fsize,font);
        this.SaveText(lines, id);
        var objNew = this.Record(true);
        if (objOld != null)
        {
            this.onRecordHistory(objOld, objNew);
            objOld = null;
        }
    }
    this.SaveFont = function (font)
    {
        var objOld = this.Record(true, false);
        var id = $(this.ele).attr("id");
        var text = $("#g_" + id).find("text");
        var strFsize = this.getFontSize();
        text.css("font-family", font);
        var fsize = parseFloat(strFsize.replace("px", ""));
        var lineheight = Math.round(fsize * 1.2);
        $("#text_" + id).css({ "font-family":font});
        var txt = text.find("tspan").text();
        var lines = this.SplitTextEx(txt,$("#g_" + id).find("rect").width(),fsize,font);
        this.SaveText(lines, id);
        var objNew = this.Record(true);
        if (objOld != null)
        {
            this.onRecordHistory(objOld, objNew);
            objOld = null;
        }
    }
    this.EidtAnnotation = function (g, canceldelete)
    {
        var BoxSize = 2;
        var rect = $(g).find("rect");
        var text = $(g).find("text");
        var id = $(g).attr("ID").replace("g_", "");

        var x = parseInt(rect.attr("x"));
        var y = parseInt(rect.attr("y"));
        var width = parseInt(rect.attr("width"));
        var height = parseInt(rect.attr("height"));//2:border

        var fsize = parseFloat(text.css("font-size").replace("px", ""));
        var fcolor = text.css("fill");
        var font = text.css("font-family");
        setBaseSizeColor(fsize, fcolor);
        var lineheight = Math.round(fsize * 1.2);
        var txt = text.find("tspan").text().replace(/\n/ig, "<br>").replace(/\r\n/ig, "<br>");
        var html = "<div id='edit_" + id + "' tabindex='21' style='position: absolute;border:solid 2px blue;touch-action: none;background-color: white;padding:1px; z-index:100; box-sizing:border-box; top: " + (y-BoxSize) + "px; left: " + (x-BoxSize) + "px; width: " + (width + BoxSize*2) + "px;height: " + (height + BoxSize*2) + "px;'>";
        html += "<div "+this.EVENTRESIZE+"=\"Resize(document.getElementById('edit_" + id + "'), event, 'nw', 40, 40);\" style='position: absolute;cursor:nw-resize;left: -9px;top: -9px;background-color: blue;width: 16px;height: 16px;padding:0px;border:0px;display: inline-block;border-radius: 50%;'></div>";
        html += "<div " + this.EVENTRESIZE + "=\"Resize(document.getElementById('edit_" + id + "'), event, 'ne', 40, 40);\" style='position: absolute;cursor:ne-resize;right: -9px;top:-9px;background-color: blue;width: 16px;height: 16px;padding:0px;border:0px;display: inline-block;border-radius: 50%;'></div>";
        html += "<div " + this.EVENTRESIZE + "=\"Resize(document.getElementById('edit_" + id + "'), event, 'se', 40, 40);\" style='position: absolute;cursor:se-resize;right: -9px;top: calc(100% - 4px);background-color: blue;width: 16px;height: 16px;padding:0px;border:0px;display: inline-block;border-radius: 50%;'></div>";
        html +=" <div "+this.EVENTRESIZE+"=\"Resize(document.getElementById('edit_" + id + "'), event, 'sw', 40, 40);\" style='position: absolute;cursor:sw-resize;left: -9px;top: calc(100% - 4px);background-color: blue;width: 16px;height: 16px;padding:0px;border:0px;display: inline-block;border-radius: 50%;'></div>";
        html += "<div id='text_" + id + "' style='cursor:move;text-align:left;width:100%;height:100%;box-sizing:border-box;word-wrap:break-word;word-break:break-all;font-family: "+font+";color:" + fcolor + ";font-size:" + fsize + "px;line-height:" + lineheight + "px;border:0px;'>" + txt + "</div>";
        html += "</div>";

        this.container.append(html);
        var div = $("#edit_" + id);
        var ismove = false;

        Drag.init(gid("text_" + id), gid("edit_" + id), -BoxSize, null, -BoxSize, null);

        var objOld = null;
        div[0].onDrag = () =>
        {
            //console.log("ondrag");
            ismove = true;
            if (objOld == null)objOld = this.Record(true,false);
            $("#editnote").hide();
            var newX = parseInt(div[0].style.left) + BoxSize;
            var newY = parseInt(div[0].style.top) + BoxSize;
            var newWidth = parseInt(div[0].style.width) - BoxSize * 2;
            var newHeight = parseInt(div[0].style.height) - BoxSize * 2;
            rect.attr("x", newX);
            rect.attr("y", newY);
            rect.attr("width", newWidth);
            rect.attr("height", newHeight);
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0]);
        };
        div[0].onDragEnd = () =>
        {
            var newX = parseInt(div[0].style.left) + BoxSize;
            var newY = parseInt(div[0].style.top) + BoxSize;
            var newWidth = parseInt(div[0].style.width) - BoxSize * 2;
            var newHeight = parseInt(div[0].style.height) - BoxSize * 2;
            rect.attr("x", newX);
            rect.attr("y", newY);
            rect.attr("width", newWidth);
            rect.attr("height", newHeight);
            text.attr("x", newX );
            text.attr("y", newY );
            //alert(text.find("tspan").length);
            if ($("#text_" + id).length == 0) return;
            var fsize = $("#text_" + id).css("font-size").replace("px", "");
            var font = $("#text_" + id).css("font-family");
            var txt = $("#text_" + id).html().replace(/<br>/ig,"\n").replace(/<br \/>/ig,"\n");
            var lines = this.SplitTextEx(txt,$("#text_" + id).width(),parseFloat(fsize),font);
            this.SaveText(lines, id);

            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0],false,true);
            var objNew = this.Record(true);
            //console.log(objOld);
            if (objOld != null)
            {
                this.onRecordHistory(objOld, objNew);
                objOld = null;
            }
        };
        div[0].onSizeChange = () =>
        {
            ismove = true;
            if (objOld == null)objOld = this.Record(true,false);
            $("#editnote").hide();
            height = parseInt(div[0].style.height);
            div.find("div.editor").height(height - 43);
        };
        div[0].onSizeChanged = () =>
        {
            ismove = true;
            if (objOld == null)objOld = this.Record(true,false);
            $("#editnote").hide();
            var newX = parseInt(div[0].style.left);
            var newY = parseInt(div[0].style.top);
            var newWidth = parseInt(div[0].style.width);
            var newHeight = parseInt(div[0].style.height);

            rect.attr("x", newX + BoxSize);
            rect.attr("y", newY + BoxSize);
            rect.attr("width", newWidth - BoxSize * 2);
            rect.attr("height", newHeight - BoxSize * 2);
            text.attr("x", newX + BoxSize );
            text.attr("y", newY + BoxSize);

            var fsize = $("#text_" + id).css("font-size").replace("px", "");
            var font = $("#text_" + id).css("font-family");
            var txt = $("#text_" + id).html().replace(/<br>/ig,"\n").replace(/<br \/>/ig,"\n");
            var lines = this.SplitTextEx(txt,$("#text_" + id).width(),parseFloat(fsize),font);
            this.SaveText(lines, id);

           this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0],false,true);
            var objNew=this.Record(true);
            if (objOld != null)
            {
                this.onRecordHistory(objOld, objNew);
                objOld = null;
            }
        };

        var SaveNote = () =>
        {
            var objOld = this.Record(true,false);
            var newtext = $("#editnote_content").val();
            x = rect.attr("x");
            y = rect.attr("y");
            var width = parseInt(rect.attr("width"));
            var lines = this.SplitText(newtext, width);
            text.html("");
            for (var i = 0; i < lines.length; i++)
            {
                var span = this.CreateEle("tspan");
                span.setAttribute('x', parseInt(x, 10) + 5);
                span.setAttribute('y', parseInt(y, 10) + 15 + 20 * i);
                span.innerHTML = lines[i];
                text.append(span);
            }
            div.remove();
            ordiv.remove();
            orpdiv.remove();
            $("#editnotetext").remove();
            or.show();
            $(g).find("rect,text").show();
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            var objNew = this.Record(true);
            this.onRecordHistory(objOld, objNew);
        };
        div.find("#cancel").bind(this.EVENTCLICK, () =>
        {
            //if (canceldelete==true)
            div.remove();
            $(g).find("rect,text").show();
            //Record_rectangle(gid($(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0]);
        });

        $(g).find("rect,text").hide();


        var or = $("#" + $(g).attr("ID").replace("g_", ""));
        var orx = or.attr("x");
        var ory = or.attr("y");
        var orwidth = parseInt(or.attr("width"));
        var orheight = parseInt(or.attr("height"));

        var orhtml = "<div id='orp_" + id + "' tabindex='21' style='position: absolute;border:solid 2px blue;touch-action: none;background-color: white;padding:1px; z-index:100; box-sizing:border-box; top: " + (ory-BoxSize) + "px; left: " + (orx-BoxSize) + "px; width: " + (orwidth + BoxSize*2) + "px;height: " + (orheight + BoxSize*2) + "px;'>";
        orhtml += "<div "+this.EVENTRESIZE+"=\"Resize(document.getElementById('orp_" + id + "'), event, 'nw', 20, 20);\" style='position: absolute;cursor:nw-resize;left: -9px;top: -9px;background-color: blue;width: 16px;height: 16px;padding:0px;border:0px;display: inline-block;border-radius: 50%;'></div>";
        orhtml += "<div " + this.EVENTRESIZE + "=\"Resize(document.getElementById('orp_" + id + "'), event, 'ne', 20, 20);\" style='position: absolute;cursor:ne-resize;right: -9px;top:-9px;background-color: blue;width: 16px;height: 16px;padding:0px;border:0px;display: inline-block;border-radius: 50%;'></div>";
        orhtml += "<div " + this.EVENTRESIZE + "=\"Resize(document.getElementById('orp_" + id + "'), event, 'se', 20, 20);\" style='position: absolute;cursor:se-resize;right: -9px;top: calc(100% - 4px);background-color: blue;width: 16px;height: 16px;padding:0px;border:0px;display: inline-block;border-radius: 50%;'></div>";
        orhtml +=" <div "+this.EVENTRESIZE+"=\"Resize(document.getElementById('orp_" + id + "'), event, 'sw', 20, 20);\" style='position: absolute;cursor:sw-resize;left: -9px;top: calc(100% - 4px);background-color: blue;width: 16px;height: 16px;padding:0px;border:0px;display: inline-block;border-radius: 50%;'></div>";
        orhtml += "<div id='or_" + id + "' style='cursor:move;text-align:left;width:100%;height:100%;box-sizing:border-box;border:0px;'></div>";
        orhtml += "</div>";

        //GetPageContainer(PageNumber).append(orhtml);
        this.container.append(orhtml);
        var ordiv = $("#or_" + $(or).attr("ID"));
        var orpdiv = $("#orp_" + $(or).attr("ID"));

        Drag.init(ordiv[0], orpdiv[0], -BoxSize, null, -BoxSize, null);
        var objOrpOld = null;
        orpdiv[0].onSizeChange = () =>
        {
            if (objOrpOld == null)objOrpOld = this.Record(true,false);
        }
        orpdiv[0].onSizeChanged = () =>
        {
            if (objOrpOld == null)objOrpOld = this.Record(true,false);
            var newX = parseInt(orpdiv[0].style.left);
            var newY = parseInt(orpdiv[0].style.top);
            var newWidth = parseInt(orpdiv[0].style.width);
            var newHeight = parseInt(orpdiv[0].style.height);

            or.attr("x", newX + BoxSize);
            or.attr("y", newY + BoxSize);
            or.attr("width", newWidth - BoxSize * 2);
            or.attr("height", newHeight - BoxSize * 2);

            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0],false,true);
            var objNew=this.Record(true);
            if (objOrpOld != null)
            {
                this.onRecordHistory(objOrpOld, objNew);
                objOrpOld = null;
            }
        };
        orpdiv[0].onDrag = () =>
        {
            if (objOrpOld == null)objOrpOld = this.Record(true,false);
            var newX = parseInt(orpdiv[0].style.left) + BoxSize;
            var newY = parseInt(orpdiv[0].style.top) + BoxSize;
            var newWidth = parseInt(orpdiv[0].style.width) - BoxSize * 2;
            var newHeight = parseInt(orpdiv[0].style.height) - BoxSize * 2;
            or.attr("x", newX);
            or.attr("y", newY);
            or.attr("width", newWidth);
            or.attr("height", newHeight);
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
        };
        orpdiv[0].onDragEnd = () =>
        {
            var newX = parseInt(orpdiv[0].style.left) + BoxSize;
            var newY = parseInt(orpdiv[0].style.top) + BoxSize;
            var newWidth = parseInt(orpdiv[0].style.width) - BoxSize * 2;
            var newHeight = parseInt(orpdiv[0].style.height) - BoxSize * 2;
            or.attr("x", newX);
            or.attr("y", newY);
            or.attr("width", newWidth);
            or.attr("height", newHeight);
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0],false,true);
            var objNew=this.Record(true);
            if (objOrpOld != null)
            {
                this.onRecordHistory(objOrpOld, objNew);
                objOrpOld = null;
            }
        };
        or.hide();

        var save = () =>
        {
            //console.log("save");
            // x = parseInt(rect.attr("x"));
            // y = parseInt(rect.attr("y"));
            // var width = parseInt(rect.attr("width"));
            $("#orp_" + id + ",#edit_" + id).remove();
            //div.remove();
            //ordiv.remove();
            orpdiv.remove();
            or.show();
            //$("#editnote").hide();
            $(g).find("rect,text").show();
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            this.Record();
            this.SetActiveTool(null);
            this.ShowSetting(false);
        };
        var deletenote = () =>
        {
            var obj = this.Record(true,false);
            if (this.onRecordHistory)
            {
                this.onRecordHistory(obj,this.RecordHistory_delete(obj.id));
            }
            if (timer) clearTimeout(timer);
            //Record_delete(g.attr("id").replace("g_", ""));
            this.Record_delete(g.attr("id").replace("g_", ""));
            div.remove();
            ordiv.remove();
            orpdiv.remove();
            or.remove();
            g.remove();
            $("#editnote").hide();
            this.SetActiveTool(null);
        };
        var editnote = () =>
        {
            save();
            var h = $(document.body).height() - 20 - 60;

            var html = `<div id="editnotetext" tabindex="51" style="position:absolute; z-index:20000; left:0px; top:0px; width:500px; height:400px; padding:2px; background-color:white; border:solid 1px #000;">
                <div style="width:100%; height:100%;">
                <div style="height:40px; width:100%; text-align:left;">
                    <span style="border:1px solid #ccc;border-radius: 4px;cursor:pointer;display:inline-block;padding:5px;" id="btnCancelNote">${this.Text.Cancel}</span>
                    <span style=" float:right;border:1px solid #ccc;border-radius:4px;cursor:pointer;display:inline-block;padding:5px;" id="btnSaveNote">${this.Text.Save}</span>
                </div>
                <div style="width:100%;">
                    <textarea style="width:100%; height:360px;resize:none;overflow-y:auto;font-family: 'Consolas';" rows="10" id="editnote_content"></textarea>
                </div>
                </div>
            </div>`;
            if ($("#editnotetext").length > 0)
            {
                $("#editnotetext").remove();
            }
            this.main.append(html);
            var showx = x;
            var showy = -this._drawGetTop() + y;
            showx = Math.max(0, showx);
            showy = Math.max(0, showy);
            showx = Math.min(this.getViewWidth() - 510, showx);
            showy = Math.min(this.getViewHeight() - 410, showy);
            $("#editnotetext").show().css({ "left": showx + "px", "top": showy + "px" });
            if (this.deviceType != 0)
            {
                $("#editnotetext").css({ "left": "0px","top":"0px","width":"calc(100% - 8px)", "height": "100%" });
            }
            $("#editnote_content").val(text.text()).focus();
            $("#btnSaveNote").bind(this.EVENTCLICK, SaveNote);
            $("#btnCancelNote").bind(this.EVENTCLICK, (evt) =>
            {
                $("#editnotetext").remove();
                div.remove();
                $(g).find("rect,text").show();
            });
            this.SetActiveTool(null);
        };

        div.focus();
        div.bind("blur", function ()
        {
            if (_blurTimer) clearTimeout(_blurTimer);
            _blurTimer = setTimeout(save, 300);
        }).bind("focus", function ()
        {
            if (_blurTimer) clearTimeout(_blurTimer);
        }).bind(this.EVENTCLICK, () =>
        {
            //console.log("to edit text mode:"+ismove);
            if (ismove == false)
            {
                //console.log("to edit text mode");

                var newX = parseInt(div[0].style.left) + BoxSize;
                var newY = parseInt(div[0].style.top) + BoxSize;
                var newWidth = $(div).width() - BoxSize * 2;
                var newHeight = $(div).height() - BoxSize * 2;
                $("#edit_" + id + ",#orp_" + id).remove();
                or.show();
                $(g).find("rect,text").show();
                this.ToInputText(id, newX, newY, newWidth, newHeight);


            }
            ismove = false;
        });

        orpdiv.bind("blur", function ()
        {
            if (_blurTimer) clearTimeout(_blurTimer);
            _blurTimer = setTimeout(save, 300);
        }).bind("focus", function ()
        {
            if (_blurTimer) clearTimeout(_blurTimer);
        });

        this.SetActiveTool(this);
    }
    this.EidtAnnotation2 = function (g, canceldelete)
    {
        //CloseOtherToggleInfo(g.attr("id").replace("g_", ""));
        var BoxSize = 12;
        if (this.deviceType != 0)
        {
            BoxSize = 25;
        }
        var rect = $(g).find("rect");
        var text = $(g).find("text");

        var x = parseInt(rect.attr("x"));
        var y = parseInt(rect.attr("y"));
        var width = parseInt(rect.attr("width"));
        var height = parseInt(rect.attr("height"));//2:border
        var menuhtml = `<div id="editnote" style="position:absolute; left:10px; top:10px; float:left; z-index:201;">
            <div class="editnotemenu" style="background-color:black;border-radius:5px; color:white; height:24px;">
            <ul>
                <li id="editnote_delete">${this.Text.Delete}</li>
                <li id="editnote_edit">${this.Text.Edit}</li>
            </ul>
            </div>
            <div style="padding:8px 0px 0px 20px; text-align:left;">
            <span style="width:0;height:0;border-left: 5px solid transparent;border-right: 5px solid transparent;border-top: 10px solid black;"></span>
            </div>
        </div>`;
        this.main.append(menuhtml);
        if ($("#editnote").length > 0)
        {
            $("#editnote").remove();
        }

        $("#editnote").attr("tar", g.attr("id").replace("g_", "")).attr("tp", "note").css({ "left": x - this._drawGetLeft() + "px", "top": Math.max(0, y - 0 - 40 - this._drawGetTop()+ this.main.scrollTop()) + "px" }).show();

        var html = "<div id='edit_" + $(g).attr("ID") + "' tabindex='21' style='position: absolute;touch-action: none;z-index:100;box-sizing:border-box; top: " + (y - BoxSize) + "px; left: " + (x - BoxSize) + "px; width: " + (width + BoxSize * 2) + "px; height: " + (height + BoxSize * 2) + "px; '><table style='width:100%;height:100%;' cellspacing='0' cellpadding='0' border='0'><tr style='height:" + BoxSize + "px;'><td "+this.EVENTRESIZE+"=\"Resize(document.getElementById('edit_" + $(g).attr("ID") + "'), event, 'nw', 50, 50);\" style='width:" + BoxSize + "px;' class='resizebg_nw'></td><td></td><td style='width:" + BoxSize + "px;' class='resizebg_ne' "+this.EVENTRESIZE+"=\"Resize(document.getElementById('edit_" + $(g).attr("ID") + "'), event, 'ne', 50, 50);\"></td></tr><tr><td></td><td style='height:100%;'><div style=\"width:100%;height:100%;border:1px solid blue; text-align:left; padding:5px;background-color:white;box-sizing:border-box;font-family: 'Consolas';font-size:14px;opacity:0.5;\" class='container'>";
        //html += "<div style='width:100%; height:22px; border-bottom:0px solid blue; blue;text-align:right;' class='head'><input type='button' data-inline='true' id='save' style='font-size:12px;display:none;' value='OK'></div >";
        //html += "<div class='editor' style='width:100%; height:" + (height - 23) + "px;'><textarea name='textarea-1' id='textarea-1' style='width:100%; height:100%;box-sizing:border-box;font-size:12px;border:0px;'>" + text.text() + "</textarea></div>";
        html += text.text().replace(/\r\n/ig, "<br />").replace(/\n/ig, "<br />");
        html += "</div>";
        html += "</td><td></td></tr><tr style='height:" + BoxSize + "px;'><td "+this.EVENTRESIZE+"=\"Resize(document.getElementById('edit_" + $(g).attr("ID") + "'), event, 'sw', 50, 50);\" style='width:" + BoxSize + "px;' class='resizebg_sw'></td><td></td><td style='width:" + BoxSize + "px;' class='resizebg_se' "+this.EVENTRESIZE+"=\"Resize(document.getElementById('edit_" + $(g).attr("ID") + "'), event, 'se', 50, 50);\"></td></tr><table></div></div>"
        this.container.append(html);
        var div = $("#edit_" + $(g).attr("ID"));

        Drag.init(div.find("div.container")[0], div[0], -BoxSize, null, -BoxSize, null);
        var objOld = null;
        div[0].onDrag = () =>
        {
            //console.log("ondrag");
            if (objOld == null)objOld = this.Record(true,false);
            $("#editnote").hide();
            var newX = parseInt(div[0].style.left) + BoxSize;
            var newY = parseInt(div[0].style.top) + BoxSize;
            var newWidth = parseInt(div[0].style.width) - BoxSize * 2;
            var newHeight = parseInt(div[0].style.height) - BoxSize * 2;
            rect.attr("x", newX);
            rect.attr("y", newY);
            rect.attr("width", newWidth);
            rect.attr("height", newHeight);
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0]);
        };
        div[0].onDragEnd = () =>
        {
            var newX = parseInt(div[0].style.left) + BoxSize;
            var newY = parseInt(div[0].style.top) + BoxSize;
            var newWidth = parseInt(div[0].style.width) - BoxSize * 2;
            var newHeight = parseInt(div[0].style.height) - BoxSize * 2;
            rect.attr("x", newX);
            rect.attr("y", newY);
            rect.attr("width", newWidth);
            rect.attr("height", newHeight);
            text.attr("x", newX + 5);
            text.attr("y", newY + 15);
            //alert(text.find("tspan").length);
            text.find("tspan").each(function (i)
            {
                $(this).attr("x", newX + 5);
                $(this).attr("y", newY + 15 + 20 * i);
            });
            $("#editnote").css({ "left": newX - this._drawGetLeft() + "px", "top": Math.max(0, newY - 0 - 40 - this._drawGetTop()+ this.main.scrollTop()) + "px" }).show();

            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0],false,true);
            var objNew = this.Record(true);
            //console.log(objOld);
            if (objOld != null)
            {
                this.onRecordHistory(objOld, objNew);
                objOld = null;
            }
        };
        div[0].onSizeChange = () =>
        {
            if (objOld == null)objOld = this.Record(true,false);
            $("#editnote").hide();
            height = parseInt(div[0].style.height);
            div.find("div.editor").height(height - 43);
        };
        div[0].onSizeChanged = () =>
        {
            if (objOld == null)objOld = this.Record(true,false);
            $("#editnote").hide();
            var newX = parseInt(div[0].style.left);
            var newY = parseInt(div[0].style.top);
            var newWidth = parseInt(div[0].style.width);
            var newHeight = parseInt(div[0].style.height);

            rect.attr("x", newX + BoxSize);
            rect.attr("y", newY + BoxSize);
            rect.attr("width", newWidth - BoxSize * 2);
            rect.attr("height", newHeight - BoxSize * 2);
            text.find("tspan").each(function (i)
            {
                $(this).attr("x", newX + BoxSize + 5);
                $(this).attr("y", newY + BoxSize + 15 + 20 * i);
            });
            $("#editnote").css({ "left": newX + BoxSize - this._drawGetLeft() + "px", "top": Math.max(0, newY + BoxSize - 0 - 40 - this._drawGetTop()+ this.main.scrollTop()) + "px" }).show();
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0],false,true);
            var objNew=this.Record(true);
            if (objOld != null)
            {
                this.onRecordHistory(objOld, objNew);
                objOld = null;
            }
        };

        var SaveNote = () =>
        {
            var objOld = this.Record(true,false);
            var newtext = $("#editnote_content").val();
            x = rect.attr("x");
            y = rect.attr("y");
            var width = parseInt(rect.attr("width"));
            var lines = this.SplitText(newtext, width);
            text.html("");
            for (var i = 0; i < lines.length; i++)
            {
                var span = this.CreateEle("tspan");
                span.setAttribute('x', parseInt(x, 10) + 5);
                span.setAttribute('y', parseInt(y, 10) + 15 + 20 * i);
                span.innerHTML = lines[i];
                text.append(span);
            }
            div.remove();
            ordiv.remove();
            orpdiv.remove();
            $("#editnotetext").remove();
            or.show();
            $(g).find("rect,text").show();
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            var objNew = this.Record(true);
            this.onRecordHistory(objOld, objNew);
        };
        div.find("#cancel").bind(this.EVENTCLICK, () =>
        {
            //if (canceldelete==true)
            div.remove();
            $(g).find("rect,text").show();
            //Record_rectangle(gid($(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0]);
        });

        $(g).find("rect,text").hide();


        var or = $("#" + $(g).attr("ID").replace("g_", ""));
        var orx = or.attr("x");
        var ory = or.attr("y");
        var orwidth = parseInt(or.attr("width"));
        var orheight = parseInt(or.attr("height"));

        var orhtml = "<div id='orp_" + or.attr("ID") + "' tabindex='22' style='position: absolute;touch-action: none;z-index:101;box-sizing:border-box; top: " + (ory - BoxSize) + "px; left: " + (orx - BoxSize) + "px; width: " + (orwidth + BoxSize * 2) + "px; height: " + (orheight + BoxSize * 2) + "px; '>";
        orhtml += "<table style='width:100%;height:100%;' cellspacing='0' cellpadding='0' border='0'><tr style='height:" + BoxSize + "px;'><td "+this.EVENTRESIZE+"=\"Resize(document.getElementById('orp_" + or.attr("ID") + "'), event, 'nw', 50, 50);\" style='width:" + BoxSize + "px;' class='resizebg_nw'></td><td></td><td style='width:" + BoxSize + "px;' class='resizebg_ne' "+this.EVENTRESIZE+"=\"Resize(document.getElementById('orp_" + or.attr("ID") + "'), event, 'ne', 50, 50);\"></td></tr><tr><td></td><td style='height:100%;'>"
        orhtml += "<div id='or_" + or.attr("ID") + "' style='width:100%;height:100%;border:1px solid blue;box-sizing:border-box;'></div>";
        orhtml += "</td><td></td></tr><tr style='height:" + BoxSize + "px;'><td "+this.EVENTRESIZE+"=\"Resize(document.getElementById('orp_" + or.attr("ID") + "'), event, 'sw', 50, 50);\" style='width:" + BoxSize + "px;' class='resizebg_sw'></td><td></td><td style='width:" + BoxSize + "px;' class='resizebg_se' "+this.EVENTRESIZE+"=\"Resize(document.getElementById('orp_" + or.attr("ID") + "'), event, 'se', 50, 50);\"></td></tr><table>"
        orhtml += "</div>";
        //GetPageContainer(PageNumber).append(orhtml);
        this.container.append(orhtml);
        var ordiv = $("#or_" + $(or).attr("ID"));
        var orpdiv = $("#orp_" + $(or).attr("ID"));

        Drag.init(ordiv[0], orpdiv[0], -BoxSize, null, -BoxSize, null);
        var objOrpOld = null;
        orpdiv[0].onSizeChange = () =>
        {
            if (objOrpOld == null)objOrpOld = this.Record(true,false);
        }
        orpdiv[0].onSizeChanged = () =>
        {
            if (objOrpOld == null)objOrpOld = this.Record(true,false);
            var newX = parseInt(orpdiv[0].style.left);
            var newY = parseInt(orpdiv[0].style.top);
            var newWidth = parseInt(orpdiv[0].style.width);
            var newHeight = parseInt(orpdiv[0].style.height);

            or.attr("x", newX + BoxSize);
            or.attr("y", newY + BoxSize);
            or.attr("width", newWidth - BoxSize * 2);
            or.attr("height", newHeight - BoxSize * 2);

            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0],false,true);
            var objNew=this.Record(true);
            if (objOrpOld != null)
            {
                this.onRecordHistory(objOrpOld, objNew);
                objOrpOld = null;
            }
        };
        orpdiv[0].onDrag = () =>
        {
            if (objOrpOld == null)objOrpOld = this.Record(true,false);
            var newX = parseInt(orpdiv[0].style.left) + BoxSize;
            var newY = parseInt(orpdiv[0].style.top) + BoxSize;
            var newWidth = parseInt(orpdiv[0].style.width) - BoxSize * 2;
            var newHeight = parseInt(orpdiv[0].style.height) - BoxSize * 2;
            or.attr("x", newX);
            or.attr("y", newY);
            or.attr("width", newWidth);
            or.attr("height", newHeight);
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
        };
        orpdiv[0].onDragEnd = () =>
        {
            var newX = parseInt(orpdiv[0].style.left) + BoxSize;
            var newY = parseInt(orpdiv[0].style.top) + BoxSize;
            var newWidth = parseInt(orpdiv[0].style.width) - BoxSize * 2;
            var newHeight = parseInt(orpdiv[0].style.height) - BoxSize * 2;
            or.attr("x", newX);
            or.attr("y", newY);
            or.attr("width", newWidth);
            or.attr("height", newHeight);
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            //Record_rectangle($("#" + $(g).attr("ID").replace("g_", ""))[0],false,true);
            var objNew=this.Record(true);
            if (objOrpOld != null)
            {
                this.onRecordHistory(objOrpOld, objNew);
                objOrpOld = null;
            }
        };
        or.hide();

        var save = () =>
        {
            x = parseInt(rect.attr("x"));
            y = parseInt(rect.attr("y"));
            var width = parseInt(rect.attr("width"));
            div.remove();
            ordiv.remove();
            orpdiv.remove();
            or.show();
            $("#editnote").hide();
            $(g).find("rect,text").show();
            this.ShowArrow($("#" + $(g).attr("ID").replace("g_", "")));
            this.Record();
            this.SetActiveTool(null);
        };
        var deletenote = () =>
        {
            var obj = this.Record(true,false);
            if (this.onRecordHistory)
            {
                this.onRecordHistory(obj,this.RecordHistory_delete(obj.id));
            }
            if (timer) clearTimeout(timer);
            //Record_delete(g.attr("id").replace("g_", ""));
            this.Record_delete(g.attr("id").replace("g_", ""));
            div.remove();
            ordiv.remove();
            orpdiv.remove();
            or.remove();
            g.remove();
            $("#editnote").hide();
            this.SetActiveTool(null);
        };
        var editnote = () =>
        {
            save();
            var h = $(document.body).height() - 20 - 60;

            var html = `<div id="editnotetext" tabindex="51" style="position:absolute; z-index:20000; left:0px; top:0px; width:500px; height:400px; padding:2px; background-color:white; border:solid 1px #000;">
                <div style="width:100%; height:100%;">
                <div style="height:40px; width:100%; text-align:left;">
                    <span style="border:1px solid #ccc;border-radius: 4px;cursor:pointer;display:inline-block;padding:5px;" id="btnCancelNote">${this.Text.Cancel}</span>
                    <span style=" float:right;border:1px solid #ccc;border-radius:4px;cursor:pointer;display:inline-block;padding:5px;" id="btnSaveNote">${this.Text.Save}</span>
                </div>
                <div style="width:100%;">
                    <textarea style="width:100%; height:360px;resize:none;overflow-y:auto;font-family: 'Consolas';" rows="10" id="editnote_content"></textarea>
                </div>
                </div>
            </div>`;
            if ($("#editnotetext").length > 0)
            {
                $("#editnotetext").remove();
            }
            this.main.append(html);
            var showx = x;
            var showy = -this._drawGetTop() + y;
            showx = Math.max(0, showx);
            showy = Math.max(0, showy);
            showx = Math.min(this.getViewWidth() - 510, showx);
            showy = Math.min(this.getViewHeight() - 410, showy);
            $("#editnotetext").show().css({ "left": showx + "px", "top": showy + "px" });
            if (this.deviceType != 0)
            {
                $("#editnotetext").css({ "left": "0px","top":"0px","width":"calc(100% - 8px)", "height": "100%" });
            }
            $("#editnote_content").val(text.text()).focus();
            $("#btnSaveNote").bind(this.EVENTCLICK, SaveNote);
            $("#btnCancelNote").bind(this.EVENTCLICK, (evt) =>
            {
                $("#editnotetext").remove();
                div.remove();
                $(g).find("rect,text").show();
            });
            this.SetActiveTool(null);
        };

        div.focus();
        var timer = null;
        div.bind("blur", function ()
        {
            if (timer) clearTimeout(timer);
            timer = setTimeout(save, 300);
        }).bind("focus", function ()
        {
            if (timer) clearTimeout(timer);
        });
        orpdiv.bind("blur", function ()
        {
            if (timer) clearTimeout(timer);
            timer = setTimeout(save, 300);
        }).bind("focus", function ()
        {
            if (timer) clearTimeout(timer);
        });


        $("#editnote").unbind().bind("click", function (e)
        {
            var tar = $(e.originalEvent.target);
            switch (tar.attr("id"))
            {
                case "editnote_delete":
                    deletenote();
                    break;
                case "editnote_edit":
                    editnote();
                    break;
                case "editnote_color":
                    break;
                case "editnote_fontsize":
                    break;
                default:
                    if (timer) clearTimeout(timer);
                    break;

            }
        });
        this.SetActiveTool(this);
    }
    this.Record = function (save,handle=true)
    {
        //var tar = this.ele;
        var obj = this.CreateRecordBaseInfo(26, { "x": "x", "y": "y", "width": "width", "height": "height" });
        if (gid("g_" + obj.id))
        {
            var g = $("#g_" + obj.id);
            var rect = g.find("rect");
            obj.Rect = new Object();
            obj.Rect.show = g.css('display') != "none";
            obj.Rect.x = parseInt(rect.attr("x"));
            obj.Rect.y = parseInt(rect.attr("y"));
            obj.Rect.width = parseInt(rect.attr("width"));
            obj.Rect.height = parseInt(rect.attr("height"));
            obj.Rect.text = base64encode(utf16to8(g.find("text").text()));
            obj.Rect.color = g.find("text").css("fill");
            obj.Rect.size = parseFloat(g.find("text").css("font-size").replace("px", ""));
            obj.Rect.font = g.find("text").css("font-family");
            var line = g.find("line");
            obj.Rect.x1 = parseInt(line.attr("x1"));
            obj.Rect.x2 = parseInt(line.attr("x2"));
            obj.Rect.y1 = parseInt(line.attr("y1"));
            obj.Rect.y2 = parseInt(line.attr("y2"));
        }
        if (save)
        {
            obj.save = 1;
        }
        if (handle)
        {
            this.RecordHandle(obj);
        }
        //console.log(this.name + ":Record done");
        return obj;
    }
    this.ShowSetting = function (isshow)
    {
        //console.log(this.name + ":ShowSetting:"+_selSize+","+_selColor);
        this.ShowColorSizeSetting(_selSize, _selColor, isshow,false,_selFont);
    }
    this.AfterSelectSizeSetting = function (size)
    {
        _selSize = size;
        if (this.ele)
        {
            this.SetActive();
            this.SaveSize(size);
        }
    }
    this.AfterSelectColorSetting = function (color)
    {
        _selColor = color;
        if (this.ele)
        {
            this.SetActive();
            this.SaveColor(color);
        }
    }
    this.AfterSelectFontSetting = function (font)
    {
        //console.log("AfterSelectFontSetting:" + font);
        _selFont = font;
        if (this.ele)
        {
            this.SetActive();
            this.SaveFont(font);
        }
    }
    this.SetActive=function()
    {
        if (_blurTimer) clearTimeout(_blurTimer);
        _blurTimer = null;
        //console.log(_blurInputTimer);
        if (_blurInputTimer)
        {
            clearTimeout(_blurInputTimer);
            _blurInputTimer = null;
            if (this.ele)
            {
                var id = $(this.ele).attr("id");
                if ($("#edit_" + id).length > 0)
                {
                    this.SaveInputText(id);
                    this.EidtAnnotation(gid("g_"+id));
                }
            }
        }

        //console.log("SetActive:"+$(this.ele).attr("id"))
        $("#edit_"+$(this.ele).attr("id")).focus();
    }
}
Object.setPrototypeOf(ToolNote.prototype, ToolBase.prototype)

function ToolBoard()
{
    ToolBase.call(this, "ToolBoard");
    var _selSize = 0.5;
    var _selColor = "#ff0000";
    var _boardline = null;
    var _boardsvg = null;
    var _pointGroup = new Array();
    var _redoGroup = new Array();
    var _historyGroup = new Array();
    var _historyHelper = new HistoryHelper();
    var _nodes4History = new Array();
    var _onDisplayChange = null;

    this.SetOnDisplayChange = function (onDisplayChange)
    {
        _onDisplayChange = onDisplayChange;
    }

    function _drawCanStart(evt)
    {
        var tar = $(evt.originalEvent.target);
        var oevt = evt.originalEvent;
        if (typeof(oevt.isPrimary)!="undefined" && oevt.isPrimary==false)
        {
            return false;
        }
        if (tar.attr("id") == "media-header" || tar.attr("id") == "media-panel-actions" || (tar[0].tagName.toLowerCase() != "svg" && tar.parent()[0].tagName.toLowerCase() != "svg"))
        {
            return false;
        }
        if (oevt.pointerType && oevt.pointerType == "mouse")
        {
            if (typeof(oevt.buttons)!="undefined" && oevt.buttons == 0)
            {
                return false;
            }
            return (oevt.button == 1 || oevt.button == 0|| oevt.button == -1)
        }
        else
        {
            return true;
        }
    }

    function _drawCancelPup(evt) {
        evt.originalEvent.preventDefault();
        evt.originalEvent.stopPropagation();
    }
    function ClearWhiteBoardMoveHand(id) {
        $("#svg_" + id).css({ cursor: "default" });
        //$("#svg_" + id).unbind();
    }
    function _drawGetEvent(evt)
    {
        if (evt.originalEvent['touches'] && evt.originalEvent['touches'].length > 0) {
            return evt.originalEvent['touches'][0];
        }
        return evt.originalEvent;
    }
    function _drawGetTop(main,container)
    {
        return $(document).scrollTop() + main.scrollTop() - _drawGetBoundingTop(container)-50;
    }
    function _drawGetLeft(main,container)
    {
        return $(document).scrollLeft() + main.scrollLeft() - _drawGetBoundingLeft(container);
    }
    function _drawGetBoundingLeft(container)
    {
        var bleft = container[0].getBoundingClientRect().left;

        bleft = Math.max(bleft, 0);
        return bleft;
    }
    function _drawGetBoundingTop(container)
    {
        var bleft = container[0].getBoundingClientRect().top;

        bleft = Math.max(bleft, 0);
        return bleft;
    }
    function _getPoz(evt,tarid,main,container)
    {
        var tch = _drawGetEvent(evt);
        var left = _drawGetLeft(main,container);
        var top = _drawGetTop(main,container)+$("#div_" + tarid).scrollTop();
        var diffx = 0, diffy = 0;

        var x = getZoomed((tch.clientX | 0) - diffx + left);
        var y = getZoomed((tch.clientY | 0) - diffy + top);
        return { x: x, y: y };
    }
    function getZoomed(p)
    {
        return Math.round(p);
    }

    this._onEventStart=function(x, y,isbrush,tarid)
    {
        //console.log("_onEventStart:"+x+","+y);
        this.ShowSetting(false);
        _boardline = this.CreateEle("path", { "isdraw": 'true', "tp": 'line', "style": 'fill:white;fill-opacity:0;stroke-linecap:round;', "stroke-width": _selSize, "stroke": _selColor });
        _boardline.setAttribute('d', "M" + x + "," + y);
        _boardline.setAttribute("stroke-opacity", isbrush?0.4 : 1);
        _boardsvg.append(_boardline);
        _nodes4History.push({x: x,y: y});
        //this.Append();
        this.RecordLine(true,tarid);

    }
    this._onEventMove=function(x, y,tarid,isbrush)
    {
        //console.log("_onEventMove:" + x + "," + y);
        var oldValue = _boardline.getAttributeNode("d").nodeValue;
        if (oldValue.length > 7870)
        {
            _nodes4History.push({ x: x, y: y });
            _historyHelper.AddHistory(tarid, {
                id: _boardline.getAttributeNode("id").nodeValue,
                color: _selColor,
                width: _selSize,
                isbrush: isbrush
            });
            _historyHelper.AddPoints(tarid, _nodes4History);
            _nodes4History = new Array();
            this.RecordLine(true, tarid);

            _boardline = this.CreateEle("path", { "isdraw": 'true', "tp": 'line', "style": 'fill:white;fill-opacity:0;stroke-linecap:round;', "stroke-width": _selSize, "stroke": _selColor });
            _boardline.setAttribute('d', "M"+ this.getLastNode(oldValue) +" L" + x + "," + y);
            _boardline.setAttribute("stroke-opacity", isbrush?0.4 : 1);
            _boardsvg.append(_boardline);
        }
        else
        {
            _boardline.setAttribute('d', oldValue + " L" + x + "," + y);
        }
        _nodes4History.push({ x: x, y: y });
        if (this.CheckRecordStep(x, y))
        {
            this.RecordLine(false, tarid);
        }
    }
    this._onEventEnd=function(x, y,tarid,isbrush)
    {
        //console.log("_onEventEnd:" + x + "," + y);
        var oldValue = _boardline.getAttributeNode("d").nodeValue;
        if (oldValue.indexOf("L") == -1)
        {
            _nodes4History.push({x: x,y: y});
            _boardline.setAttribute('d', oldValue + " L" + oldValue.substr(oldValue.indexOf("M") + 1));
        }
        _historyHelper.ClearRedo(tarid);
        _historyHelper.AddHistory(tarid, {
            id: _boardline.getAttributeNode("id").nodeValue,
            color: _selColor,
            width: _selSize,
            isbrush: isbrush
        });
        _historyHelper.AddPoints(tarid, _nodes4History);
        _nodes4History = new Array();
        this.RecordLine(true,tarid);
        return true;
    }

    this.onStart = function (x, y)
    {
        this.ele = this.CreateEle("rect", { "isdraw": 'true', "tp": 'board', "style": 'fill:blue;stroke:blue;stroke-width:1;fill-opacity:0.1;', "width": 0, "height": 0 });
        this.ele.setAttribute('x', x);
        this.ele.setAttribute('y', y);
        this.ele.setAttribute('sx', x);
        this.ele.setAttribute('sy', y);

        this.Append();
        this.Record();
    }
    this.onMove = function (x, y)
    {
        //console.log(this.name + ":onMove done");

        var oldx = parseInt(this.ele.getAttributeNode("sx").nodeValue);
        var oldy = parseInt(this.ele.getAttributeNode("sy").nodeValue);

        var diffx = x - oldx;
        var diffy = y - oldy;

        if (diffx >= 0 && diffy >= 0)
        {
            this.ele.setAttribute('width', diffx);
            this.ele.setAttribute('height', diffy);
        }
        else if (diffx < 0 && diffy < 0)
        {
            this.ele.setAttribute('x', oldx + diffx);
            this.ele.setAttribute('y', oldy + diffy);
            this.ele.setAttribute('width', - diffx);
            this.ele.setAttribute('height', - diffy);
        }
        else if (diffx >= 0 && diffy < 0)
        {
            this.ele.setAttribute('y', oldy + diffy);
            this.ele.setAttribute('width', diffx);
            this.ele.setAttribute('height', - diffy);
        }
        else if (diffx < 0 && diffy >= 0)
        {
            this.ele.setAttribute('x', oldx + diffx);
            this.ele.setAttribute('width', - diffx);
            this.ele.setAttribute('height', diffy);
        }
        //this.Record();
        return true;
    };
    this.onEnd = function (x, y)
    {
        //console.log(this.name + ":onEnd done");
        var x = parseInt(this.ele.getAttributeNode("x").nodeValue);
        var y = parseInt(this.ele.getAttributeNode("y").nodeValue);
        var width = parseInt(this.ele.getAttributeNode("width").nodeValue);
        var height = parseInt(this.ele.getAttributeNode("height").nodeValue);
        if (width < 20 && height < 20)
        {
            $(this.ele).remove();
            return false;
        }
        else
        {
            var id = this.ele.getAttributeNode("id").nodeValue;
            var g = $("#div_" + id);
            $("#" + id).bind(this.EVENTCLICK, (e) =>
            {
                this.Record(true, 1);
                this.EidtWhiteBoard(id, true);
            });
        }
        var obj =this.Record(true, 1);
        if (this.onRecordHistory)
        {
            obj.mode = 0;
            var arr = new Array();
            arr.push(this.RecordHistory_delete(obj.id));
            arr.push(this.RecordHistory_delete("edit_"+obj.id));
            this.onRecordHistory(arr, obj);
        };
        this.EidtWhiteBoard(id, true);
        this.SetTool("");
        return true;
    };
    this.EidtWhiteBoard = function (id, canceldelete)
    {
        //loger.log("EidtWhiteBoard:" + id);
        //Record_whiteboard(gid(id), false, 1,true);
        var self = this;
        var div = $("#edit_" + id);
        if (div.length == 0)
        {
            this.container.append(this.GetWBContainer(id));
            div = $("#edit_" + id);
        }
        div.find(">div.boardhead").css({
            "width": this.getContainerWidth(),
            "top": _drawGetBoundingTop(this.container),
            "left": _drawGetBoundingLeft(this.container)});
        div.show();
        if (_onDisplayChange) _onDisplayChange(true);
        //return;

        $("#WBTool_Del_" + id).unbind().bind(this.EVENTCLICK, function(e)
        {
            if (self.getCanEdit && self.getCanEdit() == false) return;
            $("#svg_" + id).find(">path[isdraw='true'],>rect[isdraw='true'],>g[isdraw='true'],>circle[isdraw='true']").remove();
            _historyHelper.Clear(id);
            _redoGroup = new Array();
            _pointGroup = new Array();
            _historyGroup = new Array();
            self.Record_clear("svg_" + id,true)
            _drawCancelPup(e);
        });
        $("#WBTool_Close_" + id).unbind().bind(this.EVENTCLICK, function(e)
        {
            if (self.getCanEdit && self.getCanEdit() == false) return;
            self.ShowSetting(false);
            div.hide();
            if (_onDisplayChange) _onDisplayChange(false);
            self.Record(true, 2);
            //SetWBMode(false);
            self.SetTool("");
        });
        $("#WBTool_Undo_" + id).unbind().bind(this.EVENTCLICK, function(e)
        {
            if (self.getCanEdit && self.getCanEdit() == false) return;
            var id = $(this).attr("id").replace("WBTool_Undo_", "");
            _drawCancelPup(e);
            var lastlines = _historyHelper.Undo(id);
            if (!lastlines || lastlines == null)
            {
                return false;
            }
            $("#" + lastlines.id).remove();
            self.Record_delete(lastlines.id);
            var points = _historyHelper.UndoPoints(id);
            _historyHelper.AddRedoPoints(id, points);
            _historyHelper.AddRedoHistory(id, lastlines);

            return false;
        });
        $("#WBTool_Redo_" + id).unbind().bind(this.EVENTCLICK, function(e)
        {
            if (self.getCanEdit && self.getCanEdit() == false) return;
            _drawCancelPup(e);
            var id = $(this).attr("id").replace("WBTool_Redo_", "");
            var points = _historyHelper.RedoPoints(id);
            if (points == null || points.length == 0)
            {
                return;
            }
            _historyHelper.AddPoints(id, points);

            var history = _historyHelper.RedoHistory(id);
            _historyHelper.AddHistory(id, history);
            var getLinePath = function (node)
            {
                var result = "";
                if (node.length == 1)
                {
                    result = "M" + node[0].x + "," + node[0].y + " L" + node[0].x + "," + node[0].y;
                } else
                {
                    for (var i = 0, j = node.length; i < j; i++)
                    {
                        if (i == 0)
                        {
                            result = "M" + node[i].x + "," + node[i].y;
                        } else
                        {
                            result += " L" + node[i].x + "," + node[i].y;
                        }
                    }
                }
                return result;
            };

            var path = createEl("path");
            path.setAttribute("id", history.id);
            path.setAttribute("isdraw", "true");
            path.setAttribute("tp", "line");
            path.setAttribute("style","fill:white;fill-opacity:0;stroke-linecap:round;");
            path.setAttribute("stroke-width", history.width);
            path.setAttribute("stroke", history.color);
            path.setAttribute("d", getLinePath(points));
            path.setAttribute("stroke-opacity", history.isbrush ? 0.4 : 1);
            gid("svg_" + id).appendChild(path);
            self.RecordLine(true,id,path);//Record_line(path, false, "div_" + id, true);
        });
        $("#WBTool_Pen_" + id).unbind().bind(this.EVENTCLICK, function(e)
        {
            if (self.getCanEdit && self.getCanEdit() == false) return;

            var id = $(this).attr("id").replace("WBTool_Pen_", "");
            ClearWhiteBoardMoveHand(id);
            if ($(this).hasClass("selected"))
            {
                self.ShowSetting(true);
                //$("#svg_" + id).unbind();
                return;
            }
            $(this).parent().find("span.selected").removeClass("selected");
            $(this).addClass("selected");
            self.DrawLine4Board(id, false);
        });
        $("#WBTool_Brush_" + id).unbind().bind(this.EVENTCLICK, function(e)
        {
            if (self.getCanEdit && self.getCanEdit() == false) return;
            var id = $(this).attr("id").replace("WBTool_Brush_", "");

            ClearWhiteBoardMoveHand(id);
            if ($(this).hasClass("selected"))
            {
                self.ShowSetting(true);
                //$("#svg_" + id).unbind();
                return;
            }
            $(this).parent().find("span.selected").removeClass("selected");
            $(this).addClass("selected");
            self.DrawLine4Board(id, true);
        });
        $("#WBTool_Hand_" + id).unbind().bind(this.EVENTCLICK, function(e)
        {
            if (self.getCanEdit && self.getCanEdit() == false) return;
            if ($(this).hasClass("selected"))
            {
                return;
            }
            var id = $(this).attr("id").replace("WBTool_Hand_", "");
            $(this).parent().find("span.selected").removeClass("selected");
            $(this).addClass("selected");
            var lastY = 0;
            var lastScrollTop = 0;
            var isMove = false;

            //console.log("WBTool_Hand:" + id);
            //return;
            $("#svg_" + id).css({ cursor: "move" });
            $("#svg_" + id).unbind().bind(self.EVENTSTART, function (evt)
            {
                //console.log("svg EVENTSTART");
                var tch = _drawGetEvent(evt);
                lastY = tch.clientY;
                var wbscroll = $("#div_" + id);
                lastScrollTop = wbscroll.scrollTop();
                isMove = true;
            }).bind(self.EVENTMOVE, function (evt)
            {
                //console.log("svg EVENTMOVE");
                if (!isMove || !_drawCanStart(evt))
                {
                    isMove = false;
                    return;
                }
                var tch = _drawGetEvent(evt);
                var currentY = tch.clientY;
                var diff = currentY - lastY;
                var wbscroll = $("#div_" + id);
                var newY = lastScrollTop - diff;
                newY = Math.max(newY, 0);
                wbscroll.scrollTop(newY);
            }).bind(self.EVENTEND, function (evt)
            {
                isMove = false;
            });
        });
        var lastTop = 0;
        $("#div_" + id).unbind().bind("scroll", function (e)
        {
            if (self.canEdit == false) return;

            var cTop = gid("div_" + id).scrollTop;
            var diff = Math.abs(cTop - lastTop);
            if (gid("div_" + id).scrollHeight -gid("div_" + id).scrollTop -gid("div_" + id).clientHeight <62)
            {
                $("#svg_" + id).height($("#svg_" + id).height() + $("#div_" + id).height() * 0.5);
                self.Record_resize("svg_" + id, 1);
            }
            if (diff < 30)
            {
                return;
            }
            lastTop = cTop;
            self.Record_scroll("div_" + id);
        });

        if (this.canEdit==true)
        {
            $("#WBTool_Pen_" + id).parent().find("span.selected").removeClass("selected");
            $("#WBTool_Pen_" + id).addClass("selected");
            $("#svg_" + id).css({ cursor: "default" });
            $("#svg_" + id).unbind();
            this.DrawLine4Board(id);
        } else
        {
            $("#WBTool_Hand_" + id).parent().find("span.selected").removeClass("selected");
        }
    }
    this.DrawLine4Board = function (tarid, isbrush)
    {
        //console.log("DrawLine4Board");
        var isDraw = false;
        var self = this;
        _boardsvg = $("#svg_" + tarid);
        $("#svg_" + tarid).unbind().bind(self.EVENTSTART, function (evt)
        {
            if (!_drawCanStart(evt))
            {
                return;
            }
            isDraw = true;
            var poz = _getPoz(evt,tarid,self.main,self.container);
            self._onEventStart(poz.x, poz.y,isbrush,tarid);

            evt.originalEvent.preventDefault();
            evt.originalEvent.stopPropagation();
            return false;
        }).bind(self.EVENTMOVE, function (evt)
        {
            if (!_drawCanStart(evt) || isDraw == false)
            {
                return;
            }
            var poz = _getPoz(evt,tarid,self.main,self.container);
            self._onEventMove(poz.x, poz.y,tarid,isbrush);

            evt.originalEvent.preventDefault();
            evt.originalEvent.stopPropagation();
            return false;

        }).bind(self.EVENTEND, function (evt)
        {
            if (isDraw == false)
            {
                return;
            }
            var poz = _getPoz(evt,tarid,self.main,self.container);
            isDraw = false;
            if (self._onEventEnd(poz.x, poz.y,tarid,isbrush))
            {
                evt.originalEvent.preventDefault();
                evt.originalEvent.stopPropagation();
                return false;
            }
            else
            {
                console.log("event end return");
                return;
            }
        }).bind(self.EVENTOUT, function (evt)
        {
            if (isDraw == false)
            {
                return;
            }

            var poz = _getPoz(evt,tarid,self.main,self.container);
            isDraw = false;
            if (self._onEventEnd(poz.x, poz.y,tarid,isbrush))
            {
                evt.originalEvent.preventDefault();
                evt.originalEvent.stopPropagation();
                return false;
            }
            else
            {
                console.log("event end return");
                return;
            }
        });
    }
    this.GetWBContainer=function(id) {
        var width = this.getViewWidth(); // GetPageContainer(PageNumber).width();
        var height = this.getViewHeight(); // GetPageContainer(PageNumber).height();//getContainerHeight
        var cheight = this.getContainerHeight();
        var html =
            "<div id='edit_" +
            id +
            "' class='boardcontainer' tabindex='11' style='position: absolute;box-sizing:border-box;  z-index:103;top:0px; left:0px;width:100%;height:100%;";
        html +=
            "background-color:white; border:1px solid #d3d3d3; border-radius:10px; box-shadow: 5px 5px 3px #d3d3d3;display:none;'>";
        html +=
            "<div class='boardhead' style='height:50px;border-bottom:1px solid #d3d3d3;border-left:1px solid #d3d3d3;border-right:1px solid #d3d3d3;width:100%; z-index:102;background-color:white;position: fixed;display: inline-block;top: 0px;left:0px;'><div style='float:left;height:100%;line-height:50px;padding-top:3px;'><span id='WBTool_Hand_" +
            id +
            "' class='WBTool_btn'><img width='20px;' title='Hand' src='"+this.ImagePath+"wb_hand.png' /></span>";
        html +=
            "<span id='WBTool_Pen_" +
            id +
            "' class='WBTool_btn selected'><img width='20px;' title='Pen' src='"+this.ImagePath+"wb_pen.png' /></span><span id='WBTool_Brush_" +
            id +
            "' class='WBTool_btn'><img width='20px;' title='Brush' src='"+this.ImagePath+"wb_brush.png' /></span>";
        html +=
            "<span id='WBTool_Del_" +
            id +
            "' class='WBTool_btn'><img width='20px;' title='Delete' src='"+this.ImagePath+"wb_delete.png' /></span>";
        html +=
            "<span id='WBTool_Undo_" +
            id +
            "' class='WBTool_btn'><img width='20px;' title='Undo' src='"+this.ImagePath+"wb_undo.png' /></span><span id='WBTool_Redo_" +
            id +
            "' class='WBTool_btn'><img width='20px;' title='Redo' src='"+this.ImagePath+"wb_redo.png' /></span>";
        //html += "<span id='WBTool_Large_" + id + "' class='WBTool_btn'><img width='20px;' title='Large' src='/static/images/wb_large.png' /></span><span id='WBTool_Small_" + id + "' class='WBTool_btn'><img width='20px;' title='Small' src='/static/images/wb_small.png' /></span>";
        html += "</div>";
        html +=
            "<div style='float:left;height:100%;line-height:50px;padding:2px 0px 0px 10px;'><span id='WBTool_Close_" +
            id +
            "' style='cursor:pointer; padding-right:10px;'><img width='20px;' title='Close' src='"+this.ImagePath+"wb_close.png' /></span></div></div><div style='height: 50px;'></div>";
        html +=
            "<div id='div_" +
            id +
            "' style='height:calc(100% - 50px);width:100%;overflow:hidden;position:relative;padding-top:0px;'>";
        html +=
            "<svg id='svg_" +
            id +
            "' width='100%' height='" +
        cheight * 3 +
            "px' version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'></svg>";
        //html += "<canvas id='canvas_" + id + "' width='" + (width - 4) + "' height='" + (height - 58) + "' style='position:absolute; left:0px; top:0px; z-index:102;'></canvas>";
        html += "</div></div>";
        return html;
    }
    this.Record = function (save,mode=0)
    {
        //console.log(this.ele);
        var obj = this.CreateRecordBaseInfo(27);
        if (save)
        {
            obj.save = 1;
        }
        obj.mode = mode;
        if (this.ele.getAttributeNode("x")) {
            obj.x = parseInt(this.ele.getAttributeNode("x").nodeValue);
        }
        if (this.ele.getAttributeNode("y")) {
            obj.y = parseInt(this.ele.getAttributeNode("y").nodeValue);
        }
        if (this.ele.getAttributeNode("width")) {
            obj.width = parseInt(this.ele.getAttributeNode("width").nodeValue);
        }
        if (this.ele.getAttributeNode("height")) {
            obj.height = parseInt(this.ele.getAttributeNode("height").nodeValue);
        }

        this.RecordHandle(obj);
        //console.log(this.name + ":Record done");
        return obj;
    }
    this.RecordLine = function (save,tarid,ele)
    {
        ele = ele || _boardline;
        var obj = this.CreateRecordBaseInfo(21, { "d": "d", "w": "stroke-width", "color": "stroke", "op": "stroke-opacity" },ele);
        if (save)
        {
            obj.save = 1;
        }
        obj.tar = "div_"+tarid;
        this.RecordHandle(obj);
        //console.log(this.name + ":Record done");
        return obj;
    }
    this.ShowSetting = function (isshow)
    {
        //console.log(this.name + ":ShowSetting:"+_selSize+","+_selColor);
        this.ShowColorSizeSetting(_selSize, _selColor, isshow,true);
    }
    this.AfterSelectSizeSetting = function (size)
    {
        _selSize = size;
    }
    this.AfterSelectColorSetting = function (color)
    {
        _selColor = color;
    }
}
Object.setPrototypeOf(ToolBoard.prototype, ToolBase.prototype)

function ToolVideo()
{
    ToolBase.call(this, "ToolVideo");
    //var LastVideoTagID = "";
    var _onSelectVideo = null;
    var _onVideoPlay = null;
    var self = this;
    this.Init = function ()
    {
        if(this.deviceType == 0 && this.target) this.target.css({ "cursor": "url('" + this.ImagePath + "video.cur" + "'),default" });

    }
    this.SetOnSelectVideo = function (onSelectVideo)
    {
        _onSelectVideo = onSelectVideo;
    }
    this.SetOnVideoPlay = function (onVideoPlay)
    {
        _onVideoPlay = onVideoPlay;
    }
    this.onClick = function (x, y)
    {
        //console.log(this.name + ":onClick done");

        var guid = GUID();
        this.VideoTagAction(guid, x, y);
        this.VideoTagEdit(guid, x, y);
        this.VideoTagSelect(guid);
        var obj = this.Record(true);
        if (this.onRecordHistory)
        {
            var arr = new Array();
            arr.push(this.RecordHistory_delete(obj.id));
            arr.push(this.RecordHistory_delete("edit_"+obj.id));
            this.onRecordHistory(arr, obj);
        }

        this.SetTool("");
        this.ele = gid(guid);
        return true;
    };
    this.Delete = function ()
    {
        this.SetActiveTool(null);
        if (!this.ele) return false;
        var obj = this.Record(true,false);
        if (this.onRecordHistory)
        {
            var arr = new Array();
            arr.push(this.RecordHistory_delete(obj.id));
            arr.push(this.RecordHistory_delete("edit_"+obj.id));
            this.onRecordHistory(obj,arr);
        }
        var id = this.ele.id;
        this.Record_delete(id);
        this.Record_delete("edit_" + id);
        $("#" + id).remove();
        $("#edit_" + id).remove();

        return true;
    }
    this.VideoTagAction = function (id, x, y, info)
    {
        //loger.log("VideoTagAction:"+x+","+y);
        if(this.deviceType == 0 && this.target) this.target.css({ "cursor": "default" });
        var container = $("#" + id);
        if (container.length == 0)
        {
            var html = '<div id="' + id + '" class="live-video-tool-container selected" style="left:' + (x - 50) + "px;top:" + (y - 50) + 'px;">';
            html += '  <div style= "position:relative;width:100%;height:100%;padding:0px;margin:0px;" >';
            html += '    <div class="live-video-tool-icon">';
            html += '      <span id="span_'+id+'"><img src="'+this.ImagePath+'icon-video.png" /></span>';
            html += "    </div>";
            html += '    <div class="live-video-tool-edit">';
            html += '      <span><img src="'+this.ImagePath+'icon-edit.png" /></span>';
            html += "    </div>";
            html += '    <div class="live-video-tool-play">';
            html += '     <span><img src="'+this.ImagePath+'icon-play.png" /></span>';
            html += '    </div><input type="hidden"></input>';
            html += "    </div >";
            html += "  </div>";
            this.container.append(html);
            container = $("#" + id);
        } else
        {
            container.css({left:x-50,top:y - 50});
            container.show();
        }
        this.SetEle(container[0]);
        if (info)
        {
            $("#" + id).find("INPUT").val(info);
        }
        else
        {
            $("#" + id).find("INPUT").val("");
        }

        container.find("div.live-video-tool-icon").unbind().bind(this.EVENTCLICK, function (e)
        {
            if (container.hasClass("selected"))
            {
                container.removeClass("selected");
            } else
            {
                container.addClass("selected");
            }
        });
        container.find("div.live-video-tool-play").unbind().bind(this.EVENTCLICK, function (e)
        {
            // if (!Context.showUploadFile)
            // {
            //     return;
            // }
            //alert("play");
            var oldInfo = $("#" + id).find("INPUT").val();
            if (oldInfo != null && oldInfo != "")
            {
                var saveinfo = JSON.parse(oldInfo);
                self.VideoTagPlay(saveinfo.id);
            } else
            {
                alert("No video to play!");
                if (self.onError) self.onError(200,"No video to play!");                 
            }
        });
        container.find("div.live-video-tool-edit").unbind().bind(this.EVENTCLICK, function (e)
        {
            // if (!Context.showUploadFile)
            // {
            //     return;
            // }
            //alert("edit");
            self.VideoTagEdit(id, parseInt(self.ele.style.left.replace("px", ""))+50, parseInt(self.ele.style.top.replace("px", "")) + 50);
        });
        if (gid("span_" + id))
        {
            Drag.init(gid("span_" + id), container[0], 50, null, 50, null);
            var objOld = null;
            container[0].onDrag = () =>
            {
                //console.log("on drag");
                if (objOld == null) objOld = this.Record(true, false);
            };
            container[0].onDragEnd = () =>
            {
                //console.log("on dragend");
                var objNew = this.Record(true);
                if (objOld != null)
                {
                    this.onRecordHistory(objOld, objNew);
                    objOld = null;
                }
            };
            container[0].canDrag = () =>
            {
                if (self.getCanEdit && self.getCanEdit() == false) return false;
                return true;
            }
        }
    };
    this.VideoTagEdit = function (id, x, y)
    {
        //console.log("VideoTagEdit:"+x+","+y);
        if (self.getCanEdit && self.getCanEdit() == false) return;
        var container = $("#edit_" + id);
        if (container.length == 0)
        {
            var showx = x + 55;
            if (x + 55 + 300 > this.container.width())
            {
                showx = x - 55 - 300;
            }
            var html = '<div id="edit_' + id + '" class="live-video-tool-editvideo" style="left:' + showx + "px;top:" + (y - 55) + 'px;">';
            html += '  <div class="live-video-tool-edit-top">';
            html += '    <span style="font-weight:bold;">Insert Video/Audio<input class="live-video-tool-info" type="hidden"></input></span>';
            html +=
                '    <span class="live-video-tool-edit-del"><img src="'+this.ImagePath+'icon-delete.png" /></span>';
            html += "    </div>";
            html += '  <div style="height:120px; text-align:left;">';
            html += '    <div class="live-video-tool-edit-listcontainer">';
            html += "       <ul>";
            html += '         <li style="width:50px">Name:</li>';
            html +=
                '         <li class="live-video-tool-edit-name" style="width:230px;text-overflow: ellipsis;overflow: hidden;height:21px;"></li>';
            html += "       </ul>";
            html += '       <ul style="clear:both;">';
            html += '         <li style="width:50px">Size:</li>';
            html +=
                '         <li class="live-video-tool-edit-length" style="width:230px;height:21px;"></li>';
            html += "       </ul>";
            html += '       <ul style="clear:both;">';
            html += '         <li style="width:50px">Time:</li>';
            html +=
                '         <li class="live-video-tool-edit-time" style="width:230px;height:21px;"></li>';
            html += "       </ul>";
            html += "     </div>";
            html += '     <div class="live-video-tool-edit-selectcontainer">';
            html +=
                '      <span class="live-video-tool-edit-selectvideo">Select Video/Audio...</span>';
            html += "    </div>";
            html +=
                '    <div class="live-video-tool-edit-changecontainer" style="display:none;">';
            html +=
                '      <span><img src="'+this.ImagePath+'icon-change.png" /></span>';
            html +=
                '       <span style="cursor:pointer;">Change Video/Audio</span>';
            html += "     </div>";
            html += "   </div>";
            html += '   <div style="height:26px; text-align:center;display:none;">';
            html +=
                '   <span class="live-video-tool-edit-recording"><label><input onclick="_cancelBubble(event);" type="checkbox"/>Enable voice recording</label></span>';
            html += "   </div>";
            html += '   <div style="height:36px; text-align:center;display:none;">';
            html += '   <span class="live-video-tool-edit-sync">Sync</span>';
            html += "   </div>";
            html += '   <div class="live-video-tool-edit-bottom">';
            html += '    <span class="live-video-tool-edit-cancel">Cancel</span>';
            html += '    <span class="live-video-tool-edit-save">Save</span>';
            html += "  </div>";
            html += "  </div>";
            this.container.append(html);
            container = $("#edit_" + id);
        } else
        {
            var showx = x + 55;
            if (x + 55 + 300 > this.container.width())
            {
                showx = x - 55 - 300;
            }
            container.css({left:showx,top:y - 55});
            container.show();
        }

        var oldInfo = $("#" + id).find("INPUT").val();
        try
        {
            if (oldInfo != null && oldInfo != "")
            {
                var saveinfo = JSON.parse(oldInfo);
                container.find("INPUT.live-video-tool-info").val(JSON.stringify(saveinfo));
                container.find("li.live-video-tool-edit-name").html(saveinfo.name);
                container.find("li.live-video-tool-edit-length").html(saveinfo.size);
                container.find("li.live-video-tool-edit-time").html(saveinfo.time);
                container.find("div.live-video-tool-edit-selectcontainer").hide();
                container.find("div.live-video-tool-edit-changecontainer").show();
            }
        } catch (exp) { }
        container.find("div.live-video-tool-edit-selectcontainer").unbind().bind(this.EVENTCLICK, function (e)
        {
            self.VideoTagSelect(id);
        });
        container.find("div.live-video-tool-edit-changecontainer").unbind().bind(this.EVENTCLICK, function (e)
        {
            self.VideoTagSelect(id);
        });
        container.find("span.live-video-tool-edit-del").unbind().bind(this.EVENTCLICK, function (e)
        {
            //alert("del");
            if (self.getCanEdit && self.getCanEdit() == false) return false;
            container.remove();
            $("#" + id).remove();
            //Record_delete(id, 1);
            self.Record_delete(id, 1);
            self.SetActiveTool(null);
        });
        container.find("span.live-video-tool-edit-save").unbind().bind(this.EVENTCLICK, function (e)
        {
            //alert("save");
            $("#" + id).find("INPUT").val(container.find("INPUT.live-video-tool-info").val());
            container.remove();
            //Record_video(gid(id), false, true);
            self.Record(true);
            self.SetActiveTool(null);
        });
        container.find("span.live-video-tool-edit-cancel").unbind().bind(this.EVENTCLICK, function (e)
        {
            //alert("cancel");
            container.remove();
            self.SetActiveTool(null);
        });
        this.SetActiveTool(this);
    }
    this.VideoTagSelect = function (id)
    {
        //LastVideoTagID = id;
        //Context.selectVideoShow();
        if (self.getCanEdit && self.getCanEdit() == false) return;
        if (_onSelectVideo) _onSelectVideo(id,this.VideoTagAfterSelect);
    }
    this.VideoTagAfterSelect = function (id,info)
    {
        //console.log("After video select:"+id);
        //alert("VideoTagAfterSelect:" + JSON.stringify(info));
        //var id = LastVideoTagID;
        var container = $("#edit_" + id);
        if (info == null)
        {
            if (container.find("INPUT.live-video-tool-info").val() == "")
            {
                $("#" + id).remove();
            }
            container.remove();
            self.SetActiveTool(null);
        } else
        {
            var objOld = self.Record(true,false);
            var saveinfo = new Object();
            saveinfo.id = info.ItemID;
            saveinfo.name = info.Title;
            saveinfo.time = info.VideoDuration;
            saveinfo.size = info.VideoSize;
            saveinfo.type = info.FileType;
            container.find("INPUT.live-video-tool-info").val(JSON.stringify(saveinfo));
            container.find("li.live-video-tool-edit-name").html(saveinfo.name);
            container.find("li.live-video-tool-edit-length").html(saveinfo.size);
            container.find("li.live-video-tool-edit-time").html(saveinfo.time);
            container.find("div.live-video-tool-edit-selectcontainer").hide();
            container.find("div.live-video-tool-edit-changecontainer").show();

            $("#" + id).find("INPUT").val(JSON.stringify(saveinfo));
            container.remove();
            //Record_video(gid(id), false, true);
            var objNew = self.Record(true);
            self.onRecordHistory(objOld, objNew);
        }

    }
    this.VideoTagPlay=function(id) {
        //Context.playVideoTag(id);
        if (self.getCanEdit && self.getCanEdit() == false) return;
        if (_onVideoPlay) _onVideoPlay(id);
    }
    this.Record = function (save,handle=true)
    {
        var obj = this.CreateRecordBaseInfo(33);
        if (save)
        {
            obj.save = 1;
        }
        obj.Left = parseInt(this.ele.style.left.replace("px", "")) + 50;
        obj.Top = parseInt(this.ele.style.top.replace("px", "")) + 50;
        if ($(this.ele).find("INPUT").val() != "")
        {
            obj.Info = JSON.parse($(this.ele).find("INPUT").val());
        }
        if (handle)
        {
            this.RecordHandle(obj);
        }
        return obj;
    }
}
Object.setPrototypeOf(ToolVideo.prototype, ToolBase.prototype)

function ToolClear()
{
    ToolBase.call(this, "ToolClear");
    this.Record = function (save,id)
    {
        //var tar = this.ele;
        var obj = this.CreateRecordBaseInfo(103);
        if (save)
        {
            obj.save = 1;
        }
        obj.id = id;
        this.RecordHandle(obj);
        return obj;
    }
    this.ClearPath = function (list)
    {
        if (list && list.length > 0)
        {
            var result = new Array();
            for (var i = 0; i < list.length; i++)
            {
                var obj = this.Record_delete(list[i], 1);
                result.push(obj);
                $("#" + list[i]).remove();
            }
            return result;
        }
        else
        {
            //Record_clear("svg" + GetFixedPageNumber(PageNumber));

            var isDelete = false;
            var paths = this.target.find(">path[isdraw='true'],>g[isdraw='true'],>circle[isdraw='true']");
            if (paths.length > 0)
            {
                paths.remove();
                isDelete = true;
            }

            this.target.find(">rect[isdraw='true']").each(function (i)
            {
                isDelete = true;
                if ($(this).attr("tp") == "board")
                {
                    $("#edit_" + $(this).attr("id")).remove();
                }
                $(this).remove();
            });
            var videos = this.container.find("div.live-video-tool-container");
            if (videos.length > 0)
            {
                videos.remove();
                isDelete = true;
            }
            if (isDelete)
            {
                return this.Record(true, "svg" + this.GetFixedPageNumber(this.pagenumber));
            }
            else
            {
                return null;
            }
        }
    }
}
Object.setPrototypeOf(ToolClear.prototype, ToolBase.prototype)

function ToolSelect()
{
    ToolBase.call(this, "ToolSelect");
    var _onSelectEle = null;
    var _isMove = false;
    var _startX = -1;
    var _startY = -1;
    var _lastX = -1;
    var _lastY = -1;
    var _startSX = -1;
    var _startSY = -1;
    var _isSetPoz = false;
    this.SetOnSelectEle = function (onSelectEle)
    {
        //console.log("SetOnSelectEle");
        _onSelectEle = onSelectEle;
    }
    this.onStart = function (x, y)
    {
        if (typeof(GLOBAL_DRIVE_TYPE)!="undefined" && GLOBAL_DRIVE_TYPE == 3)
        {
            _startX = x;
            _startY = y;
            _lastX = x;
            _lastY = y;
            _startSX = this.main.scrollLeft();
            _startSY = this.main.scrollTop();
            _isSetPoz = false;
            return false;
        }
        if (this.deviceType != 0 || this.canEdit==false) {
            return false;
        }

        _isMove = false;
        this.target.find("rect[tp='select']").remove();
        this.ele = this.CreateEle("rect", { "isdraw": 'true', "tp": 'select', "style": 'stroke:blue;stroke-dasharray:5;stroke-width:1;fill-opacity:0;', "width": 0, "height": 0 });
        this.ele.setAttribute('x', x);
        this.ele.setAttribute('y', y);
        this.ele.setAttribute('sx', x);
        this.ele.setAttribute('sy', y);

        this.Append();
        //this.Record();
        return false;
    };
    this.onMove = function (x, y)
    {
        //console.log(this.name + ":onMove done");
        if (typeof(GLOBAL_DRIVE_TYPE)!="undefined" && GLOBAL_DRIVE_TYPE == 3)
        {

            var diffx = x - _startX;
            var diffy = y - _startY;
            if (_isSetPoz==false && Math.abs(x-_lastX)+Math.abs(y-_lastY)>10)
            {
                _isSetPoz = true;
                this.main.scrollLeft(Math.max(0, Math.min(_startSX- diffx, this.main[0].scrollWidth)));
                this.main.scrollTop(Math.max(0, Math.min(_startSY-diffy, this.main[0].scrollHeight)));
                _lastX = x;
                _lastY = y;
            }
            else if (_isSetPoz==true)
            {
                _isSetPoz = false;
            }
            _isMove = true;

            return false;
        }
        if (this.deviceType != 0 || this.canEdit==false) {
            return false;
        }
        if (!this.ele) {
            return false;
        }
        var oldx = parseInt(this.ele.getAttributeNode("sx").nodeValue);
        var oldy = parseInt(this.ele.getAttributeNode("sy").nodeValue);

        var diffx = x - oldx;
        var diffy = y - oldy;

        if (diffx >= 0 && diffy >= 0)
        {
            this.ele.setAttribute('width', diffx);
            this.ele.setAttribute('height', diffy);
        }
        else if (diffx < 0 && diffy < 0)
        {
            this.ele.setAttribute('x', oldx + diffx);
            this.ele.setAttribute('y', oldy + diffy);
            this.ele.setAttribute('width', - diffx);
            this.ele.setAttribute('height', - diffy);
        }
        else if (diffx >= 0 && diffy < 0)
        {
            this.ele.setAttribute('y', oldy + diffy);
            this.ele.setAttribute('width', diffx);
            this.ele.setAttribute('height', - diffy);
        }
        else if (diffx < 0 && diffy >= 0)
        {
            this.ele.setAttribute('x', oldx + diffx);
            this.ele.setAttribute('width', - diffx);
            this.ele.setAttribute('height', diffy);
        }
        //this.Record();
        return false;
    };
    this.onEnd = function (x, y)
    {
        if (typeof (GLOBAL_DRIVE_TYPE) != "undefined" && GLOBAL_DRIVE_TYPE == 3)
        {
            return true;
        }
        if (this.deviceType != 0 || this.canEdit==false) {
            return false;
        }
        if (!this.ele) {
            return false;
        }
        var x = parseInt(this.ele.getAttributeNode("x").nodeValue);
        var y = parseInt(this.ele.getAttributeNode("y").nodeValue);
        var width = parseInt(this.ele.getAttributeNode("width").nodeValue);
        var height = parseInt(this.ele.getAttributeNode("height").nodeValue);
        _isMove = width + height > 8;
        //console.log(this.ele.id);
        $(this.ele).remove();
        this.SelectEle(x, y, width, height);
        return _isMove;
    };
    this.onClick = function (x, y)
    {
        //console.log(this.deviceType+",onClick:"+x+","+y);
        return _isMove;
    }
    this.SelectEleQuick = function (x, y, width, height)
    {
        var self = this;
        this.target.find(">path[isdraw='true']").each(function (i)
        {
            var tp = $(this).attr("tp");
            if (!tp || (tp != "line" && tp != "sline" && tp != "brush"))
            {
                return;
            }
            var rect = $(this)[0].getBoundingClientRect();
            if (self.isIntersectRect(x, y, width, height, rect))
            {
                if (_onSelectEle) _onSelectEle($(this).attr("id"),1);
            }
        });
    }
    this.SelectEle = function (x, y, width, height)
    {
        var self = this;
        var getRect = function (x1, y1, x2, y2)
        {
            var result = new Object();
            result.x = Math.min(x1, x2);
            result.y = Math.min(y1, y2);
            result.width = Math.abs(x1 - x2);
            result.height = Math.abs(y1 - y2);
            return result;
        }
        var getLine = function (x1, y1, x2, y2)
        {
            var result = new Object();
            result.x1 = x1;
            result.x2 = x2;
            result.y1 = y1;
            result.y2 = y2;
            return result;
        }
        this.target.find(">path[isdraw='true']").each(function (i)
        {
            var tp = $(this).attr("tp");
            if (!tp || (tp != "line" && tp != "sline" && tp != "brush"))
            {
                return;
            }
            var rect = $(this)[0].getBoundingClientRect();
            var container = self.main.find(">div")[0];
            rect.y += $(document).scrollTop() + self.main.scrollTop() - container.offsetTop;
            rect.x += $(document).scrollLeft() + self.main.scrollLeft() - container.offsetLeft;
            //选择区的4条边
            var l1 = getLine(x, y, x, y + height);
            var l2 = getLine(x, y, x + width, y);
            var l3 = getLine(x, y + height, x + width, y + height);
            var l4 = getLine(x + width, y, x + width, y + height);
            if (self.isIntersectRect(x, y, width, height, rect))
            {
                var arr = $(this).attr("d").split("L");//M621,125 L620,133 L613,154 L605,174
                var lastx = -1, lasty = -1;
                for (var m = 0, n = arr.length; m < n; m++)
                {
                    var p = arr[m].split(",");
                    var px = parseFloat(p[0].replace("M", "").replace(" ", ""));
                    var py = parseFloat(p[1].replace("M", "").replace(" ", ""));
                    if (m > 0)
                    {
                        var r = getRect(lastx, lasty, px, py);
                        if (self.isInsideRect(x, y, width, height, r))
                        {
                            if (_onSelectEle) _onSelectEle($(this).attr("id"), 1);
                            break;
                        }
                        var line = getLine(lastx, lasty, px, py);
                        if (self.isIntersectLine(line, l1) || self.isIntersectLine(line, l2)
                            || self.isIntersectLine(line, l3) || self.isIntersectLine(line, l4))
                        {
                            if (_onSelectEle) _onSelectEle($(this).attr("id"), 1);
                            break;
                        }
                    }
                    lastx = px;
                    lasty = py;
                }
            }
        });
    }
    this.Record = function (save,id)
    {
        //var tar = this.ele;
        var obj = this.CreateRecordBaseInfo(104);
        if (save)
        {
            obj.save = 1;
        }
        obj.id = id;
        this.RecordHandle(obj);
        return obj;
    }
}
Object.setPrototypeOf(ToolSelect.prototype, ToolBase.prototype)
//tool end------------------------------------------------------------------------------------------------------------------------------------------------

function DocumentView()
{
    var _onError = null;
    var _onDownload = null;
    var CurrentScale = 1;
    var _sizeMode = 0;
    var _sizeDiff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 20 : 10;
    var _deviceType = 0;

    this.main = null;
    this.pagenumber = 1;
    this.VerticalInMiddle = true;

    this.ShowError=function(code,obj)
    {
        if (_onError) _onError(code,obj);
    }
    this.ShowDownload=function(pagenumber,process)
    {
        if (_onDownload) _onDownload(pagenumber,process);
    }
    this.SetOnError = function (error)
    {
        _onError = error;
    }
    this.SetOnDownload = function (download)
    {
        _onDownload = download;
    }
    this.SetMain = function (main)
    {
        this.main = main;
    }
    this.SetParamter = function (main, pagenumber)
    {
        this.main = main;
        this.pagenumber = pagenumber;
    }
    this.SetPageNumber = function (pagenumber)
    {
        this.pagenumber = pagenumber;
        CurrentScale = 1;
    }
    this.SetSizeMode = function (mode)
    {
        _sizeMode = mode;
    }
    this.SetSizeDiff = function (diff)
    {
        _sizeDiff = diff;
    }
    this.SetDeviceType = function (type)
    {
        _deviceType = type;
    }
    this.SetVerticalInMiddle = function (ismiddle)
    {
        this.VerticalInMiddle = ismiddle;
    }
}

function CanvasDocumentView()
{
    DocumentView.call(this);
    var _sizeMode = 0;
    var CurrentScale = 1;
    var PDFCOUNT = 1;
    var PDFURL = "";
    var PDFLoadDoc = null;
    var PDFOBJ = null;
    var IsLoadingPage = false;

    this.SetSizeMode = function (mode)
    {
        _sizeMode = mode;
    }

    this.ShowPDF = function (Url, pageNum, callback,afterload,onprocess)
    {
        //console.log("ShowPDF:"+pageNum+"," + Url);
        this.pagenumber = pageNum;
        //PDFCOUNT = this.GetPdfCount(Url);
        PDFURL = Url;
        CurrentScale = 1;
        if (!this.main)
        {
            if (callback) callback(false, PDFCOUNT);
            return;
        }
        this.main.empty();

        PDFLoadDoc = PDFJS.getDocument(Url, null, null, obj=>
        {
            if (onprocess) onprocess(obj.loaded / obj.total);
        });
        PDFLoadDoc.then(pdf=>
        {
            PDFOBJ = pdf;
            PDFCOUNT = pdf.numPages;

            this.ShowImagePageEx(pageNum, (issuccess)=>
            {
                IsLoadingPage = false;
                if (issuccess == false)
                {
                    if (callback) callback(false);
                    return;
                }
                if (AfterLoadPDF) AfterLoadPDF(pageNum);
                if (callback) callback(true);
            }, false, pdf,true,afterload);
        }, (err)=>
        {
            IsLoadingPage = false;
            PDFLoadDoc = null;
            if (err.message != "Loading aborted")
            {
                if (callback) callback(false);
            }
        });

        // this.ShowImagePageEx(pageNum, ()=>
        // {
        //     if (callback) callback(true, PDFCOUNT);
        // }, false, this.GetPdfPageUrl(Url, pageNum), false,afterload)
    }

    this.ShowPDFPage = function (pageNum, callback, ishide, needScale)
    {
        this.pagenumber = pageNum;
        this.ShowImagePageEx(pageNum, (issuccess)=>
        {
            if (callback) callback(issuccess);
        }, ishide, this.GetPdfPageUrl(PDFURL, pageNum), needScale);
    }

    this.ShowImagePageEx = function (pageNum, callback, ishide, pdf, needScale,afterload)
    {
        if (PDFOBJ == null && pdf)
        {
            PDFOBJ = pdf;
        }
        if (PDFOBJ == null)
        {
            if (PDFURL != "")
            {
                ShowPDFFile(PDFURL, pageNum, null, callback,afterload);
            }
            return;
        }
        if (typeof (needScale) == "undefined")
        {
            needScale = false;
        }
        PDFOBJ.getPage(pageNum).then(function (page)
        {
            var scale = window.devicePixelRatio || 1;
            var viewport = page.getViewport(scale);

            var canvas = document.getElementById('canvas' + pageNum);
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };


            page.render(renderContext).then(function ()
            {

                if (needScale == true && IsToolBarShow)
                {
                    Record_view();
                }
                if (callback) callback(true);
            }, function (err)
                {
                    PDFRender = null;
                    if (err != "cancelled" && callback) callback(false);
                });

        });

        if ($("#pageContainer" + pageNum).length > 0)
        {
            $("#pageContainer" + pageNum).remove();
        }
        //var img = new Image();
        var container = document.createElement('div');
        container.id = 'pageContainer' + pageNum;
        container.className = 'pageContainer';
        //container.style.display = "inline-block";
        if (typeof (ishide) != "undefined" && ishide == true)
        {
            container.style.display = "none";
        }
        else
        {
            ishide = false;
            CurrentScale = 1;
            this.pagenumber = pageNum;
        }
        if (_sizeMode == 0)
        {
            container.style.width = this.getViewWidth()-_sizeDiff + 'px';
            container.style.height = this.getViewHeight() + 'px';
            container.setAttribute('CW', this.getViewWidth() - _sizeDiff);
            container.innerHTML = "<canvas id='canvas" + pageNum + "' style='position:absolute;width:100%;top:0px;'></canvas><svg id='svg" + pageNum + "' style='position:relative;top:0px;left:0px;'  width='100%' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'></svg>";
        }
        else if (_sizeMode == 1)
        {
            container.style.width = this.getViewWidth() + 'px';
            container.style.height = this.getViewHeight() + 'px';
            container.setAttribute('CH', this.getViewHeight());
            container.innerHTML = "<canvas id='canvas" + pageNum + "' style='position:absolute;height:100%;top:0px;'></canvas><svg id='svg" + pageNum + "' style='position:relative;top:0px;left:0px;'  width='100%' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'></svg>";

        }
        else if (_sizeMode == 2)
        {
            container.style.width = this.getViewWidth()-_sizeDiff + 'px';
            container.style.height = this.getViewHeight() + 'px';
            container.setAttribute('CW', this.getViewWidth() - _sizeDiff);
            container.setAttribute('CH', this.getViewHeight() );
            container.innerHTML = "<canvas id='canvas" + pageNum + "' style='position:absolute;width:100%;top:0px;'></canvas><svg id='svg" + pageNum + "' style='position:relative;top:0px;left:0px;'  width='100%' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'></svg>";

        }
        this.main.append(container);




        this.CheckZoom();
        if (callback) callback(true);
    }
}
Object.setPrototypeOf(CanvasDocumentView.prototype, DocumentView.prototype)

function ImageDocumentView()
{
    DocumentView.call(this);
    var CurrentScale = 1;
    var PDFCOUNT = 1;
    var PDFURL = "";
    var MIN_SCALE = 0.20, MAX_SCALE = 5.0;
    var _sizeMode = 0;
    var _sizeDiff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 20 : 10;
    var _deviceType = 0;

    this.SetPageNumber = function (pagenumber)
    {
        this.pagenumber = pagenumber;
        CurrentScale = 1;
    }

    this.SetSizeMode = function (mode)
    {
        _sizeMode = mode;
    }
    this.SetSizeDiff = function (diff)
    {
        _sizeDiff = diff;
    }
    this.SetDeviceType = function (type)
    {
        _deviceType = type;
    }

    this.SetUrl=function(url)
    {
        PDFURL=url;
    }

    this.getViewHeight = function ()
    {
        return this.main.height();
    }
    this.getViewWidth = function ()
    {
        return this.main.width();
    }
    this.GetPdfPageUrl = function (Url, pageNum)
    {
        var result = Url.replace(/\<\d+\>/ig, pageNum);
        //result = result.replace(/pdf\.peertime/ig, "pdf" + (pageNum%10)+".peertime");
        return result;
    }
    this.GetPdfCount = function (Url)
    {
        var re = Url.match(/\<\d+\>/ig);
        if (!re || re.length == 0)
        {
            return 1;
        }
        return parseInt(re[0].replace(/\<|\>/ig, ""));
    }
    this.AdjustURL = function (Url)
    {
        if (_deviceType != 0)
        {
            return Url;
        }
        var w = Math.max(screen.width, screen.height);
        var r = window.devicePixelRatio || 1;
        w = w * r;
        if (w <= 1024)
        {
            return Url;
        }
        else if (w>= 1920)
        {
            return Url.replace("\>.", "\>_4K.");
        }
        else
        {
            return Url.replace("\>.", "\>_2K.");
        }
    }
    this.ShowPDF = function (Url, pageNum, callback,afterload)
    {
        //console.log("ShowPDF:"+pageNum+"," + Url);
        this.pagenumber = pageNum;
        Url = this.AdjustURL(Url);
        PDFCOUNT = this.GetPdfCount(Url);
        PDFURL = Url;
        CurrentScale = 1;
        if (!this.main)
        {
            if (callback) callback(false, PDFCOUNT);
            return;
        }
        this.main.empty();
        this.ShowImagePageEx(pageNum, ()=>
        {
            if (callback) callback(true, PDFCOUNT);
        }, false, this.GetPdfPageUrl(Url, pageNum), false,afterload)
    }
    this.ShowPDFPage = function (pageNum, callback, ishide, needScale)
    {
        //console.log("ShowPDFPage:"+pageNum);
        this.pagenumber = pageNum;
        this.ShowImagePageEx(pageNum, (issuccess)=>
        {
            if (callback) callback(issuccess);
        }, ishide, this.GetPdfPageUrl(PDFURL, pageNum), needScale);
    }
    this.ShowImagePageEx = function (pageNum, callback, ishide, url, needScale,afterload)
    {
        //console.log("ShowImagePageEx:"+pageNum);
        if ($("#pageContainer" + pageNum).length > 0)
        {
            $("#pageContainer" + pageNum).remove();
        }
        //var img = new Image();
        var container = document.createElement('div');
        container.id = 'pageContainer' + pageNum;
        container.className = 'pageContainer';
        //container.style.display = "inline-block";
        if (typeof (ishide) != "undefined" && ishide == true)
        {
            container.style.display = "none";
        }
        else
        {
            container.style.display = "none";
            ishide = false;
            CurrentScale = 1;
            this.pagenumber = pageNum;
        }
        if (_sizeMode == 0)
        {
            container.style.width = this.getViewWidth()-_sizeDiff + 'px';
            container.style.height = this.getViewHeight() + 'px';
            container.setAttribute('CW', this.getViewWidth() - _sizeDiff);
            container.innerHTML = "<div id='canvas" + pageNum + "' style='position:absolute;width:100%;top:0px;'><img id='img_" + pageNum + "' style='width:100%;'></div><svg id='svg" + pageNum + "' style='position:relative;top:0px;left:0px;'  width='100%' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'></svg>";
        }
        else if (_sizeMode == 1)
        {
            container.style.width = this.getViewWidth() + 'px';
            container.style.height = this.getViewHeight() + 'px';
            container.setAttribute('CH', this.getViewHeight());
            container.innerHTML = "<div id='canvas" + pageNum + "' style='position:absolute;height:100%;top:0px;'><img id='img_" + pageNum + "' style='height:100%;'></div><svg id='svg" + pageNum + "' style='position:relative;top:0px;left:0px;'  width='100%' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'></svg>";

        }
        else if (_sizeMode == 2)
        {
            container.style.width = this.getViewWidth()-_sizeDiff + 'px';
            container.style.height = this.getViewHeight() + 'px';
            container.setAttribute('CW', this.getViewWidth() - _sizeDiff);
            container.setAttribute('CH', this.getViewHeight() );
            container.innerHTML = "<div id='canvas" + pageNum + "' style='position:absolute;width:100%;top:0px;'><img id='img_" + pageNum + "' style='width:100%;height:100%;'></div><svg id='svg" + pageNum + "' style='position:relative;top:0px;left:0px;'  width='100%' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'></svg>";

        }
        this.main.append(container);
        var img = gid("img_" + pageNum);
        var self = this;
        if (img)
        {
            img.onload = function()
            {
                $("#" + $(this).attr("id").replace("img_", "pageContainer")).attr("showerror", "0");
                if (self.pagenumber + "" != $(this).attr("id").replace("img_", ""))
                {
                    if (_sizeMode == 0)
                    {
                        $("#" + $(this).attr("id").replace("img_", "pageContainer")).height(self.getViewWidth() * this.height / this.width);
                    }
                    else if (_sizeMode == 1)
                    {
                        $("#" + $(this).attr("id").replace("img_", "pageContainer")).width(self.getViewHeight() * this.width / this.height);
                    }
                    else if (_sizeMode == 2)
                    {

                    }
                }
                else
                {
                    //console.log( $(img).attr("id").replace("img_", "pageContainer"));
                    $("#" + $(this).attr("id").replace("img_", "pageContainer")).show();
                    //console.log($(this).attr("id")+":show");
                    if (_sizeMode == 0)
                    {
                        $("#" + $(this).attr("id").replace("img_", "pageContainer")).height(this.height);
                    }
                    else if (_sizeMode == 1)
                    {
                        $("#" + $(this).attr("id").replace("img_", "pageContainer")).width(this.width);
                    }
                    else if (_sizeMode == 2)
                    {

                    }
                    self.CheckZoom();
                }

                self.ShowDownload(self.pagenumber, 100);
                if (afterload) afterload();
            };
            img.onerror = function (ex)
            {
                if (this.src && this.src.indexOf("_4K.") > 0)
                {
                    this.src = this.src.replace("_4K.", "_2K.");
                }
                else if (this.src && this.src.indexOf("_2K.") > 0)
                {
                    this.src = this.src.replace("_2K.", ".");
                }
                else
                {
                    $("#" + $(this).attr("id").replace("img_", "pageContainer")).attr("showerror", "1");
                    //console.log(ishide);
                    if (self.pagenumber + "" == $(this).attr("id").replace("img_", ""))
                    {
                        self.ShowError(100, {PageUrl:this.src, DocUrl:PDFURL });
                        self.ShowDownload(self.pagenumber, -1);
                    }

                    // if ($(this).attr("retry"))
                    // {
                    //     var retry = parseInt($(this).attr("retry"));
                    //     if (retry >= 1)
                    //     {
                    //         self.ShowError(100,this.src);
                    //         return;
                    //     }
                    //     $(this).attr("retry", retry + 1);
                    //     setTimeout(function () { img.src = url; }, 1000 + retry * 1000);
                    // }
                    // else
                    // {
                    //     $(this).attr("retry", "1");
                    //     setTimeout(function () { img.src = url; }, 1000);
                    // }

                }

                //console.log(ex);
                //console.log(this.src);
            };
            img.src = url;
        }

        this.CheckZoom();
        if (callback) callback(true);
        this.ShowDownload(pageNum, 0);
    }
    this.ZoomIn = function ()
    {
        var newScale = CurrentScale;
        var preScale = CurrentScale
        newScale = (newScale * 1.1).toFixed(2);
        newScale = Math.ceil(newScale * 10) / 10;
        newScale = Math.min(MAX_SCALE, newScale);
        CurrentScale = newScale;
        this.SizeChanged(newScale);
        return newScale;
    }
    this.ZoomOut = function ()
    {
        var newScale = CurrentScale;
        var preScale = CurrentScale
        newScale = (newScale / 1.1).toFixed(2);
        newScale = Math.floor(newScale * 10) / 10;
        newScale = Math.max(MIN_SCALE, newScale);
        CurrentScale = newScale;
        this.SizeChanged(newScale);
        return newScale;
    }
    this.SizeChanged = function (scale)
    {
        CurrentScale = scale;
        if (!this.main) return;
        if (_sizeMode == 0)
        {
            var newW = this.getViewWidth() * scale;
            if (scale == 1)
            {
                newW -= 10;
            }
            $("#pageContainer" + this.pagenumber).css({ "width": newW }).attr("CW", newW);
            $("#canvas" + this.pagenumber).width(newW);
            $("#pageContainer" + this.pagenumber).height($("#img_" + this.pagenumber).height());
        }
        else if (_sizeMode == 1)
        {
            var newW = this.getViewHeight() * scale;
            if (scale == 1)
            {
                newW -= 10;
            }
            $("#pageContainer" + this.pagenumber).css({ "height": newW }).attr("CH", newW);
            $("#canvas" + this.pagenumber).height(newW);
            $("#pageContainer" + this.pagenumber).width($("#img_" + this.pagenumber).width());
        }
        else if (_sizeMode == 2)
        {

        }
        this.CheckZoom();
    }
    this.CheckZoom = function ()
    {
        if (!this.VerticalInMiddle) return;

        var mh = this.main.height();
        var ch=$("#pageContainer"+this.pagenumber).height();
        if(ch<mh)
        {
            let t = (mh - ch) / 2;
            if (t > 10 && t <= 20)
            {
                t -= 5;
            }
            else if (t > 20 && t <= 50)
            {
                t -= 10;
            }
            else if (t > 50)
            {
                t -= 20;
            }
            $("#pageContainer"+this.pagenumber).css("top",t+"px");
            $("#pageContainer"+this.pagenumber).find("div.boardhead").css("top",(mh-ch)/2+"px");
        }
        else
        {
            $("#pageContainer"+this.pagenumber).css("top","");
            $("#pageContainer"+this.pagenumber).find("div.boardhead").css("top","");
        }
    }
    this.GetScale = function ()
    {
        return CurrentScale;
    }
}
Object.setPrototypeOf(ImageDocumentView.prototype, DocumentView.prototype)

/**文档白板工具类
 * @returns {WhiteBoardTool} - 工具对象
*/
function WhiteBoardTool()
{
    var _currentTool = null;
    var _lastTool = "";
    var _main = null;
    var _svg = null;
    var _container = null;
    var _onReceiveData = null;
    var _onError = null;
    var _onDownload = null;
    var _onSetTool = null;
    var _onChangePage = null;
    var _onSelectVideo = null;
    var _onBoardDisplayChange = null;
    var _onVideoPlay = null;
    var _onUndoRedoStatChange = null;
    var _pagenumber = 0;
    var _pagecount = 1;
    var _pdfurl = "";
    var _atmid = 0;
    var EVENTSTART = "pointerdown", EVENTMOVE = "pointermove", EVENTEND = "mouseup pointerup", EVENTCLICK = "click",EVENTOUT="pointerleave";
    //var EVENTSTART = "touchstart", EVENTMOVE = "touchmove", EVENTEND = "touchend", EVENTCLICK = "click";
    var _tool = null;
    var _activeTool = null;
    var _isRecord = false;
    var _isBindEvent = false;
    var _deviceType = 0;
    var _doc = new ImageDocumentView();
    var _canEdit = true;
    var _isMouseShow = false;
    var _mouseHistory = new Array();
    var _sendMousePozTimer = null;
    var _sendMouseOutTimer = null;
    var _preMouseNode = [0,0];
    var _isDraw = false;
    var _sizeMode = 0;
    var _selectLineList = new Array();
    var _undoList = new Array();
    var _redoList = new Array();

    function _drawCanStart(evt)
    {
        if (!_svg) return false;
        var oevt = evt.originalEvent;
        if (oevt['touches'] && oevt['touches'].length > 1) {
            return false;
        }
        if (typeof(oevt.isPrimary)!="undefined" && oevt.isPrimary==false)
        {
            return false;
        }
        var tar = $(oevt.target);
        if (tar.attr("id") == "media-header" || tar.attr("id") == "media-panel-actions" || (tar[0].tagName.toLowerCase() != "svg" && tar.parent()[0].tagName.toLowerCase() != "svg"))
        {
            return false;
        }
        if (oevt.pointerType && oevt.pointerType == "mouse")
        {
            if (typeof(oevt.buttons)!="undefined" && oevt.buttons == 0)
            {
                return false;
            }
            return (oevt.button == 1 || oevt.button == 0|| oevt.button == -1)
        }
        else
        {
            return true;
        }
    }
    function _drawCanStart4Pointer(evt)
    {

        if (!_svg) return false;
        var pressure = 0;
        var e = _drawGetEvent(evt);
        if (e.pressure)
        {
            pressure = Math.min(1, e.pressure);
        }

        if (pressure === 0 || pressure === 0.5 || pressure > 1)
        {
            return false;
        }
        return true;
    }

    function _drawGetEvent(evt)
    {
        if (evt.originalEvent['touches'] && evt.originalEvent['touches'].length>0) {
            return evt.originalEvent['touches'][0];
        }
        return evt.originalEvent;
    }
    function _drawGetTop()
    {
        return $(document).scrollTop() - _drawGetBoundingTop();
    }
    function _drawGetLeft()
    {
        return $(document).scrollLeft() - _drawGetBoundingLeft();
    }
    function _drawGetBoundingLeft()
    {
        var bleft = _container[0].getBoundingClientRect().left;

        //bleft = Math.max(bleft, 0);
        return bleft;
    }
    function _drawGetBoundingTop()
    {
        var bleft = _container[0].getBoundingClientRect().top;

        //bleft = Math.max(bleft, 0);
        return bleft;
    }
    function _getPoz(evt)
    {
        var tch = _drawGetEvent(evt);
        var left = _drawGetLeft();
        var top = _drawGetTop();
        var diffx = 0, diffy = 0;

        var x = getZoomed((tch.clientX | 0) - diffx + left);
        var y = getZoomed((tch.clientY | 0) - diffy + top);
        return { x: x, y: y };
    }
    function getZoomed(p)
    {
        return Math.round(p);
    }

    function _onEventStart(x, y)
    {
        _tool.ShowSetting(false);
        return _tool.onStart(x, y);

    }
    function _onEventMove(x, y)
    {
        //console.log("_onEventMove");
        return _tool.onMove(x, y);

    }
    function _onEventEnd(x, y)
    {
        return _tool.onEnd(x, y);
    }

    function _onEventClick(x, y)
    {
        if (!_tool) return false;
        return _tool.onClick(x, y);
    }

    function _unbindtoolevent()
    {
        //console.log("_unbindtoolevent");
        _isBindEvent = false;
        if(_main)
        {
            _main.unbind(EVENTSTART + " " + EVENTEND);
        }
    }
    function _bindtoolevent()
    {
        if (!_main)
        {
            return;
        }
        //console.log("bindtoolevent");
        _isBindEvent = true;

        _main.unbind(EVENTSTART + " " + EVENTEND).bind(EVENTSTART, function (evt)
        {
            if (!_drawCanStart(evt))
            {

                return;
            }
            _isDraw = true;
            var poz = _getPoz(evt);
            if (_onEventStart(poz.x, poz.y))
            {
                evt.originalEvent.preventDefault();
                evt.originalEvent.stopPropagation();
                return false;
            }

        }).bind(EVENTEND, function (evt)
        {
            //console.log("mouseup:"+evt.originalEvent.pointerType);
            if (_isDraw == false)
            {
                return;
            }
            var poz = _getPoz(evt);
            _isDraw = false;
            if (_onEventEnd(poz.x, poz.y))
            {
                evt.originalEvent.preventDefault();
                evt.originalEvent.stopPropagation();
                return false;
            }
            else
            {
                return;
            }
        }).bind(EVENTMOVE, function (evt)
        {
            //console.log("EVENTMOVE4704");
            if (!_drawCanStart(evt) || _isDraw == false)
            {
                //console.log("move 7345");
                return;
            }
            //buttons: chrome->0:none 1:left 2:right 3:left+right 7: left+right+mid
            //console.log(evt.originalEvent.button+","+evt.originalEvent.buttons);
            var poz = _getPoz(evt);
            if (_onEventMove(poz.x, poz.y))
            {
                evt.originalEvent.preventDefault();
                evt.originalEvent.stopPropagation();
                return false;
            }
        }).bind(EVENTOUT, function (evt)
        {
            //console.log("out");
            if (_isDraw == false)
            {
                return;
            }
            var poz = _getPoz(evt);
            _isDraw = false;
            if (_onEventEnd(poz.x, poz.y))
            {
                evt.originalEvent.preventDefault();
                evt.originalEvent.stopPropagation();
                return false;
            }
            else
            {
                return;
            }
        });
    }
    function _bindScrollMouseClickevent()
    {
        var bodyScroolTimer = null;
        var onMainScroll = function (e)
        {
            if (bodyScroolTimer) {
                clearTimeout(bodyScroolTimer);
            }
            bodyScroolTimer = setTimeout(() => {
                Record_view();
            }, 200);
        };
        _main.unbind("scroll", onMainScroll).unbind("mousemove", Record_mouse).unbind("mouseout", Record_mouseout).unbind("click", _onMouseClick);
        _main.bind("scroll", onMainScroll).bind("mousemove", Record_mouse).bind("mouseout", Record_mouseout).bind("click",_onMouseClick);
    }
    function _onMouseClick(evt)
    {
        var poz = _getPoz(evt);
        if (_onEventClick(poz.x, poz.y))
        {
            evt.originalEvent.preventDefault();
            evt.originalEvent.stopPropagation();
            return false;
        }
        else
        {
            //console.log("click end return");
            //console.log(evt.originalEvent.target);
            var tar = $(evt.originalEvent.target);

            if (_currentTool=="" && _canEdit && tar.attr("isdraw") == "true" && (tar.attr("tp") == "line" || tar.attr("tp") == "sline" || tar.attr("tp") == "brush"))
            {
                var oValue = tar.attr("class");
                if (!oValue || oValue == "")
                {
                    _addSelectStyle(tar.attr("id"),1);
                    // tar.attr("class", "WB_SelectPath");
                    // _add2SelectList(tar.attr("id"));
                    // Record_select(tar.attr("id"),1);
                }
                else
                {
                    tar.removeAttr("class");
                    _removeFromSelectList(tar.attr("id"));
                    Record_select(tar.attr("id"),0);
                }
            }
            else if (_currentTool == "" && _canEdit && !tar.is("path,rect"))
            {
                _clearSelectList();
            }

            Record_click(evt);
            //return false;
        }
    }
    function _onMouseMove(evt)
    {
        console.log("_onMouseMove:"+_isDraw);
        if (_isDraw == false || !_drawCanStart(evt))
        {
            console.log("before Record_mouse");
            Record_mouse(evt);
            return;
        }
        var poz = _getPoz(evt);
        _onEventMove(poz.x, poz.y);
        return;

        // evt.originalEvent.preventDefault();
        // evt.originalEvent.stopPropagation();
        // return false;
    }
    function _getTool(tool)
    {
        var result = null;
        switch (tool)
        {
            case "ToolPen":
                result = new ToolPen();//new ToolPenEx();
                break;
            case "ToolLine":
                result = new ToolLine();
                break;
            case "ToolBrush":
                result = new ToolBrush();
                break;
            case "ToolText":
                result = new ToolText();
                break;
            case "ToolNote":
                result = new ToolNote();
                break;
            case "ToolBoard":
                result = new ToolBoard();
                break;
            case "ToolVideo":
                result = new ToolVideo();
                break;
            case "ToolClear":
                result = new ToolClear();
                break;
            case "":
                result = new ToolSelect();
                break;
            default:
                result = null;
        }
        return result;
    }
    function _addSelectStyle(id,stat)
    {
        var tar = $("#" + id);
        var rect = gid(id).getBBox();//getBoundingClientRect();
        if (rect.width+rect.height<10)
        {
            tar.attr("class", "WB_SelectPathSmall");
        }
        else
        {
            tar.attr("class", "WB_SelectPath");
        }
        _add2SelectList(id);
        Record_select(id,1);
    }
    function _add2SelectList(id)
    {
        var index = FindItemInArr(_selectLineList, id);
        if (index == -1)
        {
            _selectLineList.push(id);
        }
    }
    function _removeFromSelectList(id)
    {
        var index = FindItemInArr(_selectLineList, id);
        if (index > -1)
        {
            _selectLineList.splice(index, 1);
        }

    }
    function _clearSelectList()
    {
        for (var i = 0, j = _selectLineList.length; i < j; i++)
        {
            $("#"+_selectLineList[i]).removeAttr("class");
            Record_select(_selectLineList[i],0);
        }
        _selectLineList=[];
    }
    function _clearUndoRedoList()
    {
        _undoList = [];
        _redoList = [];
    }
    function _checkRecordStep(x, y)
    {
        var sum = Math.abs(x - _preMouseNode[0]) + Math.abs(y - _preMouseNode[1]);
        var result = sum >= 60;
        if (result)
        {
            _preMouseNode = [x,y];
        }
        return result;
    }

    function getContainerWidth()
    {
        return _container.width();
    }
    function getContainerHeight()
    {
        return _container.height();
    }
    function getViewHeight()
    {
        return _main.height();
    }
    function getViewWidth()
    {
        return _main.width();
    }

    function triggerOnReocrd(data)
    {
        if (!_isRecord) return;
        if (_onReceiveData)
        {
            if (_atmid && _atmid != 0 &&!data.atmid)
            {
                data.atmid = _atmid;
            }
            _onReceiveData(data);
        }
    }

    function showError(code,obj)
    {
        if (_onError) _onError({Code:code,Data:obj});
    }

    function Record_view()
    {
        if (!_container || !_main) return;
        var obj = new Object();
        obj.type = 32;
        obj.page = _pagenumber;
        obj.CW = getContainerWidth();
        obj.CH = getContainerHeight();
        obj.VW = getViewWidth();
        obj.VH = getViewHeight();
        obj.ST = _main.scrollTop() | 0;
        obj.SL = _main.scrollLeft() | 0;
        triggerOnReocrd(obj);
    }
    function Record_changepage(pageno)
    {
        var obj = new Object();
        obj.type = 2;
        obj.page = pageno;
        triggerOnReocrd(obj);
    }
    function Record_select(id,stat)
    {
        var obj = new Object();
        obj.type = 104;
        obj.id = id;
        obj.page = _pagenumber;
        obj.stat = stat;
        triggerOnReocrd(obj);
    }
    function Record_mouse(evt, send = false)
    {
        if (!_isRecord) return;
        var poz = _getPoz(evt);
        _isMouseShow = true;

        if (_sendMousePozTimer) {
            clearTimeout(_sendMousePozTimer);
            _sendMousePozTimer = null;
        }
        if (_sendMouseOutTimer) {
            clearTimeout(_sendMouseOutTimer);
            _sendMouseOutTimer = null;
        }
        var bd = 0;
        var sleep = 10;
        if (send == true)
        {
            _mouseHistory.push([poz.x,poz.y]);
            Record_mouse_delay(sleep, true, bd);
        }
        else if(_checkRecordStep(poz.x,poz.y))
        {
            _mouseHistory.push([poz.x,poz.y]);
            Record_mouse_delay(sleep, true, bd);
        }
        return;

        _mouseHistory.push([poz.x,poz.y]);
        if (_mouseHistory.length >= 4 || send == true) {
            Record_mouse_delay(sleep, true, bd);
        } else {
            _sendMousePozTimer = setTimeoutEx(Record_mouse_delay,sleep * 2.5,sleep,false,bd);
        }
    }
    function Record_mouse_delay(sleep, send, bd) {
        if (_mouseHistory.length < 1) {
            return;
        }
        var obj = new Object();
        obj.type = 34;
        obj.show = 1;
        obj.sleep = sleep;
        obj.bd = bd;
        if (send == true) {
            var arr = _mouseHistory.splice(0, _mouseHistory.length);
            if (arr.length > 1) {
                arr.splice(0, arr.length - 1);
            }
            obj.poz = arr;
            obj.delay = 1;
        } else {
            obj.delay = 1;
            obj.poz = _mouseHistory.splice(0, _mouseHistory.length);
        }
        obj.page = _pagenumber;
        obj.VW = getViewWidth();
        obj.CW = getContainerWidth();
        obj.ST = _main.scrollTop() | 0;
        obj.SL = _main.scrollLeft() | 0;
        triggerOnReocrd(obj);
    }
    function Record_mouseout(evt)
    {
        if (!_isRecord) return;
        if (!_isMouseShow) return;
        if (_sendMouseOutTimer) {
            clearTimeout(_sendMouseOutTimer);
            _sendMouseOutTimer = null;
        }
        _sendMouseOutTimer = setTimeout(function ()
        {
            _isMouseShow = false;
            var obj = new Object();
            obj.type = 34;
            obj.show = 0;
            obj.page = _pagenumber;
            triggerOnReocrd(obj);
        }, 50);

    }
    function Record_click(evt)
    {
        if (!_isRecord) return;
        var tar = $(evt.originalEvent.target);
        var poz = _getPoz(evt);
        var obj = new Object();
        obj.type = 35;
        obj.poz = [poz.x, poz.y];

        if (tar[0].tagName.toLowerCase() == "svg") {
            if (tar.attr("id").indexOf("svg_") == 0) {
                obj.bd = 1;
            } else {
                obj.bd = 0;
            }
        } else if (tar.parent()[0] && tar.parent()[0].tagName.toLowerCase() == "svg") {
            if (tar.parent().attr("id").indexOf("svg_") == 0) {
                obj.bd = 1;
            } else {
                obj.bd = 0;
            }
        } else {
            obj.bd = 0;
        }
        obj.page = _pagenumber;
        obj.VW = getViewWidth();
        obj.CW = getContainerWidth();
        obj.ST = _main.scrollTop() | 0;
        obj.SL = _main.scrollLeft() | 0;
        triggerOnReocrd(obj);
        Play_Click(obj);
    }
    function Play_Click(data)
    {
        var clickplayer = new PlayMouseClick(data);
        clickplayer.SetParamter(_svg, _container, _main, _pagenumber,_deviceType);
        clickplayer.SetCanEdit(_canEdit);
        clickplayer.Play();
    }

    function Play_ChangePage(data)
    {
        //console.log("Play_ChangePage:"+data.page);
        if (_pdfurl=="" || data.page > _pagecount || data.page<1)
        {
            return;
        }
        let pageNum = data.page;
        _doc.ShowPDF(_pdfurl, pageNum, (issuccess, pdfcount) =>
        {
            _pagenumber = parseInt(pageNum);
            _svg = $("#svg" + pageNum);
            _container = $("#pageContainer" + pageNum);
            if (issuccess && _onChangePage) _onChangePage(pageNum,1);
        });
    }

    this.ResumeTool=function()
    {
        if (_tool)
        {
            _bindtoolevent();
            _tool.SetParamter(this.OnReocrd, _svg, _container, _main, _pagenumber, _deviceType,this.OnSetTool,this.OnSetActiveTool,this.OnRecordHistory);
            _tool.SetCanEdit(_canEdit);
        }
    }
    this.OnSetTool = (tool) =>
    {
        if (_onSetTool) _onSetTool(tool);
        this.SetDrawTool(tool);
    }
    this.OnSetActiveTool = (tool) =>
    {
        _activeTool = tool;
    }
    this.OnRecordHistory = (undo, redo) =>
    {
        //console.log("OnRecordHistory:" + JSON.stringify(undo) + "\r\n" + JSON.stringify(redo));
        if (_undoList.length==0 && _onUndoRedoStatChange)
        {
            _onUndoRedoStatChange(1,_redoList.length>0?1:0)
        }
        _undoList.push({Undo:undo,Redo:redo});
    }
    this.OnSelectEle = (id, stat) =>
    {
        if (stat == 0)
        {
            $("#"+id).removeAttr("class");
            _removeFromSelectList(id);
            Record_select(id,0);
        }
        else
        {
            _addSelectStyle(id,stat);
        }
    }
    this.OnReocrd = function (data)
    {
        triggerOnReocrd(data);
    }
    this.OnEditText = (rect, toedittext) =>
    {
        var tool = new ToolText();
        tool.SetParamter(this.OnReocrd, _svg, _container, _main, _pagenumber, _deviceType,this.OnSetTool,this.OnSetActiveTool,this.OnRecordHistory);
        tool.SetEle(rect[0]);
        tool.SetCanEdit(_canEdit);
        tool.ToEditMode(rect.attr("id"), toedittext);
        tool.SetCanEditFun(this.GetCanEdit);
        tool.SetOnError(showError);
        this.OnSetTool("");
    }
    this.OnEditNote = (id, canceldelete) =>
    {
        var tool = new ToolNote();
        tool.SetParamter(this.OnReocrd, _svg, _container, _main, _pagenumber, _deviceType,this.OnSetTool,this.OnSetActiveTool,this.OnRecordHistory);
        tool.SetEle(gid(id));
        tool.SetCanEdit(_canEdit);
        tool.SetCanEditFun(this.GetCanEdit);
        tool.SetOnError(showError);
        tool.EidtAnnotation($("#g_" + id), canceldelete);
        this.OnSetTool("");
    }
    this.OnEditVideo = (id, x, y, info) =>
    {
        var tool = new ToolVideo();
        tool.SetParamter(this.OnReocrd, _svg, _container, _main, _pagenumber, _deviceType,this.OnSetTool,this.OnSetActiveTool,this.OnRecordHistory);
        tool.SetCanEdit(_canEdit);
        tool.VideoTagAction(id, x, y, info);
        tool.SetOnSelectVideo(this.ToolVideoOnSelectVideo);
        tool.SetOnVideoPlay(this.ToolVideoOnVideoPlay);
        tool.SetCanEditFun(this.GetCanEdit);
        tool.SetOnError(showError);
    }
    this.OnEditBoard = (rect,id, canceldelete) =>
    {
        var tool = new ToolBoard();
        tool.SetParamter(this.OnReocrd, _svg, _container, _main, _pagenumber, _deviceType,this.OnSetTool,this.OnSetActiveTool,this.OnRecordHistory);
        tool.SetCanEdit(_canEdit);
        tool.SetCanEditFun(this.GetCanEdit);
        tool.SetOnError(showError);
        tool.SetEle(rect);
        tool.SetOnDisplayChange(_onBoardDisplayChange);
        tool.EidtWhiteBoard(id, canceldelete);
        this.OnSetTool("");
    }
    this.OnRecordNote = (rect) =>
    {
        var tool = new ToolNote();
        tool.SetParamter(this.OnReocrd, _svg, _container, _main, _pagenumber, _deviceType,this.OnSetTool,this.OnSetActiveTool,this.OnRecordHistory);
        tool.SetEle(rect);
        tool.Record(true);
    }
    this.OnRecordBoard = (rect,save,mode) =>
    {
        var tool = new ToolBoard();
        tool.SetParamter(this.OnReocrd, _svg, _container, _main, _pagenumber, _deviceType,this.OnSetTool,this.OnSetActiveTool,this.OnRecordHistory);
        tool.SetEle(rect);
        tool.Record(save,mode);
    }
    this.OnZoomChange= (scale,callback) =>
    {
        var oldinfo = this.GetPageInfo();
        this.Clear();
        var scale=_doc.SizeChanged(scale);
        for (var info of oldinfo)
        {
            this.Play(info);
        }
        if (callback) callback();
    }
    this.ToolVideoOnVideoPlay = (id) =>
    {
        if (!_canEdit) return;
        if (_onVideoPlay) _onVideoPlay(id);
    }
    this.ToolVideoOnSelectVideo = (id, afterSelect) =>
    {
        if (!_canEdit) return;
        if (_onSelectVideo) _onSelectVideo(id,afterSelect);
    }
    this.GetCanEdit = () =>
    {
        return _canEdit;
    }

    /**
     * 设置是否录制
     * @param {boolean}  isrecord - 是否录制
     */
    this.SetRecord = function (isrecord)
    {
        _isRecord = isrecord;
    }

    /**
     * 设置设备类型(0:web,1:ios,2:android,3:touch windows tv)
     */
    this.SetDeviceType=function(type)
    {
        _deviceType = type;
        if (type != 0)
        {
            EVENTSTART = "touchstart";
            EVENTMOVE = "touchmove";
            EVENTEND = "touchend";
            EVENTCLICK = "click";
            EVENTOUT="touchcancel";
            _doc.SetSizeDiff(0);
            _doc.SetDeviceType(type);
        }
    }
    /**
     * 设置文档显示模式
     * @param {number}  mode - 模式(0:width,1:height,2:width and height)
     */
    this.SetSizeMode = function (mode)
    {
        _sizeMode = mode;
        _doc.SetSizeMode(mode);
    }

    this.SetVerticalInMiddle = function (ismiddle)
    {
        _doc.SetVerticalInMiddle(ismiddle);
    }

    /**
     * 显示颜色粗细设置框
     * @param {boolean}  isshow - 是否显示
     */
    this.ShowSetting = function (isshow)
    {
        _tool.ShowSetting(isshow);
    }

    this.ShowSelectToolSetting = function (name)
    {
        //console.log("ShowSelectToolSetting:" + _activeTool.name);
        //console.log(_activeTool);
        if (_activeTool && _activeTool.name == name)
        {
            _activeTool.ShowSetting(true);
            _activeTool.SetActive();
            return true;
        }
        return false;

    }

    /**
     * 设置工具
     * @param {string}  tool - 工具名称
     * @param {JSON}  option - 工具选项(暂未使用)
     */
    this.SetDrawTool = function (tool, option)
    {
        if (!_canEdit) return;
        _currentTool = tool;
        if (tool != "")
        {
            _lastTool = tool;
        }
        _tool = _getTool(tool);
        if (_tool)
        {
            //console.log(_tool);
            _tool.SetParamter(this.OnReocrd, _svg, _container, _main, _pagenumber,_deviceType, this.OnSetTool,this.OnSetActiveTool,this.OnRecordHistory);
            _tool.SetCanEdit(_canEdit);
            _tool.SetCanEditFun(this.GetCanEdit);
            _tool.SetOnError(showError);
            if (tool == "ToolVideo")
            {
                _tool.SetOnSelectVideo(this.ToolVideoOnSelectVideo);
                _tool.SetOnVideoPlay(this.ToolVideoOnVideoPlay);

            }
            else if (tool == "ToolBoard")
            {
                _tool.SetOnDisplayChange(_onBoardDisplayChange);
            }
            else if (tool == "")
            {
                _tool.SetOnSelectEle(this.OnSelectEle);
            }

            if (!_isBindEvent)
            {
                _bindtoolevent();
            }
            if (tool == "ToolClear")
            {
                if (_selectLineList.length > 0)
                {
                    // if (!confirm("Do you want to delete selected " + _selectLineList.length + " lines?"))
                    // {
                    //     return;
                    // }

                    var actions = this.GetPageInfo($("#"+_selectLineList.join(",#")));
                    var clearAction = _tool.ClearPath(_selectLineList);
                    if (clearAction != null)
                    {
                        this.OnRecordHistory(actions,clearAction);
                    }
                    _selectLineList = [];
                }
                else
                {
                    if (_activeTool && _activeTool.Delete() == true)
                    {
                        //
                        _activeTool=null;
                    }
                    else
                    {
                        if (!confirm("Do you want to clear all items?"))
                        {
                            this.OnSetTool("");
                            return;
                        }
                        var actions = this.GetPageInfo();
                        var clearAction = _tool.ClearPath();
                        if (clearAction != null)
                        {
                            this.OnRecordHistory(actions,clearAction);
                        }
                    }
                }
                this.OnSetTool("");

            }

        }
        else
        {
            _unbindtoolevent();
        }
    }

    /**清除页面上所有的动作 */
    this.Clear = function ()
    {
        //Record_clear("svg" + GetFixedPageNumber(PageNumber));
        if (_svg)
        {
            _svg.find(">path[isdraw='true'],>g[isdraw='true'],>circle[isdraw='true']").remove();
            _svg.find(">rect[isdraw='true']").each(function (i)
            {
                if ($(this).attr("tp") == "board")
                {
                    $("#edit_" + $(this).attr("id")).remove();
                }
                $(this).remove();
            });
        }
        if (_container)
        {
            _container.find("div.live-video-tool-container").remove();
            _container.find("div.liveMouseClick,div.liveMouse").remove();
        }

    }

    this.ClearAll = function ()
    {
        this.Clear();
        if (_main)
        {
            _main.find(">div.pageContainer[id!='pageContainer" + _pagenumber + "']").remove();
        }
    }

    /**
     * 作废
     */
    this.Init = function (svg, main, container, pagenumber)
    {
        _main = main;
        _svg = svg;
        _container = container;
        _pagenumber = pagenumber;
        _doc.SetMain(main);
        //_bindtoolevent();
    }

    /**
     * 设置录制回调
     * @param {(data:JSON)=>void}  callback - 回调函数
     */
    this.OnReceviceData = function (callback)
    {
        _onReceiveData = callback;
    }

    /**
     * 设置错误回调,Code->1:Not Current Page Data,2:Not Support, 3:Not Current Document Data,100:show image error
     * 4:download page iamge error, 5:page image not downloaded,6:can't play action before show doc
     * @param {(data:JSON)=>void}  callback - 回调函数{Code:123,Data:{}}
     */
    this.OnError = function (callback)
    {
        _onError = callback;
        _doc.SetOnError(showError);
    }

    this.OnDownload = function (callback)
    {
        _onDownload = callback;
        _doc.SetOnDownload(callback);
    }

    /**
     * 设置工具切换回调
     * @param {(ToolName:string)=>void}  callback - 回调函数
     */
    this.OnToolReset = function (callback)
    {
        _onSetTool = callback;
    }

    this.SwitchLastTool = function ()
    {
        if (_lastTool == "")
        {
            if (_currentTool && _currentTool != "")
            {
                this.SetDrawTool(_currentTool);
                if (_onSetTool) _onSetTool(_currentTool);
            }
        }
        else
        {
            if (_currentTool && _currentTool != "")
            {
                this.SetDrawTool("");
                if (_onSetTool) _onSetTool("");
            }
            else
            {
                this.SetDrawTool(_lastTool);
                if (_onSetTool) _onSetTool(_lastTool);
            }
        }
    }

    /**
     * 播放动作
     * @param {JSON} data - 动作的JSON对象
     */
    this.Play = function (data,checkAtmID=false)
    {
        if (typeof (data) == "string")
        {
            data = JSON.parse(data);
        }
        if(!_pdfurl || _pdfurl=="")
        {
            showError(6, data);
            return 6;
        }
        if(_atmid!=0 && data.atmid && typeof(data.atmid)=="number"&& data.atmid!=0 &&data.atmid!=_atmid)
        {
            if (checkAtmID)
            {
                showError(3, data);
            }
            //console.log("Not Current Document Data:"+JSON.stringify(data));
            return 3;
        }
        if(data.type!=2 && data.page && typeof(data.page)=="number"&& data.page!=0 &&data.page!=_pagenumber)
        {
            if (checkAtmID)
            {
                showError(1, data);
            }
            //console.log("Not CurrentPage Data:"+JSON.stringify(data));
            return 1;
        }
        if(checkAtmID && data.type!=2 && !$("#pageContainer"+_pagenumber).is(":visible"))
        {
            if ($("#pageContainer" + _pagenumber).attr("showerror")=="1")
            {
                showError(4, data);
            }
            else
            {
                showError(5, data);
            }
        }
        // else
        // {
        //     console.log("CheckPage:"+_pagenumber+"=="+data.page);
        // }
        //console.log("Play:"+JSON.stringify(data));
        var player = null;
        switch (data.type)
        {
            case 1:// move page

                break;
            case 2:// change page
                //Play_ChangePage(data);
                this.ToPage(data.page,null,true);
                return;
                break;
            case 3://zome page

                break;
            case 21://pen
                player = new PlayPen(data);
                break;
            case 22://pen ex
                player = new PlayPenEx(data);
                break;
            case 24://line
                player = new PlayLine(data);
                break;
            case 25://brush
                player = new PlayBrush(data);
                break;
            case 26://note
                player = new PlayNote(data);
                player.SetOnEdit(this.OnEditNote);
                player.SetOnRecord(this.OnRecordNote);
                break;
            case 27://board
                player = new PlayBoard(data);
                player.SetOnEdit(this.OnEditBoard);
                player.SetOnRecord(this.OnRecordBoard);
                break;
            case 28://text
                player = new PlayText(data);
                player.SetOnEdit(this.OnEditText);
                break;
            case 32://changeview
                player = new PlayChangeView(data,_doc.GetScale(),_sizeMode);
                player.SetOnZoom(this.OnZoomChange);
                break;
            case 33://video
                player = new PlayVideo(data);
                player.SetOnEdit(this.OnEditVideo);
                break;
            case 34://mouse move
                player = new PlayMouseMove(data);
                break;
            case 35://mouse click
                player = new PlayMouseClick(data);
                break;
            case 101://hide
                player = new PlayHide(data);
                break;
            case 102:
                player = new PlayDelete(data);
                break;
            case 103://clear
                player = new PlayClear(data);
                break;
            case 104://select
                player = new PlaySelect(data);
                if (data.stat == 1)
                {
                    _add2SelectList(data.id);
                }
                else
                {
                    _removeFromSelectList(data.id);
                }
                break;
            case 201: //resize
                player = new PlayResize(data);
                break;
            case 202: //scroll
                player = new PlayScroll(data);
                break;
        }
        if (player)
        {
            player.SetParamter(_svg, _container, _main, _pagenumber,_deviceType);
            player.SetCanEdit(_canEdit);
            player.Play();
            return 0;
        }
        else
        {
            showError(2,data);
            //console.log("Not support:" + JSON.stringify(data));
            return 2;
        }
    }

    /**
     * 显示文档
     * @param {JQuery}  main - 文档要显示的容器
     * @param {string}  url - 文档地址
     * @param {number}  pagenum - 文档页码
     * @param {(IsSuccess:boolean,PageCount:number)=>void}  callback - 显示完成的回调函数(是否成功,总页码数)
     * @param {number}  atmid - AttachmentID
     */
    this.ShowDocument = function (main, url, pagenum, callback,atmid=0)
    {
        //if (typeof(GLOBAL_DRIVE_TYPE)!="undefined") this.SetDeviceType(GLOBAL_DRIVE_TYPE);
        //console.log("ShowDocument:" + url);
        if(!url || url=="")
        {
            if (callback) callback(false, 1);
            return;
        }
        _unbindtoolevent();
        _clearUndoRedoList();
        _main = main;
        _pagenumber = parseInt(pagenum);
        _pdfurl = url;
        _atmid = atmid;
        _doc.SetMain(main);
        _doc.ShowPDF(url, pagenum, (issuccess, pdfcount) =>
        {
            _pagecount = pdfcount;
            _svg = $("#svg" + pagenum);
            _container = $("#pageContainer" + pagenum);
            this.SetDrawTool("");
            if (callback) callback(issuccess, pdfcount);
            if (issuccess && _onChangePage) _onChangePage(pagenum,2);
        });
        _bindScrollMouseClickevent();
    }

    /**
     * 刷新文档
     * @param {(IsSuccess:boolean,PageCount:number)=>void}  callback - 显示完成的回调函数(是否成功,总页码数)
     * @param {()=>void}  afterload - 图片完全加载完的回调函数
     */
    this.RefreshDocument = function (callback)
    {
        if (_pdfurl=="" || !_container || !_main)
        {
            if (callback) callback(false, _pagenumber);
            return;
        }
        let pageNum = _pagenumber;
        _clearSelectList();
        _unbindtoolevent();
        var oldinfo=this.GetPageInfo();
        _doc.ShowPDF(_pdfurl, pageNum, (issuccess, pdfcount) =>
        {
            _svg = $("#svg" + pageNum);
            _container = $("#pageContainer" + pageNum);
            this.ResumeTool();
        }, () =>
        {
            for(var info of oldinfo)
            {
                this.Play(info);
            }
            if (callback) callback(true, pageNum);
        });
    }

    /**
     * 获取页码上动作的数据
     * @return {Array} - JSON In Array
     */
    this.GetPageInfo=function(list) {
        var svg =_svg;
        var result = new Array();
        if (!list)
        {
            if (!svg) return result;
            list = svg.find(">path,>rect,>circle");
        }
        list.each(function(i) {
            var tp = $(this).attr("tp");
            var obj = null;
            var tool = null;
            if (tp == "line")
            {
                tool = _getTool("ToolPen");
                //obj = Record_line($(this)[0], true);
            }
            else if (tp == "sline")
            {
                tool = _getTool("ToolLine");
                //obj = Record_rect($(this)[0], true);
            } else if (tp == "brush")
            {
                tool = _getTool("ToolBrush");
                //obj = Record_brush($(this)[0], true);
            } else if (tp == "text")
            {
                tool = _getTool("ToolText");
                //obj = Record_text($(this)[0], true);
            } else if (tp == "note")
            {
                tool = _getTool("ToolNote");
                //obj = Record_rectangle($(this)[0], true);
            } else if (tp == "board")
            {
                tool = _getTool("ToolBoard");
                //obj = Record_whiteboard($(this)[0], true);
            } else {
                return;
            }
            tool.SetEle($(this)[0]);
            tool.SetParamter(null, _svg, _container, _main, _pagenumber, null);
            if (tp == "board")
            {
                var pid = $(this).attr("id");
                if ($("#edit_" + pid).is(":visible"))
                {
                    obj = tool.Record(false,1);
                }
                else
                {
                    obj = tool.Record(false);
                }
            }
            else
            {
                obj = tool.Record(false);
            }
            tool.Destroy();
            result.push(obj);
            // if (obj != null) {
            //     obj.CW = parseInt(GetPageContainer(pageno).attr("CW"));
            //     obj.CH =((obj.CW * getContainerHeight()) / getContainerWidth()) | 0;
            //     result.push(obj);
            // }
            if (tp == "board") {
                var pid = $(this).attr("id");
                var boardsvg = $("#div_" + pid).find(">svg");
                boardsvg.find(">path").each(function(i) {
                    if ($(this).attr("tp") == "line")
                    {
                        var ctool = _getTool("ToolPen");
                        ctool.SetEle($(this)[0]);
                        ctool.SetParamter(null, _svg, _container, _main, _pagenumber, null);
                        var bobj = ctool.Record(false);
                        ctool.Destroy();
                        //var bobj = Record_line($(this)[0], true);
                        bobj.tar = "div_" + pid;
                        // bobj.CW = parseInt(GetPageContainer(pageno).attr("CW"));
                        // bobj.CH =((obj.CW * getContainerHeight()) /getContainerWidth()) |0;
                        result.push(bobj);
                    }
                });
            }
        });
        _container.find("div.live-video-tool-container").each(function (i)
        {
            var ctool = _getTool("ToolVideo");
            ctool.SetEle($(this)[0]);
            ctool.SetParamter(null, _svg, _container, _main, _pagenumber, null);
            var obj = ctool.Record(false);
            //var obj = Record_video($(this)[0], true);
            result.push(obj);
        });
        return result;
    }

    /**
     * 下一页
     *  @param {(IsSuccess:boolean,PageNumber:number)=>void}  callback - 回调函数(是否成功,页码)
     */
    this.NextPage= function(callback)
    {
        if (!_container || _pagenumber >= _pagecount)
        {
            if (callback) callback(false, -1);
            return;
        }
        _container.hide();
        if(_pagenumber>1 && $("#pageContainer" + (_pagenumber-1)).attr("showerror") != "0")
        {
            var img = $("#img_" + (_pagenumber - 1));
            if (img[0])
            {
                img[0].onload = null;
                img[0].onerror = null;
            }
            img.attr("src","data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg");
            $("#pageContainer" + (_pagenumber-1)).remove();
        }
        let pageNum = parseInt(_pagenumber) + 1;
        _unbindtoolevent();
        _clearSelectList();
        _clearUndoRedoList();
        if ($("#pageContainer" + pageNum).length > 0)
        {
            _doc.SetPageNumber(pageNum);
            _pagenumber = pageNum;
            _svg = $("#svg" + pageNum);
            _container = $("#pageContainer" + pageNum);

            var downloadcode = -1;
            if (_container.attr("showerror") == "0")
            {
                downloadcode = 100;
                _container.show();                
            }
            else
            {
                //https://peertime-test.oss-cn-shanghai.aliyuncs.com/P49/Attachment/D25954/f807cf51-ee6e-478e-bc50-331f8cca0f6e_2.jpg
                var newurl = _doc.GetPdfPageUrl(_doc.AdjustURL(_pdfurl), pageNum);
                $("#img_" + pageNum).attr("src", newurl);
                downloadcode = 0;
            }

            var needResize = false;
            if (_sizeMode == 0)
            {
                if (Math.abs(getViewWidth() - getContainerWidth()) > 100)
                {
                    needResize = true;
                }
            }
            else if (_sizeMode == 1)
            {
                if (Math.abs(getViewHeight() - getContainerHeight()) > 100)
                {
                    needResize = true;
                }
            }
            if(needResize)
            {
                var oldinfo = this.GetPageInfo();
                this.Clear();
                var scale=_doc.SizeChanged(1);
                for (var info of oldinfo)
                {
                    this.Play(info);
                }
            }
            _main.scrollTop(0);
            this.ResumeTool();
            Record_changepage(pageNum);
            if (callback) callback(true, pageNum);
            if (_onChangePage) _onChangePage(pageNum, 3);
            if (_onDownload) _onDownload(pageNum, downloadcode);
        }
        else
        {
            _doc.ShowImagePageEx(pageNum, (issuccess) =>
            {
                _pagenumber = pageNum;
                _svg = $("#svg" + pageNum);
                _container = $("#pageContainer" + pageNum);
                _main.scrollTop(0);
                this.ResumeTool();
                if (issuccess) Record_changepage(pageNum);
                if (callback) callback(issuccess, pageNum);
                if (issuccess && _onChangePage) _onChangePage(pageNum,3);

            }, false, _doc.GetPdfPageUrl(_doc.AdjustURL(_pdfurl), pageNum), false);
        }

    }

    /**
     * 上一页
     *  @param {(IsSuccess:boolean,PageNumber:number)=>void}  callback - 回调函数(是否成功,页码)
     */
    this.PreviewPage= function(callback)
    {
        if (!_container || _pagenumber <=1)
        {
            if (callback) callback(false, -1);
            return;
        }
        _container.hide();
        
        if(_pagenumber<_pagecount &&  $("#pageContainer" + (_pagenumber+1)).attr("showerror") != "0")
        {
            var img = $("#img_" + (_pagenumber + 1));
            if (img[0])
            {
                img[0].onload = null;
                img[0].onerror = null;
            }
            img.attr("src","data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg");
            $("#pageContainer" + (_pagenumber+1)).remove();
        }
        _unbindtoolevent();
        _clearSelectList();
        _clearUndoRedoList();
        let pageNum = parseInt(_pagenumber) - 1;
        if ($("#pageContainer" + pageNum).length > 0)
        {
            _doc.SetPageNumber(pageNum);
            _pagenumber = pageNum;
            _svg = $("#svg" + pageNum);
            _container = $("#pageContainer" + pageNum);

            var downloadcode = -1;
            if (_container.attr("showerror") == "0")
            {
                downloadcode = 100;
                _container.show();
            }
            else
            {
                var newurl = _doc.GetPdfPageUrl(_doc.AdjustURL(_pdfurl), pageNum);
                $("#img_" + pageNum).attr("src", newurl);
                downloadcode = 0;
            }
            var needResize = false;
            if (_sizeMode == 0)
            {
                if (Math.abs(getViewWidth() - getContainerWidth()) > 100)
                {
                    needResize = true;
                }
            }
            else if (_sizeMode == 1)
            {
                if (Math.abs(getViewHeight() - getContainerHeight()) > 100)
                {
                    needResize = true;
                }
            }
            if(needResize)
            {
                var oldinfo = this.GetPageInfo();
                this.Clear();
                var scale=_doc.SizeChanged(1);
                for (var info of oldinfo)
                {
                    this.Play(info);
                }
            }
            _main.scrollTop(0);
            this.ResumeTool();
            Record_changepage(pageNum);
            if (callback) callback(true, pageNum);
            if (_onChangePage) _onChangePage(pageNum, 4);
            if (_onDownload) _onDownload(pageNum, downloadcode);
        }
        else
        {
            _doc.ShowImagePageEx(pageNum, (issuccess) =>
            {
                _pagenumber = pageNum;
                _svg = $("#svg" + pageNum);
                _container = $("#pageContainer" + pageNum);
                _main.scrollTop(0);
                this.ResumeTool();
                if (issuccess) Record_changepage(pageNum);
                if (callback) callback(issuccess, pageNum);
                if (issuccess && _onChangePage) _onChangePage(pageNum,4);

            }, false, _doc.GetPdfPageUrl(_doc.AdjustURL(_pdfurl), pageNum), false);
        }
    }

    /**
     * 跳转到指定页
     *  @param {number}  pageNum - 页码
     *  @param {(IsSuccess:boolean,PageNumber:number)=>void}  callback - 回调函数(是否成功,页码)
     */
    this.ToPage= function(pageNum,callback,isplay=false)
    {
        pageNum = parseInt(pageNum);
        if (pageNum > _pagecount || pageNum<1)
        {
            if (callback) callback(false, -1);
            return;
        }
        _container.hide();
        if(pageNum>2 && $("#pageContainer" + (pageNum-2)).attr("showerror") != "0")
        {
            var img = $("#img_" + (pageNum - 2));
            if (img[0])
            {
                img[0].onload = null;
                img[0].onerror = null;
            }
            img.attr("src","data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg");
            $("#pageContainer" + (pageNum-2)).remove();
        }
        if(pageNum+1<_pagecount &&  $("#pageContainer" + (pageNum+2)).attr("showerror") != "0")
        {
            var img = $("#img_" + (pageNum + 2));
            if (img[0])
            {
                img[0].onload = null;
                img[0].onerror = null;
            }
            img.attr("src","data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg");
            $("#pageContainer" + (pageNum+2)).remove();
        }
        _unbindtoolevent();
        _clearSelectList();
        _clearUndoRedoList();
        if ($("#pageContainer" + pageNum).length > 0)
        {
            _doc.SetPageNumber(pageNum);
            _pagenumber = pageNum;
            _svg = $("#svg" + pageNum);
            _container = $("#pageContainer" + pageNum);
            var downloadcode = -1;
            if (_container.attr("showerror") == "0")
            {
                downloadcode = 100;
                _container.show();
            }
            else
            {
                var newurl = _doc.GetPdfPageUrl(_doc.AdjustURL(_pdfurl), pageNum);
                $("#img_" + pageNum).attr("src", newurl);
                downloadcode = 0;
            }
            _main.scrollTop(0);
            this.ResumeTool();
            Record_changepage(pageNum);
            if (callback) callback(true, pageNum);
            if (_onChangePage) _onChangePage(pageNum, isplay?1:5);
            if (_onDownload) _onDownload(pageNum, downloadcode);
        }
        else
        {
            _doc.ShowImagePageEx(pageNum, (issuccess, pdfcount) =>
            {
                _pagenumber = pageNum;
                _svg = $("#svg" + pageNum);
                _container = $("#pageContainer" + pageNum);
                _main.scrollTop(0);
                this.ResumeTool();
                if (issuccess) Record_changepage(pageNum);
                if (callback) callback(issuccess, pageNum);
                if (issuccess && _onChangePage) _onChangePage(pageNum,isplay?1:5);

            }, false, _doc.GetPdfPageUrl(_doc.AdjustURL(_pdfurl), pageNum), false);
        }
    }

    /**
     * 预加载指定页
     *  @param {number}  pageNum - 页码
     *  @param {(IsSuccess:boolean,PageNumber:number)=>void}  callback - 回调函数(是否成功,页码)
     */
    this.PreLoadPage= function(pageNum,callback)
    {
        if (!_main || pageNum > _pagecount || pageNum<1 || $("#pageContainer" + pageNum).length>0)
        {
            if (callback) callback(false, -1);
            return;
        }
        _doc.ShowImagePageEx(pageNum, (issuccess, pdfcount) =>
        {
            if (callback) callback(issuccess, pageNum);

        },true,_doc.GetPdfPageUrl(_doc.AdjustURL(_pdfurl), pageNum),false);
    }

    /**
     * 显示指定页图片
     */
    this.ShowPageImage= function(pageNum,url,callback)
    {
        // if (_pagenumber != pageNum)
        // {
        //     if(callback) callback(0);
        // }
        if (_pdfurl == "")
        {
            _pdfurl = url;
            _doc.SetUrl(url);
        }
        $("#img_" + pageNum).attr("src", _doc.GetPdfPageUrl(url,pageNum));
        if(callback) callback(1);
    }

    this.SetDoumentUrl= function(pageNum,url,itemid=0)
    {
        if(_atmid!=0 && itemid!=0 && itemid!=_atmid)
        {
            return;
        }
        _pdfurl = url;
        _doc.SetUrl(url);
        if (_pagenumber == pageNum)
        {
            var container = $("#pageContainer" + pageNum);
            if (container.length>0 && container.attr("showerror") != "0")
            {
                var newurl = _doc.GetPdfPageUrl(_doc.AdjustURL(_pdfurl), pageNum);
                var oldurl = $("#img_").attr("src");
                if (oldurl != newurl)
                {
                    $("#img_").attr("src", newurl);
                }
            }
        }
    }

    /**
     * 放大
     * @param {(scale: number) => void }  callback - 回调函数(倍数)
     */
    this.ZoomIn = function (callback)
    {
        var scale=_doc.ZoomIn();
        if (callback) callback(scale);
        Record_view();
    }

    /**
     * 缩小
     * @param {(scale: number) => void}  callback - 回调函数(倍数)
     */
    this.ZoomOut = function (callback)
    {
        var scale=_doc.ZoomOut();
        if (callback) callback(scale);
        Record_view();
    }

    /**
     * zoom to
     * @param scale --倍数
     * @param {(scale: number) => void}  callback - 回调函数(倍数)
     */
    this.ZoomTo = function (scale,callback)
    {
        _doc.SizeChanged(scale);
        if (callback) callback(scale);
        Record_view();
    }

    /**
     * 撤销
     * @param {(isSuccess: boolean) => void}  callback - 回调函数(是否成功)
     */
    this.Undo = function (callback)
    {
        //_undoList.push({A:undo,B:redo});
        if (_undoList.length == 0)
        {
            if (callback) callback(false);
            return;
        }
        var item = _undoList.pop();
        if (Array.isArray(item.Undo))
        {
            for (var i = 0, j = item.Undo.length; i < j; i++)
            {
                triggerOnReocrd(item.Undo[i]);
                this.Play(item.Undo[i]);
            }
        }
        else
        {
            triggerOnReocrd(item.Undo);
            this.Play(item.Undo);
        }
        _redoList.push(item);
        if (_onUndoRedoStatChange)
        {
            if (_undoList.length == 0)
            {
                _onUndoRedoStatChange(0, 1);
            }
            else if (_redoList.length == 1)
            {
                _onUndoRedoStatChange(_undoList.length>0?1:0, 1);
            }
        }
    }

    /**
     * 恢复
     * @param {(isSuccess: boolean) => void}  callback - 回调函数(是否成功)
     */
    this.Redo = function (callback)
    {
        if (_redoList.length == 0)
        {
            if (callback) callback(false);
            return;
        }
        var item = _redoList.pop();

        if (Array.isArray(item.Redo))
        {
            for (var i = 0, j = item.Redo.length; i < j; i++)
            {
                triggerOnReocrd(item.Redo[i]);
                this.Play(item.Redo[i]);
            }
        }
        else
        {
            triggerOnReocrd(item.Redo);
            this.Play(item.Redo);
        }
        _undoList.push(item);
        if (_onUndoRedoStatChange)
        {
            if (_redoList.length == 0)
            {
                _onUndoRedoStatChange(1, 0);
            }
            else if (_undoList.length == 1)
            {
                _onUndoRedoStatChange(1, _redoList.length>0?1:0);
            }
        }

    }

    /**
     * 设置页码改变的回调函数(页码,Type;1:play,2:showdocument,3:next,4:prev,5:topage)
     *  @param {(PageNumber:number,Type:number)=>void}  callback - 回调函数(页码,Type;1:play,2:showdocument,3:next,4:prev,5:topage)
     */
    this.OnPageChange = function (callback)
    {
        _onChangePage = callback;
    }

    /**
     * 设置选择视频回调
     * @param {(ID:number,AfterSelectVideo:function)=>void}  callback - 回调函数(GUID,选择完视频的回调)
     */
    this.OnSelectVideo = function (callback)
    {
        _onSelectVideo = callback;
    }

    this.OnBoardDisplayChange = function (callback)
    {
        _onBoardDisplayChange = callback;
    }

    /**
     * 设置播放视频回调
     * @param {(ID:number)=>void}  callback - 回调函数(ID:attachment id)
     */
    this.OnVideoPlay = function (callback)
    {
        _onVideoPlay = callback;
    }

    /**
     * 设置Undo Redo 状态回调
     * @param {(UndoStat:number,RedoStat:number)=>void}  callback - 回调函数(0:can't do this,  1:can do)
     */
    this.OnUndoRedoStatChange = function (callback)
    {
        _onUndoRedoStatChange = callback;
    }

    /**
     * 设置是否可编辑
     * @param {boolean} canEdit - 是否可编辑
     */
    this.SetCanEdit = function (canEdit)
    {
        _canEdit = canEdit;
        if (_tool)
        {
            _tool.SetCanEdit(canEdit);
        }
        if (!canEdit)
        {
            _unbindtoolevent();
        }
    }

    /**
     * 强制获得换页动作
     */
    this.TriggerPageChange = function ()
    {
        Record_changepage(_pagenumber);
    }

    /**强制获得页面大小位置动作 */
    this.TriggerViewChange = function ()
    {
        Record_view();
    }

    /**
     * Reset all parameter
     */
    this.Reset = function ()
    {
        _main = null;
        _container = null;
        _pagenumber = 0;
        _pagecount = 1;
        _pdfurl = "";
        _atmid = 0;
        _currentTool = null;
        _lastTool = "";
        _svg = null;
        _onReceiveData = null;
        _onError = null;
        _onDownload = null;
        _onSetTool = null;
        _onChangePage = null;
        _onBoardDisplayChange = null;
        _onVideoPlay = null;
        _onUndoRedoStatChange = null;
        _tool = null;
        _activeTool = null;
        _isRecord = false;
        _isBindEvent = false;
        _deviceType = 0;
        _canEdit = true;
        _isMouseShow = false;
        _mouseHistory = new Array();
        _preMouseNode = [0,0];
        _isDraw = false;
        _sizeMode = 0;
        _selectLineList = new Array();
        _undoList = new Array();
        _redoList = new Array();
    }

}

//export { WhiteBoardTool, ImageDocumentView }
export default WhiteBoardTool
