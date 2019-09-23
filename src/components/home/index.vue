<template>
    <div style="height: 100%;overflow: hidden">
        <div class="examfieldWrap" ref="imageWrapper">
            <div class="xd">
                <div class="headerWrap">
                    <div class="backWrap" @click="goBack">
                        <img src="./images/goback.png" class="back-img">
                    </div>
                    <p>考场信息</p>
                    <img src="./images/share.png" @click="goShare">
                </div>
                <div class="searchWrap">
                    <div @click="dowSel('isKemu')">{{kemuName}}<img src="./images/down.png"></div>
                    <div class="timeSel">
                        <div class="dateWrap">
                            <div>
                                <p> {{startDateName}}</p>
                                <p>&nbsp; - &nbsp;</p>
                                <p>{{endDateName}}</p>
                            </div>
                        </div>
                    </div>
                    <div @click="dowSel('isSort')">{{filterName}}<img src="./images/down.png" class="noopsyche"></div>
                </div>
            </div>
            <div class="listWrap">
                <div class="loading" v-if="isLoading"></div>
                <div class="listTab" @click="goDetails(item)" v-for="item in itemList"
                     v-if="itemList.length">
                    <div class="listInfo">
                        <p>{{item.name}}</p>
                        <p>{{item.address?item.address:'无'}}</p>
                    </div>
                    <div class="listCount">
                        <p>查看地图</p>
                        <p>{{(item.distance/1000).toFixed(1)}}km</p>
                    </div>
                </div>
                <div v-if="!itemList.length" class="noData">暂无数据</div>
            </div>

            <!--科目下拉-->
            <div @click.prevent.self="close('isKemu')" class="mark" v-if="isKemu">
                <div :class="kemuVal==item.kemu?'active':''" :data-value="item.kemu" v-for="item in kemuList"
                     @click="checkKemu(item.kemu,item.name)">
                    {{item.name}}
                </div>
            </div>
            <!--车型-->
            <div @click.prevent.self="close('isCar')" class="mark" v-if="isCar">
                <div :class="calVal==item.key?'active':''" :data-value="item.key" v-for="item in carLsit"
                     @click="checkCar(item.key,item.value)">
                    {{item.value}}
                </div>
            </div>
            <!--智能排序下拉-->
            <div @click.prevent.self="close('isSort')" class="mark" v-if="isSort">
                <div @click="checkFilter('name')" :class="filter1?'active':''">按首字母</div>
                <div @click="checkFilter('distance')" :class="filter2?'active':''">按距离排序</div>
            </div>

            <!--日期下拉-->
            <div id="checkinout" @click.prevent.self="close('isDate')" :class="isDate?'':'hide'">
                <div id="firstSelect" style="width:100%;">
                    <div class="Date_lr" style="float:left;">
                        <P>入住</p>
                        <input id="startDate" type="text" value="" style="" readonly>
                    </div>
                    <div class="Date_lr" style="float:right;">
                        <p>离店</p>
                        <input id="endDate" type="text" value="" style="" readonly>
                    </div>
                    <!--<span class="span21">共<span class="NumDate">1</span>晚</span>-->
                </div>
            </div>
            <div class="mask_calendar" @click.prevent.self="close('isDate')" :class="isDate?'':'hide'">
                <div class="calendar"></div>
            </div>
        </div>
        <div class="full" ref="full">
            <img :src="img_data" class="creted_img"/>
            <div class="footer">
                <div>
                    <p>驾考宝典</p>
                    <p>选驾校考驾照 就用驾考宝典</p>
                </div>
                <div>
                    <img src="./images/qufenxiang.jpg">
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CONST from '../../const';
    import { mapState } from 'vuex';
    import store from '../../store';
    import {Utils} from '../../utils';
    import {list} from '../../api/store';
    import html2canvas from 'html2canvas'
    import Vconsole from 'vconsole'
    import Canvas2Image from '../../common/js/js-canvas2image';
    //    import {calendarSwitch} from '../../resources/js/date'

    var opt = {
        preset: 'date', //日期
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式
        mode: 'scroller', //日期选择模式
        dateFormat: 'yy-mm-dd', // 日期格式
        setText: '确定', //确认按钮名称
        cancelText: '取消',//取消按钮名籍我
        dateOrder: 'yymmdd', //面板中日期排列格式
        dayText: '日', monthText: '月', yearText: '年', //面板中年月日文字
        endYear: 2020 //结束年份
    };

    export default {
        name: 'index',
        mounted(){
            var $this = this;
            document.body.className = '';
            if (CONST.params.kemu) {
                if (CONST.params.kemu == 1) {
                    $this.kemuName = '科目一'
                } else if (CONST.params.kemu == 2) {
                    $this.kemuName = '科目二'
                } else if (CONST.params.kemu == 3) {
                    $this.kemuName = '科目三'
                } else if (CONST.params.kemu == 4) {
                    $this.kemuName = '科目四'
                }
            }

//            var vConsole=new Vconsole();

            //去头部
            if (CONST.isMucang) {
                window.webview.web.setting({
                    titleBar: false,
                    toolbar: false,
                    menu: false,
                    button: 'share copy refresh',
                    title: '234'
                });
            }
            //选择时间弹窗
//            var curr = new Date().getFullYear();
//            var nowDate = new Date(),
//                    month = nowDate.getMonth(),
//                    day = nowDate.getDate();
//            var opt = {};
//            opt.date = {
//                preset: 'date',
//                minDate: nowDate, //最小日期
//                maxDate: new Date(curr, month + 2, day),                      //最大日期
//                dateFormat: 'yy-mm-dd',
//                dateOrder: 'yymmdd',
//            };
//            var dataopts = {
//                theme: 'android-ics light',
//                mode: 'scroller', // scroller —— 以wheel滑动方式选择  clickpick —— 显示 - + 按钮选择 mixed —— 兼容以上两种方式
//                display: 'modal',
//                lang: 'zh',//中文
//                rtl: false,//按钮显示位置
//                setText: '确定',
//                headerText: '选择您的考试时间',
//                onSelect: function (date) {
//                    $this.date = date;
//                    $this.renderList($this.cityCode, $this.kemuVal, $this.calVal, $this.date)
//                },
//                onCancel: function () {
//                    //点击不知道 显示弹窗
//
//                    return false;
//                },
//                onShow: function (ev) {
//                }
//            }
//            $('#USER_AGE').mobiscroll($.extend(opt['date'],
//                    dataopts
//            ));
//
//            var oppt = {
//                selectors: {
//                    sections: ".calendar"
//                },
//                index: 3,      //展示的月份个数
//                animateFunction: "slideToggle",        //动画效果
//                controlDay: true,//知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
////            daysnumber: "90",     //控制天数
//                comeColor: "#2EB6A8",       //入住颜色
//                outColor: "#2EB6A8",      //离店颜色
//                comeoutColor: "#E0F4F2",        //入住和离店之间的颜色
//                startDate: this.startDate,
//                endDate: this.endDate,
//                callback: function () {//回调函数
////                    $('.mask_calendar').fadeOut(200);
//                    var startDate = $('#startDate').val();  //入住的天数
//                    var endDate = $('#endDate').val();      //离店的天数
//                    var NumDate = $('.NumDate').text();    //共多少晚
//                    $this.startDateName = startDate.substring(5)
//                    $this.endDateName = endDate.substring(5);
//
//                    $this.startDate = startDate
//                    $this.endDate = endDate
//                    $this.isDate = false;
//                    $this.renderList($this.cityCode, $this.kemuVal, $this.calVal, $this.startDate, $this.endDate)
//
//                },
//                comfireBtn: '.comfire'//确定按钮的class或者id
//            };
//            //日期初始化
//            $('#firstSelect').calendarSwitch(oppt);
//            $('#mask_calendar').show();
            if ($this.callBack1.carType) {
                $this.kemuVal = $this.callBack1.kemu;
                $this.calVal = $this.callBack1.carType;
                $this.date = $this.callBack1.date;
                $this.filterName = $this.callBack1.filterName;
                $this.filter = $this.callBack1.filter;
                $this.startDate = $this.callBack1.startDate;
                $this.endDate = $this.callBack1.endDate;
                $this.startDateName = $this.callBack1.startDate.substring(5);
                $this.endDateName = $this.callBack1.endDate.substring(5);
                if ($this.kemuVal == 1) {
                    $this.kemuName = '科目一'
                } else if ($this.kemuVal == 2) {
                    $this.kemuName = '科目二'
                } else if ($this.kemuVal == 3) {
                    $this.kemuName = '科目三'
                } else if ($this.kemuVal == 4) {
                    $this.kemuName = '科目四'
                }
            }

            store.commit('update', ['callBack1', '']);

            for (var i = 0; i < $this.carLsit.length; i++) {
                if ($this.calVal == $this.carLsit[i].key) {
                    $this.carName = $this.carLsit[i].value;
                    break;
                }
            }
            $this.renderList($this.cityCode, $this.kemuVal, $this.calVal, Utils.formatDate(new Date().getTime()), $this.endDate, $this.filter)


        },
        computed: {
            ...mapState(['callBack1', 'showToast'])
        },
        components: {},
        methods: {
            toast: function (message) {
                store.commit('update', ['text', message]);
                store.commit('update', ['showToast', true]);
                setTimeout(function () {
                    store.commit('update', ['showToast', false]);
                }, 2000)
            },
            renderList: function (cityCode, kemu, carType, startDate, endDate, filter) {
                var $this = this;
                $this.isLoading = true;
                list({
                    cityCode: cityCode,
                    kemu: kemu,
                    carType: carType,
                    startDate: startDate,
                    endDate: endDate,
                    filter: filter,
                    latitude: $this.latitude,
                    longitude: $this.longitude
                }, function (data) {
                    if (data.data) {
                        $this.itemList = data.data.itemList;
                    } else {
                        $this.itemList = [];
                    }
                    $this.isLoading = false;
                }, function (data) {
                    $this.isLoading = false;
                    if (!$this.latitude && !$this.longitude) {
                        $this.toast('请打开定位权限');
                    }
                })
            },
            checkKemu(key, value){
                window.mcShare.Statistic.stat('考场信息查询页-切换科目');
                var $this = this;
                $this.kemuVal = key;
                $this.kemuName = value;
                $this.close('isKemu');
                $this.renderList($this.cityCode, $this.kemuVal, $this.calVal, $this.startDate, $this.endDate, $this.filter)
            },
            checkCar(key, value){
                var $this = this;
                $this.calVal = key;
                $this.carName = value;
                $this.close('isCar');
                $this.renderList($this.cityCode, $this.kemuVal, $this.calVal, $this.startDate, $this.endDate)
            },
            checkFilter(filter){
                var $this = this;
                $this.close('isSort');
                if (filter == 'name') {
                    $this.filter1 = true;
                    $this.filter2 = false;
                    $this.filterName = '按字母排序';
                    $this.filter = filter;
                } else if (filter == 'distance') {
                    $this.filter1 = false;
                    $this.filter2 = true;
                    $this.filterName = '按距离排序';
                    $this.filter = filter;
                }
                $this.renderList($this.cityCode, $this.kemuVal, $this.calVal, $this.startDate, $this.endDate, filter);

            },
            dowSel(name){
                var $this = this;
                $('#USER_AGE').mobiscroll('clear');
                $this.isKemu = false;
                $this.isCar = false;
                $this.isSort = false;
                $this[name] = !$this[name];
            },
            timeSel(){
                var $this = this;
                $this.isKemu = false;
                $this.isCar = false;
                $this.isSort = false;
                $this.isDate = true;
            },
            showTime(e){
                var $this = this;
                $this.isKemu = false;
                $this.isCar = false;
                $this.isSort = false;
            },
            goDetails(item){
                window.mcShare.Statistic.stat('考场信息查询页-查看地图');
                var $this = this;
                this.$router.push(
                        {
                            name: 'details1',
                            params: {
                                name: item.name,
                                address: item.address,
                                cityCode: $this.cityCode,
                                kemu: $this.kemuVal,
                                carType: $this.calVal,
                                startDate: $this.startDate,
                                endDate: $this.endDate,
                                metaSerialNumber: item.metaSerialNumber,
                                latitude: $this.latitude,
                                longitude: $this.longitude,
                                filterName: $this.filterName,
                                filter: $this.filter
                            }
                        }
                )
            },
            close(name){
                this[name] = false;
            },
            goBack(){
                webview.web.close();
            },
            goShare(){
                var $this = this;
                $this.createImage();
            },
            createImage: function (el) {
                var me = this;
//                var cntElem = document.querySelector('.examfieldWrap');imageWrapper
                var cntElem = el || me.$refs.imageWrapper;
                var shareContent = cntElem;//需要截图的包裹的（原生的）DOM 对象
                var width = shareContent.offsetWidth; //获取dom 宽度
                var height = shareContent.offsetHeight; //获取dom 高度
                var canvas = document.createElement("canvas"); //创建一个canvas节点
                var scale = 2; //定义任意放大倍数 支持小数
                canvas.width = width * scale; //定义canvas 宽度 * 缩放
                canvas.height = height * scale; //定义canvas高度 *缩放
                canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
                var opts = {
                    scale: scale, // 添加的scale 参数
                    canvas: canvas, //自定义 canvas
                    // logging: true, //日志开关，便于查看html2canvas的内部执行流程
                    width: width, //dom 原始宽度
                    height: height,
//                    backgroundColor: '#ffffff',
                    useCORS: true // 【重要】开启跨域配置
                };
                html2canvas(shareContent, opts).then(function (canvas) {
                    var context = canvas.getContext('2d');
                    // 【重要】关闭抗锯齿
                    context.mozImageSmoothingEnabled = false;
                    context.webkitImageSmoothingEnabled = false;
                    context.msImageSmoothingEnabled = false;
                    context.imageSmoothingEnabled = false;
                    // 【重要】默认转化的格式为png,也可设置为其他格式
                    var img_data = Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height);
                    if (!el) {
                        me.img_data = img_data;
                        me.loadImage(img_data, ()=> {
                            me.createImage(me.$refs.full)
                        })
                    } else {
                        me.uploadImg(img_data)
                    }

                });
            },//将html转化成图片
            uploadImg(img_data){
                var me = this;
                var type = img_data.split(',')[0].split(':')[1].split(';')[0];
                var blob = me.getBlobBydataURI(img_data, type);
                var formData = new FormData();
                formData.append('file', blob);
                window.mcShare.Utils.ajax({
                    url: 'http://jiaxiao.staging.jiakaobaodian.com/api/web/v3/upload/file.htm?_r=' + window.mcShare.Utils.sign(1),
                    data: formData,
                    method: 'post',
                    dataType: 'json',
                    async: true,
                    contentType: false,
                    success: function (ret) {
                        if (ret.success) {
                            me.imgUrl = ret.data[0].url;
                            window.webview.share.setting({
                                //title: 'webview',
                                channel: 'weixin_moment,weixin_friend,sina,qq,q_zone',
                                type: 'image',
//                                guideImage: 'http://laofuzi.ttt.kakamobi.com/mucang-protocol/test/jkbd.jpg',
                                shareData: {
                                    imageUrl: ret.data[0].url
                                }
                            });

                            webview.web.menu();
                        }
                    },
                    error: function () {
                        webview.system.alert('服务器出错!');
                    }
                });
            },
            getBlobBydataURI: function (dataURI, type) {
                var binary = atob(dataURI.split(',')[1]);
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type: type});
            },//将base64转化成Blob对象
            loadImage: function (src, callback) {
                var img = new Image();
                img.src = src;
                img.onload = function () {
                    callback()
                }
            },
        },
        data(){
            return {
                itemList: [],
                kemuList: [
                    {
                        kemu: 1,
                        name: '科目一'
                    },
                    {
                        kemu: 2,
                        name: '科目二'
                    },
                    {
                        kemu: 3,
                        name: '科目三'
                    },
                    {
                        kemu: 4,
                        name: '科目四'
                    }
                ],
                carLsit: [
                    {
                        key: 'C1',
                        value: '小车C1'
                    }, {
                        key: 'C2',
                        value: '小车C2'
                    }, {
                        key: 'C5',
                        value: '小车C5'
                    }, {
                        key: 'A2',
                        value: '货车A2'
                    }, {
                        key: 'B2',
                        value: '货车B2'
                    }, {
                        key: 'A1',
                        value: '客车A1'
                    }, {
                        key: 'A3',
                        value: '客车A3'
                    }, {
                        key: 'B1',
                        value: '客车B1'
                    }
                ],
                kemuVal: CONST.params.kemu || 1,
                isKemu: false,
                kemuName: CONST.params.kemu || '科目一',
                isCar: false,
                calVal: "C1",
                carName: '小车C1',
                isSort: false,
                isDate: false,
                filter: 'name',
                latitude: CONST.params._latitude,
                longitude: CONST.params._longitude,
                filter1: true,
                filter2: false,
                filterName: '按首字母',
                cityCode: CONST.params.cityCode || 110000,
                date: Utils.formatDate(new Date().getTime()),
                startDateName: Utils.formatDate2(new Date().getTime()),
                endDateName: Utils.formatDate2(new Date().getTime() + 60 * 24 * 60 * 60 * 1000),
                startDate: Utils.formatDate(new Date().getTime()),
                endDate: Utils.formatDate(new Date().getTime() + 60 * 24 * 60 * 60 * 1000),
                dataURL: '',
                img_data: '',
                imgUrl: '',
                isLoading: true
//                date: '2018-06-20'
            }
        }
    }
</script>

<style>
    @import "style.css";
</style>
