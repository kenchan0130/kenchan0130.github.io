$(function() {
	var showedSmallchatDataKey = "showed-smallchat";

  var hideSmallchat = function() {
		function hideSmallchatLoop(counter) {
			var $smallchatDom = $('#Smallchat');
			var upper = 10000000;
			if ($smallchatDom.data(showedSmallchatDataKey) || counter > upper) {
				return;
			}

			if ($smallchatDom.length > 0) {
				$smallchatDom.hide();
				return;
			}

			setTimeout(function() {
				hideSmallchatLoop(counter + 1);
			});
		}
		setTimeout(function() {
			hideSmallchatLoop(0);
		});
	};

	var showSmallchat = function(showedCallback) {
		var $smallchatDom = $('#Smallchat');
		var showedCallbackIsFunction = typeof showedCallback === 'function';
		function showSmallchatLoop(counter) {
			var $smallchatDom = $('#Smallchat');
			var upper = 1000;
			if ($smallchatDom.data(showedSmallchatDataKey) || counter > upper) {
				if (showedCallbackIsFunction) {
					showedCallback();
				}
				return;
			}

			if ($smallchatDom.length > 0) {
				if (showedCallbackIsFunction) {
					$smallchatDom.show('normal', showedCallback);
				} else {
					$smallchatDom.show('normal');
				}
				$smallchatDom.data(showedSmallchatDataKey, true);
				return;
			}

			setTimeout(function() {
				showSmallchatLoop(counter + 1);
			});
		}
		setTimeout(function() {
			showSmallchatLoop(0);
		});
	};

  // When the user click DOM for opening chat, this script opens the chat.
	$(".js-open-smallchat").on("click", function() {
		var openSmallchat = function() {
			function openSmallchatLoop(counter) {
				var $smallchatIframContent = $("#Smallchat iframe").contents();
				// Kill the openSmallchatLoop function recursive call.
				var upper = 1000;
				if (counter > upper) {
					return;
				}
				// Retry opening the chat
				if ($smallchatIframContent.length > 0) {
					$smallchatIframContent
						.find(".Icon")
						.not(".Messenger_close")
						.click();
				} else {
					setTimeout(function() {
						openSmallchatLoop(counter + 1);
					});
				}
			}
			setTimeout(function() {
				openSmallchatLoop(0);
			});
		};
		showSmallchat(openSmallchat);
	});

	var decideTofinishReadingPage = function(finishedReadingPageCallback) {
		var docHeight = $(document).innerHeight();
		var windowHeight = $(window).innerHeight();
		var pageBottom = docHeight - windowHeight;
		var buffer = $("footer").innerHeight() * 2.75;

		if (pageBottom - buffer <= $(window).scrollTop()) {
			finishedReadingPageCallback();
		}
	};

  // Hide chat icon by befault
  hideSmallchat();
	// If the user reload the page and fullfill showing smallchat, it show the chat.
	decideTofinishReadingPage(showSmallchat);

	// Show the chat just before finishing reading with scroll event.
	$(window).on("scroll", function() {
		decideTofinishReadingPage(showSmallchat);
	});
});
