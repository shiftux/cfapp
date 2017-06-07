Meteor.methods({
  participate: function(userId, event) {
    if(userId != this.userId){throw new Meteor.Error(777, 'Unauthorized', 'Unauthorized')} 
    ok = false
    noOverlap = false
    inThePast = true
    Meteor.call('subscriptionOK', userId, event, function(error, result){
      if(error){throw new Meteor.Error(701, 'Not enough credit', 'You need to buy more credit!')}
      else{ok = result}
    })
    Meteor.call('checkNoOverlap', userId, event, function(error, result){
      if(error){throw new Meteor.Error(702, 'Overlapping', 'You cannot sign up to multiple events simultaneously!')}
      else{noOverlap = result}
    })
    Meteor.call('checkInThePast', userId, event, function(error, result){
      if(error){throw new Meteor.Error(703, 'Event Past', 'You cannot sign up to an event in the past!')}
      else{inThePast = result}
    })
    if(!ok) {throw new Meteor.Error('', 'You have no entries left! Speak to your coach.')}
    if(!noOverlap) {throw new Meteor.Error('', 'You cannot sign up to multiple events simultaneously!')}
    if(inThePast) {throw new Meteor.Error('', 'You cannot sign up to an event in the past!')}
    let e = Events.findOne( event );
    var array = e.participants
    if (array){
      array.push(userId)
    } else {
      array = [userId]
    }
    length = array.length
    Events.update({_id: event._id}, {$set:{participants: array, participantsCount: length}});
    count = 0
    Meteor.call('numberOfParticipationsToday', userId, event, function(error, result){count = result})
    if(typeof count === 'undefined'){throw new Meteor.Error('Cannot evaluate numberOfParticipationsToday', 'Cannot evaluate number of entries for this user')}
    if(count <= 1){
      Transactions.insert({userId: userId, eventId: event._id, reason: 'participate', modification: -1 });
    }
  },
  unsubscribe: function(userId, event, force = false){ // force is for user deletion, if not the events that are in the past cannot be unsubscribed
    if(userId !== this.userId && !Roles.userIsInRole(this.userId, 'admin')){throw new Meteor.Error(777, 'Unauthorized', 'Unauthorized')} 
    let e = Events.findOne( event );
    let signoutDelayElapsed = true
    Meteor.call('signoutDelayElapsed', e, function(error, result){
      if(error){console.log(error)}
      else{signoutDelayElapsed = result}
    })
    if(!signoutDelayElapsed || force){
      var array = e.participants;
      var index = array.indexOf(userId);
      if(index > -1) array.splice(index,1);
      length = array.length
      Events.update({_id: event._id}, {$set:{participants: array, participantsCount: length}}, function( error, result) {
        if ( error ) { console.log ( error ); return false }
        if ( result && moment(event.start).isAfter(moment()) ) {
          Meteor.call('bumpFromWaitingList',e,function( error, result) {
            if ( error ) { console.log ( error ); return false }
          });
          // notification email
        }
      });
      count = 0
      Meteor.call('numberOfParticipationsToday', userId, event, function(error, result){count = result})
      if(count === 0){
        Transactions.insert({userId: userId, eventId: event._id, reason: 'unsubscribe', modification: 1 })
      }
    } else {
      throw new Meteor.Error(555, 'You are too late to sign out (' + signoutDelay + ' hours)');
      return false
    }
    return true
  },
  goInWaitingList: function(userId, event){
    if(userId != this.userId){throw new Meteor.Error(777, 'Unauthorized', 'Unauthorized')} 
    ok = false
    noOverlap = false
    Meteor.call('subscriptionOK', userId, event, function(error, result){
      if(error){throw new Meteor.Error(701, 'Not enough credit', 'You need to buy more credit!')}
      else{ok = result}
    })
    Meteor.call('checkNoOverlap', userId, event, function(error, result){
      if(error){throw new Meteor.Error(702, 'Overlapping', 'You cannot sign up to multiple events simultaneously!')}
      else{noOverlap = result}
    })
    if(!ok) {throw new Meteor.Error('', 'You have no entries left! Speak to your coach.')}
    if(!noOverlap) {throw new Meteor.Error('', 'You cannot sign up to multiple events simultaneously!')}
    let e = Events.findOne( event );
    if(moment().isBefore(e.start)){
      var array = e.waitingList
      if (array){
        array.push(userId)
      } else {
        array = [userId]
      }
      Events.update({_id: event._id}, {$set:{waitingList: array}});
    }
  },
  waitRemove: function(userId, event){
    if(userId != this.userId){throw new Meteor.Error(777, 'Unauthorized', 'Unauthorized')} 
    let e = Events.findOne( event );
    var array = e.waitingList;
    var index = array.indexOf(userId);
    if(index > -1) array.splice(index,1);
    Events.update({_id: event._id}, {$set:{waitingList: array}});
  },
  bumpFromWaitingList: function(event){
    var waitArray = event.waitingList;
    var participantsArray = event.participants;
    if (waitArray && Object.keys(waitArray).length > 0 && Object.keys(participantsArray).length < event.maxParticipants){
      var bumper = waitArray.shift();
      participantsArray.push(bumper);
      Events.update({_id: event._id}, {$set:{waitingList: waitArray, participants: participantsArray}})
      count = 0
      Meteor.call('numberOfParticipationsToday', bumper, event, function(error, result){count = result})
      if(count <= 1){
        Transactions.insert({userId: bumper, eventId: event._id, reason: 'bumped', modification: -1 });
      }
      Meteor.call('bumpedFromWaitingListMail', Users.findOne(bumper).emails[0].address, event, function( error, result) {
        if ( error ) { console.log ( error ); return false }
      });
    } else {
      return 0
    }
  },
  deleteEvent: function(userId, event){
    if(userId != this.userId){throw new Meteor.Error(777, 'Unauthorized', 'Unauthorized')} 
    if(Roles.userIsInRole(Meteor.userId(), 'admin')){
      if(Object.keys(event.waitingList).length === 0 && Object.keys(event.participants).length === 0){
        Events.remove({_id: event._id});
      }
    }
  },
  subscriptionOK: function(userId, event){
    if(userId != this.userId){throw new Meteor.Error(777, 'Unauthorized', 'Unauthorized')} 
    user = Users.findOne(userId)
    if(user.subscription.subscriptionType === 'Subscription'){
      if(moment(user.subscription.startOfSubscription).isAfter(moment(event.start)) ||
        moment(user.subscription.endOfSubscription).isBefore(moment(event.start))){
        return false //throw new Meteor.Error(703, 'No subscription', 'Your subscription is not valid at the date of the event!')
      } else {
        return true
      }
    } else { // type Single Entries
      count = 0;
      Meteor.call('computeCredit', userId, function(error, result){
        if(error) {throw new Meteor.Error(704, 'Cannot compute credit', error)}
        else {count = result}
      })
      if(count < -2 || typeof count === 'undefined'){
        // throw new Meteor.Error(705, 'Not enough credit', 'Your credit is too low to subscribe to this event!')
        return false
      } else {
        return true
      }
    }
  },
  checkNoOverlap: function(userId, event){
    overlap = false
    otherEventsThatDayWithThisParticipant = Events.find({participants: userId, 
      start: {$gte: moment(event.start).startOf('day').toDate(), $lt: moment(event.start).endOf('day').toDate()}}).fetch()
    if(otherEventsThatDayWithThisParticipant.length === 0) return true
    otherEventsThatDayWithThisParticipant.forEach(function(eventB){
      Meteor.call('overlap', event, eventB, function(error, result){
        if(error){console.log(error)}
        else {overlap = result}
      })
    })
    return !overlap
  },
  checkInThePast: function(userId, event){
    return moment(event.start).isBefore(moment())
  },
  numberOfParticipationsToday: function(userId, event){
    return Events.find({participants: userId, 
      start: {$gte: moment(event.start).startOf('day').toDate(), $lt: moment(event.start).endOf('day').toDate()}}).fetch().length
  },
  signoutDelayElapsed: function(event){
    return moment().isAfter(moment(event.start).subtract(signoutDelay, 'hours'))
  },
  // overlap if (StartA <= EndB)  and  (EndA >= StartB)
  overlap: function(eventA, eventB){
    return (moment(eventA.start) < moment(eventB.end)) && (moment(eventA.end) > moment(eventB.start))
  }
});