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
                <p>{{itemList.kemuName}}<i>{{itemList.startDate}}至{{itemList.endDate}}</i></p>
            </div>
            <div class="topAddress">
                <p>{{itemList.address?itemList.address:'无'}}</p>
                <p v-if="itemList.address&&itemList.distance>0">{{itemList.distance}}km</p>
            </div>
        </div>
        <div class="detailsContent" id="mapContent">

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
            var params = $this.$route.params;
            if (params.kemu == 1) {
                params.kemuName = '科目一';
            } else if (params.kemu == 2) {
                params.kemuName = '科目二'
            } else if (params.kemu == 3) {
                params.kemuName = '科目三'
            } else if (params.kemu == 4) {
                params.kemuName = '科目四'
            }
            $this.itemList = params;
            detailList(params, function (data) {
                if (data.data) {
                    $this.longitude = data.data.longitude;
                    $this.latitude = data.data.latitude;
                    $this.initMap();
                }

            }, function () {

            })

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
            },
            initMap () {
                this.render();
                this.setMapEvent();//设置地图事件
                this.addMapControl();//向地图添加控件
                this.SearchInfoWindow();//向地图添加信息窗口
            },
            render(){
                var $this = this;
                var map = new BMap.Map("mapContent");
                var point = new BMap.Point($this.longitude, $this.latitude);
                var myIcon = new BMap.Icon(require('./images/icon.png'), new BMap.Size(38, 38), {
                    anchor: new BMap.Size(19, 38)
                });
                var marker = new BMap.Marker(point, {icon: myIcon});  // 创建标注
                map.addOverlay(marker);              // 将标注添加到地图中
                map.centerAndZoom(point, 15);
                $this.map = map;//将map变量存储在全局

            },
            setMapEvent(){
                var $this = this;
                $this.map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
                $this.map.enableScrollWheelZoom();//启用地图滚轮放大缩小
                $this.map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
                $this.map.enableKeyboard();//启用键盘上下左右键移动地图
            },
            addMapControl(){
                //向地图中添加缩放控件
                var $this = this;
                var ctrl_nav = new BMap.NavigationControl({
                    anchor: BMAP_ANCHOR_TOP_LEFT,
                    type: BMAP_NAVIGATION_CONTROL_LARGE
                });
                $this.map.addControl(ctrl_nav);
                //向地图中添加缩略图控件
                var ctrl_ove = new BMap.OverviewMapControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1});
                $this.map.addControl(ctrl_ove);
                //向地图中添加比例尺控件
                var ctrl_sca = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});
                $this.map.addControl(ctrl_sca);
            },
            SearchInfoWindow(){
                var $this = this;
                var content = '<div>' + $this.itemList.name + '</div>';

                //创建检索信息窗口对象
                var infoWindow = new BMap.InfoWindow('', {
                    width: 100,     // 信息窗口宽度
                    height: 10,     // 信息窗口高度
                    title: $this.itemList.name,
                    offset: {
                        width: 0,
                        height: -38
                    }
                });
                $this.map.openInfoWindow(infoWindow, new BMap.Point($this.longitude, $this.latitude));


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
                params: {},
                map: ''
            }
        }
    }
</script>

<style>
    @import "style.css";
</style>
