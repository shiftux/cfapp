AutoForm.hooks({
  'edit-form': {
    onSuccess: function (operation, result, template) {
      FlashMessages.sendSuccess('Workout updated successfully!');
    },
    onError: function(operation, error, template) {
      FlashMessages.sendSuccess('Workout update failed!');
      console.log(error);
    }
  }
});

Template.editWorkoutModal.helpers({
  currentWorkout: function(){
    return Session.get('currentWorkout');
  }
});

Template.editWorkoutModal.events({
  'submit form': function(event, template){

    Session.set('exerciseSubtemplate', 'listWorkouts');
    Modal.hide();
    $('#edit-workout-modal').modal('hide');
  },
  'click #delete-workout-button': function(event, template){
    event.preventDefault();
    $('#edit-workout-modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#delete-workout-modal').modal('show');
  }
});