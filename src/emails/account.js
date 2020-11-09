const sgMail = require("@sendgrid/mail");
const sendgridAPIKey = process.env.SENDGRID_API;
sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = async (email, name) => {
  sgMail.send({
    to: email,
    from: "codeblack03@rediffmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app ${name}. Let me know how you get along with the app`,
  });
};

const sendUnsubscribeEmail = async (email, name) => {
  sgMail.send({
    to: email,
    from: "codeblack03@rediffmail.com",
    Subject: "Unsubscribe",
    text: `Thank You for being a user ${name}. See you soon again`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendUnsubscribeEmail,
};
