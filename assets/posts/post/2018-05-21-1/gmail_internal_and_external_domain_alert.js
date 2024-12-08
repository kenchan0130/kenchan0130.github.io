// ==UserScript==
// @name         Gmail Internal and External Domain Alert
// @namespace    https://mail.google.com
// @version      1.0.0
// @description  This script will visually warn you when sending mail to other than the regulated domain in Gmail.
// @author       Tadayuki Onishi
// @include      /^https:\/\/mail\.google\.com\/mail/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/gmail-js/0.7.2/gmail.min.js
// @downloadURL  https://kenchan0130.github.io/assets/posts/2018-05-21/1/gmail_internal_and_external_domain_alert.js
// @updateURL    https://kenchan0130.github.io/assets/posts/2018-05-21/1/gmail_internal_and_external_domain_alert.js
// @supportURL   https://kenchan0130.github.io
// ==/UserScript==

(() => {
  'use strict';

  // Please set your favorite color. If you like the default, please set null or empty string.
  const BACKGROUND_COLOR = {
    internal: null,
    external: '#FA9996'
  };

  // Please add your internal domains. Regular expressions are fine.
  const INTERNAL_DOMAIN_LIST = [
    'gmail.com'
  ];

  const SCRIPT_DISCRIMINANT = "gmail-internal-and-external-domain-alert";

  // Define functions

  const isInternalEmail = (emailValue) => {
    //console.log(emailValue);
    const emailMatch = emailValue.match(/^(.+)@(.+)$/);
    // ignore not email
    if (!emailMatch) { return false; }
    const emailDomain = emailMatch[2];

    return !!INTERNAL_DOMAIN_LIST.find((domain) => !!domain.match(new RegExp(emailDomain)));
  };

  const isValidColorString = (colorString) => {
    if (!colorString || !!['inherit', 'transparent'].find((x) => x === colorString)) { return false; }

    const image = document.createElement('img');
    image.style.color = 'rgb(0, 0, 0)';
    image.style.color = colorString;
    if (image.style.color !== 'rgb(0, 0, 0)') { return true; }
    image.style.color = 'rgb(255, 255, 255)';
    image.style.color = colorString;
    return image.style.color !== 'rgb(255, 255, 255)';
  };

  const setBackGroundColor = (element, target) => {
    const backgroundColor = BACKGROUND_COLOR[target];
    if (backgroundColor && isValidColorString(backgroundColor)) {
      $(element).css({
        "background-color": backgroundColor
      });
    }
  };

  const setBackGroundColorToRecipient = () => {
    $('form').find('[email*="@"]').each((index, element) => {
      const $element = $(element);
      if ($element.hasClass(SCRIPT_DISCRIMINANT)) { return; }

      const emailAddress = $element.attr('email');
      if (isInternalEmail(emailAddress)) {
        setBackGroundColor($element, 'internal');
      } else {
        setBackGroundColor($element, 'external');
      }
      $element.addClass(SCRIPT_DISCRIMINANT);
    });
  };

  const setBackGroundColorObserver = new MutationObserver(setBackGroundColorToRecipient);

  // Main Script
  const gmail = Gmail();
  gmail.observe.on('recipient_change', () => {
    setBackGroundColorToRecipient();
    $('form').find('[email*="@"]').each((index, element) => {
      setBackGroundColorObserver.observe($(element).closest('form')[0], {
        attributes: false,
        childList: true,
        characterData: true,
        subtree: true
      });
    });
  });
})();
