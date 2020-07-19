<template>
    <div align="center">
        <h1>全球新型冠状病毒确诊数统计</h1>
        <div id="main" style="width: 1000px;height:400px;"></div><br>
        <el-form :inline="true" :model="search" class="demo-form-inline">
            <el-form-item label="">
                <el-input v-model="search.country" placeholder="国家/地区"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="covidData"
                :default-sort="{prop: 'total', order: 'descending'}"
                style="width: 100%">
            <el-table-column
                    prop="country"
                    label="国家/地区"
                    width="200"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="province"
                    label="省/州"
                    width="200"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="diffFromPreDay"
                    label="昨日对比"
                    sortable
                    width="200"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="total"
                    label="总确诊数"
                    sortable
                    width="200"
                    align="center">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                search: {
                    country: ''
                },
                covidData: null,
                mapData: []
            }
        },
        mounted() {
            this.$axios
                .get('http://localhost:8080/getData')
                .then( response => {
                    this.covidData=response.data;
                    for (var i = 0; i < this.covidData.length; i++) {
                        var geoCoord = [];
                        geoCoord.push(this.covidData[i].longitude);
                        geoCoord.push(this.covidData[i].latitude);
                        geoCoord.push(this.covidData[i].total);
                        if(this.covidData[i].province!==""){
                            this.mapData.push({
                                name: this.covidData[i].province,
                                value: geoCoord
                            });
                        }else{
                            this.mapData.push({
                                name: this.covidData[i].country,
                                value: geoCoord
                            });
                        }
                    }
                    var myChart = this.$echarts.init(document.getElementById('main'));

                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: '全球新型冠状病毒确诊数统计',
                            subtext: 'ComfirmedCase of COVID',
                            sublink: 'https://gitee.com/dgut-sai/COVID-19/raw/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
                            left: 'center'
                        },
                        tooltip : {
                            trigger: 'item'
                        },
                        bmap: {
                            center: [104.114129, 37.550339],
                            zoom: 3,
                            roam: true,
                            mapStyle: {
                                styleJson: [{
                                    'featureType': 'water',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#d1d1d1'
                                    }
                                }, {
                                    'featureType': 'land',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#f3f3f3'
                                    }
                                }, {
                                    'featureType': 'railway',
                                    'elementType': 'all',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'highway',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#fdfdfd'
                                    }
                                }, {
                                    'featureType': 'highway',
                                    'elementType': 'labels',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'arterial',
                                    'elementType': 'geometry',
                                    'stylers': {
                                        'color': '#fefefe'
                                    }
                                }, {
                                    'featureType': 'arterial',
                                    'elementType': 'geometry.fill',
                                    'stylers': {
                                        'color': '#fefefe'
                                    }
                                }, {
                                    'featureType': 'poi',
                                    'elementType': 'all',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'green',
                                    'elementType': 'all',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'subway',
                                    'elementType': 'all',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'manmade',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#d1d1d1'
                                    }
                                }, {
                                    'featureType': 'local',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#d1d1d1'
                                    }
                                }, {
                                    'featureType': 'arterial',
                                    'elementType': 'labels',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'boundary',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#fefefe'
                                    }
                                }, {
                                    'featureType': 'building',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#d1d1d1'
                                    }
                                }, {
                                    'featureType': 'label',
                                    'elementType': 'labels.text.fill',
                                    'stylers': {
                                        'color': '#999999'
                                    }
                                }]
                            }
                        },
                        series : [
                            {
                                name: 'ComfirmedCase',
                                type: 'scatter',
                                coordinateSystem: 'bmap',
                                data: this.mapData,
                                symbolSize: function (val) {
                                    return val[2] / 6000;
                                },
                                encode: {
                                    value: 2
                                },
                                label: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                itemStyle: {
                                    color: 'red'
                                },
                                emphasis: {
                                    label: {
                                        show: true
                                    }
                                }
                            },
                            {
                                name: 'Top 5',
                                type: 'effectScatter',
                                coordinateSystem: 'bmap',
                                data: this.mapData.slice(0, 6),
                                symbolSize: function (val) {
                                    return val[2] / 6000;
                                },
                                encode: {
                                    value: 2
                                },
                                showEffectOn: 'render',
                                rippleEffect: {
                                    brushType: 'stroke'
                                },
                                hoverAnimation: true,
                                label: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: true
                                },
                                itemStyle: {
                                    color: 'red',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                },
                                zlevel: 1
                            }
                        ]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        methods: {
            onSearch() {
                this.$axios
                    .get('http://localhost:8080/search', {
                        params: {
                            country: this.search.country
                        }
                    })
                    .then(response => (this.covidData = response.data))     //注意取response.data中的内容
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }
</script>
