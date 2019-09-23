<template>
    <div class="detailsWrap">
        <div class="headerWrap">
            <div class="backWrap" @click="goBack">
                <img src="./images/goback.png">
            </div>
            <p>考场信息</p>
            <!--<img src="./images/share.png">-->
        </div>
        <div class="detailsTop">
            <div class="topTittle">
                <p>{{itemList.name}}</p>
                <div><span class="labelStyle">{{kemuName}}</span><span>{{startDate}} ~ {{endDate}}</span></div>
            </div>
            <div class="topAddress" @click="goMap()">
                <p>{{itemList.address?itemList.address:'无'}}</p>
                <p v-if="itemList.address&&itemList.distance>0">{{itemList.distance}}km</p>
            </div>
        </div>
        <div class="line"></div>
        <div class="detailsContent">
            <p class="contentTile">考试计划公布</p>
            <div class="tableWrap">
                <table class="theTable">
                    <!--标题-->
                    <thead>
                    <tr class="head-title">
                        <th rowspan="2" class="headth">
                            <div class="ht-div">
                                <table>
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>日期</th>
                                    </tr>
                                    <tr>
                                        <th>场次</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </th>
                        <th v-for="item in dateList">
                            <div>
                                <p>{{item.week}}</p>
                                <p>{{item.date}}</p>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <div>
                                <p>第一场</p>
                                <p>已报名/可容纳</p>
                            </div>
                        </td>
                        <td v-for="item in amList">
                            {{item.applyCount}}/{{item.count}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <p>第二场</p>
                                <p>已报名/可容纳</p>
                            </div>
                        </td>
                        <td v-for="item in pmList">
                            {{item.applyCount}}/{{item.count}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <p class="tips">* 前往交管平台（www.122.gov.cn）即可预约考试</p>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CONST from '../../const';
    import {Utils} from '../../utils';
    import { mapState } from 'vuex';
    import store from '../../store';
    import {detailList} from '../../api/store';

    export default {
        name: 'success',
        mounted(){
            var $this = this;
            $this.startDate = Utils.formatDate1(new Date().getTime());
            var params = $this.$route.params;
            $this.params = $this.$route.params;
            if ($this.callBack2.carType) {
                params = $this.callBack2;
                $this.params = $this.callBack2;
            }
            store.commit('update', ['callBack1', params]);
            store.commit('update', ['callBack2', '']);
            document.body.className = '';
            if (CONST.isMucang) {
                window.webview.web.setting({
                    titleBar: false,
                    toolbar: false,
                    menu: false,
                    button: 'share copy refresh',
                    title: '234'

                });
            }
            var x = 'date';
            detailList(params, function (data) {
                if (data.data) {
                    $this.itemList = data.data;
                    $this.itemList.distance = ($this.itemList.distance / 1000).toFixed(2);
                } else {
                    $this.itemList = [];
                }

                //渲染科目
                if ($this.itemList.kemu == 1) {
                    $this.kemuName = '科目一'
                } else if ($this.itemList.kemu == 2) {
                    $this.kemuName = '科目二'
                } else if ($this.itemList.kemu == 3) {
                    $this.kemuName = '科目三'
                } else if ($this.itemList.kemu == 4) {
                    $this.kemuName = '科目四'
                }

                //获取日期
                $this.endDate = Utils.formatDate1($this.itemList.examDate);

                //经、纬度
                $this.latitude = $this.itemList.latitude;
                $this.longitude = $this.itemList.longitude;


                //获取周几
                var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
                $this.itemDataList = $this.itemList.itemDataList;
                for (var i = 0; i < $this.itemDataList.length; i++) {
                    $this.itemDataList[i].date = Utils.formatDate($this.itemDataList[i].date);
                    $this.itemDataList[i].week = today[new Date(Date.parse($this.itemDataList[i].date)).getDay()];
                }

                //根据日期排序
                $this.itemDataList.sort(function (a, b) {
                    if (a[x] < b[x]) {
                        return -1
                    }
                    if (a[x] > b[x]) {
                        return 1
                    }
                    return 0;
                });

                //第一行(星期)
                var hash = {};
                $this.dateList = $this.itemDataList.reduce(function (item, next) {
                    hash[next.date] ? '' : hash[next.date] = true && item.push(next);
                    return item
                }, []);

                //获得上\下午列表
                for (var y = 0; y < $this.itemDataList.length; y++) {
                    if ($this.itemDataList[y].timeOfDay) {
//                        if ($this.itemDataList[y].timeOfDay.substring(4, 5) == '-') {
//                            var theTime = parseInt($this.itemDataList[y].timeOfDay.substring(5, 7));
//                        }
//                        if (
//                                $this.itemDataList[y].timeOfDay.indexOf('上') > -1 ||
//                                $this.itemDataList[y].timeOfDay.substring(1, 2) == '一' ||
//                                $this.itemDataList[y].timeOfDay.substring(5) == '考场1' ||
//                                (theTime || theTime < 12) ||
//                                $this.itemDataList[y].timeOfDay == '第1场' ||
//                                $this.itemDataList[y].timeOfDay.substring(0, 1) == '1'
//                        ) {
//                            $this.amList.push($this.itemDataList[y]);
//                        }
//
//                        if (
//                                $this.itemDataList[y].timeOfDay.indexOf('下') > -1 ||
//                                $this.itemDataList[y].timeOfDay.substring(1, 2) == '二' ||
//                                $this.itemDataList[y].timeOfDay.substring(5) == '考场2' ||
//                                (theTime || theTime > 12) ||
//                                $this.itemDataList[y].timeOfDay == '第2场' ||
//                                $this.itemDataList[y].timeOfDay.substring(0, 1) == '2'
//                        ) {
//                            $this.pmList.push($this.itemDataList[y]);
//                        }

                        if (y == 0) {
                            $this.amList.push($this.itemDataList[y]);
                        } else {
                            if ($this.itemDataList[y].date == $this.itemDataList[y - 1].date) {
                                $this.pmList.push($this.itemDataList[y]);
                            } else {
                                $this.amList.push($this.itemDataList[y]);
                            }
                        }


                    }
                }

                var dateLength = $this.dateList.length;

                //上、下午数据格式化
                var theAm = [];
                var thePm = [];


                //上午
                for (var p = 0; p < dateLength; p++) {
                    for (var d = 0; d < $this.amList.length; d++) {
                        if ($this.amList[d]) {
                            if ($this.amList[d].date == $this.dateList[p].date) {
                                theAm.push($this.amList[d]);
                                break
                            } else {
                                if (d == $this.amList.length - 1) {
                                    theAm.push({
                                        applyCount: 0,
                                        count: 0,
                                        date: $this.dateList[p].date,
                                        timeOfDay: "上午",
                                        week: $this.dateList[p].week
                                    })
                                }
                            }
                        }
                    }
                }


                for (var q = 0; q < dateLength; q++) {
                    for (var w = 0; w < $this.pmList.length; w++) {
                        if ($this.pmList[w]) {
                            if ($this.pmList[w].date == $this.dateList[q].date) {
                                thePm.push($this.pmList[w])
                                break
                            } else {
                                if (w == $this.pmList.length - 1) {
                                    thePm.push({
                                        applyCount: 0,
                                        count: 0,
                                        date: $this.dateList[q].date,
                                        timeOfDay: "下午",
                                        week: $this.dateList[q].week
                                    })
                                }
                            }
                        }
                    }
                }


                $this.amList = theAm;
                $this.pmList = thePm;


            }, function () {

            })

        },
        computed: {
            ...mapState(['callBack2', 'callBack1'])
        },
        methods: {
            goMap(){
                var $this = this;
                this.$router.push(
                        {
                            name: 'map',
                            params: {
                                callbackData: $this.params,
                                latitude: $this.itemList.latitude,
                                longitude: $this.itemList.longitude
                            }
                        }
                )
            },
            goBack(){
                var $this = this;
                var params = $this.$route.params;
                if ($this.callBack2.carType) {
                    params = $this.callBack2;
                }
//                store.commit('update', ['callBack1', params]);
                $this.$router.go(-1);
            }
        },
        data(){
            return {
                itemList: [],
                itemDataList: [],
                dateList: [],
                amList: [],
                pmList: [],
                startDate: '',
                endDate: '',
                kemuName: '',
                latitude: '',
                longitude: '',
                params: {}
            }
        }
    }
</script>

<style>
    @import "style.css";
</style>
