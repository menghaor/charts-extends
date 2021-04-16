/*
 * @Description: 图表Class
 * @Author: Haor
 * @Date: 2021-03-19
 */

; (function (win, doc, echarts, utils) {
    /**
     * 比例图表
     * @param {String} wrapperId 容器id
     * @param {Array} data 数据
     */
    function Ratio (wrapperId, data) {
        //配置文件
        this.option = {
            tooltip: {
                trigger: 'item',
                formatter: function (param) {
                    return (
                        param.marker +
                        ' ' +
                        param.name +
                        '：<strong>' +
                        param.value +
                        ' (' +
                        param.percent +
                        '%)</srtong>'
                    )
                },
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '50%',
                    data: [],
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}: {c}({d}%)',
                        },
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        }

        this.init(wrapperId, data);
    }

    /**
     * 设置图表数据
     * @param {Array} data
     */
    Ratio.prototype.setData = function (data) {
        this.option.series[0].data = Array.isArray(data) ? data : []
        this.chart.setOption(this.option)
    }

    /**
     * 多走势线
     * @param {String} wrapperId 容器id
     * @param {Array} data
     */
    function MoreTrendLine (wrapperId, data) {
        this.option = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: [],
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            toolbox: {
                show: false,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: { interval: 0, rotate: 30 },
                data: [],
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                },
            },
            series: [],
        }
        this.init(wrapperId, data);
    }

    /**
     * 设置图表数据
     * @param {Object} data
     * @param {String} data.yUnit y轴单位
     * @param {Array} data.series
     * @param {Array} data.xAxis
     * @param {Array} data.legend
     * 
     */
    MoreTrendLine.prototype.setData = function (data) {
        data =  JSON.parse(JSON.stringify(data))
        this.option.yAxis.axisLabel.formatter = '{value}' + (data.yUnit || '')
        this.option.series = data.series
        this.option.xAxis.data = data.xAxis
        this.option.legend.data = data.legend
        this.option['_timer'] = Date.now()
        this.chart.setOption(this.option)
    }

    /**
     * 柱状图
     * @param {String} wrapperId 容器id
     * @param {Array} data
     */
    function Pillars (wrapperId, data) {
        this.option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999',
                    },
                },
            },
            legend: {
                data: [],
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisLabel: { interval: 0, rotate: 30 },
                    axisPointer: {
                        type: 'shadow',
                    },
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '万元',
                    min: 0,
                    max: 250,
                    interval: 50,
                    axisLabel: {
                        formatter: '{value}',
                    },
                },
            ],
            series: [
                {
                    name: '',
                    type: 'bar',
                    data: [],
                },
            ],
        }

        this.init(wrapperId, data);
    }

    /**
     * 设置图表数据
     * @param {Object} data
     * @param {Array} data.series
     * @param {Array} data.xAxis
     */
    Pillars.prototype.setData = function (data) {
        if (typeof data === 'function') return
        this.option.series[0].data = data.series
        this.option.xAxis[0].data = data.xAxis
        this.option.yAxis[0].max = data.max
        this.option.yAxis[0].interval = data.max / 10
        this.chart.setOption(this.option)
    }

    //收集
    var charts = {
        Ratio: Ratio,
        MoreTrendLine: MoreTrendLine,
        Pillars: Pillars,
    }




    /**
     *
     * 图表公共方法、属性
     */
    function ChartCommon () {
        this.eventsHandlerMap = {} //事件处理
    }

    /**
     * 初始化
     * @param {String} wrapperId
     * @param {*|Function} data
     */
    ChartCommon.prototype.init = function (wrapperId, data) {
        if (!echarts) {
            return console.warn(chartType + '类型的Chart不存在！') 
        }
        var dom = doc.querySelector(wrapperId)
        this.id = 'hr_' + Date.now();
        this.wrapId = wrapperId
        this.chart = echarts.init(dom)
        this.chart.setOption(this.option)
        if (utils.getType(data) === 'object') {
            this.setData(data)
        }
    }

    /**
     * 获取公共参数
     * @return {Object}
     */
    ChartCommon.prototype.setOption = function (newOptions) {
        this.option = utils.deepClone(newOptions); //深克隆配置
        this.chart.setOption(newOptions)
        return this;
    }

    /**
     * 图表监听/注册事件
     * @param {Object} events 监听事件类型 例：{click: function () {}}
     * @param {String} events[key] 事件名称
     * @param {Function} events[value] 事件处理方法
     * @return {Object} chart实例
     */
    ChartCommon.prototype.listen = function (events) {
        var _self = this
        Object.keys(events).forEach(function (key) {
            var eventHandle = events[key] //事件处理函数
            _self.chart.on(key, function () {
                var args = [].slice.call(arguments, 0)
                typeof eventHandle === 'function' && eventHandle.apply(_self, args) //事件监听实参请参考Echart文档
            })
        })
        return this
    }

    /**
     * 获取数据
     * @param {Function} cb 回调函数
     * @return {Object}
     */
    ChartCommon.prototype.getData = function (cb) {
        if (typeof this.getDataFn === 'function') {
            this.getDataFn.call(this, this, cb || this.setData)
        }
        return this
    }

    //export
    win.charts = win.charts || charts;
    win.ChartCommon = win.ChartCommon || ChartCommon;
})(window, document, window.echarts, window.utils)
