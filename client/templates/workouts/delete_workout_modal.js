Template.deleteWorkoutModal.events({
  'click #workout-delete-modal-yes': function(event, template){
    event.preventDefault();
    Meteor.call('deleteWorkout', Session.get( 'currentWorkout' ), function(error, response){
      if (error) {
        alert('Could not delete workout');
      } else{
        FlashMessages.sendSuccess("Successfully deleted workout");
      }
    });
    Modal.hide('deleteWorkoutModal');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  },
  'click #workout-delete-modal-no': function(event, template){
    event.preventDefault();
    Modal.hide();
  },
});