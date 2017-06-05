Template.resetPassword.events({
  'submit form': function( event, template ) {
    event.preventDefault();
    
    let email = template.find( '[name="emailAddress"]' ).value
    Meteor.call( 'sendResetPasswordLink', email, ( error, response ) => {
      if ( error ) {
        FlashMessages.sendError("Cannont send reset email! " + error);
      } else {
        FlashMessages.sendSuccess("Reset Link Sent to " + email)
      }
    });
  }
});