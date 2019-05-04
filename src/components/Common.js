/**
 * 图层类型
 * @type {{POLYGON: string, POLYLIE: string, POINT: string}}
 */
const LAYER_TYPE = {
  POINT: 'point',
  POLYLIE: 'polyline',
  POLYGON: 'polygon'
}
/**
 * 获取图层样式
 * @param data
 * @param type
 * @returns {{color: number[], type: string}|{outline: {color: number[], width: number}, color: number[], type: string}|{color: number[], width: number, type: string}|Runtime.RemoteObject | ObjectConstructor | SVGSymbolElement}
 */
const getSymbol = (data, type, defaultSymbol) => {
  if (data.symbol) {
    return data.symbol
  } else if (defaultSymbol) {
    return defaultSymbol
  } else {
    if (type === LAYER_TYPE.POINT) {
      return {
        type: 'simple-marker',
        color: [226, 119, 40]
      }
    } else if (type === LAYER_TYPE.POLYLIE) {
      return {
        type: 'simple-line',
        color: [226, 119, 40],
        width: 4
      }
    } else if (type === LAYER_TYPE.POLYGON) {
      return {
        type: 'simple-fill',
        color: [227, 139, 79, 0.8],
        outline: {
          color: [255, 255, 255],
          width: 1
        }
      }
    }
  }
}

export {
  LAYER_TYPE,
  getSymbol
}
