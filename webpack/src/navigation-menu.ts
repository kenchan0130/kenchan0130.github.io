import * as $ from 'jquery'

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = $('#js-mobile-menu').unbind()
  $('#js-navigation-menu').removeClass('show')
  menuToggle.on('click', (e: JQuery.Event) => {
    e.preventDefault()
    $('#js-navigation-menu').slideToggle(() => {
      if ($('#js-navigation-menu').is(':hidden')) {
        $('#js-navigation-menu').removeAttr('style')
      }
    })
  })
})
