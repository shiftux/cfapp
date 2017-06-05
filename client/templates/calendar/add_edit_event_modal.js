AutoForm.hooks({
  'events-edit-form': {
    onSuccess: function (operation, result, template) {
      if(result){
        FlashMessages.sendSuccess("Successfully created event");
        $('#add-edit-event-modal').modal('hide')
      }
    },
    onError: function(operation, error, template) {
      FlashMessages.sendError("Failed to create event! " + error);
      console.log(error);
      Modal.hide();
    }
  },
});

Template.addEditEventModal.created = function() {
  Session.set('modalSubTemplate', 'event');
}

Template.addEditEventModal.helpers({
  modalType( type ) { // whether it's to update or to add an event
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === type;
    }
  },
  modalLabel() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return {
        button: eventModal.type === 'edit' ? 'Edit' : 'Add',
        label: eventModal.type === 'edit' ? 'Edit' : 'Add an'
      };
    }
  },
  event() {
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === 'edit' ? Events.findOne( eventModal.event ) : {
        start: moment(eventModal.date).toDate(), // $('input[name=start]').val("setthevalue") , format 03/07/2017 6:57 PM moment().format('MM/DD/YYYY h:m A')
        end: moment(eventModal.date).add(1,'hour').toDate()
      };
    }
  },
  free: function() {
    if(Session.get('eventModal')) {
      let e = Events.findOne( Session.get( 'eventModal' ).event );
      if (e.participants){
        return  Object.keys(e.participants).length <= e.maxParticipants ?  true : false ;
      } else{
        return true
      }
    }
  },
  participating: function() {
    if(Session.get('eventModal')) {
      let e = Events.findOne( Session.get( 'eventModal' ).event );
      if (e.participants){
        return  e.participants.indexOf(Meteor.userId()) > -1 ? true : false ;
      }
    }
  },
  booked: function() {
    if(Session.get('eventModal')) {
      let e = Events.findOne( Session.get( 'eventModal' ).event );
      if (e.participants){
        if (e.participants.indexOf(Meteor.userId()) === -1) {
          return  Object.keys(e.participants).length === e.maxParticipants ? true : false ;
        } else{
          return false
        }
      }
    }
  },
  waiting: function(){
    if(Session.get('eventModal')) {
      let e = Events.findOne( Session.get( 'eventModal' ).event );
      if (e.waitingList){
        return  e.waitingList.indexOf(Meteor.userId()) > -1 ? true : false ;
      }
    }
  },
  isAdmin: function(){
    return Roles.userIsInRole(Meteor.userId(), 'admin')
  },
  formatStart: function(date){
    return moment(date).format('dddd, MMMM Do YYYY') + ", from " + moment(date).format('HH:mm')
  },
  formatEnd: function(date){
    return moment(date).format('HH:mm')
  },
  coach: function(){
    if(Session.get('eventModal')) {
      let e = Events.findOne( Session.get( 'eventModal' ).event );
      return e.coach
    }
  },
  signedUpParticipants: function(){
    if(Session.get('eventModal')) {
      let e = Events.findOne( Session.get( 'eventModal' ).event );
      return e.participants ? Object.keys(e.participants).length : 0
    }
  },
  waitListCount: function(){
    if(Session.get('eventModal')) {
      let e = Events.findOne( Session.get( 'eventModal' ).event );
      return e.waitingList ? Object.keys(e.waitingList).length : 0
    }
  },
  waitListInFrontOf: function(){
    if(Session.get('eventModal')) {
      let e = Events.findOne( Session.get( 'eventModal' ).event );
      return e.waitingList ? e.waitingList.indexOf(Meteor.userId()) : 0
    }
  },
  participantListItems: function(){
    e = Events.findOne( Session.get( 'eventModal' ).event );
    names = Meteor.subscribe('participants', e._id )
    names = Users.find({_id:{$in:e.participants}}).map(function (obj) {
      return {
          "firstName": obj.profile.firstName,
          "lastName": obj.profile.lastName
      };
    });
    return names;
  },
  tabIsEvent: function(){
    return Session.get('modalSubTemplate') === 'event'
  },
  showIndex: function(index){
    return index + 1;
  }
});

Template.addEditEventModal.events({
  'click #delete-event-button': function(event, template){
    event.preventDefault();
    Modal.show('deleteEventModal')
  },
  'click #add-edit-user-participate': function(event, template){
    event.preventDefault();
    var calendarEvent = Events.findOne( Session.get( 'eventModal' ).event);
    Meteor.call('participate', Meteor.userId(), calendarEvent, function(error, response){
      if (error) {
        $('#add-edit-event-modal').modal('hide')
        FlashMessages.sendError("Cannont participate! " + error);
      } else{
        $('#add-edit-event-modal').modal('hide')
        FlashMessages.sendSuccess("Successfully signed up for event");
      }
    });
  },
  'click #add-edit-user-unsubscribe': function(event, template){
    event.preventDefault();
    var calendarEvent = Events.findOne( Session.get( 'eventModal' ).event);
    Meteor.call('unsubscribe', Meteor.userId(), calendarEvent, function(error, response){
      if (error) {
        $('#add-edit-event-modal').modal('hide')
        FlashMessages.sendError(error);
      } else{
        $('#add-edit-event-modal').modal('hide')
        FlashMessages.sendSuccess("Successfully unsubscribed from event");
      }
    });
  },
  'click #add-edit-user-wait': function(event, template){
    event.preventDefault();
    var calendarEvent = Events.findOne( Session.get( 'eventModal' ).event);
    Meteor.call('goInWaitingList', Meteor.userId(), calendarEvent, function(error, response){
      if (error) {
        $('#add-edit-event-modal').modal('hide')
        FlashMessages.sendError("Cannont go in waiting list! " + error);
      } else{
        $('#add-edit-event-modal').modal('hide')
        FlashMessages.sendSuccess("Successfully added you to waiting List");
      }
    });
  },
  'click #add-edit-user-waitRemove': function(event, template){
    event.preventDefault();
    var calendarEvent = Events.findOne( Session.get( 'eventModal' ).event);
    Meteor.call('waitRemove', Meteor.userId(), calendarEvent, function(error, response){
      if (error) {
        alert('Could not remove from waiting list');
      } else{
        $('#add-edit-event-modal').modal('hide')
        FlashMessages.sendSuccess("Successfully removed entry from waiting list");
      }
    });
  },
  'click #tab-event': function(event, template){
    event.preventDefault();
    $('#tab-event').addClass('active');
    $('#tab-participants').removeClass('active');
    Session.set('modalSubTemplate', 'event');
  },
  'click #tab-participants': function(event, template){
    event.preventDefault();
    $('#tab-event').removeClass('active');
    $('#tab-participants').addClass('active');
    Session.set('modalSubTemplate', 'participants');
  },
  // 'click #users-password-update-submit': function(event, template){
  //   event.preventDefault();
  //   currentPW = $("#password-update-form-current-pw").val()
  //   newPW = $("#password-update-form-new-pw").val()
  //   newPWConf = $("#password-update-form-new-pw-confirmation").val()
  //   if (newPW === newPWConf){
  //     console.log("new PW's are identic")
  //   } else{
  //     console.log("Password missmatch")
  //   }
  // }
});