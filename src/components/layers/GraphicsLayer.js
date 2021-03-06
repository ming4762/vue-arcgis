import BaseLayer from './BaseLayer'
import GisUtil from '../utils/GisUtil'
import { LAYER_TYPE, getSymbol } from '../Common'

const name = 'graphics-layer'

let GisGraphicsLayer = null

/**
 * GraphicsLayer 组件
 * TODO: (功能加强) 图层类型可以是多样的，可以设置元素类型
 */
export default {
  name: name,
  mixins: [BaseLayer],
  props: {
    // 图层数据
    data: {
      type: Array,
      default: () => []
    },
    // 图层类型
    graphicType: String,
    // 图层样式
    symbol: Object
  },
  data () {
    return {
      name: name,
      // 图层数据
      graphicDataList: []
    }
  },
  watch: {
    /**
     * 监控数据变化
     */
    data: {
      deep: true,
      handler: function () {
        this.graphicDataList = this.convertData(this.data, this.graphicType)
        this.refreshGraphics()
      }
    }
  },
  methods: {
    // --------- 公共方法 -------------
    /**
     * 初始化方法
     * @returns {Promise<*>}
     */
    init: async function () {
      if (GisGraphicsLayer === null) {
        GisGraphicsLayer = (await GisUtil.loadModules('esri/layers/GraphicsLayer'))[0]
      }
      this.layer = new GisGraphicsLayer({
        id: this.id,
        title: this.title
      })
      // 执行回调
      if (this.initCallback) {
        this.initCallback(this.layer, this.getIndex())
      }
      this.loadData()
      // 加载数据
      return this.layer
    },
    /**
     * 获取图层边界
     */
    getExtent: function () {
      const graphicList = this.getGraphics()
      if (graphicList.length === 0) {
        return null
      } else {
        let xmax = 0
        let ymax = 0
        let xmin = 0
        let ymin = 0
        graphicList.forEach(graphic => {
          const extent = graphic.geometry.extent
          if (xmax === 0 || xmax < extent.xmax) {
            xmax = extent.xmax
          }
          if (ymax === 0 || ymax < extent.ymax) {
            ymax = extent.ymax
          }
          if (extent.xmin !== null && (xmin === 0 || xmin > extent.xmin)) {
            xmin = extent.xmin
          }
          if (extent.ymin !== null && (ymin === 0 || ymin > extent.ymin)) {
            ymin = extent.ymin
          }
        })
        return {
          xmin: xmin,
          xmax: xmax,
          ymax: ymax,
          ymin: ymin
        }
      }
    },
    /**
     * 获取图形元素集合
     */
    getGraphics: function () {
      return this.layer.graphics.items
    },
    /**
     * 根据ID获取图层元素
     * @param id 图层元素ID
     */
    getGraphicsById: function (id) {
      let result = null
      for (let graphic of this.getGraphics()) {
        if (graphic.attributes && graphic.attributes.id === id) {
          result = graphic
          break
        }
      }
      return result
    },
    // -------- 私有方法 ----------
    /**
     * 转换数据
     * @param data
     * @param graphicType
     */
    convertData: function (data, graphicType) {
      let graphicDataList = []
      switch (graphicType) {
        case LAYER_TYPE.POINT:
          graphicDataList = this.addPoint(data)
          break
        case LAYER_TYPE.POLYLIE:
          graphicDataList = this.addPolyline(data)
          break
        case LAYER_TYPE.POLYGON:
          graphicDataList = this.addPolygon(data)
          break
      }
      return graphicDataList
    },
    /**
     * 刷新元素
     */
    refreshGraphics: function () {
      // 删除元素
      if (this.layer) {
        this.layer.removeAll()
        this.addGraphics()
      }
    },
    /**
     * 加载数据
     */
    loadData: function () {
      this.graphicDataList = this.convertData(this.data, this.graphicType)
      this.addGraphics()
    },
    /**
     * 添加元素
     * @returns {Promise<void>}
     */
    addGraphics: async function () {
      const [Graphic] = await GisUtil.loadModules('esri/Graphic')
      const graphics = []
      this.graphicDataList.forEach(graphicData => {
        graphics.push(new Graphic(graphicData))
      })
      this.layer.addMany(graphics)
      const listener = 'graphics-added'
      if (this.$listeners[listener]) {
        this.$emit(listener, graphics)
      }
    },
    /**
     * 添加点
     * @param data
     * @returns {*}
     */
    addPoint: function (data) {
      return data.map(pointData => {
        const point = this.addSpatialReference({
          type: 'point',
          longitude: pointData.x,
          latitude: pointData.y
        }, pointData)
        return {
          geometry: point,
          symbol: getSymbol(pointData, LAYER_TYPE.POINT, this.symbol),
          attributes: pointData.attributes
        }
      })
    },
    /**
     * 添加线
     */
    addPolyline: function (data) {
      return data.map(lineData => {
        const polyline = this.addSpatialReference({
          type: 'polyline',
          paths: lineData.paths
        }, lineData)
        return {
          geometry: polyline,
          symbol: getSymbol(lineData, LAYER_TYPE.POLYLIE, this.symbol),
          attributes: lineData.attributes
        }
      })
    },
    /**
     * 添加面
     * @param data
     * @returns {*}
     */
    addPolygon: function (data) {
      return data.map(polygonData => {
        const polygon = this.addSpatialReference({
          type: 'polygon',
          rings: polygonData.rings
        }, polygonData)
        return {
          geometry: polygon,
          symbol: getSymbol(polygonData, LAYER_TYPE.POLYGON, this.symbol),
          attributes: polygonData.attributes
        }
      })
    },
    /**
     * 添加spatialReference
     * @param geometry
     * @param data
     * @returns {*}
     */
    addSpatialReference: function (geometry, data) {
      if (data.spatialReference) {
        geometry = Object.assign({
          spatialReference: data.spatialReference
        }, geometry)
      }
      return geometry
    }
  },
  render (h) {
    return undefined
  }
}
