let dateRange = 5;
let weekRange = 5;
let monthRange = 3;

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    yieldTemplates: {
        navigation: {to: 'nav'},
        // myFooter: {to: 'footer'},
    }
});

AccountsTemplates.configure({
  defaultLayout: 'layout',
  enablePasswordChange: true,
  hideSignUpLink: false
});
AccountsTemplates.configureRoute('signIn');

Router.route('/signup', {
  name: 'signupForm'
});

Router.route('/emailVerification', {
  name: 'emailVerification'
});

Router.route('/resetPassword', {
  name: 'resetPassword'
});

Router.route('/changePassword', {
  name: 'changePassword'
});

Router.route('/statistics', {
  name: 'statistics',
  waitOn: function() {
    var subscription = []
    var referenceDate = this.params.query.referenceDate
    if (Roles.userIsInRole(Meteor.user(), ['admin'])) {
      subscription.push(Meteor.subscribe('monthlyUserStats', referenceDate, monthRange))
    }
    return subscription
  },
 data: function(){
   if (Roles.userIsInRole(Meteor.user(), ['admin'])) {
      var dailyUserStats = [];
      var days = [];
      var weeklyUserStats = [];
      var weeks = [];
      var monthlyUserStats = [];
      var months = [];
      var types = {};
      var dailyTypeStats = [];
      var dailyTypes = [];
      if (this.params.query.referenceDate) { var referenceDate = moment(this.params.query.referenceDate)
        } else { var referenceDate = moment() }
      for (i = -dateRange; i <= dateRange; i++) {
        day = moment(referenceDate).add(i, 'days')
        days.push(day.format('ddd MMM Do'))
        list = Events.find({start: {$gte: moment(day).startOf('day').toDate(), $lt: moment(day).endOf('day').toDate()}}).fetch()
        dailyUserStats.push( (list.map(function(e) {return e.participants.length;})).reduce(function(pv, cv) { return pv + cv; }, 0) )
        if(i===0) {
          typeCounts = list.map(function(e) { return types[e.type] = (isNaN(types[e.type]) ? 0 : types[e.type]) + e.participants.length;})
          dailyTypes = Object.keys(types)
          dailyTypeStats = Object.values(types)
        }
      }
      for (i = -weekRange; i <= weekRange; i++) { 
        day = moment(referenceDate).add(i*7, 'days')
        weeks.push(moment(day).startOf('isoWeek').format('MMM Do') + ' - ' + moment(day).endOf('isoWeek').format('MMM Do'))
        list = Events.find({start: {$gte: moment(day).startOf('isoWeek').toDate(), $lt: moment(day).endOf('isoWeek').toDate()}}).fetch()
        weeklyUserStats.push( (list.map(function(e) {return e.participants.length;})).reduce(function(pv, cv) { return pv + cv; }, 0) )
        if(i===0) {
          typeCounts = list.map(function(e) { return types[e.type] = (isNaN(types[e.type]) ? 0 : types[e.type]) + e.participants.length;})
          weeklyTypes = Object.keys(types)
          weeklyTypeStats = Object.values(types)
        }
      }
      for (i = -monthRange; i <= monthRange; i++) { 
        day = moment(referenceDate).startOf('month').add(i, 'months')
        months.push(moment(day).startOf('month').format('MMMM'))
        list = Events.find({start: {$gte: moment(day).startOf('month').toDate(), $lt: moment(day).endOf('month').toDate()}}).fetch()
        monthlyUserStats.push( (list.map(function(e) {return e.participants.length;})).reduce(function(pv, cv) { return pv + cv; }, 0) )
        if(i===0) {
          typeCounts = list.map(function(e) { return types[e.type] = (isNaN(types[e.type]) ? 0 : types[e.type]) + e.participants.length;})
          monthlyTypes = Object.keys(types)
          monthlyTypeStats = Object.values(types)
        }
      }
      return {referenceDate, days, weeks, months, dailyUserStats, weeklyUserStats, monthlyUserStats, dailyTypes, dailyTypeStats, weeklyTypes, weeklyTypeStats, monthlyTypes, monthlyTypeStats}
    } else {
      return {};
    }
  }
});

Router.route('/', {
  name: 'main',
  waitOn: function(daysLimit = 8) {
    return Meteor.subscribe('events', daysLimit);
  }
});

Router.route('user', {
  path: 'user/:_id',
  waitOn: function() {
    return [
      Meteor.subscribe('user', this.params._id),
      Meteor.subscribe('userTransactions', this.params._id),
      Meteor.subscribe('userRegisteredEvents', this.params._id),
      Meteor.subscribe('userWaitingListEvents', this.params._id)
    ]
  },
  data: function () {
    return {
      userInfo: Users.findOne({_id: this.params._id}),
      userTransactions: Transactions.find({userId: this.params._id}).fetch(),
      userRegisteredEvents: Events.find({participants: this.params._id, start: {$gte: moment().toDate()}}).fetch(),
      userWaitingListEvents: Events.find({waitingList: this.params._id, start: {$gte: moment().toDate()}}).fetch(),
    };
  }
});

Router.route('/userlist', {
  name: 'userList',
  waitOn: function() {
    return Meteor.subscribe('user_list', Meteor.userId());
  }
});

Router.route('/calendar', {
  name: 'calendar'
});

Router.route('/exerciseOverview', {
  name: 'exerciseOverview',
  waitOn: function() {
    var exercisesType = this.params.query.exercisesType;
    return Meteor.subscribe('exercises', exercisesType);
  }
});

Router.route('/exercise/:_id', {
  name: 'exercise',
   waitOn: function() {
    return [
      Meteor.subscribe('exercise', this.params._id),
      Meteor.subscribe('workoutsList', this.params._id, Meteor.userId())
    ];
  },
  data: function() {
    return {
      exercise: Exercises.findOne(this.params._id),
      workoutsList: Workouts.find({exerciseId: this.params._id, userId: Meteor.userId()})
    }
  }
});

Router.route('/help', {
  name: 'help'
});

// Protect all Routes
Router.onBeforeAction('dataNotFound');
Router.plugin('ensureSignedIn', {
    except: ['main', 'signupForm', 'help','emailVerification', 'resetPassword']//, 'atSignIn', 'atSignUp', 'atForgotPassword']
});
