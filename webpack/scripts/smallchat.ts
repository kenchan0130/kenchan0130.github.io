import $ from 'jquery';

export default $(() => {
	const showedSmallchatDataKey = "showed-smallchat";

	const setSmallchatScript = (callback) => {
		const script = document.createElement('script');
		script.src = '//embed.small.chat/TAEV2JR5WGAS7P6N2V.js';
		script.async = true;
		script.onload = callback;
		document.body.appendChild(script);
	};

  const hideSmallchat = () => {
		function hideSmallchatLoop(counter) {
			const $smallchatDom = $('#Smallchat');
			const upper = 10000000;
			if ($smallchatDom.data(showedSmallchatDataKey) || counter > upper) {
				return;
			}

			if ($smallchatDom.length > 0) {
				$smallchatDom.hide();
				return;
			}

			setTimeout(() => {
				hideSmallchatLoop(counter + 1);
			});
		}
		setTimeout(() => {
			hideSmallchatLoop(0);
		});
	};

	const showSmallchat = (showedCallback) => {
		const $smallchatDom = $('#Smallchat');
		const showedCallbackIsFunction = typeof showedCallback === 'function';
		function showSmallchatLoop(counter) {
			const $smallchatDom = $('#Smallchat');
			const upper = 1000;
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

			setTimeout(() => {
				showSmallchatLoop(counter + 1);
			});
		}
		setTimeout(() => {
			showSmallchatLoop(0);
		});
	};

	const decideTofinishReadingPage = (finishedReadingPageCallback) => {
		const docHeight = $(document).innerHeight();
		const windowHeight = $(window).innerHeight();
		const pageBottom = docHeight - windowHeight;
		const buffer = $("footer").innerHeight() * 2.75;

		if (pageBottom - buffer <= $(window).scrollTop()) {
			finishedReadingPageCallback();
		}
	};

	setSmallchatScript(() => {
		// When the user click DOM for opening chat, this script opens the chat.
		$(".js-open-smallchat").on("click", function() {
			const openSmallchat = () => {
				function openSmallchatLoop(counter) {
					const $smallchatIframContent = $("#Smallchat iframe").contents();
					// Kill the openSmallchatLoop function recursive call.
					const upper = 1000;
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
						setTimeout(() => {
							openSmallchatLoop(counter + 1);
						});
					}
				}
				setTimeout(() => {
					openSmallchatLoop(0);
				});
			};
			showSmallchat(openSmallchat);
		});

		// Hide chat icon by befault
		hideSmallchat();
		// If the user reload the page and fullfill showing smallchat, it show the chat.
		decideTofinishReadingPage(showSmallchat);

		// Show the chat just before finishing reading with scroll event.
		$(window).on("scroll", () => {
			decideTofinishReadingPage(showSmallchat);
		});
	});
});
