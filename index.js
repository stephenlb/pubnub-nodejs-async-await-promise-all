const PubNub = require('pubnub');
const publisher = new PubNub({
  publishKey   : "demo",
  subscribeKey : "demo",
  keepAlive    : true,
});
const subscriber = new PubNub({
  publishKey   : "demo",
  subscribeKey : "demo",
  keepAlive    : true,
});

const channel   = "async-await";
const connected = "PNConnectedCategory";
const letters   = ['A', 'B', 'C'];

async function sendAllAtOnce() {
  let done = await Promise.all(letters.map( async letter => {
      return publisher.publish({
        channel: channel, message: { test: "Message"+letter }
      });
  } ));
  console.log(done);
}

subscriber.addListener({
  message: function(messageEvent) {
    console.log(messageEvent.message);
  },
  status: function (statusEvent) {
    if (statusEvent.category === connected) sendAllAtOnce();
  },
});
//sendAllAtOnce();
    //try {
    //} catch(e) { console.error(e) }
subscriber.subscribe({
  channels: [channel],
});

setTimeout( subscriber.unsubscribeAll, 5000 );
