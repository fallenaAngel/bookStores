require([
  'headerRender',
  'locationFormat',
  'render',
  'bscroll',
  'locationStorage'
], function(headerRender, locationFormat, render, bscroll, locationStorage) {
  headerRender({ title: '目录' })

  //1.先获取地址栏参数fiction_id
  var fiction_id = locationFormat().fiction_id

  //2.根据id发起ajax请求，获取数据
  $.ajax({
    url: '/api/detailList',
    dataType: 'json',
    data: {
      fiction_id: fiction_id
    },
    success: function(data) {
      var tag = null
      if (locationFormat().chapterNum) {
        tag = locationFormat().chapterNum
      } else {
        tag = data.item.toc.length - 1
      }
      console.log(tag)

      var json = data.item.toc
      render(json, $('#chapter_list_render'), $('.chapter_list'))
      var myScroll = new bscroll('div#con', { click: true })
      myScroll.scrollToElement(
        $('ul.chapter_list li')
          .eq(tag)
          .get(0)
      )
      $('ul.chapter_list li')
        .eq(tag)
        .addClass('active')

      listClick()
    },
    error: function(err) {
      console.log(err)
    }
  })

  function listClick() {
    $('ul.chapter_list li').on('click', function() {
      locationStorage.set('chapterNum', $(this).index())
      window.location.href =
        '../../page/artical.html?fiction_id=352876&chapterNum=' +
        $(this).index()
    })
  }
})
