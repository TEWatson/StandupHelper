'use strict';

const buildUpdateList = require('../helperDelegates/responseBuilders').buildUpdateList;
const enhanceResponseText = require('../helperDelegates/responseBuilders').enhanceResponseText;

module.exports = function(handler, table) {

    table
        .scan()
        .then(function(resp){
            if (resp !== undefined && resp.length > 0) {
                var updateList = buildUpdateList(resp);
                var enhancedUpdateList = enhanceResponseText(updateList);
                handler.emit(':tell', handler.t('FILL_IN_MESSAGE', enhancedUpdateList));
            } else {
                handler.emit(":tell", handler.t('NO_ABSENCES_MESSAGE'))
            }
        })
        .catch(function(err){
            console.log(err);
            handler.emit('Error');
        })

}
