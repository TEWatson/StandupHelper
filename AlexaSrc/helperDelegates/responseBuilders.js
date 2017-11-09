'use strict';

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
                    "here is an update for " + itemArray[i].sender +
                    ": <break time=\"500ms\"/> " + itemArray[i].content +
                    " <break time=\"1s\"/>"
            }
            else {
                aggregateString =
                    aggregateString +
                    "and here is an update for " + itemArray[i].sender +
                    ": <break time=\"500ms\"/> " + itemArray[i].content
            }
        }
        return aggregateString
    }
}

