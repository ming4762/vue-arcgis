export default {
  props: {
    // 图层ID
    id: String,
    // 图层可见状态
    visible: {
      type: Boolean,
      default: true
    },
    // 标题
    title: String,
    // 序号
    index: Number
  },
  data () {
    return {
      // layer实体
      layer: null,
      type: 'layer',
      // 创建完毕的回调
      initCallback: null,
      // 默认的需要由调用图层单位设定
      defaultIndex: 0
    }
  },
  watch: {
    /**
     * 监控显示状态变化
     * @param _new
     * @param old
     */
    visible: function (_new, old) {
      if (_new !== old) {
        if (this.layer !== null) {
          this.layer.visible = _new
        } else if (_new === true) {
          this.init()
        }
      }
    }
  },
  methods: {
    /**
     * 设置回调函数
     * @param callback 回调函数
     */
    setInitCallback: function (callback) {
      this.initCallback = callback
    },
    /**
     * 设置默认的序号
     * @param index
     */
    setDefaultIndex: function (index) {
      this.defaultIndex = index
    },
    /**
     * 获取图层显示状态
     */
    getVisible: function () {
      return this.visible
    },
    //
    // init: async function () {
    //   return null
    // }
    /**
     * 获取图层
     * @returns {null}
     */
    getLayer: function () {
      return this.layer
    },
    /**
     * 获取序号
     */
    getIndex: function () {
      if (this.index !== null) {
        return this.index
      } else {
        return this.defaultIndex
      }
    }
  }
}
