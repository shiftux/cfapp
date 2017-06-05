Exercises = new Meteor.Collection('exercises');

Exercises.allow({
  insert: function (userId, doc, fields, modifier) {
    if(!isAdmin(userId)) return false;
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    if(!isAdmin(userId)) return false;
    return true;
  },
  remove: function (userId, doc, fields, modifier) {
    return false;
  },
});

Exercises.deny({
  //insert: () => true,
  //update: () => true,
  //remove: () => true
});

///////////////////////////////////////////////////////////////////////////
// Schema
///////////////////////////////////////////////////////////////////////////

Exercises.attachSchema(new SimpleSchema({
  type: {
    type: String,
    optional: false,
    allowedValues: [ 'Body Weight', 'Barbell', 'Other' ],
  },
  name: {
    type: String,
    label: "Exercise Name",
    max: 150,
    unique: true,
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
    max: 1000
  },
  videoId: {
    type: String,
    label: "YouTube Video ID",
    optional: true,
    min: 0
  },
}));