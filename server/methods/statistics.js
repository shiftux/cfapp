Meteor.methods({
  'generateDailyEventParticipantsStats' : function(date) {
    events = Events.find({start: {$gte: moment(date).startOf('day').toDate(), $lt: moment(date).endOf('day').toDate()}}).fetch()
    var exportData = []
    events.forEach(function(event){
      var participantsData = []
      event.participants.forEach(function(participantId){
        participant = Users.findOne(participantId)
        participantsData.push( ' ' + participant.profile.firstName + ' ' +participant.profile.lastName )
      })
      var data = {event: event.title, date: event.start, participants: participantsData}
      exportData.push(data)
    })
    return exportData
  },
 })