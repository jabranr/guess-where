!(function(root, document, $, google, factory)	{

	root.GuessWhere = root.GuessWhere || factory(root, document, $, google);

	$(document).ready(GuessWhere.init);

})(this, document, jQuery, google, function(root, document, $, google) {

	'use strict';

	var _app = {};

	var app  = {
		fbscopes: 'email',
		iOS: (new RegExp(/iP(od|ad|hone)/)).test(navigator.userAgent),
		android: (new RegExp(/(Android)/)).test(navigator.userAgent)
	};

	function setupGoogleMaps(lat, lng, zoom, callback) {
		var map = _app.map = new google.maps.Map(_app.canvas, {
			center: new google.maps.LatLng((lat || 45.436), (lng || 4.876)),
			zoom: (zoom || 2),
			backgroundColor: '#f1f1f1',
			disableDefaultUI: true,
			disableDoubleClickZoom: true,
			keyboardShortcuts: false,
			scrollwheel: false,
			draggable: false
		});

		google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
			return (callback && typeof callback === 'function') ? callback.call(this, map) : false;
		});

		$(root).on('resize', function(e) {
			google.maps.event.trigger(_app.map, 'resize');
		});
	};

	// getJSON helper method
	function getJSON(url, data, success, error) {
		return $.ajax({
			url: url,
			type: 'GET',
			dataType: 'JSON',
			data: data,
			success: success,
			error: error
		});
	};

	function setStyle(map, level) {
		if (_app.modes && _app.modes[level]) {
			map.setOptions({ styles: _app.modes[level] });
			return;
		}

		return getJSON('./assets/js/modes/' + level + '.json', {}, function(style) {
			_app.modes = _app.modes || {};
			_app.modes[level] = style;
			map.setOptions({ styles: style });
		}, function(xhr, error) {
			// console.log(error);
		});
	}

	// Bootstrap the app
	function init() {

		_app.canvas = $('#mapCanvas').get(0);

		// Setup geocoder
		_app.geocoder = new google.maps.Geocoder();

		// Setup map
		setupGoogleMaps(45.436, 4.876, 2, function(map) {

			// Get cities
			getJSON('./assets/js/countries.json', {}, sortData, function(xhr, error) {
				// console.log(error);
			});

			setStyle(map, 'pro');

			$('.mode-btn').on('click', function(ev) {
				var $this = $(this);
				if ($this.hasClass('mode-active')) {
					return;
				}

				$this.addClass('mode-active');
				$this.siblings().removeClass('mode-active');
				setStyle(map, $this.data('level'));
			});
		});

		$('.fa-info-circle').on('click', function(e) {
			alert('By continue to use this website, you agree to use of cookies.');
		});
	};

	function addCountryInfo(collection, country) {
		collection.push({
			name: country.name.common,
			latlng: new google.maps.LatLng(country.latlng[0], country.latlng[1]),
			capital: country.capital
		});
	};

	// Sort data
	function sortData(countries) {
		var _data = {
			total: countries.length,
			countries: [],
			capitals: [],
			byRegion: {},
			bySubregion: {}
		};

		$.map(countries, function(country)	{
			if ( country.capital && country.capital !== '' ) {
				_data.capitals.push(country.capital);
				addCountryInfo(_data.countries, country);

				_data.byRegion[country.region] = _data.byRegion[country.region] || [];
				addCountryInfo(_data.byRegion[country.region], country);

				_data.bySubregion[country.subregion] = _data.bySubregion[country.subregion] || [];
				addCountryInfo(_data.bySubregion[country.subregion], country);
			}
		});

		_app.data = _data;

		addRegionChoices();
		return setupQuiz();
	};

	// Add region choices
	function addRegionChoices() {
		var $regions = $('.regions');
		var $toggleRegions = $('.toggle-regions');

		for (var key in _app.data.byRegion) {
			if (key == '') continue;

			$('<li />').append(
				$('<label />', {
					'html': ' ' + key
				}).prepend(
					$('<input />', {
						'type': 'radio',
						'name': 'region',
						'value': key.toLowerCase(),
						'id': 'region' + key.replace(' ', ''),
						'data-title': key
					}).on('click', setRegionChoice)
				)
			).appendTo($regions);
		}

		$toggleRegions.on('click', function(e) {
			e.preventDefault();
			$regions.toggleClass('regions--open');
			$toggleRegions.find('.fa').toggleClass('fa-plus fa-minus');
		});

		$('#regionWorld').click(setRegionChoice);
	};

	// Set region choice
	function setRegionChoice(e) {
		if ( this.checked ) {
			_app.quiz.region = $(this).data('title');
			$('.selected-region').text(_app.quiz.region);
			return setupQuiz();
		}
	};

	function addRandomChoice(choices, choice) {
		choices.push($('<button />', {
			'class': 'btn the-guess btn-info animated',
			'type': 'button',
			'html': choice.capital + '<div class="guess-country">' + choice.name + '</div>'
		}));
	}

	// Reset to pro (map style & button selection)
	function resetStyle() {
		setStyle(_app.map, 'pro');
		$('.mode-btn[data-level="pro"]').addClass('mode-active');
		$('.mode-btn[data-level="pro"]').siblings().removeClass('mode-active');
	}

	// Setup quiz
	function setupQuiz() {
		_app.quiz = _app.quiz || {};
		_app.quiz.done = _app.quiz.done || [];
		_app.quiz.correct = _app.quiz.correct || 0;
		_app.quiz.answer = _app.quiz.answer || '';
		_app.quiz.region = _app.quiz.region || 'World';

		resetStyle();

		var randomCountry = getRandomCountry();
		if (typeof randomCountry !== 'undefined' && randomCountry.capital && randomCountry.capital !== '') {
			_app.geocoder.geocode({
				'address': randomCountry.capital
			}, function(results, status) {
				if ( status === google.maps.GeocoderStatus.OK ) {
					var result = results[0];
					_app.map.panTo(result.geometry.location);
					_app.map.setZoom(app.iOS || app.android ? 10 : 12);

					if (app.iOS || app.android) {
						_app.map.panBy(0, -100);
					} else {
						_app.map.panBy(-100, 0);
					}

					var $guesses = $('.guesses').empty();
					var $answers = [];

					addRandomChoice($answers, randomCountry);

					_app.quiz.answer = randomCountry.capital + randomCountry.name;
					_app.quiz.done.push(randomCountry);


					for(var i = 0; i < 3; i++) {
						var randCountry = getRandomCountry();
						if (typeof randCountry === 'undefined' || !randCountry.capital) {
							i--;
							continue;
						}

						addRandomChoice($answers, randCountry);
					}

					$answers = arrSuffle($answers);

					$($answers).each(function(i, el) {
						$(el).delay(100 * i).promise().done(function() {
							$(this).appendTo($guesses)
								.addClass('fadeInLeft')
								.on('click', markAnswers);
						});
					});

					$('.score-out-of').html(_app.quiz.done.length);
				}
			});
		}
		else {
			return setupQuiz();
		}
	};

	// Mark asnwers
	function markAnswers(e) {
		e.preventDefault();

		var $this = $(this).prop('disabled', true);
		var title = $this.html();
		var titleText = $this.text();

		if ( titleText === _app.quiz.answer ) {
			_app.quiz.correct += 1;
			$this.toggleClass('btn-info btn-success').html('<i class="fa fa-check"></i> ' + title);
		} else {
			$this.toggleClass('btn-info btn-danger').html('<i class="fa fa-remove"></i> ' + title);
			$this.siblings('.the-guess').each(function(i, el) {
				var $el = $(el);
				var elTitleText = $el.text();
				var elTitle = $el.html();
				if ( elTitleText === _app.quiz.answer ) {
					$el.toggleClass('btn-info btn-success').html('<i class="fa fa-check"></i> ' + elTitle);
				}
			});
		}

		$this.siblings().prop('disabled', true);

		$('.scored').html(_app.quiz.correct);
		$('.score-out-of').html(_app.quiz.done.length);

		root.setTimeout(function() {
			$('.animated').each(function(i, el) {
				$(el).addClass('fadeOutRight');
			});

			setupQuiz();
		}, 1500);

	};

	// Get random unique country
	function getRandomCountry() {
		var country = _app.quiz.region === 'World' ?
			_app.data.countries[Math.floor(Math.random() * _app.data.countries.length)] :
			_app.data.byRegion[_app.quiz.region][Math.floor(Math.random() * _app.data.byRegion[_app.quiz.region].length)];

		if (_app.quiz && _app.quiz.done && _app.quiz.done.indexOf(country) === -1) {
			return country
		};

		getRandomCountry();
	};

	// Shuffle array - from: http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
	function arrSuffle(arr) {
		var counter = arr.length, newArr, index;
		while(counter > 0) {
			index = Math.floor(Math.random() * counter);
			counter--;
			newArr = arr[counter];
			arr[counter] = arr[index];
			arr[index] = newArr;
		}
		return arr;
	};


	app.init = init;
	return app;
});