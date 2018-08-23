define(['jquery', 'text!header', 'render'], function($, header, render) {
  function headerRender(data) {
    $('body').append(header)
    render(data, $('#header_render'), $('#header'))
    $('#head_back').on('click', function() {
      history.go(-1)
    })
    $('span.icon-home').on('click', function() {
      window.location.href = '../../index.html'
    })
  }
  return headerRender
})
