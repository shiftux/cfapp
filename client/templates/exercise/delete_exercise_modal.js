Template.deleteExerciseModal.events({
  'click #exercise-delete-modal-yes': function(event, template){
    event.preventDefault();
    Meteor.call('deleteExercise', Session.get( 'currentExercise' ), function(error, response){
      if (error) {
        alert('Could not delete event');
      } else{
        FlashMessages.sendSuccess("Successfully deleted exercise");
        Router.go('exerciseOverview', {});
      }
    });
    Modal.hide('deleteExerciseModal');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  },
  'click #exercise-delete-modal-no': function(event, template){
    event.preventDefault();
    Modal.hide();
  },
});
