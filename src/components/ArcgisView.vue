<script>
import GisUtil from './utils/GisUtil'
import { gisOption } from './gisConfig/GisConfig'

export const ViewType = {
  VIEW_3D: '3D',
  VIEW_2D: '2D'
}

const events = {
  switchView: 'switch-view'
}
/**
 * 视图组件
 */
export default {
  name: 'ArcgisView',
  props: {
    // 是否是混合图层
    mixed: {
      type: Boolean,
      default: false
    },
    jsUrl: String,
    jsBaseUrl: String,
    // 视图类型，mixed为true，改属性无效
    viewType: {
      type: String,
      default: ViewType.VIEW_2D
    },
    // 视图边界
    extent: {
      type: Object,
      default: () => {
        return {
          xmin: 119.514,
          ymin: 36.496,
          xmax: 121.941,
          ymax: 38.413
        }
      }
    },
    // 显示鼠标坐标
    showCursorXY: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const elementId = new Date().getTime() + ''
    return {
      // 视图容器
      viewContainer: {
        mapView: null,
        sceneView: null,
        activeView: null,
        container: elementId
      },
      // 鼠标点
      cursorPoint: {},
      // 地图对象
      map: {},
      // 地图vue实例
      mapVue: null,
      elementId: elementId
    }
  },
  created () {
    gisOption.url = this.jsUrl
    gisOption.dojoConfig.baseUrl = this.jsBaseUrl
  },
  mounted () {
    // 创建视图
    this.createView()
  },
  watch: {
    extent: {
      deep: true,
      handler: function (_new) {
        this.getActiveView().extent = _new
      }
    }
  },
  methods: {
    // --------- 公共方法 -------------
    /**
     * 获取地图实例
     * @returns {map|{}}
     */
    getMap: function () {
      return this.map
    },
    /**
     * 获取激活状态的view
     * @returns {null}
     */
    getActiveView: function () {
      return this.viewContainer.activeView
    },
    /**
     * 设置视图中心
     */
    setCenter: function (point) {
      this.getActiveView().center = point
    },
    // -------- 私有方法 ----------
    /**
     * 创建视图
     */
    createView: function () {
      this.createMap()
        .then(map => {
          this.map = map
          // 视图初始化参数
          const initialViewParams = {
            map: this.map,
            extent: this.extent,
            container: this.viewContainer.container,
            constraints: {
              rotationEnabled: false
            },
            viewType: this.viewType
          }
          if (this.mixed) {
            this.create2D3DView(initialViewParams)
          } else {
            this.createOneView(initialViewParams)
          }
        })
    },
    /**
     * 创建地图实例
     * @returns {Promise<*>}
     */
    createMap: async function () {
      let promiseMethod = null
      console.log(this.$children)
      for (let i = 0; i < this.$children.length; i++) {
        let mapVue = this.$children[i]
        if (mapVue['name'] === 'arcgis-map') {
          this.mapVue = mapVue
          promiseMethod = mapVue.init
        }
      }
      let map = null
      if (promiseMethod != null) {
        map = await promiseMethod()
      } else {
        map = await this.createDefaultMap()
      }
      return map
    },
    /**
     * 创建默认地图
     * @returns {Promise<void>}
     */
    createDefaultMap: async function () {
      const [Map] = await GisUtil.loadModules('esri/Map')
      return new Map({
        basemap: 'satellite',
        ground: 'world-elevation'
      })
    },
    /**
     * 切换视图
     */
    switchView: function () {
      const is3D = this.getActiveView().type === '3d'
      this.getActiveView().container = null
      if (is3D) {
        // 获取当前视图中心店
        this.viewContainer.mapView.viewpoint = this.viewContainer.activeView.viewpoint.clone()
        this.viewContainer.mapView.container = this.viewContainer.container
        // 设置激活视图
        this.viewContainer.activeView = this.viewContainer.mapView
      } else {
        this.viewContainer.sceneView.viewpoint = this.viewContainer.activeView.viewpoint.clone()
        this.viewContainer.sceneView.container = this.viewContainer.container
        this.viewContainer.activeView = this.viewContainer.sceneView
      }
      // 视图切换事件
      if (this.$listeners[events.switchView]) {
        this.$emit(this.$listeners[events.switchView])
      }
    },
    /**
     * 创建2D 3D混合视图
     */
    create2D3DView: function (initialViewParams) {
      // 创建2d视图
      return this.doCreateView(initialViewParams, ViewType.VIEW_2D)
        .then(view => {
          this.viewContainer.activeView = view
          // 创建3d视图
          initialViewParams.container = null
          this.doCreateView(initialViewParams, ViewType.VIEW_3D)
          this.viewContainer.activeView = this.viewContainer.mapView
          this.allCreateEvent()
        })
    },
    /**
     * 创建单一视图
     */
    createOneView: async function (initialViewParams) {
      let viewType = initialViewParams.viewType
      await this.doCreateView(initialViewParams, viewType)
      if (viewType === ViewType.VIEW_2D) {
        this.viewContainer.activeView = this.viewContainer.mapView
      } else {
        this.viewContainer.activeView = this.viewContainer.sceneView
      }
      this.getActiveView().when(() => {
        this.allCreateEvent()
      })
    },
    /**
     * 创建视图
     */
    doCreateView: async function (params, type) {
      const [MapView, SceneView] = await GisUtil.loadModules('esri/views/MapView', 'esri/views/SceneView')
      let view
      let is2D = type === ViewType.VIEW_2D
      if (is2D) {
        view = new MapView(params)
        this.viewContainer.mapView = view
        this.viewContainer.mapView.when(() => {
          this.addEvent(view)
          this.oneCreatedEvent(view)
        })
      } else {
        view = new SceneView(params)
        this.viewContainer.sceneView = view
        this.viewContainer.sceneView.when(() => {
          this.addEvent(view)
          this.oneCreatedEvent(view)
        })
      }
      // 移除下方介绍
      view.ui.remove('attribution')
      if (this.showCursorXY) {
        view.ui.add('cursorXYSpan', 'bottom-left')
      }
    },
    /**
     * 单一视图创建完毕事件
     */
    oneCreatedEvent: function (view) {
      if (this.$listeners['one-created']) {
        this.$emit('one-created', view)
      }
    },
    /**
     * 所有视图创建完毕事件
     */
    allCreateEvent: function () {
      // 初始化图层
      if (this.mapVue) {
        this.mapVue.initLayer()
      }
      if (this.$listeners['all-created']) {
        this.$emit('all-created')
      }
    },
    /**
     * 添加事件
     * @param view
     */
    addEvent: function (view) {
      // 添加鼠标移动事件
      const pointerMove = 'pointer-move'
      view.on(pointerMove, event => {
        if (this.$listeners[pointerMove]) {
          if (event.x !== 0 && event.y !== 0) {
            view.hitTest(event).then(response => {
              this.$emit(pointerMove, event, response['results'])
            })
          }
        }
        if (this.showCursorXY === true) {
          this.handleShowCursorXY(event)
        }
      })
      // 鼠标点击事件
      const pointerClick = 'pointer-click'
      if (this.$listeners[pointerClick]) {
        view.on('click', event => {
          if (event.x !== 0 && event.y !== 0) {
            view.hitTest(event).then(response => {
              this.$emit(pointerClick, event, response['results'])
            })
          }
        })
      }
    },
    /**
     * 显示xy坐标
     * @param event
     */
    handleShowCursorXY: function (event) {
      // 获取经纬度
      this.cursorPoint = this.getActiveView().toMap({
        x: event.x,
        y: event.y
      })
    }
  },
  /**
   * 渲染函数
   * @param h
   */
  render (h) {
    return (
      <div class="arcgis-full-height">
        <div id={this.elementId} class="arcgis-full-height"/>
        {
          this.mixed
            ? <div class="view-switch">
              <input onClick={this.switchView} class="esri-component esri-widget--button esri-widget esri-interactive" type="button" value="3D"/>
            </div>
            : ''
        }
        {
          this.$slots.default
        }
        {
          this.showCursorXY
            ? <span id="cursorXYSpan">经度：{this.cursorPoint.x}&nbsp;&nbsp;维度：{this.cursorPoint.y}</span>
            : ''
        }
      </div>
    )
  }
}
</script>

<style>
  @import url("../../css/arcgis/esri/css/main.css");
  .view-switch {
    position: absolute;
    top: 15px;
    left: 60px;
  }
  .view-switch input {
    border: none;
    box-shadow:  rgba(0, 0, 0, 0.3) 0 1px 2px;
  }
  .arcgis-full-height {
    height: 100%;
  }
</style>
