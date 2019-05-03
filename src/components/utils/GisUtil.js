import esriLoader from 'esri-loader'

import { gisOption } from '../config/GisConfig'
/**
 * gis工具类
 */
export default class GisUtil {
  /**
   * 加载GIS模块
   * @param models 模块名称
   */
  static async loadModules (...models) {
    return esriLoader.loadModules(models, gisOption)
  }
}
