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
                    " <break time=\"1s\"/>"
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
        var greetingList = responseEnhancements.greetings
        var randomGreeting = greetingList[Math.floor(Math.random() * greetingList.length)];
        var greeting = "<say-as interpret-as=\"interjection\">" + randomGreeting + "</say-as> <break time=\"300ms\"/> \n"

        var goodbyeList = responseEnhancements.goodbyes
        var randomGoodbye = goodbyeList[Math.floor(Math.random() * goodbyeList.length)];
        var goodbye = "\n <break time=\"500ms\"/> <say-as interpret-as=\"interjection\">" + randomGoodbye + "</say-as>"

        var enhanced = greeting + responseText + goodbye;
        return enhanced;
    }
}
