<template>
  <div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TestMixin from '../mixins/test-mixin'

import { CloudTableCRUD, CloudForm } from '../../src/index'
@Component({
  components: {
  },
  mixins: [TestMixin]
})
export default class HelloWorld extends Vue<TestMixin> {
  msg: string = 'Welcome to Your Vue-Typescript App'
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
