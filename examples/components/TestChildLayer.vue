<template>
  <div>
    <FeatureLayer
        id="borderLayer"
        :featureLoadedCallback="dealAddvcdBorder"
        :symbol="borderSymble"
        :query="{}"
        url="http://charsming.f3322.org:6080/arcgis/rest/services/HZZ_XHAXQ/MapServer/6"></FeatureLayer>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { FeatureLayer } from '../../src'

  @Component({
    components: {
      FeatureLayer
    }
  })
  export default class TestChildLayer extends Vue {

    dealAddvcdBorder (graphicsData: any[]) {
      if (graphicsData.length > 0) {
        const graphic = graphicsData[0]
        const rings = graphic.geometry.rings
        rings.push([[-180, 90], [-180, -90], [180, -90], [180, 90]])
        return [
          {
            attributes: graphic.attributes,
            geometry: {
              type: graphic.geometry.type,
              rings: rings
            }
          }
        ]
      }
      return []
    }

    borderSymble: any = {
      type: 'simple-fill',
      color: [169, 169, 169, 1],
      outline: {
        color: [47, 79, 79],
        width: 2
      }
    }
  }
</script>

<style scoped>

</style>
