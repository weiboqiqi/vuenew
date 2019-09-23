<template>
    <div class="mapWrap">
        <div class="headerWrap">
            <div class="backWrap" @click="goBack">
                <img src="./images/goback.png">
            </div>
            <p>考场信息</p>
            <!--<img src="./images/share.png">-->
        </div>
        <div id="mapContent" class="mapContent"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CONST from '../../const';
    import {Utils} from '../../utils';
    import { mapState } from 'vuex';
    import store from '../../store';

    export default {
        name: 'success',
        mounted(){
            var $this = this;
            $this.longitude = $this.$route.params.longitude;
            $this.latitude = $this.$route.params.latitude;
            store.commit('update', ['callBack2', $this.$route.params.callbackData]);
            this.initMap();
            document.body.className = '';

        },
        computed: {
            ...mapState(['callBack2'])
        },
        methods: {
//            //这几个地方加this
            initMap () {
                this.render();
                this.setMapEvent();//设置地图事件
                this.addMapControl();//向地图添加控件
            },
            render(){
                var $this = this;
                var map = new BMap.Map("mapContent");
                var point = new BMap.Point($this.longitude, $this.latitude);
                var marker = new BMap.Marker(point);  // 创建标注
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
            goBack(){
                var $this = this;
//                store.commit('update', ['callBack2', $this.$route.params.callbackData]);
                $this.$router.go(-1);
            }

        },
        data(){
            return {
                latitude: '',
                longitude: '',
                map: null
            }
        }
    }
</script>

<style>
    @import "style.css";
</style>
