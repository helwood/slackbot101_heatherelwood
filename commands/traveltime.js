'use strict';

// Require dependencies
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDf9NQEqXaZOLsqQ5tWzsSRiTo-5an1KOQ'
});


// Geocode an address.
// googleMapsClient.geocode({
// }, function(err, response) {
//   if (!err) {
//     console.log(response.json.results);
//   }
// });

module.exports = function(bot) {

    bot.registerCommand(new RegExp('^traveltime *', 'i'), {displayName: 'traveltime {address}'}, function(bot, params, message, slackbotCallback) {

        // initialize the repsonse object
        var resp = {
            text: null
        };

        var now = new Date();
		var origin = "421 Penman Street #310, Charlotte, NC";

        if(!params[1]) {
            resp.text = 'I need an address silly.';
            return slackbotCallback(null, resp);
        }

        // remove "weather"
        params.shift();
        var address = params.join(' ');


		var url = "https://www.google.com/maps/dir/?api=1&origin="+encodeURI(origin)+"&destination="+encodeURI(address)+"&travelmode=driving";
		// url = encodeURI(url);


           googleMapsClient.directions({
				origin: origin,
				destination: address,
				mode: 'driving',
				departure_time: now
			}, function(err, response) {
				if(!err) {
					// resp.text = response.json.routes[0].legs[0].duration.text;
					resp.attachments = [
                      {
                          fields: [
                               {
                                   "title": "Start Address",
                                   "value": response.json.routes[0].legs[0].start_address,
                                   "short": true
                               },
                               {
                                   "title": "End Address",
                                   "value": response.json.routes[0].legs[0].end_address,
                                   "short": true
                               },
                               {
                                   "title": "Distance",
                                   "value": response.json.routes[0].legs[0].distance.text,
                                   "short": true
                               },
                               {
                                   "title": "Duration",
                                   "value": response.json.routes[0].legs[0].duration.text,
                                   "short": true
                               },
                               {
                               	"title": "Link",
                               	"value": url,
                               	"short": false
                               }
                           ]
                      }
                  ];
            		return slackbotCallback(null, resp);
				} else {
					console.log(err);
					resp.text = 'Uh oh! Unable to get travel info for "'+address+'"';
              		return slackbotCallback(null, resp);
				}
			});
    });

};	