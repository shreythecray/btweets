//Require the Twit package
const Twit = require('twit');
cronJob = require('cron').CronJob;

// Your Twilio number
var from_number = '+12345678900';
// Your phone number
var to_number = '+15550000000';

var T = new Twit({
  consumer_key: '[insert_your_consumer_API_key_here]',
  consumer_secret: '[insert_your_consumer_API_secret_key_here]',
  access_token: '[insert_your_access_token_here]',
  access_token_secret: '[insert_your_access_secret_token_here]',
});


T.get('search/tweets', { q: 'bts', count: 1 }, async (err, data, response) => {
  const accountSid =  '[insert your account SID here]'
  const authToken  =  '[insert your auth token here]'
  const client = require('twilio')(accountSid, authToken);

  try {
    const statuses = data.statuses;
    const tweets = [];
    var url;

    statuses.map(status => {
      tweets.push({
        time: status.created_at,
        text: status.text,
        name: status.user.name,
        screen_name: status.user.screen_name,
        tweet_url: `https://twitter.com/${status.user.screen_name}/status/${status.id_str}`
      });
    });

  //console.log(data.statuses);

  //console.log('https://twitter.com/', data.statuses[0].user.screen_name, '/status/', data.statuses[0].id_str);

  client.messages
     .create({
       body: `Here's your BTweetS for the day from ${data.statuses[0].user.screen_name}: https://twitter.com/${data.statuses[0].user.screen_name}/status/${data.statuses[0].id_str} with ${data.statuses[0].retweeted_status.retweet_count} retweets and ${data.statuses[0].retweeted_status.favorite_count} likes!`,
       from: from_number,
       to: to_number
     })
     .then(message => console.log(message.sid));

  } catch(e){
     client.messages
     .create({
       body: `Oops! something is wrong - ${new Date().toLocaleString()}`,
       from: from_number,
       to: to_number
     })
     .then(message => console.log(message.sid));
   }
})