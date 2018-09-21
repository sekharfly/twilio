// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.http.HttpMethod;
import com.twilio.rest.api.v2010.account.IncomingPhoneNumber;
import com.twilio.type.PhoneNumber;

import java.net.URI;

public class Example {
    // Find your Account Sid and Token at twilio.com/console
    public static final String ACCOUNT_SID = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
    public static final String AUTH_TOKEN = "your_auth_token";

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        IncomingPhoneNumber incomingPhoneNumber = IncomingPhoneNumber.creator(
                new com.twilio.type.PhoneNumber("+15105647903"))
            .setFriendlyName("My Company Line")
            .setVoiceMethod(HttpMethod.GET)
            .setVoiceUrl(URI.create("http://demo.twilio.com/docs/voice.xml"))
            .create();

        System.out.println(incomingPhoneNumber.getSid());
    }
}