AutoForm.hooks({
  'users-update-subscription-form': {
    onSuccess: function (operation, result, template) {
      FlashMessages.sendSuccess("Successfully updated subscription");
    },
    onError: function(operation, error, template) {
      FlashMessages.sendError("Failed to update subscription! " + error);
      console.log(error);
    }
  },
})

Template.modifyUserSubscriptionModal.helpers({
  'userInfo': function(){
    console.log(Session.get('userToModify'))
    return Session.get('userToModify')
  },
  'userName': function(){
    var userInfo = Session.get('userToModify')
    return userInfo.profile.firstName + " " + userInfo.profile.lastName
  },
  'userEmail': function(){
    return Session.get('userToModify').emails[0].address
  },
  initialSubscription: function(){
    var userInfo = Session.get('userToModify')
    return userInfo.subscription.subscriptionType
  },
  currentCredit: function(){
    Meteor.call('computeCredit', Session.get('userToModify')._id, function(error, result){
      if (error) {FlashMessages.sendError(error)}
      else {Session.set('creditCount', result)}
    })
    return Session.get('creditCount')
  }
})

Template.modifyUserSubscriptionModal.events({
  'click #users-update-subscription-submit': function(event, template){
    event.preventDefault();
    values = AutoForm.getFormValues('users-update-subscription-form')
    type = values.insertDoc.subscription.subscriptionType
    if(type === 'Subscription'){
      startDate = moment(values.insertDoc.subscription.startOfSubscription).toDate()
      endDate = values.insertDoc.subscription.endOfSubscription
      Meteor.call('updateSubscription', Session.get('userToModify')._id, startDate, endDate, function(error, result){
        if ( error ) {FlashMessages.sendError("Failed to modify subscription!" + error)}
        else {FlashMessages.sendSuccess("Successfully modified subscription of " + Session.get('userToModify').profile.firstName) }
      })
    } else {
      additionalEntries = values.insertDoc.subscription.additionalEntries
      Meteor.call('updateSubscriptionEntries', Session.get('userToModify')._id, additionalEntries, function(error, result){
        if ( error ) {FlashMessages.sendError("Failed to modify subscription!" + error) }
        else {FlashMessages.sendSuccess("Successfully modified subscription of " + Session.get('userToModify').profile.firstName) }
      })
    }
    $('#modify-user-subscription-modal').modal('hide')
    $('#delete-user-modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('.grayBackgroundClass').hide();
  },
  'click #user-delete-button': function(event, template){
    event.preventDefault();
    $('#modify-user-subscription-modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#delete-user-modal').modal('show');
  },
  'click #modify-user-subscription-cancel': function(event, template){
    event.preventDefault();
    $('#modify-user-subscription-modal').modal('hide');
    $('#delete-user-modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('.grayBackgroundClass').hide();
  },
});
