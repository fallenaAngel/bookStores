require([
  'jquery',
  'headerRender',
  'render',
  'text!bookLRtpl',
  'locationStorage'
], function($, headerRender, render, bookLRtpl, locationStorage) {
  function init() {
    //1.点击返回上一步
    headerRender({
      isSearch: true
    })

    //2.点击搜索
    this.searchHistory = locationStorage.get('history') || []
    render(
      this.searchHistory,
      $('#search_history_tag_render'),
      $('ul.search_history_tag'),
      true
    )
    this.tag = $('ul.search_history_tag')
    this.list = $('ul.search_list')
    this.ipt = $('#search_ipt')
    this.searchBook()
    this.tagClick()
  }

  //2.点击搜索
  init.prototype.searchBook = function() {
    var that = this
    $('#search_btn').on('click', function() {
      that.iptVal = that.ipt.val()
      if (that.iptVal == '') {
        that.list.html('<li>没有相应的搜索结果</li>')
      } else {
        that.Render(that.iptVal)
        that.searchHistory = locationStorage.get('history') || []
        if (that.searchHistory.indexOf(that.iptVal) == -1) {
          that.searchHistory.push(that.iptVal)
          locationStorage.set('history', that.searchHistory)
        }
      }
    })
  }
  init.prototype.Render = function(val) {
    var that = this
    $.ajax({
      url: '/api/searchList',
      dataType: 'json',
      data: {
        val: val
      },
      success: function(data) {
        console.log(data)

        RenderList(data)
        iptChange()
      },
      error: function(err) {
        console.error(err)
      }
    })
    function g() {
      that.list.html('')
      that.searchHistory = locationStorage.get('history')
      render(
        that.searchHistory,
        $('#search_history_tag_render'),
        $('ul.search_history_tag'),
        true
      )
    }
    function RenderList(data) {
      if (data) {
        that.tag.hide()
        that.list.show()
        g()
        $('body').append(bookLRtpl)
        render(data.items, $('#l-r-tpl'), $('ul.search_list'))
      } else {
        that.tag.hide()
        that.list.show()
        that.list.html('<li>没有相应的搜索结果</li>')
      }
    }

    function iptChange() {
      $('#search_ipt').on('input', function() {
        var val = $(this).val()
        if (!val) {
          that.tag.show()
          that.list.hide()
          g()
        }
      })
    }
  }
  init.prototype.tagClick = function() {
    var that = this
    $('ul.search_history_tag').on('click', 'li', function() {
      var val = $(this).text()
      console.log(val)
      that.ipt.val(val)
      that.Render(val)
    })
  }
  new init()
})
