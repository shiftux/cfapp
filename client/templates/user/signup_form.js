Template.signupForm.helpers({
  schema: function () {
      return Schema.createUserFormSchema;
  }
});

Template.signupForm.events({
  // 'click #signup-form-submit': function(event, template){
  'submit form': function(event, template){
    event.preventDefault();
    var doc = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      email: event.target.email.value.toLowerCase(),
      password: event.target.password.value,
      passwordConfirmation: event.target.passwordConfirmation.value,
    }
    var ok = false;
    var id = ''
    Meteor.call('insertUser', doc, function(error, response){
      if (error) {
        FlashMessages.sendError("Could not create user. "+error);
      } else{
        if(response !== undefined){
          ok = true
          id = response
          Session.set('emailVerificationUserId', id)
          $("#signup-form").attr("hidden", "true");
          Meteor.call( 'sendVerificationLink', id, ( error, response ) => {
            if ( error ) {
              FlashMessages.sendError( error.reason, 'danger' );
            } else {
              FlashMessages.sendSuccess("Successfully created user");
              Router.go('emailVerification', {});
            }
          });
        }
      }
    });
    // setTimeout(function () {
    //   if(ok){
    //     Meteor.loginWithPassword(doc.email, doc.password, function(error, response){
    //       if (error) {
    //         FlashMessages.sendError("Could not login user. "+error);
    //       } else{
    //         Router.go('user', {_id:id});
    //       }
    //     });
    //   }
    // }, 2500)

    // Accounts.createUser({
    //     email: event.target.firstName.value,
    //     password: event.target.password.value
    //   }, function(error, response){
    //     if (error) {
    //       FlashMessages.sendError("Could not create user" + error);
    //     } else{
    //       FlashMessages.sendSuccess("Successfully created user");
    //     }
    // });
    // event.preventDefault();
    // console.log('alöskfjaölsdjkfölaskdfjaöklsdfj')
    // console.log(event)
    // console.log(event.target.firstName.value)
    // console.log($('#signup-form'))
    // console.log(template)
  },
});