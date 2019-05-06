import BaseLayer from './BaseLayer'
import GisUtil from '../utils/GisUtil'
import { LAYER_TYPE, getSymbol } from '../Common'

const name = 'feature-layer'

export default {
  name: name,
  mixins: [BaseLayer],
  props: {
    url: {
      type: String,
      required: true
    },
    // 渲染器
    renderer: Object,
    // 查询实体
    query: Object,
    // 处理featureLayer数据加载完毕回调
    featureLoadedCallback: Function,
    // 图层样式
    symbol: Object
  },
  data () {
    return {
      graphicDataList: []
    }
  },
  methods: {
    /**
     * 初始化函数
     */
    init: async function () {
      const [FeatureLayer] = await GisUtil.loadModules('esri/layers/FeatureLayer')
      const featureLayer = new FeatureLayer(this.getProperties())
      if (this.query) {
        this.layer = await this.createQueryLayer()
        // 处理数据并加载图层
        this.queryFeatureData(featureLayer)
      } else {
        this.layer = featureLayer
      }
      // 执行回调
      if (this.initCallback) {
        this.initCallback(this.layer, this.getIndex())
      }
      return this.layer
    },
    /**
     * 查询图层数据
     * @param featureLayer featureLayer
     */
    queryFeatureData: async function (featureLayer) {
      const featureQuery = featureLayer.createQuery()
      for (let key in this.query) {
        featureQuery[key] = this.query[key]
      }
      const response = await featureLayer.queryFeatures(featureQuery)
      // 处理数据
      this.dealFeatureData(response.features, response.geometryType)
      // 执行回调
      if (this.featureLoadedCallback) {
        this.graphicDataList = this.featureLoadedCallback(this.graphicDataList)
      }
      // 设置样式
      this.graphicDataList.forEach(graphic => {
        graphic.symbol = getSymbol(graphic, response.geometryType, this.symbol)
      })
      this.addGraphics()
    },
    /**
     * 创建查询图层
     */
    createQueryLayer: async function () {
      // 创建图层
      const [GraphicsLayer] = await GisUtil.loadModules('esri/layers/GraphicsLayer')
      return new GraphicsLayer({
        id: this.id,
        title: this.title
      })
    },
    /**
     * 处理查询的数据
     * @param features
     * @param type
     */
    dealFeatureData: function (features, type) {
      features.forEach(feature => {
        this.graphicDataList.push({
          geometry: this.getGeometry(feature.geometry, type),
          attributes: feature.attributes
        })
      })
    },
    /**
     * 添加元素
     */
    addGraphics: async function () {
      const [Graphic] = await GisUtil.loadModules('esri/Graphic')
      let graphics = []
      this.graphicDataList.forEach(graphicData => {
        graphics.push(new Graphic(graphicData))
      })
      this.layer.addMany(graphics)
    },
    /**
     * 获取图形
     * @param geometry 查询得到的图形
     * @param type 图形类型
     */
    getGeometry: function (geometry, type) {
      let result
      switch (type) {
        case LAYER_TYPE.POINT:
          result = {
            type: type,
            latitude: geometry.latitude,
            longitude: geometry.longitude
          }
          break
        case LAYER_TYPE.POLYLIE:
          result = {
            type: type,
            paths: geometry.paths
          }
          break
        case LAYER_TYPE.POLYGON:
          result = {
            type: type,
            rings: geometry.rings
          }
          break
      }
      return result
    },
    /**
     * 获取参数
     */
    getProperties: function () {
      const properties = {
        url: this.url
      }
      if (this.id !== null) {
        properties.id = this.id
      }
      if (this.renderer !== null) {
        properties.renderer = this.renderer
      }
      return properties
    }
  },
  render (h) {
    return undefined
  }
}
