<template>
    <section class="slider" :style="{height:sliderHeight + 'px'}">
      <ul class="slider-content" :style="{left:moveLef + 'px'}">
          <li :style="{width:imgWidth+'px'}" v-for="item in sliderList" :key="item.name"><img :src="item" /></li>
      </ul>
    </section>
</template>

<script>
export default {
  name: "Slider",
  data () {
    return {
        moveLef: 0,
        sliderList:[
            require('../assets/r1.jpg'),
            require('../assets/r2.jpg'),
            require('../assets/r3.jpg'),
            require('../assets/r4.jpg'),
            require('../assets/r5.jpg'),
            require('../assets/r6.jpg'),
            require('../assets/r3.jpg')
        ],
        imgWidth: 200,
        sliderHeight: 390
    }
  },
  props: {
    msg: String
  },
  methods:{
    sliderMove: function(){
        let $this = this
        let slideSelf = setInterval(() => {
            if(this.moveLef < (-this.imgWidth -10)){
                clearInterval(slideSelf)
                this.changeSliderList()
                this.moveLef = 0
                setTimeout(()=>{
                    this.sliderMove()
                }, 2000);
            }else{
                this.moveLef = this.moveLef - 1
            }
        }, 1);
    },
    changeSliderList: function(){
        let item = this.sliderList[0]
        this.sliderList = this.sliderList.slice(1)
        this.sliderList.push(item)
    },
    resetImg:function(){
        let $width = (document.getElementsByClassName('banner')[0].offsetWidth - 120)/6;
        this.imgWidth = $width
        this.sliderHeight = document.getElementsByClassName('banner')[0].offsetWidth * 0.2857
        window.onresize = ()=>{
            this.resetImg()
        }
    }
  },
  mounted: function(){
      this.resetImg()
  },
  created: function(){
      this.sliderMove()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../scss/Slider.scss";
</style>
