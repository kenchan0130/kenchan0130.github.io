$(function(){
  // Add smallchat
  $(window).on('scroll', function() {
    var smallchatScriptDomId = 'kenchan0130-smallchat';

    if (document.getElementById(smallchatScriptDomId) !== null) {
      return;
    }

    var docHeight = $(document).innerHeight();
    var windowHeight = $(window).innerHeight();
    var pageBottom = docHeight - windowHeight;
    var buffer = $('footer').innerHeight() * 2.75;

    if ((pageBottom - buffer) <= $(window).scrollTop()) {
      var smallchatScript = document.createElement('script');
      smallchatScript.id = smallchatScriptDomId;
      smallchatScript.async = true;
      document.body.appendChild(smallchatScript);
      smallchatScript.onload = function() {
        var styles = document.createElement('link');
        styles.rel = 'stylesheet';
        styles.href = '//static.small.chat/messenger.css';
        styles.async = true;
        document.head.appendChild(styles);
        var script = document.createElement('script');
        script.src = '//static.small.chat/messenger.js';
        script.async = true;
        document.body.appendChild(script);
      };
      smallchatScript.src = '//embed.small.chat/TAEV2JR5WGAS7P6N2V.js';
    }
  });
});
