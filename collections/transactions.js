Transactions = new Mongo.Collection( 'transactions' );

Transactions.allow({
  insert: function (userId, doc) {
    if(isAdmin(userId)) return true;
    if((sameUser(userId)) && (doc.modification < 0)) return true;
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    if(isAdmin(userId)) return true;
    return false;
  },
  remove: function (userId, doc, fields, modifier) {
    if(isAdmin(userId)) return true;
    return false;
  },
});

Transactions.deny({
  //insert: () => true,
  //update: () => true,
  //remove: () => true
});

///////////////////////////////////////////////////////////////////////////
// Schema
///////////////////////////////////////////////////////////////////////////


let TransactionsSchema = new SimpleSchema({
  'userId': {
    type: String,
    optional: false,
  },
  'eventId': {
    type: String,
    optional: true,
  },
  'modification': {
    type: Number,
    optional: false,
    label: 'Number of additional entries',
    custom: function() {
      var eventId = this.field('eventId');
      var modification = this
      if (modification.isSet && !eventId.isSet) {
        if (modification<0) return "mustBePositive";
      }
    }
  },
  'reason': {
    type: String,
    optional: false,
    allowedValues: [ 'participate', 'unsubscribe', 'bumped', 'boughtEntries' ],
  },
  'createdAt': {
    type: Date,
    autoValue: function(){
      return new Date()
    },
    optional: false
  },
});

Transactions.attachSchema( TransactionsSchema );

TransactionsSchema.messages({
  mustBePositive: 'A modification without an eventId must be a positive modification (grant entry).',
});
