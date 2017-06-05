Meteor.methods({
  'deleteExercise': function(exercise){
    if(!Roles.userIsInRole(this.userId, 'admin')) { throw new Meteor.Error(603, 'Not allowed', 'Only Admin can delete exercises!') }
    Workouts.remove({exerciseId: exercise._id})
    Exercises.remove({_id: exercise._id})
  },
});