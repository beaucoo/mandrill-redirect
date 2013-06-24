/*jshint node: true, expr:true */
/*global describe, beforeEach, it */

require('should'); // https://github.com/visionmedia/should.js
var rewire = require('rewire');
var _ = require('lodash');


describe("Mandrill Redirect should", function () {
    "use strict";

    var mod;

    function stub() {
    }

    function notExpected() {
        throw "NOT EXPECTED";
    }

    function exists(val) {
        (!!val).should.be.true;
    }

    function notExists(val) {
        (!val).should.be.true;
    }

    function setMock(hash) {
        mod.__set__(hash);
    }

    function getFunc(name) {
        return mod.__get__(name);
    }

    var actualTemplate;
    var expectedTemplate;
    var redirectEmail = "test@gmail.com";

    beforeEach(function (done) {
        mod = rewire("../lib/mandrill-redirect");

        actualTemplate = {
            message: {
                to: [
                    {email: "jack@gmail.com", name: "Jack"},
                    {email: "jill@gmail.com", name: "Jill"}
                ],
                merge_vars: [
                    {rcpt: "jack@gmail.com", vars: "JACKS_VARS"},
                    {rcpt: "jill@gmail.com", vars: "JILLS_VARS"}
                ],
                recipient_metadata: [
                    {rcpt: "jack@gmail.com", values: "JACKS_VALUES"},
                    {rcpt: "jill@gmail.com", values: "JILLS_VALUES"}
                ]
            }
        };

        expectedTemplate = {
            message: {
                to: [
                    {email: "test+0@gmail.com", name: "Jack"},
                    {email: "test+1@gmail.com", name: "Jill"}
                ],
                merge_vars: [
                    {rcpt: "test+0@gmail.com", vars: "JACKS_VARS"},
                    {rcpt: "test+1@gmail.com", vars: "JILLS_VARS"}
                ],
                recipient_metadata: [
                    {rcpt: "test+0@gmail.com", values: "JACKS_VALUES"},
                    {rcpt: "test+1@gmail.com", values: "JILLS_VALUES"}
                ]
            }
        };

        done();
    });


    function redirect() {
        return mod(actualTemplate, redirectEmail);
    }


    it("succeed w/ all", function () {
        redirect().should.be.true;
        actualTemplate.should.eql(expectedTemplate);
    });


    it("succeed w/o all", function () {
        delete actualTemplate.merge_vars;
        delete actualTemplate.recipient_metadata;
        delete expectedTemplate.merge_vars;
        delete expectedTemplate.recipient_metadata;

        redirect().should.be.true;
        actualTemplate.should.eql(expectedTemplate);
    });


    it("insist on defined 'to' values", function () {
        delete actualTemplate.message.to;
        redirect().should.be.false;
    });


    it("insist on one or more 'to' values", function () {
        actualTemplate.message.to = [];
        redirect().should.be.false;
    });


    it("optionally insist on matching 'to' and 'merge_vars' counts", function () {
        actualTemplate.message.merge_vars = [];
        redirect().should.be.false;
    });


    it("optionally insist on matching 'to' and 'recipient_metadata' counts", function () {
        actualTemplate.message.recipient_metadata = [];
        redirect().should.be.false;
    });


    it("skip when no redirect", function () {
        var original = _.cloneDeep(actualTemplate);
        mod(actualTemplate).should.be.true;
        actualTemplate.should.eql(original);
    });
});