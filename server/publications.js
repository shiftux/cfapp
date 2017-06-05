Meteor.publish('user', function(id) {
  return Users.find({_id:id}, {fields: { services: 0, roles: 0, heartbeat: 0 }});
});

Meteor.publish( 'events', function(daysLimit = 8) {
  return Events.find({start: {$gte: moment().toDate(), $lte: moment().add(daysLimit, 'days').toDate()}});
});

Meteor.publish( 'participants', function(eventId) {
  event = Events.findOne(eventId)
  names = Users.find({_id:{$in:event.participants}}, {fields: {emails: 0, createdAt: 0, subscription: 0, services: 0, roles: 0, heartbeat: 0}})
  return names;
});

Meteor.publish('user_list', function(id) {
  if (Roles.userIsInRole(id, 'admin')){
    return Users.find();
  } else {
    return Users.find({_id: id});
  }
});

Meteor.publish('userTransactions', function(id) {
  return Transactions.find({userId: id})
});

Meteor.publish('userRegisteredEvents', function(id) {
  return Events.find({participants: id, start: {$gte: moment().toDate()}})
});

Meteor.publish('userWaitingListEvents', function(id) {
  return Events.find({waitingList: id, start: {$gte: moment().toDate()}})
});

Meteor.publish('monthlyUserStats', function(referenceDate, monthRange){
  if(!referenceDate) {referenceDate = moment()}
  var startDate = moment(referenceDate).add(-monthRange, 'months').toDate()
  var endDate = moment(referenceDate).add(monthRange, 'months').toDate()
  return Events.find({start: {$gte: moment(startDate).startOf('month').toDate(), $lt: moment(endDate).endOf('month').toDate()}})
})

