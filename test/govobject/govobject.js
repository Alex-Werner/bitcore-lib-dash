/* jshint unused: false */
/* jshint latedef: false */
var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('lodash');
var sinon = require('sinon');

var bitcore = require('../..');
var GovObject = bitcore.GovObject;
var Proposal = bitcore.GovObject.Proposal;
var errors = bitcore.errors;

/* FromObject */
describe('GovObject', function(){


  describe('GovObject - FromObject', function(){
    it('should cast a JSON Proposal into a Proposal Object', function(){
      var govObject = new GovObject;
      var jsonProposal = {
        network:"testnet",
        name:"TestProposal",
        start_epoch:Math.round(new Date("2015-10-10").getTime()/1000),
        end_epoch:Math.round(new Date("2025-10-10").getTime()/1000),
        payment_address:'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh',
        payment_amount:10,
        type:1,
        url:"http://www.dash.org"
      };

      govObject = govObject.fromObject(jsonProposal);

      expect(govObject instanceof Proposal);

      govObject.serialize().should.equal(expectedHex);
    })
    it('should cast a stringified JSON Proposal into a Proposal Object', function(){
      var govObject = new GovObject;
      var jsonProposal = {
        network:"testnet",
        name:"TestProposal",
        start_epoch:Math.round(new Date("2015-10-10").getTime()/1000),
        end_epoch:Math.round(new Date("2025-10-10").getTime()/1000),
        payment_address:'yXGeNPQXYFXhLAN1ZKrAjxzzBnZ2JZNKnh',
        payment_amount:10,
        type:1,
        url:"http://www.dash.org"
      };

      var govObject = govObject.fromObject(JSON.stringify(jsonProposal));

      expect(govObject instanceof Proposal);

      govObject.serialize().should.equal(expectedHex);
    })
  });
});
var expectedHex = "5b5b2270726f706f73616c222c7b22656e645f65706f6368223a313736303035343430302c226e616d65223a225465737450726f706f73616c222c227061796d656e745f61646472657373223a22795847654e505158594658684c414e315a4b72416a787a7a426e5a324a5a4e4b6e68222c227061796d656e745f616d6f756e74223a31302c2273746172745f65706f6368223a313434343433353230302c2274797065223a312c2275726c223a22687474703a2f2f7777772e646173682e6f7267227d5d5d";
