import * as lodash from 'lodash'
import Vue from 'vue'
import { Message, ModalInstance } from 'iview';

// 全局变量设置
declare global {
  const _: typeof lodash
}

// iview 全局方法
declare module 'vue/types/vue' {
  interface Vue {
    $Message: Message,
    $Modal: ModalInstance
  }
}
