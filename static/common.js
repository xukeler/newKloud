function gid(id) { return document.getElementById(id); }
function createEl(name) { return document.createElementNS("http://www.w3.org/2000/svg", name); }

var Browser = {};
Browser.isIE = function () { return (!!window.ActiveXObject || "ActiveXObject" in window) };
Browser.isIE5Up = function () { return (Browser.isIE() && document.getElementById) ? true : false; };
Browser.isFirefox = function () { return navigator.userAgent.toLowerCase().indexOf('firefox') != -1 };
Browser.isChrome = function () { return navigator.userAgent.toLowerCase().indexOf('chrome') != -1 && navigator.userAgent.toLowerCase().indexOf('edge') == -1; };
Browser.isSafari = function () { return navigator.userAgent.toLowerCase().indexOf('safari') != -1 };
Browser.isOpera = function () { return (window.opera) ? true : false; };
Browser.isEdge = function () { return navigator.userAgent.toLowerCase().indexOf('edge') != -1; };

String.prototype.endsWith = function String$endsWith(suffix) { return (this.substr(this.length - suffix.length) === suffix); }
String.prototype.startsWith = function String$startsWith(prefix) { return (this.substr(0, prefix.length) === prefix); }
String.prototype.trim = function String$trim() { return this.replace(/^\s+|\s+$/g, ''); }
String.prototype.trimEnd = function String$trimEnd() { return this.replace(/\s+$/, ''); }
String.prototype.trimStart = function String$trimStart() { return this.replace(/^\s+/, ''); }
String.format = function String$format(format, args) { return String._toFormattedString(false, arguments); }
String.localeFormat = function String$localeFormat(format, args) { return String._toFormattedString(true, arguments); }
String._toFormattedString = function String$_toFormattedString(useLocale, args)
{
  var result = ''; var format = args[0];
  for (var i = 0; ;)
  {
    var open = format.indexOf('{', i); var close = format.indexOf('}', i); if ((open < 0) && (close < 0)) { result += format.slice(i); break; }
    if ((close > 0) && ((close < open) || (open < 0))) { result += format.slice(i, close + 1); i = close + 2; continue; }
    result += format.slice(i, open); i = open + 1; if (format.charAt(i) === '{') { result += '{'; i++; continue; }
    var brace = format.substring(i, close); var colonIndex = brace.indexOf(':'); var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex)) + 1;
    var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1); var arg = args[argNumber];
    if (typeof (arg) === "undefined" || arg === null) { arg = ''; }
    if (arg.toFormattedString) { result += arg.toFormattedString(argFormat); }
    else if (useLocale && arg.localeFormat) { result += arg.localeFormat(argFormat); }
    else if (arg.format) { result += arg.format(argFormat); }
    else result += arg.toString();
    i = close + 1;
  } return result;
}


Date.prototype.getDatePart = function ()
{
  let tick = this.getTime();
  let date = new Date(tick);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.getTime();
};
Date.prototype.getTimePart = function ()
{
  let tick = ((this.getHours() * 60 + this.getMinutes()) * 60 + this.getSeconds()) * 1000 + this.getMilliseconds();

  return tick;
};

function IsKlassroom()
{
  return VERSIONTYPE === 1;
}
function IsKloudSync()
{
  return VERSIONTYPE === 2;
}
function IsProjectOne() {
  return VERSIONTYPE === 3;
}
function switchProjectOne() {
  if (IsKloudSync()){
    VERSIONTYPE = 3;
  }else{
    VERSIONTYPE = 2;
  }
}
function routerPrefix()
{
  switch (VERSIONTYPE)
  {
    default:
    case 0:
      return "";

    case 1:
      return "klassroom-";

    case 2:
      return "kloudsync-";
      
    case 3:
      return "projectone-";
  }
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
function Trim(s) { if (s == null) return null; var m = s.match(/^\s*(\S+(\s+\S+)*)\s*$/); return (m == null) ? "" : m[1]; }
function IsExistInArr(arr, id)
{
  var j = arr.length;
  if (j == 0) return false;
  for (var i = 0; i < j; i++)
  {
    if (arr[i] == id) return true;
  }
  return false;
}
function FindStrInArr(arr, str)
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
window.setTimeoutEx = function (callback, timeout, param)
{
  var args = Array.prototype.slice.call(arguments, 2);
  var _cb = function () { callback.apply(null, args); }
  __sto(_cb, timeout);
}
Date.prototype.Format = function (fmt)
{
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
  -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
  -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

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
function CharToHex(str)
{
  var out, i, len, c, h;

  out = "";
  len = str.length;
  i = 0;
  while (i < len)
  {
    c = str.charCodeAt(i++);
    h = c.toString(16);
    if (h.length < 2)
      h = "0" + h;

    out += "\\x" + h + " ";
    if (i > 0 && i % 8 == 0)
      out += "\r\n";
  }

  return out;
}
function GetAPIUrl()
{
  if (IsHttps())
  {
    return WEBAPI_ROOTURL_HTTPS;
  }
  else
  {
    return WEBAPI_ROOTURL;
  }
}
function GetAPIUrlEx()
{
  return WEBAPI_ROOTURL_HTTPSEX;
  //https://testapi.peertime.cn/peertime/V1/ ->https://testapi.peertime.cn/MeetingServer/
  //return WEBAPI_ROOTURL_HTTPS.substr(0,WEBAPI_ROOTURL_HTTPS.indexOf("/peertime/"))+"/MeetingServer/";
}
function GetWebSocketUrl()
{
  if (IsHttps())
  {
    return WEBSOCKET_SERVERURL_HTTPS;
  }
  else
  {
    return WEBSOCKET_SERVERURL;
  }
}
function GetRongCloudAppKey()
{
  return RONGCLOUDAPPKEY_BUILD;

  //if (location.href.toLowerCase().indexOf("klassroom.kloud.com") > -1 || location.href.toLowerCase().indexOf("peertime.cn") > -1)
  //{
  //  return RONGCLOUDAPPKEY_BUILD;
  //}
  //else
  //{
  //  return RONGCLOUDAPPKEY_DEV;
  //}
}
function IsHttps()
{
  return location.href.toLowerCase().indexOf("https") == 0;
}
function GetParamFormUrl(url, key, defaultvalue)
{
  url = url.substr(url.indexOf("?"));
  var index = url.toLowerCase().indexOf(key.toLowerCase());
  if (index == -1)
  {
    if (typeof (defaultvalue) != "undefined") return defaultvalue;
    return "";
  }
  index = url.toLowerCase().indexOf("?" + key.toLowerCase());
  if (index > -1)
  {
    url = url.substr(index + key.length + 2);
  }
  else
  {
    index = url.toLowerCase().indexOf("&" + key.toLowerCase());
    if (index > -1)
    {
      url = url.substr(index + key.length + 2);
    }
    else
    {
      if (typeof (defaultvalue) != "undefined") return defaultvalue;
      return "";
    }
  }
  index = url.indexOf("&")
  if (index > -1)
  {
    url = url.substr(0, index);
  }
  return url;
}
var Drag = {
  obj: null,
  init: function (o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
  {
    _attachEvent(o, "pointerdown", Drag.start);//touch-action: none;

    o.hmode = bSwapHorzRef ? false : true;
    o.vmode = bSwapVertRef ? false : true;

    o.root = oRoot && oRoot != null ? oRoot : o;

    if (o.hmode && isNaN(parseInt(o.root.style.left))) o.root.style.left = "0px";
    if (o.vmode && isNaN(parseInt(o.root.style.top))) o.root.style.top = "0px";
    if (!o.hmode && isNaN(parseInt(o.root.style.right))) o.root.style.right = "0px";
    if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

    o.minX = typeof minX != 'undefined' ? minX : null;
    o.minY = typeof minY != 'undefined' ? minY : null;
    o.maxX = typeof maxX != 'undefined' ? maxX : null;
    o.maxY = typeof maxY != 'undefined' ? maxY : null;

    o.xMapper = fXMapper ? fXMapper : null;
    o.yMapper = fYMapper ? fYMapper : null;

    o.root.onDragStart = new Function();
    o.root.onDragEnd = new Function();
    o.root.onDrag = new Function();
  },

  start: function (e)
  {
    if (typeof (e.isPrimary) != "undefined" && e.isPrimary == false) return false;

    _attachEvent(document, "pointermove", Drag.drag);
    _attachEvent(document, "pointerup", Drag.end);

    _cancelDefault(e);
    _cancelBubble(e);
    var o = Drag.obj = this;
    e = Drag.fixE(e);
    var y = parseInt(o.vmode ? o.root.style.top : o.root.style.bottom);
    var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right);
    o.root.onDragStart(x, y);

    o.lastMouseX = e.clientX;
    o.lastMouseY = e.clientY;
    o.startMouseX = e.clientX;
    o.startMouseY = e.clientY;

    if (o.hmode)
    {
      if (o.minX != null) o.minMouseX = e.clientX - x + o.minX;
      if (o.maxX != null) o.maxMouseX = o.minMouseX + o.maxX - o.minX;
    } else
    {
      if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
      if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
    }

    if (o.vmode)
    {
      if (o.minY != null) o.minMouseY = e.clientY - y + o.minY;
      if (o.maxY != null) o.maxMouseY = o.minMouseY + o.maxY - o.minY;
    } else
    {
      if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
      if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
    }

    return false;
  },

  drag: function (e)
  {
    if (typeof (e.isPrimary) != "undefined" && e.isPrimary == false) return false;
    if (Drag.obj.root.canDrag && Drag.obj.root.canDrag() == false) return false;
    //_cancelDefault(e);
    _cancelBubble(e);
    e = Drag.fixE(e);
    var o = Drag.obj;

    var ey = e.clientY;
    var ex = e.clientX;
    var y = parseFloat(o.vmode ? o.root.style.top : o.root.style.bottom);
    var x = parseFloat(o.hmode ? o.root.style.left : o.root.style.right);
    var nx, ny;

    if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
    if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
    if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
    if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

    nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
    ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

    if (o.xMapper) nx = o.xMapper(y)
    else if (o.yMapper) ny = o.yMapper(x)

    Drag.obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
    Drag.obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
    Drag.obj.lastMouseX = ex;
    Drag.obj.lastMouseY = ey;
    if (Math.abs(ex - Drag.obj.startMouseX) + Math.abs(ey - Drag.obj.startMouseY) > 2)
    {
      Drag.obj.root.onDrag(nx, ny);
    }
    return false;
  },

  end: function (e)
  {
    if (typeof (e.isPrimary) != "undefined" && e.isPrimary == false) return false;
    _cancelDefault(e);
    _cancelBubble(e);
    _detachEvent(document, "pointermove", Drag.drag);
    _detachEvent(document, "pointerup", Drag.end);
    Drag.obj.root.onDragEnd(parseInt(Drag.obj.root.style[Drag.obj.hmode ? "left" : "right"]),parseInt(Drag.obj.root.style[Drag.obj.vmode ? "top" : "bottom"]));
    Drag.obj = null;
  },

  cancel: function (o)
  {
    _attachEvent(o, "pointerdown", Drag.start);
    o.root = null;
    _detachEvent(document, "pointermove", Drag.drag);
    _detachEvent(document, "pointerup", Drag.end);
    Drag.obj = null;
  },

  fixE: function (e)
  {
    if (e.touches && e.touches.length > 0) e = e.touches[0];
    if (typeof e == 'undefined') e = window.event;
    if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
    if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
    return e;
  }
};
function _attachEvent(obj, evt, func)
{
  if (obj.addEventListener)
  {
    obj.addEventListener(evt, func, true);
  } else if (obj.attachEvent)
  {
    obj.attachEvent("on" + evt, func);
  } else
  {
    eval("var old" + func + "=" + obj + ".on" + evt + ";");
    eval(obj + ".on" + evt + "=" + func + ";");
  }
}
function _detachEvent(obj, evt, func)
{
  if (obj.removeEventListener)
  {
    obj.removeEventListener(evt, func, true);
  } else if (obj.detachEvent)
  {
    obj.detachEvent("on" + evt, func);
  } else
  {
    eval(obj + ".on" + evt + "=old" + func + ";");
  }
}
function _cancelDefault(e)
{
  if (e.preventDefault) e.preventDefault();
  else e.returnValue = false;
}
function _cancelBubble(e)
{
  if (e.stopPropagation) e.stopPropagation();
  else e.cancelBubble = true;
}
function ResizeWithShadow(resizeObj, event, direction, minWidth, minHeight, maxX, maxY)
{
  if (typeof (resizeObj.CanResize) != 'undefined' && !resizeObj.CanResize)
    return;
  var objShadow;
  var parentOffsetLeft = 0, parentOffsetTop = 0;
  var obj = resizeObj;

  while (obj.parentNode && obj.parentNode.tagName != "BODY")
  {
    parentOffsetLeft += obj.parentNode.offsetLeft;
    parentOffsetTop += obj.parentNode.offsetTop;
    obj = obj.parentNode;
  }

  if (!document.getElementById('shadow'))
  {
    objShadow = document.createElement("DIV");
    objShadow.id = 'shadow';
    objShadow.style.position = 'absolute';
    objShadow.style.filter = 'alpha(opacity=30,style=0)';
    objShadow.style.backgroundColor = '#ccc';
    document.body.appendChild(objShadow);
  }
  else
    objShadow = document.getElementById('shadow');
  objShadow.style.zIndex = resizeObj.style.zIndex + 1;
  objShadow.style.left = parentOffsetLeft + resizeObj.offsetLeft + 'px';
  objShadow.style.top = parentOffsetTop + resizeObj.offsetTop + 'px';
  objShadow.style.width = resizeObj.offsetWidth + 'px';
  objShadow.style.height = resizeObj.offsetHeight + 'px';

  objShadow.style.display = '';

  Resize(objShadow, event, direction, minWidth, minHeight, maxX, maxY)
  _attachEvent(document, 'mouseup', dragEnd);
  _cancelBubble(event);

  _cancelDefault(event);
  function dragEnd()
  {
    var chgX = 1;
    var chgY = 1;
    switch (direction)
    {
      case 'e':
        chgX = 1;
        chgY = 0;
        break;
      case 'n':
        chgX = 0;
        chgY = -1;
        break;
      case 'ne':
        chgX = 1;
        chgY = -1;
        break;
      case 'nw':
        chgX = -1;
        chgY = -1;
        break;
      case 's':
        chgX = 0;
        chgY = 1;
        break;
      case 'se':
        chgX = 1;
        chgY = 1;
        break;
      case 'sw':
        chgX = -1;
        chgY = 1;
        break;
      case 'w':
        chgX = -1;
        chgY = 0;
        break;
    }

    if (chgX < 0)
    {
      resizeObj.style.left = objShadow.offsetLeft - parentOffsetLeft + 'px';
    }
    if (chgY < 0)
    {
      resizeObj.style.top = objShadow.offsetTop - parentOffsetTop + 'px';
    }

    resizeObj.style.width = objShadow.style.width;
    resizeObj.style.height = objShadow.style.height;

    if (resizeObj.onsizechanged)
      eval(resizeObj.onsizechanged);
    else if (resizeObj.onSizeChanged)
      eval(resizeObj.onSizeChanged);

    if (resizeObj.onResizeCompleted)
      eval(resizeObj.onResizeCompleted);

    resizeObj.ResizeState = false;
    _detachEvent(document, 'mouseup', dragEnd);

    document.body.removeChild(objShadow);

    _cancelBubble(event);
  }
}
function Resize(resizeObj, event, direction, minWidth, minHeight, maxX, maxY)
{
  if (typeof (resizeObj.CanResize) != 'undefined' && !resizeObj.CanResize) return;
  if (typeof (event.isPrimary) != "undefined" && event.isPrimary == false) return false;
  resizeObj.style.width = resizeObj.offsetWidth;
  resizeObj.style.height = resizeObj.offsetHeight;
  resizeObj.ResizeState = true;
  _cancelBubble(event);
  _cancelDefault(event);
  if (event.touches && event.touches.length > 0) event = event.touches[0];
  var oldX = event.clientX;
  var oldY = event.clientY;
  var oldWidth = resizeObj.offsetWidth;
  var oldHeight = resizeObj.offsetHeight;
  oldOffsetRight = screen.width - resizeObj.offsetLeft - resizeObj.offsetWidth;
  oldOffsetBottom = screen.height - resizeObj.offsetTop - resizeObj.offsetHeight;

  var isChanged = false;
  var newHeight = 0, newWidth = 0;

  _attachEvent(document, "pointermove", moveHandler);
  _attachEvent(document, 'pointerup', resizeEnd);

  function moveHandler(e)
  {
    if (typeof (e.isPrimary) != "undefined" && e.isPrimary == false) return false;
    if (e.touches && e.touches.length > 0) e = e.touches[0];
    var chgX = 1;
    var chgY = 1;
    switch (direction)
    {
      case 'e':
        chgX = 1;
        chgY = 0;
        break;
      case 'n':
        chgX = 0;
        chgY = -1;
        break;
      case 'ne':
        chgX = 1;
        chgY = -1;
        break;
      case 'nw':
        chgX = -1;
        chgY = -1;
        break;
      case 's':
        chgX = 0;
        chgY = 1;
        break;
      case 'se':
        chgX = 1;
        chgY = 1;
        break;
      case 'sw':
        chgX = -1;
        chgY = 1;
        break;
      case 'w':
        chgX = -1;
        chgY = 0;
        break;
    }
    if (chgX < 0)
    {
      newWidth = (oldWidth + oldX - e.clientX);
    }
    else if (chgX > 0)
    {
      newWidth = (oldWidth + e.clientX - oldX);
    }
    if (chgY < 0)
    {
      newHeight = (oldHeight + oldY - e.clientY);
    }
    else if (chgY > 0)
    {
      newHeight = (oldHeight + e.clientY - oldY);
    }
    if (chgX != 0 && minWidth && newWidth < minWidth)
      newWidth = minWidth;

    if (chgY != 0 && minHeight && newHeight < minHeight)
      newHeight = minHeight;

    if (chgX < 0)
    {
      resizeObj.style.left = screen.width - oldOffsetRight - newWidth + 'px';
    }

    if (chgY < 0)
    {
      resizeObj.style.top = screen.height - oldOffsetBottom - newHeight + 'px';
    }

    if (newWidth > 0)
      resizeObj.style.width = newWidth + "px";
    if (newHeight > 0)
      resizeObj.style.height = newHeight + "px";
    if (resizeObj.onSizeChanging) resizeObj.onSizeChanging();
    _cancelBubble(event);
  }

  function resizeEnd()
  {
    if (resizeObj.offsetWidth != oldWidth || resizeObj.offsetHeight != oldHeight)
      isChanged = true;

    if (isChanged && resizeObj.getAttributeNode("onsizechanged"))
      eval(resizeObj.getAttributeNode("onsizechanged").nodeValue);
    else if (isChanged && resizeObj.getAttributeNode("onSizeChanged"))
      eval(resizeObj.resizeObj.getAttributeNode("onSizeChanged").nodeValue);


    if (resizeObj.getAttributeNode("onResizeCompleted"))
      eval(resizeObj.getAttributeNode("onResizeCompleted").nodeValue);
    if (resizeObj.onSizeChanged) resizeObj.onSizeChanged();
    resizeObj.ResizeState = false;
    _detachEvent(document, 'pointermove', moveHandler);
    _detachEvent(document, 'pointerup', resizeEnd);

    _cancelBubble(event);
    // if (resizeObj.layerid)
    //   ChangeLayer(resizeObj);
  }
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

function botCheck()
{
  var botPattern = "(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
  var re = new RegExp(botPattern, 'i');
  var userAgent = navigator.userAgent;
  if (re.test(userAgent))
  {
    return true;
  }
  else
  {
    return false;
  }
}

function PasswordEncrypt2(password)
{
  var validateloginstring = GetValidateLoginString();
  var encrypted = "";
  if (password == "")
  {
    return encrypted;
  }

  var len = password.length;
  var temp;
  var index = 0;
  for (var i = 0; i < len; i++)
  {
    if (len < 3)
    {
      index = password.charCodeAt(len - i - 1) - 'A'.charCodeAt(0);
      if (index < 0 || index > 100) index = 5 + i;
      temp = validateloginstring.charAt(index);
      encrypted += temp;
    }
    if (len < 6)
    {
      index = password.charCodeAt(i) - 'A'.charCodeAt(0) + 8;
      if (index < 0 || index > 100) index = 8 + i;
      temp = validateloginstring.charAt(index);
      encrypted += temp;
    }

    if (len < 10)
    {
      index = password.charCodeAt(i) - 'A'.charCodeAt(0) + 15;
      if (index < 0 || index > 100) index = 15 + i;
      temp = validateloginstring.charAt(index);
      encrypted += temp;
    }

    temp = password.charAt(len - i - 1);

    if (temp >= 'a' && temp <= 'z')
      temp = String.fromCharCode('Z'.charCodeAt(0) - (temp.charCodeAt(0) - 'a'.charCodeAt(0)));
    else if (temp >= 'A' && temp <= 'Z')
      temp = String.fromCharCode('z'.charCodeAt(0) - (temp.charCodeAt(0) - 'A'.charCodeAt(0)));
    else if (temp >= '{' && temp <= '~')
      temp = '?';
    else if (temp >= '1' && temp.charCodeAt(0) <= 0x3130)
      temp = String.fromCharCode('G'.charCodeAt(0) - (temp.charCodeAt(0) - '1'.charCodeAt(0)));

    encrypted += temp;
  }

  return encrypted;
}

function GetValidateLoginString()
{
  return "TKllskdhEceldlaEkdLLkIdfa*%8*Loulle*YiYkudOkjkshGTT*76%6EE54$TYu&yyyy^%$$tgKcKJKDHhjsdueKscu<jdjuU^UUUsd";
}

function CheckPhoneNum(num)
{
  var reg = /^\+?\d+-?\d*$/g;
  return reg.test(num);
}
function GetSizeShowText(size)
{
  if (size / (1024 * 1024 * 1024) > 1)
  {
    return (size / (1024 * 1024 * 1024)).toFixed(1) + "G";
  }
  if (size / (1024 * 1024) > 1)
  {
    return (size / (1024 * 1024)).toFixed(1) + "M";
  }
  return (size / 1024).toFixed(1) + "K";
}
function GetTimeLengthShowText(len)
{
  var hour = Math.floor(len / 3600);
  var min = Math.floor((len % 3600) / 60);
  var sec = Math.round(len % 60);
  if (hour > 0)
  {
    return hour + ":" + min + ":" + (sec < 10 ? "0" + sec : sec + "");
  }
  else
  {
    return min + ":" + (sec < 10 ? "0" + sec : sec + "");
  }
}
function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
     if (userAgentInfo.indexOf(Agents[v]) > 0) {
       return false;
     }
  }
  return flag;
}
//去除所有空格
function trimStr(str)
{
  return str.replace(/\s*/g, "");
}
(function (jQuery)
{
  if (jQuery.browser) return;

  jQuery.browser = {};
  jQuery.browser.mozilla = false;
  jQuery.browser.webkit = false;
  jQuery.browser.opera = false;
  jQuery.browser.msie = false;

  var nAgt = navigator.userAgent;
  jQuery.browser.name = navigator.appName;
  jQuery.browser.fullVersion = '' + parseFloat(navigator.appVersion);
  jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset, verOffset, ix;

  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset = nAgt.indexOf("Opera")) != -1)
  {
    jQuery.browser.opera = true;
    jQuery.browser.name = "Opera";
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset = nAgt.indexOf("MSIE")) != -1)
  {
    jQuery.browser.msie = true;
    jQuery.browser.name = "Microsoft Internet Explorer";
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset = nAgt.indexOf("Chrome")) != -1)
  {
    jQuery.browser.webkit = true;
    jQuery.browser.name = "Chrome";
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset = nAgt.indexOf("Safari")) != -1)
  {
    jQuery.browser.webkit = true;
    jQuery.browser.name = "Safari";
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset = nAgt.indexOf("Firefox")) != -1)
  {
    jQuery.browser.mozilla = true;
    jQuery.browser.name = "Firefox";
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
    (verOffset = nAgt.lastIndexOf('/')))
  {
    jQuery.browser.name = nAgt.substring(nameOffset, verOffset);
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 1);
    if (jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase())
    {
      jQuery.browser.name = navigator.appName;
    }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix = jQuery.browser.fullVersion.indexOf(";")) != -1)
    jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix);
  if ((ix = jQuery.browser.fullVersion.indexOf(" ")) != -1)
    jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix);

  jQuery.browser.majorVersion = parseInt('' + jQuery.browser.fullVersion, 10);
  if (isNaN(jQuery.browser.majorVersion))
  {
    jQuery.browser.fullVersion = '' + parseFloat(navigator.appVersion);
    jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
  }
  jQuery.browser.version = jQuery.browser.majorVersion;
})(jQuery);
