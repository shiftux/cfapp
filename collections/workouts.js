Workouts = new Meteor.Collection('workouts');

Workouts.allow({
  insert: function (userId, doc, fields, modifier) {
    if(!sameUser(userId)) return false;
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    if(!sameUser(userId)) return false;
    if(!isOwner(userId, doc)) return false;
    return true;
  },
  remove: function (userId, doc, fields, modifier) {
    if(!sameUser(userId)) return false;
    if(!isOwner(userId, doc)) return false;
    return true;
  },
});

Workouts.deny({
  //insert: () => true,
  //update: () => true,
  //remove: () => true
});

///////////////////////////////////////////////////////////////////////////
// Schema
///////////////////////////////////////////////////////////////////////////

Workouts.attachSchema(new SimpleSchema({
  exerciseId: {
    type: String,
    optional: false,
    max: 50
  },
  userId: {
    type: String,
    optional: false,
    max: 50
  },
  date: {
    type: Date,
    optional: false,
    max: moment().endOf('day').toDate(),
    autoform: {
      type: "bootstrap-datepicker",
      value: moment().toDate()
    },
    label: "Date",
  },
  reps: {
    type: String,
    label: "Repetitions",
    optional: true,
    max: 50
  },
  time: {
    type: String,
    label: "Time",
    optional: true,
    max: 50
  },
  weight: {
    type: Number,
    label: "Weight",
    optional: true,
    min: 0
  },
  notes: {
    type: String,
    label: "Notes",
    optional: true,
    max: 1000
  }
}));