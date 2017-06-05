Meteor.methods({
  'deleteWorkout': function(workout){
    if(!workout.userId === this.userId) { throw new Meteor.Error(603, 'Not allowed', 'You may only delete your own workouts!') }
    Workouts.remove({_id: workout._id})
  },
});