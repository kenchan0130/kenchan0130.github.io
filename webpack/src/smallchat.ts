const showedSmallchatDataKey = 'showed-smallchat'

const setSmallchatScript = (callback: () => void) => {
  const script = document.createElement('script')
  script.src = '//embed.small.chat/TAEV2JR5WGAS7P6N2V.js'
  script.async = true
  script.onload = callback
  document.body.appendChild(script)
}

const hideSmallchat = () => {
  function hideSmallchatLoop(counter: number) {
    const $smallchatDom = $('#Smallchat')
    const upper = 10000000
    if ($smallchatDom.data(showedSmallchatDataKey) || counter > upper) {
      return
    }

    if ($smallchatDom.length > 0) {
      $smallchatDom.hide()
      return
    }

    setTimeout(() => {
      hideSmallchatLoop(counter + 1)
    })
  }
  setTimeout(() => {
    hideSmallchatLoop(0)
  })
}

const showSmallchat = (showedCallback?: () => void) => {
  function showSmallchatLoop(counter: number) {
    const $smallchatDom = $('#Smallchat')
    const upper = 1000
    if ($smallchatDom.data(showedSmallchatDataKey) || counter > upper) {
      if (typeof showedCallback === 'function') {
        showedCallback()
      }
      return
    }

    if ($smallchatDom.length > 0) {
      if (typeof showedCallback === 'function') {
        $smallchatDom.show(400, showedCallback)
      } else {
        $smallchatDom.show(400)
      }
      $smallchatDom.data(showedSmallchatDataKey, true)
      return
    }

    setTimeout(() => {
      showSmallchatLoop(counter + 1)
    })
  }
  setTimeout(() => {
    showSmallchatLoop(0)
  })
}

const decideTofinishReadingPage = (
  finishedReadingPageCallback: (_?: any) => void
) => {
  const docHeight = $(document).innerHeight()
  const windowHeight = $(window).innerHeight()
  const footerHeight = $('footer').innerHeight()
  const scrollTop = $(window).scrollTop()
  if (!docHeight || !windowHeight || !footerHeight || !scrollTop) {
    return
  }

  const pageBottom = docHeight - windowHeight
  const buffer = footerHeight * 2.75

  if (pageBottom - buffer <= scrollTop) {
    finishedReadingPageCallback()
  }
}

$(document).ready(() => {
  setSmallchatScript(() => {
    // When the user click DOM for opening chat, this script opens the chat.
    $('.js-open-smallchat').on('click', () => {
      const openSmallchat = () => {
        function openSmallchatLoop(counter: number) {
          const $smallchatIframContent = $('#Smallchat iframe').contents()
          // Kill the openSmallchatLoop function recursive call.
          const upper = 1000
          if (counter > upper) {
            return
          }
          // Retry opening the chat
          if ($smallchatIframContent.length > 0) {
            $smallchatIframContent
              .find('.Icon')
              .not('.Messenger_close')
              .click()
          } else {
            setTimeout(() => {
              openSmallchatLoop(counter + 1)
            })
          }
        }
        setTimeout(() => {
          openSmallchatLoop(0)
        })
      }
      showSmallchat(openSmallchat)
    })

    // Hide chat icon by befault
    hideSmallchat()
    // If the user reload the page and fullfill showing smallchat, it show the chat.
    decideTofinishReadingPage(showSmallchat)

    // Show the chat just before finishing reading with scroll event.
    $(window).on('scroll', () => {
      decideTofinishReadingPage(showSmallchat)
    })
  })
})
