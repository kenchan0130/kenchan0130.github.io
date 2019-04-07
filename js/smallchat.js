$(function() {
	var smallchatScriptDomId = "kenchan0130-smallchat";

	var showSmallchat = function(smallchatScriptDomId, smallchatOnloadCallback) {
		if (document.getElementById(smallchatScriptDomId) !== null) {
			return;
		}

		var smallchatScript = document.createElement("script");
		smallchatScript.id = smallchatScriptDomId;
		smallchatScript.async = true;
		document.body.appendChild(smallchatScript);
		smallchatScript.onload = function() {
			var styles = document.createElement("link");
			styles.rel = "stylesheet";
			styles.href = "//static.small.chat/messenger.css";
			styles.async = true;
			document.head.appendChild(styles);
			var script = document.createElement("script");
			script.src = "//static.small.chat/messenger.js";
			if (typeof smallchatOnloadCallback === "function") {
				script.onload = smallchatOnloadCallback;
			}
			script.async = true;
			document.body.appendChild(script);
		};
		smallchatScript.src = "//embed.small.chat/TAEV2JR5WGAS7P6N2V.js";
	};

	$(".js-open-smallchat").on("click", function() {
		var openSmallchat = function() {
			function openSmallchatLoop(counter) {
				var $smallchatIframContent = $("#Smallchat iframe").contents();
				// Kill the openSmallchatLoop function recursive call.
				if (counter > 10) {
					return;
				}
				// Retry opening the chat
				if ($smallchatIframContent.length > 0) {
					$smallchatIframContent
						.find(".Icon")
						.not(".Messenger_close")
						.click();
				} else {
					openSmallchatLoop(counter + 1);
				}
			}
			setTimeout(function() {
				openSmallchatLoop(0);
			}, 100);
		};

		if (document.getElementById(smallchatScriptDomId) !== null) {
			openSmallchat();
		} else {
			showSmallchat(smallchatScriptDomId, openSmallchat);
		}
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

	// If the user reload the page and fullfill showing smallchat, it show the chat.
	decideTofinishReadingPage(function() {
		setTimeout(function() {
			showSmallchat(smallchatScriptDomId);
		}, 1000);
	});

	// Show the chat just before finishing reading with scroll event.
	$(window).on("scroll", function() {
		if (document.getElementById(smallchatScriptDomId) !== null) {
			return;
		}

		decideTofinishReadingPage(function() {
			showSmallchat(smallchatScriptDomId);
		});
	});
});
