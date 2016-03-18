var Storage = require('./storage');
var Kiosk = require('./kiosk');
var _ = require('lodash');
var debug = require('debug')('analyzer');

/**
 * @param {Object} options
 * @returns {Promise}
 */
var selectCheapestRoundtrip = function(options) {
    options = _.extend({
        route: Kiosk.defaultRoute
    }, options);

    debug('Selecting the cheapest roundtrip with options', options);

    return Storage
        .find(Storage.collectionName.roundtrips)
        .then(function(roundtrips) {
            var totalCost = options.totalCost;
            // Remove total cost from filter, since filter only test values for equalty.
            delete options.totalCost;

            var filteredRoundtrips = _.filter(roundtrips, options);
            var result;
            var message;

            // If price limit is specified, find tickets below price limit, and return nearest ticket by date.
            if (totalCost) {
                var cheapEnoughRoundtrips = _.filter(filteredRoundtrips, function(roundtrip) {
                    return roundtrip.totalCost <= totalCost;
                });
                // If cheap enough roundtrips are found, select nearest by date
                if (cheapEnoughRoundtrips.length) {
                    result = _.minBy(cheapEnoughRoundtrips, function(roundtrip) {
                        return roundtrip.originatingTicket.datetime;
                    });
                // If cheap enough roundtrips are not found, simply select the cheapest roundtrip
                } else {
                    message = `Я не нашёл билетов за ${totalCost} ₽ и меньше. Вот самый дешёвый:`;
                    result = _.minBy(filteredRoundtrips, 'totalCost');
                }
            // If price limit is not specified, find cheapest ticket.
            } else {
                result = _.minBy(filteredRoundtrips, 'totalCost');
            }

            return {roundtrip: result, message: message};
        });
};

/**
 * @param {Object} [options]
 * @param {Route} [options.route]
 * @param {Route} [options.earlyMorning]
 * @param {Route} [options.weekend]
 * @param {Route} [options.totalCost]
 * @returns {Promise}
 */
var analyze = function(options) {
    return selectCheapestRoundtrip(options)
        .catch(function(error) {
            console.log(error);
        });
};

module.exports = {
    analyze: analyze
};
