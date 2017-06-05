Template.emailVerification.helpers({
  verified: function(){
    return Meteor.user().emails[ 0 ].verified;
  }
});

Template.emailVerification.events({
  'click #resend-verification-link': function ( event, template ) {
    userId = ''
    if(typeof Session.get('emailVerificationUserId') === 'undefined'){
      userId = Meteor.userId()
    } else {
      userId = Session.get('emailVerificationUserId')
    }
    Meteor.call( 'sendVerificationLink', userId, function( error, response ) {
      if ( error ) {
        FlashMessages.sendError("Cannont send verification email! " + error);
      } else {
        if(Meteor.userId()){
          let email = Meteor.user().emails[ 0 ].address;
        } else {
          email = 'your email.'
        }
        FlashMessages.sendSuccess("Verification sent to " + email);
      }
    });
  }
});