Template.navigation.helpers({
  theId: function(){
    return Meteor.userId()
  },
  userName: function(){
    user = Users.findOne({_id: Meteor.userId()})
    return user.profile.firstName + " " + user.profile.lastName
  }
});

Template.navigation.events({
  'click #user-sign-out-button': function(event, template){
    event.preventDefault();
    Meteor.logout();
    Meteor.logoutOtherClients();
    FlashMessages.sendSuccess("You are logged out");
  },
})