<template>
    <div>
        <div>echarts</div>
        <div>
            <!-- <div class="main" style="width: 1100px;height: 440px; margin: auto;">echart1</div> -->
            <div class="echarts" style="width: 1100px;height: 440px; margin: auto;" v-for="(axis,index) in target" :key="index">
                <div class="echartsType" style="width: 1000px;height: 440px; margin: auto;">
            </div>
        </div>
        </div>
    </div>
</template>

<script>
// 导入
import * as echarts from 'echarts';
import {getGasChromatographDataByDeviceId} from '@/api/realdata/index'

export default {
    name:'detialData',
    data(){
        return{
            chromatographData:[],
            target:[
                {id:'carbon6plusEchartData', name:'碳六+',warning:0.020},
                {id:'carbonDioxideEchartData', name:'二氧化碳',warning:2},
                {id:'ethaneEchartData',name:'乙烷',warning:1},
                {id:'hiLowCalorificValueEchartData',name:'Hi低热值',warning:40},
                {id:'hsHighCalorificValueEchartData',name:'Hs高热值',warning:40},
                {id:'isobutaneEchartData',name:'异丁烷',warning:0.010},
                {id:'isopentaneEchartData',name:'异戊烷',warning:0.010},
                {id:'methaneEchartData',name:'甲烷',warning:101},
                {id:'nbutaneEchartData',name:'正丁烷',warning:0.020},
                {id:'newPentaneEchartData',name:'新戊烷',warning:0.002},
                {id:'nitrogenEchartData',name:'氮气',warning:0.808},
                {id:'npentaneEchartData',name:'正戊烷',warning:0.010},
                {id:'propaneEchartData',name:'丙烷',warning:0.050},
                {id:'scaleDensityDenEchartData',name:'标况密度',warning:1},
            ]
        }
    },
    created() {
        const deviceId = this.$route.query.id;
        this.getChromatographData(deviceId);

    },
    mounted() {
        
   },
    methods: {
        // 色谱仪时序数据
        getChromatographData(deviceId) {
            getGasChromatographDataByDeviceId(deviceId).then(res => {
                this.chromatographData = res.data 
                console.log(this.chromatographData);
                this.draw()
            })
        },
        draw(){
            for(let i = 0; i < this.target.length; i++){
                var chartDom = document.querySelectorAll('.echartsType')[i];
                    // console.log(chartDom);
                    var myChart = echarts.init(chartDom);
                    // console.log(myChart);
                    // console.log(this.chromatographData[this.target[i].id]); 
                    var option;
                    myChart.setOption(
                        (option = {
                            title: {
                                text: this.target[i].name,
                                subtext:'单位（%）',
                            },
                            tooltip: {
                                trigger: 'axis',
                            },
                            grid: {
                                left: '7%',
                                right: '12%',
                                bottom: '10%',
                                // containLable:true
                            },
                            xAxis: {
                                data:this.chromatographData.timeArray
                            },
                            yAxis: {
                                type: 'value',
                                min: function (value) {
                                    return value.min;
                                },
                                max: function (value) {
                                    return value.max*1.1;
                                }
                            },
                            toolbox: {
                                right: 10,
                                feature: {
                                saveAsImage: {}
                                }
                            },
                            legend: {
                                left: 'center'
                            },
                            dataZoom: [
                                {
                                startValue: '2023-3-8'
                                },
                                {
                                type: 'inside'
                                }
                            ],
                            series: {
                                name: this.target[i].name,
                                type: 'line',
                                smooth:true,
                                data:this.chromatographData[this.target[i].id],
                                markLine: {
                                silent: true,
                                lineStyle: {
                                    color: 'red'
                                },
                                data: [
                                    {
                                    yAxis: this.target[i].warning
                                    },
                                ]
                                }
                            }
                        })
                    );
                option && myChart.setOption(option);
                }
            }, 
            }
            
     
}


</script>