Meteor.methods({
  bumpedFromWaitingListMail: function(recepient, event){
    console.log('sending bumpedFromWaitingListMail to: ', recepient)
    Email.send({
      to: recepient,
      from: "noreply@crossfittb.ch",
      subject: "Tom's Box: You're participating!",
      html: "<p>You've been pushed from the waiting list to participate at <strong>"+event.title+"</strong>, at <strong>"+moment(event.start).format("dddd, MMMM Do YYYY, HH:mm")+"</strong>.</p>",
    });
  },
  sendVerificationLink: function(userId){
    return Accounts.sendVerificationEmail( userId );
  },
  sendResetPasswordLink: function(email){
    userId = Accounts.findUserByEmail(email)
    if(typeof userId === 'undefined'){throw new Meteor.Error('User not found', 'There is no user for the specified email')}
    return Accounts.sendResetPasswordEmail( userId )
  }
});


// console: 

// curl -s --user 'api:$$$API_KEY$$$' \
//     https://api.mailgun.net/v3/crossfittb.ch/messages \
//     -F from='Toms Box <noreply@crossfittb.ch>' \
//     -F to=montanari.sandro@gmail.com \
//     -F subject='Hello' \
//     -F text='Testing some Mailgun awesomness!'