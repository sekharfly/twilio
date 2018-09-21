// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const authToken = 'your_auth_token';
const client = require('twilio')(accountSid, authToken);

client.preview.proxy.services('KSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
                    .sessions('KCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
                    .participants('KPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
                    .update({participantType: 'sms'})
                    .then(participant => console.log(participant.friendlyName))
                    .done();
