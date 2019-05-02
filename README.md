# vue-ECharts

## Attributes
参数 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---|---
initOptions | echarts初始化配置，请参考EChart官网 | object
options | echarts实例数据 | object | - | -
theme | echarts主题 | Array | - | -
group |  实例的分组，会自动绑定到 ECharts 组件的同名属性上 | string | - | -
autoresize |  尺寸变化是否自动重绘 | boolean | true/false | false
manualUpdate | 是否手动更新 | boolean | true/false | false
watchShallow | 是否浅监控属性变化| boolean | true/false | false

## Methods
方法名 | 说明 | 参数 | 返回值
---|---|---|---
resize | 执行echart方法resize | options? | -
load | 加载数据 | - | -
appendData | 执行echart方法appendData | 
dispatchAction | 执行echart方法dispatchAction | 
convertToPixel | 执行echart方法convertToPixel | 
convertFromPixel | 执行echart方法convertFromPixel | 
containPixel | 执行echart方法containPixel | 
showLoading | 执行echart方法showLoading | 
hideLoading | 执行echart方法hideLoading | 
getDataURL | 执行echart方法getDataURL | 
getConnectedDataURL | 执行echart方法getConnectedDataURL | 
clear | 执行echart方法clear |
dispose | 执行echart方法dispose |
mergeOptions | 合并参数 |

