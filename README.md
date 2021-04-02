最近写几了几个报表模块，抽出空余时间简单的封装了一下。对原始的echarts进行二次封装、更方便维护、创建、管理；

### 效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/2021032212430937.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L21lbmdoYW9lcg==,size_16,color_FFFFFF,t_70#pic_center)


### 1.文件目录说明
```bash
|-- echarts-extends
    |-- inedx.html              #视图
    |-- charts-class.js         #各类图表class
    |-- chart-factory.js        #图表工厂
    |-- utils.js                #工具方法
```


> 提示： 每个图表构造器原型上都有一个 `setData` 方法，此方法应该定义你改图表使用的数据，不应该拿来处理或组装数据，（相当于对外暴露一个接口，必须按照我的格式来设置数据）。

### 2.使用
```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Echarts</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.0.2/echarts.common.js"></script>
    <style>
        .my-card {
            display: block;
            width: 600px;
            border: 1px solid #ddd;
            margin: 20px auto;
            border-radius: 5px;
        }
        .my-card .card-header {
            height: 50px;
            line-height: 50px;
            padding: 0 20px;
            border-bottom: 1px solid #ddd;
            user-select: none;
        }
        
        .my-card .card-content {
            min-height: 300px;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="my-card">
        <div class="card-header">图表1</div>
        <div class="card-content" id="chart1"></div>
    </div>
    <div class="my-card">
        <div class="card-header">图表2</div>
        <div class="card-content" id="chart2"></div>
    </div>

    <div class="my-card">
        <div class="card-header">图表3</div>
        <div class="card-content" id="chart3"></div>
    </div>

    <script src="./utils.js"></script>
    <script src="./charts-class.js"></script>
    <script src="./chart-factory.js"></script>
    <script>
        var chartFactory = null; //图表工厂
        function _init() {
            chartFactory = initChart();  //初始化图表
        }

        /**
         * 初始化图表
         * @return {Object} 图表工厂
         */
        function initChart() {
            var chartFactory = new ChartFactory();  //图表工厂
            chartFactory.batchCreate([
               	//多走势图
                {
                    type: 'MORE_TREND_LINE', //图表类型，（chart-class.js）中的枚举文件；
                    wrapId: '#chart1',  //图表挂载容器选择器
                    data: function (chart) { //data可以是你的默认数据，也可以走API去拿
                        var  data = {
                            yUnit: "测试",
                            xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                            legend: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
                            series: [
                                {
                                    name: '邮件营销',
                                    type: 'line',
                                    stack: '总量',
                                    data: [120, 132, 101, 134, 90, 230, 210]
                                },
                                {
                                    name: '联盟广告',
                                    type: 'line',
                                    stack: '总量',
                                    data: [220, 182, 191, 234, 290, 330, 310]
                                },
                                {
                                    name: '视频广告',
                                    type: 'line',
                                    stack: '总量',
                                    data: [150, 232, 201, 154, 190, 330, 410]
                                },
                                {
                                    name: '直接访问',
                                    type: 'line',
                                    stack: '总量',
                                    data: [320, 332, 301, 334, 390, 330, 320]
                                },
                                {
                                    name: '搜索引擎',
                                    type: 'line',
                                    stack: '总量',
                                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                                }
                            ]
                        };
                        
                      	//备注：当前作用域的 this === chart
                        chart.setData(data) //这里的setData === 构造器原乡上的setData方法；
                    }
                },
                {
                    type: 'RATIO',
                    wrapId: '#chart2',
                    data: function (chart) {
                        var data =  [
                            {value: 1048, name: '搜索引擎'},
                            {value: 735, name: '直接访问'},
                            {value: 580, name: '邮件营销'},
                            {value: 484, name: '联盟广告'},
                            {value: 300, name: '视频广告'}
                        ]
                        chart.setData(data)
                    },

                    //事件，这里的事件可根据echarts提供的对应事件，key、value传递，底层代理绑定
                    events: {
                        click: function (param) {
                            console.log(param)
                        }
                    }
                },
                {
                    type: 'PILLARS',
                    wrapId: '#chart3',
                    data: function (chart) {
                        var data = {
                            xAxis:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            series: [120, 200, 150, 80, 70, 110, 130]
                        }
                        chart.setData(data)
                    }
                }
            ]); //批量创建图表
            chartFactory.getChartsData(); //获取图表数据
            return chartFactory;
        }

        _init();
    </script>
</body>
</html>
```

### 3.备注

> 如果觉得对你有帮助，请给作者一个start吧，谢谢啦~