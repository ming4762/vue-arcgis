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
  data () {
    return {
      name: 'base-map'
    }
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
      // 初始化图层
      if (this.$children.length > 0) {
        await this.recursionInit(this.$children, properties)
      }
      return properties
    },
    /**
     * 使用递归初始化图层
     */
    recursionInit: async function (children, properties) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child['type'] === 'layer') {
          const layer = await child.init()
          properties.baseLayers.push(layer)
        }
        if (child.$children.length > 0 && child.name !== 'base-map') {
          await this.recursionInit(child.$children, properties)
        }
      }
    }
  },
  render (h) {
    return (
      <div>
        {
          this.$slots.default
        }
      </div>
    )
  }
}
