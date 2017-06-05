AutoForm.hooks({
  'users-profile-form': {
    onSuccess: function (operation, result, template) {
      FlashMessages.sendSuccess("Successfully updated user info");
    },
    onError: function(operation, error, template) {
      FlashMessages.sendError("Failed to update user info! " + error);
      console.log(error);
    }
  },
  'users-email-form': {
    onSuccess: function (operation, result, template) {
      FlashMessages.sendSuccess("Successfully updated user email");
    },
    onError: function(operation, error, template) {
      FlashMessages.sendError("Failed to update email! " + error);
      console.log(error);
    }
  },
});

Template.user.created = function() {
  if(this.data.userInfo.subscription.subscriptionType==="Subscription"){
    var start=moment(this.data.userInfo.subscription.startOfSubscription)
    var end=moment(this.data.userInfo.subscription.endOfSubscription)
    var total = end.diff(start, 'days')
    var remaining = end.diff(moment(), 'days')
    var userProgressText = remaining + " days left"
  }else{ // Single Entries
    var remaining = 0
    var total = 12
    this.data.userTransactions.forEach(function(t){
      remaining = remaining + t.modification;
    })
    var userProgressText = remaining + " entries left"
  }
  var allEntries = 0
  this.data.userTransactions.forEach(function(t){
    if(t.modification === -1) allEntries = allEntries + 1;
  })
  Session.set('progressPercent', remaining/total*100)
  Session.set('progressText', userProgressText)
  Session.set('userRegisteredEvents', this.data.userRegisteredEvents)
  Session.set('userWaitingListEvents', this.data.userWaitingListEvents)
  Session.set('collapsedMode', $('.navbar-toggle.collapsed').is(":visible"))
}

Template.user.rendered = function(){
  if(Session.get('progressPercent')<0){$(".progress-circular-bar").css("fill", "#FF5B68")}
}

Template.user.helpers({
  userDoc: function(){
    return this.userInfo
  },
  sameUser: function(){
    return this.userInfo._id === Meteor.userId()
  },
  updatePassword: function(){
    return Schema.updatePasswordSchema
  },
  isAdmin: function(){
    return Roles.userIsInRole(Meteor.userId(), 'admin')
  },
  subscriptionType: function(){
    return this.userInfo.subscription.subscriptionType
  },
  collapsedMode: function(){
    return Session.get('collapsedMode')
  },
  isSubscriptionUser: function(){
    return this.userInfo.subscription.subscriptionType === 'Subscription'
  },
  startDate: function(){
    return moment(this.userInfo.subscription.startOfSubscription).format('DD MMM YYYY')
  },
  endDate: function(){
    return moment(this.userInfo.subscription.endOfSubscription).format('DD MMM YYYY')
  },
  name: function(){
    return this.userInfo.profile.firstName + " " + this.userInfo.profile.lastName
  }
});

Template.user.events({
  'click #user-delete-button': function(event, template){
    event.preventDefault();
    Modal.show('deleteUserModal')
  },
  'click #button-show-my-events': function(event, template){
    event.preventDefault();
    Modal.show('myEventsModal')
  },
  'click #button-purchase': function(event, template){
    event.preventDefault();
    Modal.show('purchaseModal')
  },
});
