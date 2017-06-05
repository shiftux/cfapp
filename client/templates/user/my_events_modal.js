Template.myEventsModal.helpers({
  myEvents: function(){
    return Session.get('userRegisteredEvents')
  },
  empty: function(){
    return Session.get('userRegisteredEvents').length === 0
  },
  myWaitingList: function(){
    return Session.get('userWaitingListEvents')
  },
  waitingEmpty: function(){
    return Session.get('userWaitingListEvents').length === 0
  },
});

Template.myEventsModal.events({
  'click #my-events-event-link': function(event, template){
    event.preventDefault();
    Modal.hide();
    if (Meteor.user()){
      Session.set( 'eventModal', { type: 'edit', event: this._id } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    }
  },
  'click #my-waitingList-event-link': function(event, template){
    event.preventDefault();
    Modal.hide();
    if (Meteor.user()){
      Session.set( 'eventModal', { type: 'edit', event: this._id } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    }
  }
});
