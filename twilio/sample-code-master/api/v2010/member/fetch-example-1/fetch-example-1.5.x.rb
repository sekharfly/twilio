# Download the helper library from https://www.twilio.com/docs/ruby/install
require 'rubygems'
require 'twilio-ruby'

# Your Account Sid and Auth Token from twilio.com/console
account_sid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
auth_token = 'your_auth_token'
@client = Twilio::REST::Client.new(account_sid, auth_token)

member = @client.queues('QU5ef8732a3c49700934481addd5ce1659')
                .members('CA386025c9bf5d6052a1d1ea42b4d16662')
                .fetch

puts member.call_sid
