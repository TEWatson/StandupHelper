'use strict';

const Alexa = require('alexa-sdk');
const dynasty = require('dynasty')({});
const languageStrings = require('./languageStrings');
const listAbsentMembers = require('./intentDelegates/listAbsentMembers');
const readUpdates = require('./intentDelegates/readUpdates');

const APP_ID = "amzn1.ask.skill.4a43403d-fa8a-482e-a3f5-f44476344ca8";
const standupUpdatesTable = dynasty.table('Standup-Updates');

const handlers = {

  'ListAbsentMembers': function() {
      listAbsentMembers(this, standupUpdatesTable)
  },

  'ReadUpdates': function() {
      readUpdates(this, standupUpdatesTable)
  },

  'Error': function() {
      this.emit(':tell', this.t('ERROR_MESSAGE'))
  },

  'AMAZON.HelpIntent': function () {
    this.attributes.speechOutput = this.t('HELP_MESSAGE');
    this.attributes.repromptSpeech = this.t('HELP_REPROMT');
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
  },
  'AMAZON.RepeatIntent': function () {
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
  },
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest');
  },
  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest');
  },
};

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings.strings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

function dialogHandler() {
  if (this.event.request.dialogState === "STARTED") {
    this.emit(':delegate', this.event.request.intent)
  } else if (this.event.request.dialogState !== "COMPLETED"){
    this.emit(':delegate')
  } else {
    return this.event.request.intent
  }
}
