AutoForm.hooks({
  'edit-form': {
    onSuccess: function (operation, result, template) {
      FlashMessages.sendSuccess('Workout saved successfully!');
    },
    onError: function(operation, error, template) {
      FlashMessages.sendSuccess('Workout could not be saved!');
      console.log(error);
    }
  }
});

Template.addWorkout.events({
  'submit form': function(event, template){
    event.preventDefault();
    workoutAttributes = {
      exerciseId: Session.get('currentExercise')._id,
      reps: event.target.reps.value,
      date: new Date(event.target.date.value),
      weight: event.target.weight.value,
      time: event.target.time.value,
      notes: event.target.notes.value,
      userId: Meteor.user()._id
    };
    Workouts.insert(workoutAttributes);
    Session.set('exerciseSubtemplate', 'listWorkouts');
  }
});
