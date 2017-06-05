Accounts.emailTemplates.siteName = "Tom's Box";
Accounts.emailTemplates.from     = "Tom's Box <noreply@crossfittb.ch>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "Tom's Box: Verify Your Email Address";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        // urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "info@tomsbox.ch",
        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${url}\n\n If you did not request this verification, please ignore this email.`;

    return emailBody;
  }
};