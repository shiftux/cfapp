Meteor.methods({
  'insertUser' : function(doc) {
    check(doc, Schema.createUserFormSchema);
    // `doc` will contain the fields in the `Schema.createUserFormSchema`
    var newUser = Accounts.createUser({email: doc.email, password: doc.password,
      profile:{firstName: doc.firstName, lastName: doc.lastName }})
    return newUser
  },
  'deleteUser': function(userId){
    if(userId === this.userId && Roles.userIsInRole(this.userId, 'admin')) { throw new Meteor.Error(604, 'Cannot delete Admin', 'The admin user cannot be deleted') }
    if(userId !== this.userId && !Roles.userIsInRole(this.userId, 'admin')) { throw new Meteor.Error(603, 'Not allowed', 'Users can only delete themselves') }
    var ok = false
    Meteor.call('removeFromAllEvents', userId, function(error, result){
      if(error) { console.log(error); ok = false }
      if(result){ ok = true }
    })
    if(!ok) { throw new Meteor.Error(601, 'Failed', 'Cannot delete user!'); }
    else{
      Transactions.remove({userId: userId})
      Users.remove({_id: userId})
    }
    return userId
  },
  updateSubscription: function(subscriptionUserId, startDate, endDate){
    if(!Roles.userIsInRole(this.userId, 'admin')) { throw new Meteor.Error(602, 'Not an Admin', 'Only Admin may update subscription') }
    var subscriptionDoc = {subscriptionType: "Subscription", startOfSubscription: startDate, endOfSubscription: endDate, additionalEntries: 0 }
    Users.update({_id: subscriptionUserId}, {$set: {subscription: subscriptionDoc}}) // errors are automatically thrown and the function returns if needed!
    return subscriptionUserId
  },
  'updateSubscriptionEntries': function(subscriptionUserId, additionalEntries){
    if(!Roles.userIsInRole(this.userId, 'admin')) { throw new Meteor.Error(602, 'Not an Admin', 'Only Admin may update subscription') }
    var subscriptionDoc = {subscriptionType: 'Single Entries', startOfSubscription: moment().toDate(), endOfSubscription: moment().toDate(), additionalEntries: 0 }
    var transactionDoc = {userId: subscriptionUserId, modification: additionalEntries, reason: 'boughtEntries'}
    Users.update({_id: subscriptionUserId}, {$set: {subscription: subscriptionDoc}})
    Transactions.insert(transactionDoc)
    return subscriptionUserId
  },
  'computeCredit': function(userId){
    if (!Roles.userIsInRole(this.userId, 'admin') && typeof this.connection !== 'undefined') {
      if (this.userId !== userId) {throw new Meteor.Error(602, 'Not an Admin', 'Only admin may view credit of other users') }
    }
    var count = 0;
    Transactions.find({userId: userId}).fetch().forEach(function(t){
      count = count + t.modification;
    })
    return count;
  },
  'removeFromAllEvents': function(userId){
    if(userId !== this.userId && !Roles.userIsInRole(this.userId, 'admin')){throw new Meteor.Error(666, 'Unauthorized', 'Unauthorized')}
    ok = false
    if(Events.find({participants: userId}).fetch().length === 0){ok = true}
    Events.find({participants: userId}).forEach(function(e){  //, start: {$gte: moment().format('YYYY-MM-DDTHH:mm')}}).forEach(function(e){
      Meteor.call('unsubscribe', userId, e, true, function(error, result){ //true is the force parameter
        if(error) { ok = false; console.log(error) }
        if(result){ ok = true }
      });
    });
    if(!ok){throw new Meteor.Error(606, 'Cannot unsubscribe', 'Cannot remove from all events!');}
    return true
  },
  getAllUserEmails: function() {
    return Users.find().fetch().map(function(u){return u.emails[0].address})
  }
});