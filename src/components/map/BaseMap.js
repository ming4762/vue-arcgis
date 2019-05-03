import GisUtil from '../utils/GisUtil'

const name = 'base-map'
/**
 * 底图
 */
export default {
  name: name,
  props: {
    id: String,
    title: String
  },
  methods: {
    // --------- 公共方法 -------------
    /**
     * 初始化方法
     * @returns {Promise<void>}
     */
    init: async function () {
      const [BaseLayer] = await GisUtil.loadModules('esri/Basemap')
      return new BaseLayer(await this.initMapProperties())
    },
    // -------- 私有方法 ----------
    /**
     * 初始化地图参数
     */
    initMapProperties: async function () {
      const properties = {
        baseLayers: []
      }
      if (this.id != null) {
        properties.id = this.id
      }
      if (this.title != null) {
        properties.title = this.title
      }
      // 初始化地图图层
      for (let i = 0; i < this.$children.length; i++) {
        const layerVue = this.$children[i]
        const layer = await layerVue.init()
        properties.baseLayers.push(layer)
      }
      return properties
    }
  },
  render (h) {
    return this.$slots.default
  }
}
