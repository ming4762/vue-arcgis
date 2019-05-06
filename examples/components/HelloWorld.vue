<template>
  <div style="height: 600px">
    <ArcgisView
        :extent="extent"
        @pointer-click="handleViewClick"
        ref="view"
        jsBaseUrl="http://charsming.f3322.org:8082/js/arcgis/4.9/dojo"
        jsUrl="http://charsming.f3322.org:8082/js/arcgis/4.9/init.js">
      <arcgis-map>
        <base-map>
          <web-tile-layer
              preset="shandong"/>
        </base-map>
        <!-- 测试图层 -->
        <graphics-layer
            :visible="visible"
            :data="data"
            graphicType="point"></graphics-layer>
      </arcgis-map>
    </ArcgisView>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TestMixin from '../mixins/test-mixin'
import Component from 'vue-class-component'
import { ArcgisView, ArcgisMap, BaseMap, WebTileLayer, GraphicsLayer } from '../../src'

@Component({
  components: {
    ArcgisView,
    ArcgisMap,
    BaseMap,
    WebTileLayer,
    GraphicsLayer
  },
  mixins: [TestMixin]
})
export default class HelloWorld extends Vue<TestMixin> {
  $refs
  // 5de6cf77ed54ae2360c0182e387db7bc
  msg: string = 'Welcome to Your Vue-Typescript App'

  extent = {
    xmin: 119.514,
    ymin: 36.496,
    xmax: 121.941,
    ymax: 38.413
  }

  mounted () {
    console.log(ArcgisMap.name)
    setTimeout(() => {
      this.data.push({
        x: 120.9081856774994,
        y: 37.50232919209251
      })
      this.extent.xmin = 115.0
    }, 3000)
  }
  visible = true
  handleViewClick (a, b) {
    console.log(this.$refs['view'].getActiveView())
    console.log(a, b)
  }
  data = [
    {
      x: 135,
      y: 37
    }
  ]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
