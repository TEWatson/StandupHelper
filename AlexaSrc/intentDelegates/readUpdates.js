'use strict';

const buildUpdateList = require('../helperDelegates/responseBuilders').buildUpdateList;
module.exports = function(handler, table) {

    table
        .scan()
        .then(function(resp){
            if (resp !== undefined && resp.length > 0) {
                handler.emit(':tell', handler.t('FILL_IN_MESSAGE', buildUpdateList(resp)));
            } else {
                handler.emit(":tell", handler.t('NO_ABSENCES_MESSAGE'))
            }
        })
        .catch(function(err){
            console.log(err);
            handler.emit('Error');
        })

}
