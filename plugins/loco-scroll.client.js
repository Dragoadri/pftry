import Vue from 'vue'
import LocomotiveScroll from 'locomotive-scroll'

import 'locomotive-scroll/dist/locomotive-scroll.css'

const install = (instance) => {
  instance.prototype.LocomotiveScroll = LocomotiveScroll
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install)
  if (install.installed) {
    install.installed = false
  }
}

Vue.use(install)