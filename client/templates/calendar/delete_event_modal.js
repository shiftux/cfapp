Template.deleteEventModal.events({
  'click #event-delete-modal-yes': function(event, template){
    event.preventDefault();
    Meteor.call('deleteEvent', Meteor.userId(), Events.findOne( Session.get( 'eventModal' ).event), function(error, response){
      if (error) {
        alert('Could not delete event');
      } else{
        $('#add-edit-event-modal').modal('hide')
        FlashMessages.sendSuccess("Successfully deleted event");
      }
    });
    Router.go('main', {});
    Modal.hide('deleteEventModal');
  },
  'click #event-delete-modal-no': function(event, template){
    event.preventDefault();
    Modal.hide();
  },
});
