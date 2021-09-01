/**
 *  @author
 * @description  按需引入Vant
 */

// 引入全局样式
import '@/assets/scss/index.scss'
import { Button, Tabbar, TabbarItem } from 'vant'
const pluginsVant = [Button, Tabbar, TabbarItem]
export const vantPlugins = {
  install: function (vm) {
    pluginsVant.forEach(item => {
      vm.component(item.name, item)
    })
  }
}
