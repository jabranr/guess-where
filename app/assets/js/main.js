!(function(root, document, $, google, factory)	{
	root.GuessWhere = root.GuessWhere || factory(root, document, $, google);
	$(document).ready(GuessWhere.init);
})(this, document, jQuery, google, function(root, document, $, google) {
	var _app = {};
	var app  = {
		fbscopes: 'email',
		iOS: (new RegExp(/iP(od|ad|hone)/)).test(navigator.userAgent),
		android: (new RegExp(/(Android)/)).test(navigator.userAgent)
	};

	var setupGoogleMaps = function(lat, lng, zoom, callback) {
		var map = _app.map = new google.maps.Map(_app.canvas, {
			center: new google.maps.LatLng((lat || 45.436), (lng || 4.876)),
			zoom: (zoom || 2),
			backgroundColor: '#f1f1f1',
			disableDefaultUI: true,
			disableDoubleClickZoom: true,
			keyboardShortcuts: false,
			scrollwheel: false,
			draggable: false,
			styles: [
			    {
			        "featureType": "administrative.country",
			        "elementType": "geometry.stroke",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "administrative",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "transit.station",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "road",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "landscape",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "elementType": "labels.text.fill",
			        "stylers": [
			            {
			                "visibility": "simplified"
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#5fbcec"
			            }
			        ]
			    },
			    {
			        "featureType": "road",
			        "stylers": [
			            {
			                "lightness": 10
			            },
			            {
			                "saturation": -40
			            }
			        ]
			    },
			    {
			        "featureType": "landscape",
			        "stylers": [
			            {
			                "color": "#f2f2f2"
			            },
			            {
			                "visibility": "on"
			            }
			        ]
			    }
			]
		});

		google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
			return (callback && typeof callback === 'function') ? callback.call(this, map) : false;
		});

		$(root).on('resize', function(e) {
			google.maps.event.trigger(_app.map, 'resize');
		});
	};

	// getJSON helper method
	var getJSON = function(url, data, success, error) {
		return $.ajax({
			url: url,
			type: 'GET',
			dataType: 'JSON',
			data: data,
			success: success,
			error: error
		});
	};

	// Bootstrap method
	var init = function() {

		_app.canvas = $('#mapCanvas').get(0);

		// Setup geocoder
		_app.geocoder = new google.maps.Geocoder();

		// Setup map
		setupGoogleMaps(45.436, 4.876, 2, function(map) {

			// Get cities
			getJSON('./assets/js/countries.json', {}, sortData, function(xhr, error) {
				// console.log(error);
			});

		});

		$('.fa-info-circle').on('click', function(e) {
			alert('By continue to use this website, you agree to use of cookies.');
		});
	};

	// Sort data
	var sortData = function(countries) {
		var _data = { total: countries.length };
		_data.countries = [];
		_data.capitals = [];
		_data.byRegion = {};
		_data.bySubregion = {};

		countries.map(function(country)	{
			if ( country.capital && country.capital !== '' ) {
				_data.capitals.push(country.capital);
				_data.countries.push({
					name: country.name.official,
					latlng: new google.maps.LatLng(country.latlng[0], country.latlng[1]),
					capital: country.capital
				});

				_data.byRegion[country.region] = _data.byRegion[country.region] || [];
				_data.byRegion[country.region].push({
					name: country.name.official,
					latlng: new google.maps.LatLng(country.latlng[0], country.latlng[1]),
					capital: country.capital
				});

				_data.bySubregion[country.subregion] = _data.bySubregion[country.subregion] || [];
				_data.bySubregion[country.subregion].push({
					name: country.name.official,
					latlng: new google.maps.LatLng(country.latlng[0], country.latlng[1]),
					capital: country.capital
				});
			}
		});

		_app.data = _data;

		addRegionChoices();
		return setupQuiz();
	};

	// Add region choices
	var addRegionChoices = function() {
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
	var setRegionChoice = function(e) {
		var $this = $(this);
		if ( this.checked ) {
			_app.quiz.region = $this.data('title');
		}
	};

	// Setup quiz
	var setupQuiz = function() {
		_app.quiz = _app.quiz || {};
		_app.quiz.done = _app.quiz.done || [];
		_app.quiz.correct = _app.quiz.correct || 0;
		_app.quiz.answer = _app.quiz.answer || '';
		_app.quiz.region = _app.quiz.region || 'World';

		var randomCountry = getRandomCountry();
		if (typeof randomCountry !== 'undefined' && randomCountry.capital && randomCountry.capital !== '') {
			_app.geocoder.geocode({
				'address': randomCountry.capital
			}, function(results, status) {
				if ( status === google.maps.GeocoderStatus.OK ) {
					var result = results[0];
					_app.map.panTo(result.geometry.location);
					_app.map.setZoom(12);
					_app.map.panBy(-100, 0);

					var $guesses = $('.guesses').empty();
					var $answers = [];

					$answers.push( $('<button />', {
						'class': 'btn btn-lg btn-block the-guess btn-info animated',
						'type': 'button',
						'html': randomCountry.capital
					}) );

					_app.quiz.answer = randomCountry.capital;
					_app.quiz.done.push(randomCountry);


					for(var i = 0; i < 3; i++) {
						var randCountry = getRandomCountry();
						if (typeof randCountry === 'undefined' || !randCountry.capital) {
							i--;
							continue;
						}

						$answers.push( $('<button />', {
							'class': 'btn btn-lg btn-block the-guess btn-info animated',
							'type': 'button',
							'html': randCountry.capital
						}) );
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
	var markAnswers = function(e) {
		e.preventDefault();
		var $this = $(this).prop('disabled', true);
		var title = $this.html();
		if ( title === _app.quiz.answer ) {
			_app.quiz.correct += 1;
			$this.toggleClass('btn-info btn-success').html('<i class="fa fa-check"></i> ' + title);
		}
		else {
			$this.toggleClass('btn-info btn-danger').html('<i class="fa fa-remove"></i> ' + title);
			$this.siblings('.the-guess').each(function(i, el) {
				var $el = $(el);
				var elTitle = $el.html();
				if ( elTitle === _app.quiz.answer ) {
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
	var getRandomCountry = function() {
		var country = _app.quiz.region === 'World' ?
			_app.data.countries[Math.floor(Math.random() * _app.data.countries.length)] :
			_app.data.byRegion[_app.quiz.region][Math.floor(Math.random() * _app.data.byRegion[_app.quiz.region].length)];

		if (_app.quiz && _app.quiz.done && _app.quiz.done.indexOf(country) === -1) return country;
		getRandomCountry();
	};

	// Shuffle array - from: http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
	var arrSuffle = function(arr) {
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