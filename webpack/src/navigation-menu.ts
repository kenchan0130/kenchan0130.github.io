$(() => {
  const menuToggle = $('#js-mobile-menu').off()
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
