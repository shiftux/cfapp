Events = new Mongo.Collection( 'events' );

Events.allow({
  insert: function (userId, doc, fields, modifier) {
    if(!isAdmin(userId)) return false;
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    if(!isAdmin(userId)) return false;
    return true;
  },
  remove: function (userId, doc, fields, modifier) {
    if(!isAdmin(userId)) return false;
    if(doc.participants){if(doc.participants.lenght >= 0) return false;}
    if(doc.waitingList){if(doc.waitingList.lenght >= 0) return false;}
    return true;
  },
});

Events.deny({
  //insert: () => true,
  //update: () => true,
  //remove: () => true
});

///////////////////////////////////////////////////////////////////////////
// Schema
///////////////////////////////////////////////////////////////////////////


let EventsSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'The title of this event.',
    optional: false,
    // defaultValue: function(){return this.field('type').value}
  },
  'start': {
    type: Date,
    label: 'When this event will start.',
    optional: false,
    autoform: {type: "bootstrap-datetimepicker"}
  },
  'end': {
    type: Date,
    label: 'When this event will end.',
    optional: false,
    autoform: {type: "bootstrap-datetimepicker"},
    custom: function() {
      var start = this.field('start');
      var end = this;
      if (start.isSet && end.isSet) {
        if (moment(end.value).isBefore(moment(start.value))) return "badEndDate";
        if (moment(start.value).isBefore(moment())) return "inPast";
        if (!(moment(end.value).dayOfYear() === moment(start.value).dayOfYear())) return "needSameDate";
      }
    }
  },
  'type': {
    type: String,
    label: 'What type of event is this?',
    optional: false,
    allowedValues: [ 'Workout of the Day', 'Yoga', 'Open Gym', 'Master Klasse', 'Advanced Klasse', 'Weight Lifting Klasse', 'Special Event' ],
    defaultValue: 'Workout of the Day'
  },
  'coach': {
    type: String,
    label: 'Coach',
    optional: false,
    allowedValues: [ 'Tom', 'Christine', 'Adrian', 'Sybille', 'Ruth', 'Tobias', 'Claudia', 'Sebastian' ],
    defaultValue: 'Tom'
  },
  'maxParticipants': {
    type: Number,
    label: 'Maximum number of participants',
    optional: false,
    min: 1,
    max: 100,
    defaultValue: 12
  },
  'participants': {
    type: [String],
    optional: true,
    minCount: 0,
    regEx: SimpleSchema.RegEx.Id,
    maxCount: 12,//function(){return this.field('maxParticipants').value}
    defaultValue: []
  },
  'participantsCount': {
    type: Number,
    optional: true,
    min: 0,
    defaultValue: 0,
  },
  'waitingList': {
    type: [String],
    optional: true,
    minCount: 0,
    regEx: SimpleSchema.RegEx.Id,
    maxCount: 10,
    defaultValue: []
  },
});

Events.attachSchema( EventsSchema );

EventsSchema.messages({
  badEndDate: 'End date must be after the start date.',
  needSameDate: 'End date must be on the same date as start date.',
  inPast: "Event can't be created in the past.",
})

// Events.after.update(function (userId, doc, fieldNames, modifier, options) {
//   count = Object.keys(doc.participants).length
//   if (count !== this.previous.participantsCount){
//     Events.update(doc._id, {$set:{participantsCount: count}})
//   }
// })
