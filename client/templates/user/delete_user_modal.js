Template.deleteUserModal.events({
  'click #users-delete-modal-yes': function(event, template){
    event.preventDefault();
    var user;
    Roles.userIsInRole(Meteor.user(), 'admin') ? user = Session.get('userToModify')._id : user = Meteor.userId()
    console.log(user)
    Meteor.call('deleteUser', user, function(error, result){
      if(error) FlashMessages.sendError("Could not delete user! "+error);
      if(result){
        FlashMessages.sendSuccess("Successfully deleted user");
        if(!Roles.userIsInRole(Meteor.user(), 'admin')) {
          Meteor.logout();
          Meteor.logoutOtherClients;
          Router.go('main', {});
        }
        $('#delete-user-modal').modal('hide');
        $('.grayBackgroundClass').hide();
      }
    })
  },
  'click #users-delete-modal-no': function(event, template){
    event.preventDefault();
      $('#delete-user-modal').modal('hide');
      $('.grayBackgroundClass').hide();
  },
})
