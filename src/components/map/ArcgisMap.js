import GisUtil from '../utils/GisUtil'
const name = 'arcgis-map'
export default {
  name: name,
  props: {
    // 底图
    basemap: String,
    // 地图的地面属性（地图为3D地图时有效）
    ground: String
  },
  data () {
    return {
      // 底图对象
      map: null,
      name: name
    }
  },
  methods: {
    // 公共方法
    /**
     * 初始化函数
     * @returns {Promise<*>}
     */
    init: async function () {
      return this.create()
    },
    /**
     * 获取地图对象
     */
    getMap: function () {
      return this.map
    },
    /**
     * 初始化图层
     */
    initLayer: function () {
      let indexObject = {
        index: 1
      }
      if (this.$children.length > 0) {
        this.recursionInit(this.$children, indexObject)
      }
    },
    // ------- 私有方法 -------
    /**
     * 创建方法
     * @returns {Promise<void>}
     */
    create: async function () {
      const [Map] = await GisUtil.loadModules('esri/Map')
      this.map = new Map(await this.initMapProperties())
      // 初始化图层
      // this.initLayer()
      return this.map
    },
    /**
     * 初始化地图参数
     * @returns {Promise<void>}
     */
    initMapProperties: async function () {
      return {
        basemap: await this.getBaseMap()
      }
      // TODO: (待完善)获取ground
    },
    /**
     * 获取底图
     * @returns {Promise<*>}
     */
    getBaseMap: async function () {
      let baseMap = null
      for (let i = 0; i < this.$children.length; i++) {
        const child = this.$children[i]
        if (child.name === 'base-map') {
          baseMap = await child.init()
        }
      }
      if (baseMap === null) {
        baseMap = this.basemap === null ? 'satellite' : this.basemap
      }
      return baseMap
    },
    /**
     * 使用递归初始化图层
     */
    recursionInit: function (children, indexObject) {
      children.forEach(child => {
        if (child['type'] === 'layer') {
          this.addLayer(child, indexObject.index)
          indexObject.index = indexObject.index + 1
        }
        if (child.$children.length > 0) {
          this.recursionInit(child.$children, indexObject)
        }
      })
    },
    /**
     * 添加图层
     * @param layer
     * @param index
     */
    addLayer: function (layer, index) {
      // 设置默认序号
      layer.setDefaultIndex(index)
      // 设置回调函数
      layer.setInitCallback((layer, layerIndex) => {
        this.map.add(layer, layerIndex)
      })
      // 如果图层是显示的直接创建
      if (layer.getVisible() === true) {
        layer.init()
      }
    }
  },
  render (h) {
    return this.$slots.default
  }
}
