Template.editExerciseModal.helpers({
  currentExercise: function(){
    return Session.get('currentExercise');
  }
});

Template.editExerciseModal.events({
  'submit form': function( event ){
   	Modal.hide()
  },
  'click #delete-exercise-button': function(event, template){
  	event.preventDefault();
    $('#edit-exercise-modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#delete-exercise-modal').modal('show');
  }
});