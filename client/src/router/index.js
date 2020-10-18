import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Diagrama from '@/components/Diagrama'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path: '/Diagrama',
      name: 'Diagrama',
      component: Diagrama
    }
  ]
})
