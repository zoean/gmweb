<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <el-tooltip v-else-if="svgTitle != ''" class="item" effect="dark" :content="svgTitle" placement="bottom">
    <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
      <use :xlink:href="iconName" />
    </svg>
  </el-tooltip>
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
      <use :xlink:href="iconName" />
    </svg>
</template>

<script>
import { isExternal } from '@/assets/js/common'

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    iconTitle: {
      type: String,
      default: ''
    }
  },
  computed: {
    data(){
      return {

      }
    },
    isExternal() {
      return isExternal(this.iconClass)
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    svgTitle(){
      return this.iconTitle ? this.iconTitle : ''
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-wrap{
  position: relative;
}
.svg-wrap p{
  position: absolute;
  left: 0;
  top: 3.2em;
  height: 20px;
  background: rgba(0,0,0,0.65);
  border-radius: 10%;
  color: #fff;
  padding:2px 5px;
  z-index: 4;
}
.svg-wrap p i{
  width:0;
  height:0;
	border-right:5px solid transparent;
	border-left:5px solid transparent;
	border-bottom:5px solid rgba(0,0,0,0.65);
  position: absolute;
  left: 50%;
  top: -5px;
}
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.border-icon{
  padding: 9px;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  /* margin: 0;*/
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
