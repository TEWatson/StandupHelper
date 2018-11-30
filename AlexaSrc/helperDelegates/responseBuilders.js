'use strict';

const responseEnhancements = require('../responseEnhancements');

module.exports = {
    buildTeammateList : function(itemArray) {
        var aggregateString = "";
        var length = itemArray.length;
        for (var i = 0; i < length; i++) {
            if (i < (length - 1)) {
                aggregateString = aggregateString + itemArray[i].sender + " "
            }
            else {
                aggregateString = aggregateString + "and " + itemArray[i].sender
            }
        }
        return aggregateString
    },

    buildUpdateList : function(itemArray) {
        var aggregateString = "";
        var length = itemArray.length;
        for (var i = 0; i < length; i++) {
            if (i < (length - 1) || length === 1) {
                aggregateString =
                    aggregateString +
                    "here is " + itemArray[i].sender + "'s update: " +
                    "<break time=\"500ms\"/> " + itemArray[i].content +
                    " <break time=\"500ms\"/>"
            }
            else {
                aggregateString =
                    aggregateString +
                    "and here is " + itemArray[i].sender + "'s update: " +
                    "<break time=\"500ms\"/> " + itemArray[i].content
            }
        }
        return aggregateString
    },

    enhanceResponseText : function(responseText) {

        function replaceEmailSubstrings(emailText) {
            // Iterate over the replaceable substrings
            var reps = responseEnhancements.replacements;
            Object.keys(reps).forEach(
                    function(key) {
                        emailText = emailText.split(key).join(reps[key]);
                    }
                );
            return emailText;
        }

        // Make replacements, e.g. "working from home" for "WFH"
        responseText = replaceEmailSubstrings(responseText);

        var greetingList = responseEnhancements.greetings
        var randomGreeting = greetingList[Math.floor(Math.random() * greetingList.length)];
        var greeting = "<say-as interpret-as=\"interjection\">" + randomGreeting + "</say-as> <break time=\"250ms\"/> \n"

        var goodbyeList = responseEnhancements.goodbyes
        var randomGoodbye = goodbyeList[Math.floor(Math.random() * goodbyeList.length)];
        var goodbye = "\n <say-as interpret-as=\"interjection\">" + randomGoodbye + "</say-as>"

        return greeting + responseText + goodbye;
    }
}
