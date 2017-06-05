import { Chart } from 'chart'
// http://www.chartjs.org/
// http://stackoverflow.com/questions/42474471/implement-chart-js-plugin-meteor-project

Template.statistics.onCreated(function(){
  Session.set('collapsedMode', $(window).width() < breakWidth );
});

Template.statistics.helpers({
  schema: function(){
    return new SimpleSchema({
      'date': {
        type: Date,
        label: 'Pick a date',
        optional: false,
        autoform: {type: "bootstrap-datepicker"}
      },
    });
  }, 
  referenceDate: function(){
    return moment(this.referenceDate).format('ddd, MMM Do')
  },
  referenceWeek: function(){
    return moment(this.referenceDate).startOf('isoWeek').format('MMM Do') + ' - ' + moment(this.referenceDate).endOf('isoWeek').format('MMM Do')
  },
  referenceMonth: function(){
    return moment(this.referenceDate).startOf('month').format('MMMM')
  },
  collapsedMode: function(){
    return Session.get('collapsedMode');
  },
})

Template.statistics.events({
  'submit form': function( event ){
    event.preventDefault();
    Router.go('statistics',{}, {query: 'referenceDate=' + event.target.date.value})
  },
  'click #export-data': function(event, template){
    $( event.target ).button( 'loading' );
    Meteor.call('generateDailyEventParticipantsStats', this.referenceDate.toDate(), function(error, response){
      if (error) {
        FlashMessages.sendError("Cannont compute statistics! " + error);
        $( event.target ).button( 'reset' );
      } else{
        var cvsFile = Papa.unparse(response);
        fileName = 'EventUserStatistics_' + moment(this.referenceDate).format('YYYYMMDD-HHmm') + '.csv'
        var dl = document.createElement('a');
        dl.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(cvsFile));
        dl.setAttribute('download', fileName);
        dl.click();
        $( event.target ).button( 'reset' );
      }
    });
  },
});

// run the a function everytime the resizes the window
$(window).resize(function (e) { //set window resize listener
  Session.set('collapsedMode', $(window).width() < breakWidth );
});
