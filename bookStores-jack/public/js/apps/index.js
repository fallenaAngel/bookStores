require([
  'jquery',
  'swiper',
  'bscroll',
  'render',
  'text!bookTBtpl',
  'text!bookLRtpl',
  'text!bookLRLimitTpl',
  'locationStorage'
], function(
  $,
  Swiper,
  bscroll,
  render,
  bookTBtpl,
  bookLRtpl,
  bookLRLimitTpl,
  locationStorage
) {
  function init() {
    this.conSwipers = null
    this.pageNum = 1
    this.total
    this.count = 10
    this.conScrolls = null
    this.indexPage = window.localStorage

    //1.请求数据
    this.getData()
    // 登录
    this.login()
  }

  //1.请求数据
  init.prototype.getData = function() {
    var that = this
    $.ajax({
      url: '/api/index',
      dataType: 'json',
      success: function(data) {
        //2.head的tab切换
        that.headTabClick()
        //3.主体部分SWiper实例化
        that.conSwiper()
        //4.主体部分，better-scroll
        that.conScroll()
        //5. 书城--banner
        that.cityBanner(data)
        //6. 主页导航部分
        that.indexNav(data)
        // 7. 主页--本周最火
        that.weekHot(data)
        //8. 主页--重磅推荐
        that.conRecommend(data)
        //8. 主页--分类--女生频道
        that.conClassify(data)
        // 9. 主页--书架--列表渲染
        that.bookRackList()
      },
      error: function(err) {
        console.log(err)
      }
    })
  }

  //2.head的tab切换
  init.prototype.headTabClick = function() {
    that = this
    $('header div.swiper-tab span.tab_item').on('click', function() {
      var Ind = $(this).index()
      if (Ind == 1) {
        that.indexPage.setItem('page', 1)
        $('header div.swiper-tab i.head_line').addClass('head_line_active')
      } else {
        that.indexPage.setItem('page', 0)
        $('header div.swiper-tab i.head_line').removeClass('head_line_active')
      }
      $(this)
        .addClass('head_tab_color')
        .siblings()
        .removeClass('head_tab_color')
      that.conSwipers.slideTo(that.indexPage.getItem('page'))
    })
  }

  //3.主体部分SWiper实例化
  init.prototype.conSwiper = function() {
    var that = this
    this.conSwipers = new Swiper('#content', {
      on: {
        slideChangeTransitionStart: function() {
          var Ind = this.activeIndex
          if (Ind == 1) {
            that.indexPage.setItem('page', 1)
            $('header div.swiper-tab i.head_line').addClass('head_line_active')
          } else {
            that.indexPage.setItem('page', 0)
            $('header div.swiper-tab i.head_line').removeClass(
              'head_line_active'
            )
          }
          $('header div.swiper-tab span.tab_item')
            .eq(Ind)
            .addClass('head_tab_color')
            .siblings()
            .removeClass('head_tab_color')
        }
      }
    })

    //返回角度
    function GetSlideAngle(dx, dy) {
      return (Math.atan2(dy, dx) * 180) / Math.PI
    }
    //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    function GetSlideDirection(startX, startY, endX, endY) {
      var dy = startY - endY
      var dx = endX - startX
      var result = 0
      //如果滑动距离太短
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return result
      }

      var angle = GetSlideAngle(dx, dy)
      if (angle >= -45 && angle < 45) {
        result = 4
      } else if (angle >= 45 && angle < 135) {
        result = 1
      } else if (angle >= -135 && angle < -45) {
        result = 2
      } else if (
        (angle >= 135 && angle <= 180) ||
        (angle >= -180 && angle < -135)
      ) {
        result = 3
      }

      return result
    }
    //滑动处理
    var startX, startY
    document.addEventListener(
      'touchstart',
      function(ev) {
        startX = ev.touches[0].pageX
        startY = ev.touches[0].pageY
      },
      false
    )
    document.addEventListener(
      'touchend',
      function(ev) {
        var endX, endY
        endX = ev.changedTouches[0].pageX
        endY = ev.changedTouches[0].pageY
        var direction = GetSlideDirection(startX, startY, endX, endY)
        switch (direction) {
          case 3:
            that.conSwipers.slideTo(1)
            break
          case 4:
            that.conSwipers.slideTo(0)
            break
          default:
        }
      },
      false
    )
  }

  //4.主体部分，书城部分，better-scroll
  init.prototype.conScroll = function() {
    var that = this
    this.conScrolls = new bscroll('div#book_city', {
      scrollY: true,
      probeType: 2,
      click: true
    })
    var htmlFontSize = parseFloat($('html').css('font-size'))
    var realSize = ((htmlFontSize / 37.5) * 44).toFixed(2)
    this.conScrolls.on('scroll', function() {
      if (this.y < this.maxScrollY - realSize) {
        //上拉
        if (that.pageNum > that.total) {
          $('div.swiper-slide ul').attr('data-up', '我是有底线的')
        } else {
          $('div.swiper-slide ul').attr('data-up', '释放加载更多。。')
        }
      } else if (this.y < this.maxScrollY - realSize / 2) {
        if (that.pageNum > that.total) {
          $('div.swiper-slide ul').attr('data-up', '我是有底线的')
        } else {
          $('div.swiper-slide ul').attr('data-up', '上拉加载更多。。。')
        }
      } else if (this.y > realSize) {
        //下拉
        $('div.swiper-slide ul').attr('data-down', '释放刷新。。')
      } else if (this.y > realSize / 2) {
        $('div.swiper-slide ul').attr('data-down', '下拉刷新。。。')
      }
    })
    this.conScrolls.on('scrollEnd', function() {
      if (that.pageNum > that.total) {
        $('div.swiper-slide ul').attr('data-up', '我是有底线的')
      } else {
        $('div.swiper-slide ul').attr('data-up', '上拉加载更多。。。')
      }
      $('div.swiper-slide ul').attr('data-down', '下拉刷新。。。')
    })
    this.conScrolls.on('touchEnd', function() {
      if ($('div.swiper-slide ul').attr('data-up') == '释放加载更多。。') {
        console.log('上拉加载')
        if (that.pageNum > that.total) {
          return false
        } else {
          that.loadMore(that.pageNum)
          that.pageNum++
        }
      } else if ($('div.swiper-slide ul').attr('data-down') == '释放刷新。。') {
        console.log('下拉刷新')
        window.location.reload()
      }
    })
  }

  //5.书城--banner部分
  init.prototype.cityBanner = function(data) {
    var json = data.items[0].data
    render(
      json,
      $('#city_banner_render'),
      $('li.city_banner div.swiper-wrapper')
    )
    var cityBanner = new Swiper('li.city_banner', {
      autoplay: true,
      loop: true
    })
  }

  // 6. index页面nav渲染
  init.prototype.indexNav = function(data) {
    var json = data.items[1].data
    render(json, $('#city_nav_render'), $('div#book_city ul li.con_nav'))
  }

  // 7. 主页--本周最火
  init.prototype.weekHot = function(data) {
    $('body').append(bookTBtpl)
    var json1 = data.items[2].ad_name
    var json2 = data.items[2].data.data
    render(json1, $('#city_con_tit'), $('div.block_title'))
    render(json2, $('#t-b-tpl'), $('div.block_content'))
    $('div.block_content').on('click', 'dl', function() {
      var fiction_id = $(this).attr('data-id')
      location.href = '../../page/detail.html?fiction_id=' + fiction_id
    })
  }

  //8. 主页--重磅推荐
  init.prototype.conRecommend = function(data) {
    $('body').append(bookLRtpl)
    var json = data.items[3].ad_name
    var json1 = data.items[3].data.data
    json1[0].isShowNum = true //isShowNum相当于一个标记，如果第一条数据上存在，则显示
    var firstData = [json1[0]] //firstData相当于空数组，然后给push了第一条数据
    render(json, $('#con_recommend_title_render'), $('div.con_recommend_title'))
    render(
      firstData,
      $('#l-r-tpl'),
      $('li#con_recommend_content_list_first_item')
    )
    render(
      json1.slice(1),
      $('#con_recommend_content_list_render'),
      $('ol.con_recommend_content_list')
    )
  }

  //8. 主页--分类--女生最爱
  init.prototype.conClassify = function(data) {
    var data = data.items[4].data.data
    $('body').append(bookLRLimitTpl)
    render(data, $('#l-r-limit-tpl'), $('ul.con_classify_list_render'))
  }

  //9. 主页-下拉加载更多
  init.prototype.loadMore = function(data) {
    var that = this
    this.total = this.pageNum * this.count
    $.ajax({
      url: '/api/recommend',
      dataType: 'json',
      data: {
        pageNum: that.pageNum,
        count: that.count
      },
      success: function(data) {
        var json = data.items
        var total = data.total
        that.total = total / that.count
        render(json, $('#l-r-tpl'), $('ol.con_loadMore_list_render'))
        that.conScrolls.refresh()
      },
      error: function(err) {
        console.log(err)
      }
    })
  }

  // 10. 主页--书架--列表渲染
  init.prototype.bookRackList = function() {
    $.ajax({
      url: '/api/bookRackList',
      dataType: 'json',
      success: function(data) {
        render(
          data,
          $('#book_rack_content_list_render'),
          $('ul.book_rack_con_list_render')
        )
        $('#con_top_switch_btn').on('click', function() {
          $(this).toggleClass('con_top_search_switch_tb')
          $('ul.book_rack_con_list_render li').toggleClass('book_rack_tp_list')
        })
      },
      error: function(err) {
        console.error(err)
      }
    })
  }

  //	11.点击登录
  init.prototype.login = function() {
    $('#login_btn').on('click', function() {
      var user = locationStorage.get('login')
      if (!user) {
        window.location.href = '../../page/login.html'
      } else {
        window.location.href = '../../page/userIndex.html'
      }
    })
  }
  new init()
})
