Template.weightsTableWorkouts.onCreated(function(){
  list = this.data.workoutsList.fetch()
  maxValue = Math.max.apply(Math,list.map(function(l){return l.weight;}));
  if (maxValue < 0)
    maxValue = 0;
  this.referenceWeight = new ReactiveVar(maxValue);
});

Template.weightsTableWorkouts.helpers({
  referenceWeight: function(){
    return Template.instance().referenceWeight.get();
  },
  percentage: function(){
    var percentages = [];
    for (var i = 95; i > 25; i=i-5) {
        percentages.push({
            p: i,
            pkg: Template.instance().referenceWeight.get() * i / 100,
            plb: Math.round((Template.instance().referenceWeight.get() * i / 100 * 2.2046) * 100) / 100
        });
    }
    return percentages;
  }
});

Template.weightsTableWorkouts.events({
  'change input': function(e,t) {
    t.referenceWeight.set(e.target.value);
  }
});