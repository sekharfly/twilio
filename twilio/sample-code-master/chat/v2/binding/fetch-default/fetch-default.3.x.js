// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const authToken = 'your_auth_token';
const client = require('twilio')(accountSid, authToken);

client.chat.services('ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
           .bindings('BSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
           .fetch()
           .then(binding => console.log(binding.sid))
           .done();
