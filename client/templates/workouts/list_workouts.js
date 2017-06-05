Template.listWorkouts.created = function() {
  Session.set('workoutsSorting', {weight:-1});
  Session.set('currentExerciseId', "");
  Session.set('currentWorkout', []);
}

Template.listWorkouts.helpers({
  humanDate: function(date) {
    return moment(date).format("DD.MM.YYYY");
  },
  workoutsList: function() {
    sorting = Session.get('workoutsSorting');
    list = this.workoutsList.collection.find({}, {sort: sorting}).fetch();
    return list;
  },
  noWorkoutsYet: function(){
    return this.workoutsList.collection.find().fetch().length <= 0
  }
});

Template.listWorkouts.events({
  'click #workout-date-sort': function(event, Template){
    event.preventDefault();
    Session.set('workoutsSorting', {date:-1});
   },
  'click #workout-weight-sort': function(event, Template){
    event.preventDefault();
    Session.set('workoutsSorting', {weight:-1});
   },
  'click #workout-reps-sort': function(event, Template){
    event.preventDefault();
    Session.set('workoutsSorting', {reps:-1});
   },
  'click #workout-edit': function(event, Template){
    event.preventDefault();
    Session.set('currentWorkout', this);
    Session.set('exerciseSubtemplate', 'workoutUpdate');
  },
  'click #edit-workout-modal': function(event, Template){
    event.preventDefault();
    Session.set('currentWorkout', this);
    Modal.show('editWorkoutModal')
  },
});