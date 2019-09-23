import * as Api from './api';

var list = function (params, success, error) {
    Api.post({
        url: '/api/web/exam-plain/get-list.htm',
        params: params
    }, success, error)
}
var detailList = function (params, success, error) {
    Api.post({
        url: '/api/web/exam-plain/get-detail-list.htm',
        params: params
    }, success, error)
}
export {
    list,
    detailList
}