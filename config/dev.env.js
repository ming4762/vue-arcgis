'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // arcgis for js 地址
  GIS_JS_URL: '"http://charsming.f3322.org:8082/js/arcgis/4.9/init.js"',
  // arcgis baseUrl
  GIS_BASE_URL: '"http://charsming.f3322.org:8082/js/arcgis/4.9/dojo'
})
