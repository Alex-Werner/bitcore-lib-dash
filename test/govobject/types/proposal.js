'use strict';

/* jshint unused: false */
/* jshint latedef: false */
var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('lodash');
var sinon = require('sinon');

var bitcore = require('../../..');
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;

var Proposal = bitcore.GovObject.Proposal;
var errors = bitcore.errors;

// TODO: create Proposal from object

describe('Proposal', function() {
    var startDate = Math.round(new Date("2015-10-10").getTime()/1000);
    var endDate = Math.round(new Date("2025-10-10").getTime()/1000);

    it('should create new proposal', function() {
        var proposal = new Proposal();

        proposal.network = 'testnet';
        proposal.end_epoch = endDate;
        proposal.name = 'TestProposal';
        proposal.payment_address = 'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh';
        proposal.payment_amount = 10;
        proposal.start_epoch = startDate;
        proposal.type = 1;
        proposal.url = "http://www.dash.org";

        proposal.serialize().should.equal(expectedHex);
    });

    it('should throw error if invalid date', function() {
        var proposal = new Proposal();

        proposal.network = 'testnet';
        proposal.end_epoch = 1477872000;
        proposal.name = 'TestProposal';
        proposal.payment_address = 'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh';
        proposal.payment_amount = 10;
        proposal.start_epoch = 'not a date'; // invalid date
        proposal.type = 1;
        proposal.url = "http://www.dash.org";

        expect(function() {
            return proposal.serialize();
        }).to.throw(errors.GovObject.Proposal.start_epoch);

    });

    it('should throw error if start date >= end date', function() {
        var proposal = new Proposal();

        proposal.network = 'testnet';
        proposal.end_epoch = 1472688000;
        proposal.name = 'TestProposal';
        proposal.payment_address = 'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh';
        proposal.payment_amount = 10;
        proposal.start_epoch = 1477872000;
        proposal.type = 1;
        proposal.url = "http://www.dash.org";

        expect(function() {
            return proposal.serialize();
        }).to.throw(errors.GovObject.Proposal.invalidDateWindow);

    });

    it('should throw error if end date < now', function() {
        var start_epoch = Math.round(new Date('1/18/2014').getTime()/1000);
        var end_epoch = Math.round(new Date('3/25/2015').getTime()/1000);

        var proposal = new Proposal();

        proposal.network = 'testnet';
        proposal.end_epoch = end_epoch;
        proposal.name = 'TestProposal';
        proposal.payment_address = 'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh';
        proposal.payment_amount = 10;
        proposal.start_epoch = start_epoch;
        proposal.type = 1;
        proposal.url = "http://www.dash.org";

        expect(function() {
            return proposal.serialize();
        }).to.throw(errors.GovObject.Proposal.invalidDateWindow);

    });

    it('should throw error if payment address is invalid', function() {
        var proposal = new Proposal();

        proposal.network = 'testnet';
        proposal.end_epoch = endDate;
        proposal.name = 'TestProposal';
        proposal.payment_address = 'XmPtF6UoguyK'; // payment address must be > 26 characters
        proposal.payment_amount = 10;
        proposal.start_epoch = startDate;
        proposal.type = 1;
        proposal.url = "http://www.dash.org";

        expect(function() {
            return proposal.serialize();
        }).to.throw(errors.GovObject.Proposal.invalidAddress);

    });

    it('should throw error if amount <= 0', function() {
        var proposal = new Proposal();

        proposal.network = 'testnet';
        proposal.end_epoch = endDate;
        proposal.name = 'TestProposal';
        proposal.payment_address = 'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh';
        proposal.payment_amount = '';
        proposal.start_epoch = startDate;
        proposal.type = 1;
        proposal.url = "http://www.dash.org";

        expect(function() {
            return proposal.serialize();
        }).to.throw(errors.GovObject.Proposal.invalidPayment);

    });

    it('should throw error if invalid url', function() {
        var proposal = new Proposal();

        proposal.network = 'testnet';
        proposal.end_epoch = endDate;
        proposal.name = 'TestProposal';
        proposal.payment_address = 'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh';
        proposal.payment_amount = 10;
        proposal.start_epoch = startDate;
        proposal.type = 1;
        proposal.url = "http";

        expect(function() {
            return proposal.serialize();
        }).to.throw(errors.GovObject.Proposal.invalidUrl);

    });

    it('should throw error if proposal name is invalid', function() {
        var proposal = new Proposal();

        proposal.network = 'testnet';
        proposal.end_epoch = endDate;
        proposal.name = 'Test Proposal';
        proposal.payment_address = 'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh';
        proposal.payment_amount = 10;
        proposal.start_epoch = startDate;
        proposal.type = 1;
        proposal.url = "http://www.dash.org";

        expect(function() {
            return proposal.serialize();
        }).to.throw(errors.GovObject.Proposal.invalidName);
    });
    it('should create a new proposal from a JSON object', function(){
        var jsonProposal = {
          network:"testnet",
          name:"TestProposal",
          start_epoch:startDate,
          end_epoch:endDate,
          payment_address:'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh',
          payment_amount:10,
          type:1,
          url:"http://www.dash.org"
        };
        var proposal = new Proposal();
        proposal = proposal.fromObject(jsonProposal);
        expect(proposal instanceof Proposal);
        proposal.serialize().should.equal(expectedHex);

    });
    it('should create a new proposal from a stringified JSON object', function(){
        var jsonProposal = {
          network:"testnet",
          name:"TestProposal",
          start_epoch:startDate,
          end_epoch:endDate,
          payment_address:'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh',
          payment_amount:10,
          type:1,
          url:"http://www.dash.org"
        };

        var proposal = new Proposal();
        proposal = proposal.fromObject(JSON.stringify(jsonProposal));
        expect(proposal instanceof Proposal);
        proposal.serialize().should.equal(expectedHex);
    });

    it('should create a new proposal from a hex string', function(){
        var Proposal = bitcore.GovObject.Proposal;
        var proposal = new Proposal(expectedHex);

        expect(proposal instanceof Proposal);
        proposal.serialize().should.equal(expectedHex);
    });

});
var expectedHex = '5b5b2270726f706f73616c222c7b22656e645f65706f6368223a313736303035343430302c226e616d65223a225465737450726f706f73616c222c227061796d656e745f61646472657373223a22795847654e505158594658684c414e315a4b72416a787a7a426e5a324a5a4e4b6e68222c227061796d656e745f616d6f756e74223a31302c2273746172745f65706f6368223a313434343433353230302c2274797065223a312c2275726c223a22687474703a2f2f7777772e646173682e6f7267227d5d5d';
