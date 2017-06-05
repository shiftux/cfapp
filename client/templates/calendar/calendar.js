// based on:
// https://themeteorchef.com/snippets/reactive-calendars-with-fullcalendar/
// resizing described here:
// http://stackoverflow.com/questions/28111602/change-fullcalendar-view-and-header-options-based-on-viewport-width

let daysIncrement = 8;
let startTime = moment();
let groupedList = [];
let dateFormat = "dddd, MMMM Do YYYY"

let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( moment(date) );
};

let getColor = (type) => {
  switch(type) {
    case 'Workout of the Day':
      return '#34495E'
      break;
    case 'Yoga':
      return '#38407F'
      break;
    case 'Open Gym':
      return '#50703C'
      break;
    case 'Master Klasse':
      return '#87BD65'
      break;
    case 'Special Event':
      return '#70D1FF'
      // return '#E27BE5'
      break;
    case 'Advanced Klasse':
      return '#38687F'
      break
    case 'Weight Lifting Klasse':
      return '#7081FF'
      break
    default:
      return '#4398DB'
  }
}

let options = {
  firstDay: 1,
  allDaySlot: false,
  slotLabelFormat: 'HH:mm',
  defaultView: 'agendaWeek',
  slotEventOverlap: false,
  views: {
    agendaWeek: {
      titleFormat: 'MMMM D, YYYY',
      minTime: '06:00:00',
      maxTime: '22:00:00',
      columnFormat: 'ddd, D'
    },
    agendaDay: {
      titleFormat: 'MMMM D, YYYY',
      minTime: '06:00:00',
      maxTime: '22:00:00'
    }
  },
  customButtons: {
    listButton: {
      text: 'List',
      // click: function() {
      // }
    }
  },
  header: {
    right: 'listButton agendaDay agendaWeek month today prev,next'
  },
  events( start, end, timezone, callback ) { // full-calendar specific method (can also be an array)
    let data = Events.find().fetch().map( ( event ) => {
      if(!isPast(event.start)){
        event.editable = false;
        event.backgroundColor = getColor(event.type);
        if(event.title === 'Workout of the Day') event.title = 'WOD';
        return event;
      }
    });
    data = data.filter(function( element ) {return element !== undefined;});
    if ( data ) { // if data is available, update the calendar, callback is an argument in this function
      callback( data );
    }
  },
  eventRender( event, element ) { // format the appearance of events
    participants = event.participants ? Object.keys(event.participants).length : 0
    element.find( '.fc-content' ).html(
      `<p class="type-${ event.type.replace(/ /g,'') }">${ event.title } </p>
       <p class="guest-count">${ participants } of ${ event.maxParticipants }</p>
      `
    );
    if ($.inArray(Meteor.userId(), event.participants) >= 0){
      element.find( '.fc-content' ).parent().css('border-color', '#E09DE3')
      element.find( '.fc-content' ).parent().css('border-width', '3px')
    }
    if ($.inArray(Meteor.userId(), event.waitingList) >= 0){
      element.find( '.fc-content' ).parent().css('border-color', '#84F5FF')
      element.find( '.fc-content' ).parent().css('border-width', '3px')
    }
  },
  eventAfterAllRender: function(view){
    if('agendaDay'===view.name){
      if($('.fc-time-grid-event').length>0){
        var renderedEvents = $('div.fc-event-container a');
        $('div.fc-scroller').animate({
          scrollTop: renderedEvents&&renderedEvents.length>0?renderedEvents[0].offsetTop:0 + 20
        }, 50);
      }
    }
  },
  dayClick( date ) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')){
      Session.set( 'eventModal', { type: 'add', date: date.format() } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    }
  },
  eventClick( event ) {
    if (Meteor.user()){
      Session.set( 'eventModal', { type: 'edit', event: event._id } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    } else {
      FlashMessages.sendError("Must be signed in to view events");
      Router.go('/sign-in')
    }
  },
}

Template.calendar.onCreated(function(){
  this.isListView = new ReactiveVar( $(window).width() < breakWidth );
  Session.setDefault('daysLimit', 2*daysIncrement);
});

Template.calendar.onRendered( () => {
  this.$('#events-calendar').fullCalendar(options);
  recreateFC($(window).width());
  // go to the first page with an event
  if ($('.fc-time-grid-event').length === 0){
    $('.fc-next-button').click()
  }

  Tracker.autorun( () => { // a reactive data source that will force Tracker to automatically re-run this function whenever it changes
    Events.find().fetch();
    $( '#events-calendar' ).fullCalendar( 'refetchEvents' );
  });

  Deps.autorun(function() {
    Meteor.subscribe('events', Session.get('daysLimit'));
  });
});

Template.calendar.items = function() {
  return items.find();
}

Template.calendar.helpers({
  templateGestures: {
    'swiperight .fc-view-container': function (event, templateInstance) {
      event.preventDefault()
      $('.fc-prev-button').click()
    },
    'swipeleft .fc-view-container': function (event, templateInstance) {
      event.preventDefault()
      $('.fc-next-button').click()
    },
  },
  isListView: function(){
    return Template.instance().isListView.get();
  },
  eventListKeys:function(){
    groupedList = _.groupBy( Events.find({},{sort: {start: 1}}).fetch(), 
      function(obj){ return moment(obj.start).format(dateFormat) })
    return Object.keys(groupedList)
  },
  eventListPerDay: function(date){
    return groupedList[date]
  }, 
  moreResults: function(){
    return !(Events.find().count() < Session.get("itemsLimit"));
  }
})

Template.calendar.events({
  'click #calendar-button': function(event, template){
    Template.instance().isListView.set(false)
    $("#events-calendar").css({"visibility": "visible"});
  },
  'click .fc-listButton-button': function(event, template){
    $("#events-calendar").css({"visibility": "hidden"});
    Template.instance().isListView.set(true)
  },
  'click #events-list-item': function(event, template){
    if (Meteor.user()){
      Session.set( 'eventModal', { type: 'edit', event: this._id } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    } else {
      FlashMessages.sendError("Must be signed in to view events");
      Router.go('/sign-in')
    }
  },
  'click .fc-icon-right-single-arrow': function(event, template){
    Session.set('daysLimit', Session.get('daysLimit') + daysIncrement);
    Meteor.subscribe('events', Session.get('daysLimit'));
  },
})

// listeners
// run the showMoreVisible function everytime the user scrolls
$(window).scroll(function(e) {
  showMoreVisible()
});

// run the a function everytime the resizes the window
$(window).resize(function (e) { //set window resize listener
  recreateFC($(window).width()); //or you can use $(document).width()
});

let showMoreVisible = () => {
  var threshold, target = $("#showMoreResults");
  if (!target.length) return;
  threshold = $(window).scrollTop() + $(window).height() - target.height();
  if (target.offset().top < threshold) {
    if (!target.data("visible")) {
      target.data("visible", true);
      Session.set("daysLimit", Session.get("daysLimit") + daysIncrement);
    }
  } else {
    if (target.data("visible")) {
      target.data("visible", false);
    }
  }
}

let recreateFC = (screenWidth) => { // This will destroy and recreate the FC taking into account the screen size
  if (screenWidth < breakWidth) {
    $('.fc-listButton-button').click()
  } else {
    $('.fc-agendaWeek-button').click()
  }
}

Template.eventsPerDay.helpers({
  eventsPerDay: function(){
  startTime = moment(this.day, dateFormat).startOf('day').toDate()
  endTime = moment(this.day, dateFormat).endOf('day').toDate()
    return Events.find({start: {$gte: startTime, $lt: endTime}}, {sort: {start: 1}}).fetch()
  },
  participating: function(event){
    return ($.inArray(Meteor.userId(), event.participants) >= 0) ?  '<b style="color:#E09DE3;font-size:200%;">\u2022 </b>' : ""
  },
  waiting: function(event){
    return ($.inArray(Meteor.userId(), event.waitingList) >= 0) ?  '<b style="color:#84F5FF;font-size:200%;">\u2022 </b>' : ""
  },
  startTime: function(dateTime){
    return moment(dateTime).format('HH:mm')
  },
})