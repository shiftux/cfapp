Template.exercise.created = function() {
  Session.set('exerciseSubtemplate', 'listWorkouts');
  Session.set('currentExercise', this.data.exercise);
}

Template.exercise.helpers({
  name: function(){
    return this.exercise.name;
  },
  description: function(){
    return this.exercise.description;
  },
  subtemplate: function(template){
    return Session.equals('exerciseSubtemplate', template);
  },
  videoPresent: function(){
    return !(this.exercise.videoId === undefined)
  }
});

Template.exercise.events({
  'click #edit-exercise-button': function(event, template){
    event.preventDefault();
    Session.set('currentExercise', this.exercise);
    Modal.show('editExerciseModal')
  },
  'click #exercise-video-button': function(event, template){
    event.preventDefault();
    Modal.show('playMovieModal')
  },
  'click #exercise-workouts': function(event, template){
    event.preventDefault();
    Session.set('exerciseSubtemplate', 'listWorkouts');
  },
  'click #exercise-weights-table-workout': function(event, template){
    event.preventDefault();
    Session.set('exerciseSubtemplate', 'weightsTableWorkouts');
  },
  'click #exercise-chart-workout': function(event, template){
    event.preventDefault();
    Session.set('exerciseSubtemplate', 'chartWorkouts');
  },
  'click #exercise-submit-workout': function(event, template){
    event.preventDefault();
    Session.set('exerciseSubtemplate', 'addWorkout');
  },
});
