Template.exerciseOverview.onCreated(function(){
  Session.setDefault('type', 'Barbell');
});

Template.exerciseOverview.onRendered( () => {
  Deps.autorun(function() {
    Meteor.subscribe('exercises', Session.get('type'));
  });
});

Template.exerciseOverview.helpers({
  exercisesList: function(){
  	if(Session.get('type') === 'All') { return Exercises.find({},{sort: {name:1}}).fetch()}
    else { return Exercises.find({type: Session.get('type')},{sort: {name:1}}).fetch() };
  },
  exercisesTitle: function(){
  	return Session.get('type') + ' Exercises'
  }
})

Template.exerciseOverview.events({
  'click #All-type-button': function(event, template){
    Session.set('type', 'All')
    Router.go('exerciseOverview',{}, {query: 'exercisesType=' + Session.get('type')})
  },
  'click #Barbell-type-button': function(event, template){
    Session.set('type', 'Barbell')
    Router.go('exerciseOverview',{}, {query: 'exercisesType=' + Session.get('type')})
  },
  'click #Body-Weight-type-button': function(event, template){
    Session.set('type', 'Body Weight')
    Router.go('exerciseOverview',{}, {query: 'exercisesType=' + Session.get('type')})
  },
  'click #Other-type-button': function(event, template){
    Session.set('type', 'Other')
    Router.go('exerciseOverview',{}, {query: 'exercisesType=' + Session.get('type')})
  },
  'click #add-exercise-button': function(event, template){
    Modal.show('addExerciseModal')
  },
})