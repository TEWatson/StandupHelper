'use strict';

module.exports = function(handler, dynasty, table) {

    if (slots.Item && slots.Item.value && slots.Location.value) {
        dynasty
            .list(table)
            .then(function(resp){
                if (resp.TableNames != undefined) {
                    table.update({ hash: handler.event.session.user.userId,
                            range: slots.Item.value
                            }, {location: slots.Location.value})
                    .then(function(resp) {
                      if (slots.Item.value != slots.Item.original) {
                          handler.emit(':tell', handler.t('MOVE_MESSAGE_PLURAL', slots.Item.original, slots.Location.value));
                      }
                      else {
                          handler.emit(':tell', handler.t('MOVE_MESSAGE_SINGULAR', slots.Item.original, slots.Location.value));
                      }
                    })
                    .catch(function(err) {
                        console.log(err);
                        handler.emit('Error');
                    })
                } else {
                    handler.emit(":tell", handler.t('NO_ITEM_MESSAGE'))
                }
            })
            .catch(function(err){
                console.log(err);
                handler.emit('Error');
            })

    } else {
        console.log("error with itemName slot");
        handler.emit('Error')
    }
}
