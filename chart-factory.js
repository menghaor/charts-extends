/*
 * @Description: 图表工厂，用户管理图表的（增、删、改）等操作功能；
 * @Author: Haor
 * @Date: 2021-03-19
 */

;(function (win, echarts, utils) {
    function ChartFactory () {
        if (!(this instanceof ChartFactory)) {
            throw new Error('The ChartFactory class can only be called using the new form!')
        }
        
        this.charts = {} //收集所有的图表

        //图表class
        this.chartClassMap = {
            //饼图
            RATIO: win.charts.Ratio,
    
            //走势折线
            MORE_TREND_LINE: win.charts.MoreTrendLine,
    
            //柱状图
            PILLARS: win.charts.Pillars,
        }
        this.init()
    }
    
    /**
     * 初始化
     */
    ChartFactory.prototype.init = function () {
        if (!echarts) {
            return console.warn('Please introduce the echart library first');
        }

        this.bindResizeEvent()
    }
    
    /**
     * 获取图表数据
     * @return {Object}
     */
    ChartFactory.prototype.getChartsData = function () {
        var charts = this.charts
        Object.keys(charts).forEach(function (cKey) {
            if (typeof charts[cKey].getData === 'function') {
                charts[cKey].getData.call(charts[cKey], charts[cKey].setData)
            }
        })
        return this
    }
    
    /**
     * 批量创建
     * @param {Array} chartList
     * @param {String} chartList.item.type 图表的type
     * @param {String} chartList.item.wrapId 容器
     * @param {String} chartList.item.objKey 返回实例的key
     * @param {Array|Object|Function} chartList.item.data 图表数据，如果为函数，则里面函数请求内容调用cb，传入data
     * @return {Object}
     */
    ChartFactory.prototype.batchCreate = function (chartList) {
        var chartRes = Object.create(null)
        for (var i = 0, len = chartList.length; i < len; i++) {
            var chartItem = chartList[i]
            var chartObj = this.create(
                chartItem.type,
                chartItem.wrapId,
                chartItem.data,
                chartItem.events
            ) //生成图表实例
            chartRes[chartItem.objKey || chartItem.type] = chartObj
        }
        return chartRes
    }
    
    /**
     * 创建图表
     * @param {String} chartType 图表类型
     * @param {String} wrapperId 容器id
     * @param {*|Function} chartData 数据或获取数据函数
     * @param {Object} events 事件监听
     */
    ChartFactory.prototype.create = function (
        chartType,
        wrapperId,
        chartData,
        events
    ) {
        var chartClassMap = this.chartClassMap; //图表class
    
        //传入的type是否在map中存在
        if (!Object.prototype.hasOwnProperty.call(chartClassMap, chartType)) {
            return console.warn(chartType + '类型的Chart不存在！')
        }
    
        //每个图表构造器继承(ChartCommon)
        var chartClass = utils.extend(chartClassMap[chartType], ChartCommon)
    
        //图表实例
        var chartInstance = new chartClass(wrapperId, chartData)
    
        //绑定获取数据方法
        if (typeof chartData === 'function') {
            chartInstance.getDataFn = chartData
        }
    
        //绑定事件事件
        if (utils.getType(events) === 'object') {
            chartInstance.listen(events)
        }
    
        //保存在实例中
        this.charts[wrapperId] = chartInstance
    
        return chartInstance
    }
    
    /**
     * 绑定窗口缩放事件
     * @param cb
     */
    ChartFactory.prototype.bindResizeEvent = function (cb) {
        var handleEvent = utils.debounce(
            function () {
                var charts = this.charts
                for (var key in charts) {
                    if (charts[key].chart) {
                        typeof charts[key].chart.resize && charts[key].chart.resize()
                        cb && cb(charts[key])
                    }
                }
            }.bind(this),
            100
        )
    
        win.addEventListener('resize', handleEvent, false)
    }

    //export
    win.ChartFactory = win.ChartFactory || ChartFactory;
})(window, (echarts || window.echarts), window.utils);
