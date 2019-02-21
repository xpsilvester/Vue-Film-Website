<template>
  <div class="course">
    <div class="to-course-list"><span></span>返回电视剧列表</div>
    <div class="lesson-video-main">
      <video id="vdo" width="960" autoplay="autoplay" class="video" src="http://demo.lanrenzhijia.com/demo/51/5183/demo/vedio/sintel.mp4"></video>
      <div class="lesson-video-aside">
        <p class="catalog">目录</p>
        <ul class="lesson-video-section-list">
          <li class="lesson-video-section-item" v-for="(item,index) in courseList" :key="item.classId">
            <p>
              第{{index+1}}集 
            </p>
            <p>
              {{item.title}}
            </p>
            <span class="state1 state" v-if="item.state == 0">未观看</span>
            <span class="state2 state" v-if="item.state == 1">已观看{{item.watched}}%</span>
            <span class="state3 state" v-if="item.state == 2">已看完</span>
            <span class="playing" v-if="item.state == 3"></span>
          </li>
        </ul>
      </div>
      <div class="video-controls">
        <div :class="videoOption.isPlay ? 'pause' : 'play'" @click="playVideo"></div>
        <div class="next"></div>
        <div class="progressNum">{{videoOption.currentTime}}</div>
        <div class="progressBar" @mouseenter="showCurrent">
          <div class="progressWhiteBar" :style="{width:videoOption.progress+'%'}">
            <div class="progressBtn" @mousedown="move" @click="log"></div>
          </div>
          <span class="chapterSpot" v-for="spot in spotList" :key="spot"  @mousedown="videoMove(spot)" :style="{left: spot/videoDuration * 100 +'%'}"></span>
        </div>
        <div class="progressNum2">{{videoOption.duration}}</div>
        <div :class="videoOption.isMuted ? 'muted' : 'sound'" @click="muteVideo"></div>
        <div class="fullScreen" @click="fullScreen"></div>
      </div>
      <div class="tip" v-show="isTip">
        <p class="catalog">小节目录</p>
        <p class="chapter" @mousedown="videoMove(5)">1. 介绍</p>
        <p class="chapter" @mousedown="videoMove(10)">2. 前情概要</p>
        <p class="chapter" @mousedown="videoMove(15)">3. 剧情概述</p>
        <span class="close" @mousedown="isTip = false"></span>
        <p></p>
      </div>
    </div>
    <p class="title">{{title}}</p>
    <div class="detail" v-html="detail"></div>
  </div>
</template>

<script>

export default {
  name: 'OnlineVideo',
  components: {
    
  },
  data () {
    return {
      videoOption:{
        isPlay: true,
        duration: '00:00:00',
        currentTime: '00:00:00',
        progress: 0,
        isMuted: false
      },
      isTip: true,
      spotList:[
        5,
        10,
        15
      ],
      videoDuration: 0,
      title: '年度热剧：知否知否应是绿肥红瘦',
      detail: '<div class="detail"><p>《知否知否应是绿肥红瘦》是由东阳正午阳光影视有限公司出品，侯鸿亮担任制片人，张开宙执导，曾璐、吴桐编剧，赵丽颖、冯绍峰领衔主演，朱一龙、施诗、张佳宁、曹翠芬、刘钧、刘琳、高露、王仁君、李依晓、王鹤润、张晓谦、李洪涛主演，王一楠、陈瑾特别出演的古代社会家庭题材电视剧。</p></div>',
      courseList:[
        {
          title: '伯爵府袁家特来下聘盛家嫡长女华兰',
          state: 2,
          classId: 1,
          watched: 0
        },
        {
          title: '白烨与盛长柏相约在船上喝酒',
          state: 2,
          classId: 2,
          watched: 60
        },
        {
          title: '卫小娘突然临盆',
          state: 1,
          classId: 3,
          watched: 80
        },
        {
          title: '齐国公府小公爷齐衡酷爱书法',
          state: 3,
          classId: 4,
          watched: 80
        },
        {
          title: '如兰从小桃的书包中拿出齐衡送的笔',
          state: 0,
          classId: 5,
          watched: 80
        }
      ]
    }
  },
  methods: {
    log: function(){
      console.log(true);
    },
    //播放视频
    playVideo: function(){
      let video = document.getElementById('vdo')
      if(this.videoOption.isPlay){
        video.pause()
        this.videoOption.isPlay = false
      }else{
        video.play()
        this.videoOption.isPlay = true
      }
    },
    //静音
    muteVideo: function(){
      let video = document.getElementById('vdo')
      if(this.videoOption.isMuted){
        video.muted = false
        this.videoOption.isMuted = false
      }else{
        video.muted = true
        this.videoOption.isMuted = true
      }
    },
    videoMove: function(num){
      let video = document.getElementById('vdo')
      this.videoOption.progress = num / video.duration * 100
      video.currentTime = num
    },
    //全屏
    fullScreen: function(){
      let ele = document.getElementById('vdo');
      if (ele.requestFullscreen) {
          ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullScreen) {
          ele.webkitRequestFullScreen();
      }
    },
    //播放进度
    videoCurruntTime: function(){
      let video = document.getElementById('vdo')
      let videoTime = video.duration
      let $this = this;
      setInterval(() => {
        $this.videoOption.currentTime = $this.calDuration(video.currentTime)
        //$this.videoOption.progress = video.currentTime / videoTime
      }, 1000);
    },
    //拖拽进度条
    move: function(e){
      let odiv = e.target;        //获取目标元素
      let video = document.getElementById('vdo')
      let videoDuration = video.duration
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = (e)=>{       //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX;    
          //绑定元素位置到positionX和positionY上面
          this.positionY = left;
          //移动当前元素
          let $width = left / 632 ;
          $width = $width > 0.99 ? 0.99 : $width;
          this.videoOption.progress = $width * 100;
          video.currentTime = video.duration * $width
      };
      document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
      };
    },
    showCurrent: function(e){
      let odiv = e.target;        //获取目标元素
      console.log(e.clientX)
    }
  },
  computed: {
    calDuration: function(){
      return function(times){
        var result = '00:00:00';
        var hour,minute,second
        if (times > 0) {
          hour = Math.floor(times / 3600);
          hour = hour < 10 ? '0'+hour : hour;
          
          minute = Math.floor((times - 3600 * hour) / 60);
          minute = minute < 10 ? '0'+minute : minute;
    
          second = Math.floor((times - 3600 * hour - 60 * minute) % 60);
          second = second < 10 ? '0'+second : second;
         
          result = hour+':'+minute+':'+second;
        }
        return result
      }
    }
  },
  created: function(){
    //获取视频时长
    let getTime = setInterval(() => {
      let video = document.getElementById('vdo')
      if(video != null && !isNaN(video.duration)){
        this.videoDuration = video.duration;
        this.videoOption.duration = this.calDuration(video.duration)
        this.videoCurruntTime()
        clearInterval(getTime)
      }
    }, 100);
    
  }
}
</script>

<style lang="scss" scoped>
.to-course-list{
    margin: 40px auto;
    width: 1200px;
    text-align: left;
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    cursor: pointer;
    span{
        transform: rotate(-135deg);
        border-top: 1px solid #999999;
        border-right: 1px solid #999999;
        display: block;
        width: 7px;
        height: 7px;
        float: left;
        margin: 6px 2px 0 0;
    }
}
.lesson-video-main{
    width: 1200px;
    height: 540px;
    margin: 24px auto;
    position: relative;
    video{
        float: left;
    }
    .video-controls{
        width: 960px;
        position: absolute;
        left: 0;
        bottom: 0;
        height: 32px;
        background: rgba(0,0,0,0.5);
        cursor: pointer;
        
        .play,.pause{
            width: 24px;
            height: 24px;
            background: url(../assets/play24.png);
            position: absolute;
            left: 16px;
            top: 4px;
        }
        .pause{
            background: url(../assets/pause.png);
        }
        .next{
            width: 24px;
            height: 24px;
            background: url(../assets/next.png);
            position: absolute;
            left: 56px;
            top: 4px;
        }
        .sound,.muted{
            width: 24px;
            height: 24px;
            background: url(../assets/sound.png);
            position: absolute;
            left: 880px;
            top: 4px;
        }
        .muted{
            background: url(../assets/mute.png);
        }
        .fullScreen{
            width: 24px;
            height: 24px;
            background: url(../assets/fullScreen.png);
            position: absolute;
            left: 920px;
            top: 4px;
        }
        .progressNum,.progressNum2{
            position: absolute;
            left: 96px;
            top: 8px;
            font-size: 12px;
            color: #FFFFFF;
            font-weight: bold;
        }
        .progressNum2{
            left: 812px;
        }
        .progressWhiteBar{
            position: absolute;
            left: 0;
            top: 0;
            background: #00AAFF;
            height: 6px;
            width: 0%;
            border-radius: 3px;
            .progressBtn{
                width: 8px;
                height: 16px;
                background: #FFFFFF;
                box-shadow: 0 0 8px 0 rgba(0,170,255,0.50);
                border-radius: 2px;
                position: absolute;
                right: -8px;
                top: -5px;
                z-index:999;
            }
        }
        
        .progressBar{
            width: 632px;
            height: 6px;
            background: rgba(255,255,255,0.4);
            border-radius: 3px;
            left: 164px;
            top: 14px;
            position: absolute;
            .chapterSpot{
                width: 8px;
                height: 8px;
                border-radius: 100%;
                background: #fff;
                position: absolute;
                top: -1px;
                cursor: pointer;
            }
        }
    }
    .tip{
        width: 110px;
        padding: 8px;
        position: absolute;
        left: 4px;
        bottom: 36px;
        background: rgba(0,0,0,0.5);
        border-radius: 2px;
        p{
            font-size: 12px;
            line-height: 16px;
        }
        .catalog{
            color: #FFFFFF;
        }
        .chapter{
            color: #CCCCCC;
            margin: 8px auto;
            cursor: pointer;
            &:hover{
                color: #FFFFFF;
                text-shadow: 0 0 8px rgba(0,170,255,0.50);
            }
        }
        .close{
            width: 16px;
            height: 16px;
            background: url(../assets/close16.png);
            position: absolute;
            top: 8px;
            right: 8px;
            cursor: pointer;
        }
    }
    .lesson-video-aside{
        width: 240px;
        height: 540px;
        float: left;
        background: #1A1A1A;
        .catalog{
            height: 40px;
            line-height: 40px;
            padding-left: 8px;
            font-size: 13px;
            color: #999999;
        }
        .lesson-video-section-item{
            height: 56px;
            padding-left: 8px;
            position: relative;
            &:hover{
                background: #404040;
                cursor: pointer;
            }
            p{
                &:first-child{
                    font-size: 12px;
                    color: #999999;
                    line-height: 16px;
                    padding-top: 4px;
                }
                &:nth-child(2){
                    font-size: 14px;
                    color: #D9D9D9;
                    line-height: 20px;
                    margin-top: 8px;
                }
            }
            .state{
                position: absolute;
                padding: 2px 4px;
                font-size: 12px;
                color: #fff;
                opacity: 0.5;
                border-radius: 2px;
                top: 4px;
                right: 8px;
                font-weight: bold;
            }
            .state1{
                background: #FF794D;
            }
            .state2{
                background: #FFAC5A;
                box-shadow: 0 0 4px 0 #FFAC5A;
            }
            .state3{
                background: #70CC70;
                box-shadow: 0 0 4px 0 #70CC70;
            }
            .playing{
                position: absolute;
                top: 4px;
                right: 8px;
                background: url(../assets/playing.png);
                width: 16px;
                height: 16px;
            }
        }
    }
}
.title{
    width: 1200px;
    margin: 16px auto;
    font-size: 18px;
    color: #333333;
    line-height: 24px;
}
.detail{
    width: 1200px;
    margin: 16px auto;
    font-size: 14px;
    color: #666666;
    line-height: 20px;
}
</style>