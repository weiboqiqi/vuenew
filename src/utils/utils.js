import CONST from '../const'
var fill = function (tbl) {
    return function (num, n) {
        return (0 >= (n - '' + num.length)) ? num : (tbl[n] || (tbl[n] = Array(n + 1).join(0))) + num;
    }
}([]);
var sign = function (version) {
    var key = Math.abs(parseInt(new Date().getTime() * Math.random() * 10000)).toString();
    var sum = 0;
    for (var i = 0; i < key.length; i++) {
        sum += parseInt(key.charAt(i));
    }
    sum += key.length;
    sum = fill(sum, 3 - sum.toString().length);
    return version.toString() + key + sum;
};
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var getParams = function () {
    var search = window.location.search || '';
    var result = {};
    if (search) {
        search = search.substring(1);
        var items = search.split('&');
        for (var i = 0; i < items.length; i++) {
            var temp = items[i].split('=');
            try {
                result[temp[0]] = JSON.parse(decodeURIComponent(temp[1]));
            } catch (e) {
                result[temp[0]] = decodeURIComponent(temp[1]);
            }
        }
    }
    var hash = (window.location.hash || '').substring(1);
    if (hash) {
        hash = hash.substring(1);
        var hashArr = hash.split('&');
        for (var i = 0; i < hashArr.length; i++) {
            var temp = hashArr[i].split('=');
            try {
                result[temp[0]] = JSON.parse(decodeURIComponent(temp[1]));
            } catch (e) {
                result[temp[0]] = decodeURIComponent(temp[1]);
            }
        }
    }
    //分享数据
    var shareData = result.shareData;
    try {
        shareData = JSON.parse(shareData);
    } catch (e) {
        shareData = {}
    }
    extend(result, shareData);
    return result;
}
//dologin 未取到用户信息，是否调起登录
//callback  未登录，用户信息为空

var getUserInfo = function (callback, doLogin) {
    var mcUserInfo = {};
    callback = callback || function (mcUserInfo, fromLogin) {
        }
    var login = function () {
        window.webview.user.login('youxizhongxin', function (res) {
            try {
                res = JSON.parse(res);
            } catch (e) {
                res = {};
            }
            mcUserInfo = res.data || {};
            mcUserInfo.authToken = mcUserInfo.authToken || mcUserInfo.accessToken;
            sessionStorage.setItem('mcUserInfo', JSON.stringify(mcUserInfo));
            callback(mcUserInfo, true)
        })
    }

    var getUser = function () {
        try {
            window.webview.user.get(function (result) {
                try {
                    mcUserInfo = result.data || {};
                    mcUserInfo.authToken = mcUserInfo.authToken || mcUserInfo.accessToken;
                } catch (e) {
                    mcUserInfo = {};
                }
                //是否登录
                if (mcUserInfo.authToken) {
                    sessionStorage.setItem('mcUserInfo', JSON.stringify(mcUserInfo));
                    callback(mcUserInfo)
                } else if (doLogin) {
                    login()
                } else {
                    callback(mcUserInfo)
                }
            })
        } catch (e) {
            mcUserInfo = {};
            callback(mcUserInfo)
        }
    }
    if (CONST.isMucang) {
        if (sessionStorage.getItem('mcUserInfo')) {
            try {
                mcUserInfo = JSON.parse(sessionStorage.getItem('mcUserInfo'));
                if (mcUserInfo.authToken) {
                    callback(mcUserInfo)
                } else {
                    getUser();
                }
            } catch (e) {
                getUser();
            }
        } else {
            getUser();
        }
    } else {
        callback(mcUserInfo)
    }
};
var extend = function (target, obj) {
    if (target) {
        for (var a in obj) {
            target[a] = obj[a]
        }
    }
    return target;
}

var loadImage = function (images, callback) {
    if (typeof  images === 'string') {
        images = [images];
    }
    var count = 0, length = images.length;
    var loadCallback = function () {
        count++;
        if (count == length) {
            callback && callback();
        }
    }
    var loadImg = function (src) {
        var img = new Image();
        img.src = src;
        img.onload = img.onerror = loadCallback
    }
    while (images.length) {
        loadImg(images.pop());
    }
}

var formatDate = function (time, dataEnd) {
    dataEnd = dataEnd || 0;
    return (new Date(time + dataEnd * 24 * 60 * 60 * 1000).format('yyyy-MM-dd'))
}

var formatDate1 = function (time, dataEnd) {
    dataEnd = dataEnd || 0;
    return (new Date(time + dataEnd * 24 * 60 * 60 * 1000).format('yyyy.MM.dd'))
}

var formatDate2 = function (time, dataEnd) {
    dataEnd = dataEnd || 0;
    return (new Date(time + dataEnd * 24 * 60 * 60 * 1000).format('MM.dd'))
}

export  {
    getParams,
    getUserInfo,
    extend,
    sign,
    loadImage,
    formatDate,
    formatDate1,
    formatDate2
}