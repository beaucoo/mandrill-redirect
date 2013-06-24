/*jshint node: true */
/*global require, __dirname, process */


var util = require('util');


// See the README.md
module.exports = function redirectEmails(template, redirectToEmail) {
    "use strict";

    if (!redirectToEmail) {
        return true;
    }

    var emailTo = template.message.to;
    if (!emailTo || 0 === emailTo.length) {
        console.error("ERROR: 'template.message.to' expected to have at least one recipient");
        return false;
    }

    // Format aliases of the given email (otherwise Mandrill resolves them all to one to be sent)
    var emailParts = redirectToEmail.split("@");
    var emailFormat = util.format("%s+%s@%s", emailParts[0], "%d", emailParts[1]);


    var mergeVars = template.message.merge_vars;
    if (mergeVars && mergeVars.length !== emailTo.length) {
        console.error("ERROR: 'template.message.merge_vars' expected to have same count as 'template.message.to'");
        return false;
    }

    var recipientMetadata = template.message.recipient_metadata;
    if (recipientMetadata && recipientMetadata.length !== emailTo.length) {
        console.error("ERROR: 'template.message.recipient_metadata' expected to have same count as 'template.message.to'");
        return false;
    }

    for (var i = 0; i < emailTo.length; i++) {
        var email = util.format(emailFormat, i);
        emailTo[i].email = email;

        if (mergeVars) {
            mergeVars[i].rcpt = email;
        }

        if (recipientMetadata) {
            recipientMetadata[i].rcpt = email;
        }
    }

    return true;
};