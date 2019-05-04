import BaseLayer from './BaseLayer'
import GisUtil from '../utils/GisUtil'

const name = 'web-tile-layer'

export const presetLayer = {
  shandong: 'shandong',
  global: 'global'
}

// 山东省天地图配置
const config = {
  shandong: {
    urlTemplate: 'http://www.sdmap.gov.cn/tileservice/SDPubMap?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile' + '&LAYER=0' + '&STYLE=default' + '&FORMAT=image/png' + '&TILEMATRIXSET=taishannew' + '&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
    tileInfo: {
      dpi: 90.71428571427429,
      spatialReference: {
        wkid: 4326
      },
      format: 'PNG8',
      compressionQuality: 0,
      lods: [
        { 'level': 0, 'resolution': 1.4062500000002376, 'scale': 590995186.11759996 },
        { 'level': 1, 'resolution': 0.703125000000119, 'scale': 295497593.0588 },
        { 'level': 2, 'resolution': 0.351562500000059, 'scale': 147748796.5294 },
        { 'level': 3, 'resolution': 0.17578125000003, 'scale': 73874398.2647 },
        { 'level': 4, 'resolution': 0.0878906250000148, 'scale': 36937199.1323 },
        { 'level': 5, 'resolution': 0.0439453125000074, 'scale': 18468599.566175 },
        { 'level': 6, 'resolution': 0.0219726562500037, 'scale': 9234299.7830875 },
        { 'level': 7, 'resolution': 0.0109863281250019, 'scale': 4617149.89154375 },
        { 'level': 8, 'resolution': 0.00549316406250093, 'scale': 2308574.94577187 },
        { 'level': 9, 'resolution': 0.00274658203125046, 'scale': 1154287.47288594 },
        { 'level': 10, 'resolution': 0.00137329101562523, 'scale': 577143.736442969 },
        { 'level': 11, 'resolution': 0.000686645507812616, 'scale': 288571.868221484 },
        { 'level': 12, 'resolution': 0.000343322753906308, 'scale': 144285.934110742 },
        { 'level': 13, 'resolution': 0.000171661376953154, 'scale': 72223.960000000006 },
        { 'level': 14, 'resolution': 8.5830688476577E-05, 'scale': 36071.4835276855 },
        { 'level': 15, 'resolution': 4.29153442382885E-05, 'scale': 18035.7417638428 },
        { 'level': 16, 'resolution': 2.14576721191443E-05, 'scale': 9017.87088192139 },
        { 'level': 17, 'resolution': 1.07288360595721E-05, 'scale': 4508.93544096069 },
        { 'level': 18, 'resolution': 5.36441802978606E-06, 'scale': 2254.46772048035 },
        { 'level': 19, 'resolution': 2.68220901489303E-06, 'scale': 1127.23386024017 },
        { 'level': 20, 'resolution': 1.34110450744652E-06, 'scale': 563.616930120087 }
      ],
      origin: {
        x: -180,
        y: 90
      }
    }
  },
  global: {
    urlTemplate: 'http://{subDomain}.tianditu.com/DataServer?T=vec_c&x={col}&y={row}&l={level}',
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    tileInfo: {
      dpi: 90.71428571427429,
      spatialReference: {
        wkid: 4326
      },
      format: 'PNG8',
      compressionQuality: 0,
      lods: [
        { level: 2, levelValue: 2, resolution: 0.3515625, scale: 147748796.52937502 },
        { level: 3, levelValue: 3, resolution: 0.17578125, scale: 73874398.264687508 },
        { level: 4, levelValue: 4, resolution: 0.087890625, scale: 36937199.132343754 },
        { level: 5, levelValue: 5, resolution: 0.0439453125, scale: 18468599.566171877 },
        { level: 6, levelValue: 6, resolution: 0.02197265625, scale: 9234299.7830859385 },
        { level: 7, levelValue: 7, resolution: 0.010986328125, scale: 4617149.8915429693 },
        { level: 8, levelValue: 8, resolution: 0.0054931640625, scale: 2308574.9457714846 },
        { level: 9, levelValue: 9, resolution: 0.00274658203125, scale: 1154287.4728857423 },
        { level: 10, levelValue: 10, resolution: 0.001373291015625, scale: 577143.73644287116 },
        { level: 11, levelValue: 11, resolution: 0.0006866455078125, scale: 288571.86822143558 },
        { level: 12, levelValue: 12, resolution: 0.00034332275390625, scale: 144285.93411071779 },
        { level: 13, levelValue: 13, resolution: 0.000171661376953125, scale: 72142.967055358895 },
        { level: 14, levelValue: 14, resolution: 8.58306884765625e-005, scale: 36071.483527679447 },
        { level: 15, levelValue: 15, resolution: 4.291534423828125e-005, scale: 18035.741763839724 },
        { level: 16, levelValue: 16, resolution: 2.1457672119140625e-005, scale: 9017.8708819198619 },
        { level: 17, levelValue: 17, resolution: 1.0728836059570313e-005, scale: 4508.9354409599309 },
        { level: 18, levelValue: 18, resolution: 5.3644180297851563e-006, scale: 2254.4677204799655 },
        { level: 19, levelValue: 19, resolution: 2.68220901489257815e-006, scale: 1127.23386023998275 },
        { level: 20, levelValue: 2, resolution: 1.341104507446289075e-006, scale: 563.616930119991375 }
      ],
      origin: {
        x: -180,
        y: 90
      }
    }
  }
}

/**
 * 天地图图层
 * TODO：全球天地图添加注记图层
 */
export default {
  name: name,
  mixins: [BaseLayer],
  props: {
    // 预设图层
    preset: String,
    // 资源地址模板
    urlTemplate: String,
    copyright: String,
    tileInfo: Object,
    token: String,
    // 坐标系
    spatialReference: {
      type: Object,
      default: () => {
        return { wkid: 4326 }
      }
    }
  },
  created () {
    if (this.preset === null && this.urlTemplate === null) {
      console.error('参数错误，如果未选择预设，请设置urlTemplate')
    }
  },
  methods: {
    /**
     * 初始化方法
     * @returns {Promise<void>}
     */
    init: async function () {
      const [TileInfo, WebTileLayer] = await GisUtil.loadModules('esri/layers/support/TileInfo', 'esri/layers/WebTileLayer')
      let tileInfo = null
      const layerConfig = this.getConfig()
      if (this.tileInfo !== null) {
        tileInfo = new TileInfo(layerConfig.tileInfo)
      }
      // 构建参数
      const properties = {
        urlTemplate: layerConfig.urlTemplate,
        spatialReference: this.spatialReference,
        visible: this.visible
      }
      if (tileInfo !== null) {
        properties.tileInfo = tileInfo
      }
      if (this.copyright !== null) {
        properties.copyright = this.copyright
      }
      if (layerConfig.subDomains) {
        properties.subDomains = layerConfig.subDomains
      }
      this.layer = new WebTileLayer(properties)
      return this.layer
    },
    /**
     * 获取配置
     * 如果设置预设信息则使用预设对应tileinof
     */
    getConfig: function () {
      if (this.preset !== null) {
        const layerConfig = config[this.preset]
        if (this.preset === presetLayer.global) {
          layerConfig.urlTemplate = layerConfig.urlTemplate + `&tk=${this.token}`
        }
        return layerConfig
      } else {
        return {
          urlTemplate: this.urlTemplate,
          tileInfo: this.tileInfo
        }
      }
    }
  },
  render (h) {
    return undefined
  }
}
