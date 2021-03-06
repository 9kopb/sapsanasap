var vows = require('vows');
var assert = require('assert');

var Kiosk = require('./../kiosk');

vows.describe('Routes').addBatch({
    'To Moscow': {
        topic: Kiosk.toMoscow(),
        'should be directed to Moscow': function(topic) {
            assert.equal('mow', topic.to.alias);
        },
        'should be directed from St Peterburg': function(topic) {
            assert.equal('spb', topic.from.alias);
        }
    },
    'To St Petersburg': {
        topic: Kiosk.Route.toSpb(),
        'should be directed to St Peterburg': function(topic) {
            assert.equal('spb', topic.to.alias);
        },
        'should be directed from Moscow': function(topic) {
            assert.equal('mow', topic.from.alias);
        }
    }
}).export(module);