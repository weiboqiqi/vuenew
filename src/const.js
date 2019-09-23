//通用、常量配置
import { getParams } from './utils/utils'
//require('./common/js/share-sdk-v2.0');
require('./common/js/vconsole.min');
require("./common/js/jquery-1.11.0.min");
require("./common/js/mobiscroll-2.13.min");
require("./resources/js/date");

var host = window.location.protocol + '//sirius.kakamobi.cn';
//var host = window.location.protocol + '//sirius.ttt.mucang.cn';
//var host = window.location.protocol + '//192.168.1.121:8080';

var CONST = {
    host: host,
    baseUrl: host + '/api/web/v3/coach',
    MicroMessenger: navigator.userAgent.indexOf('MicroMessenger') > -1,
    isMucang: /mucang/ig.test(navigator.userAgent),
    isiOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1,
    params: getParams()
}

CONST.params.channel = mcShare.Utils.getChannel();
export default CONST