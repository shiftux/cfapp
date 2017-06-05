Meteor.startup(function() {

  if (Users.find({}).count() === 0 ){
    var adminId = Meteor.users.insert({
      emails: [ { address: 'admin@admin.a', verified: true } ],
      services: { password: { bcrypt: '$2a$10$KvleiGCD2PfRmV6kIYc8h.aMHjUNesseEQAzgwtq1UKD4akjrZAEm' }, resume: { loginTokens: [] } },
      profile: {firstName: "The", lastName: "Admin", birthday: new Date(2015,10,1) },
      createdAt: new Date(),
      roles: ["admin"]
    });
  } // users == 0

  if (Events.find({}).count() === 0 ){
    date = moment().add(1,'days')
    endDate = moment('2025-09-31')
    while (date.isBefore(endDate)){
      fillTheCorrespondingDay(date)
      date = date.add(1,'days')
    } // while
  } // events == 0
}); // startup


/////////////////////////////////////////////////////////////////
// helper functions
/////////////////////////////////////////////////////////////////

function fillTheCorrespondingDay(date){
  switch(date.day()) {
    case 0:
      fillSunday(date)
      break;
    case 1:
      fillMonday(date)
      break;
    case 2:
      fillTuesday(date)
      break;
    case 3:
      fillWednesday(date)
      break;
    case 4:
      fillThursday(date)
      break;
    case 5:
      fillFriday(date)
      break;
    case 6:
      fillSaturday(date)
      break;
  }
}

function fillMonday(date){
  createOpenGym2h(moment(date).startOf('day').add(11, 'hours'))
  createWOD(moment(date).startOf('day').add(12,'hours'))
  createWOD(moment(date).startOf('day').add(17,'hours'))
  createWOD(moment(date).startOf('day').add(18,'hours', 'Adrian'))
  createWOD8limit(moment(date).startOf('day').add(19,'hours', 'Adrian'))
  createOpenGym(moment(date).startOf('day').add(16, 'hours'))
  createOpenGym(moment(date).startOf('day').add(17.5, 'hours'))
  createAdvanced(moment(date).startOf('day').add(19,'hours'))
}

function fillTuesday(date){
  createWOD(moment(date).startOf('day').add(6.5, 'hours'))
  createOpenGym(moment(date).startOf('day').add(6.5, 'hours'))
  createMaster(moment(date).startOf('day').add(10, 'hours'))
  createOpenGym2h(moment(date).startOf('day').add(11, 'hours'))
  createWOD(moment(date).startOf('day').add(12, 'hours'))
  createWOD(moment(date).startOf('day').add(17, 'hours'))
  createWOD(moment(date).startOf('day').add(18, 'hours'))
  createWOD8limit(moment(date).startOf('day').add(19, 'hours'))
  createOpenGym(moment(date).startOf('day').add(16, 'hours'))
  createOpenGym(moment(date).startOf('day').add(17.5, 'hours'))
  createAdvanced(moment(date).startOf('day').add(19, 'hours'))
}

function fillWednesday(date){
  createOpenGym2h(moment(date).startOf('day').add(11, 'hours'))
  createWOD(moment(date).startOf('day').add(12, 'hours'))
  createWOD(moment(date).startOf('day').add(17, 'hours'))
  createWOD(moment(date).startOf('day').add(18, 'hours'))
  createWOD(moment(date).startOf('day').add(19, 'hours'))
  createOpenGym(moment(date).startOf('day').add(16, 'hours'))
  createOpenGym(moment(date).startOf('day').add(17.5, 'hours'))
}

function fillThursday(date){
  createWOD(moment(date).startOf('day').add(6.5, 'hours'))
  createOpenGym(moment(date).startOf('day').add(6.5, 'hours'))
  createOpenGym2h(moment(date).startOf('day').add(11, 'hours'))
  createWOD(moment(date).startOf('day').add(12, 'hours'))
  createWOD(moment(date).startOf('day').add(17, 'hours'))
  createWOD(moment(date).startOf('day').add(18, 'hours'))
  createWOD8limit(moment(date).startOf('day').add(19, 'hours'))
  createOpenGym(moment(date).startOf('day').add(16, 'hours'))
  createOpenGym(moment(date).startOf('day').add(17.5, 'hours'))
  createAdvanced(moment(date).startOf('day').add(19, 'hours'))
}

function fillFriday(date){
  createOpenGym2h(moment(date).startOf('day').add(17, 'hours'))
  createWeightLifting(moment(date).startOf('day').add(17, 'hours'))
  createYoga(moment(date).startOf('day').add(19, 'hours'))
}

function fillSaturday(date){
  createWOD(moment(date).startOf('day').add(9, 'hours'))
  createWOD(moment(date).startOf('day').add(10, 'hours'))
  createWOD(moment(date).startOf('day').add(11, 'hours'))
  createOpenGym(moment(date).startOf('day').add(9, 'hours'))
  createOpenGym(moment(date).startOf('day').add(10.5, 'hours'))
}

function fillSunday(date){
  createOpenGym20limit(moment(date).startOf('day').add(14, 'hours'))
}

function createWOD(dateTime, coach='Tom'){
  Events.insert({
    title: 'Workout of the Day',
    type: 'Workout of the Day',
    start: moment(dateTime).toDate(),
    end: moment(dateTime).add(60, 'minutes').toDate(),
    maxParticipants: 12,
    coach: coach
  });
}

function createWOD8limit(dateTime, coach='Tom'){
  Events.insert({
    title: 'Workout of the Day',
    type: 'Workout of the Day',
    start: moment(dateTime).toDate(),
    end: moment(dateTime).add(60, 'minutes').toDate(),
    maxParticipants: 8,
    coach: coach
  });
}

function createYoga(dateTime, coach='Claudia'){
  Events.insert({
    title: 'Yoga',
    type: 'Yoga',
    start: moment(dateTime).toDate(),
    end: moment(dateTime).add(60, 'minutes').toDate(),
    maxParticipants: 12,
    coach: coach
  });
}

function createOpenGym(dateTime, coach='Tom'){
  Events.insert({
    title: 'Open Gym',
    type: 'Open Gym',
    start: moment(dateTime).toDate(),
    end: moment(dateTime).add(90, 'minutes').toDate(),
    maxParticipants: 12,
    coach: coach
  });
}

function createOpenGym2h(dateTime, coach='Tom'){
  Events.insert({
    title: 'Open Gym',
    type: 'Open Gym',
    start: moment(dateTime).toDate(),
    end: moment(dateTime).add(120, 'minutes').toDate(),
    maxParticipants: 12,
    coach: coach
  });
}

function createOpenGym20limit(dateTime, coach='Tom'){
  Events.insert({
    title: 'Open Gym',
    type: 'Open Gym',
    start: moment(dateTime).toDate(),
    end: moment(dateTime).add(120, 'minutes').toDate(),
    maxParticipants: 20,
    coach: coach
  });
}

function createMaster(dateTime, coach='Tom'){
  Events.insert({
    title: 'Master Class',
    type: 'Master Klasse',
    start: moment(dateTime).toDate(),
    end: moment(dateTime).add(60, 'minutes').toDate(),
    maxParticipants: 12,
    coach: coach
  });
}

function createWeightLifting(dateTime, coach='Christine'){
  Events.insert({
    title: 'Weight Lifting',
    type: 'Weight Lifting Klasse',
    start: moment(dateTime).toDate(),
    end: moment(dateTime).add(90, 'minutes').toDate(),
    maxParticipants: 12,
    coach: coach
  });
}

function createAdvanced(dateTime, coach='Tobias'){
  Events.insert({
    title: 'Advanced Class',
    type: 'Advanced Klasse',
    start: moment(dateTime).toDate(),
    end: moment(dateTime).add(90, 'minutes').toDate(),
    maxParticipants: 12,
    coach: coach
  });
}
