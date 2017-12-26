'use strict';

const buildTeammateList = require('../helperDelegates/responseBuilders').buildTeammateList;
module.exports = function(handler, table) {

    table
        .scan()
        .then(function(resp){
            if (resp !== undefined && resp.length > 0) {
                if (resp.length > 1) {
                    handler.emit(':tell', handler.t('LIST_MESSAGE_PLURAL', buildTeammateList(resp)));
                }
                else {
                    handler.emit(':tell', handler.t('LIST_MESSAGE_SINGULAR', resp[0].sender));
                }
            } else {
                handler.emit(":tell", handler.t('NO_ABSENCES_MESSAGE'))
            }
        })
        .catch(function(err){
            console.log(err);
            handler.emit('Error');
        })

}
