import 'dotenv/config';
import twilio from 'twilio';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  TARGET_PHONE_NUMBER,
  PUBLIC_BASE_URL,
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER || !PUBLIC_BASE_URL) {
  console.error('Saknar env-variabler — kolla .env mot .env.example.');
  process.exit(1);
}

const to = process.argv[2] || TARGET_PHONE_NUMBER;
if (!to) {
  console.error('Inget nummer att ringa. Använd: npm run call -- +46701234567');
  process.exit(1);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const call = await client.calls.create({
  to,
  from: TWILIO_PHONE_NUMBER,
  url: `${PUBLIC_BASE_URL}/twiml/incoming`,
});

console.log('Samtal startat, SID:', call.sid);
