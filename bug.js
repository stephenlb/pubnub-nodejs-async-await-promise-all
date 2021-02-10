const PubNub = require('pubnub');
const pubnub = new PubNub({
  publishKey   : "demo",
  subscribeKey : "demo",
  keepAlive    : true,
});

const channel   = "async-await";
const connected = "PNConnectedCategory";
const letters   = ['A', 'B', 'C'];

async function sendAllAtOnce() {
  let done = await Promise.all(letters.map( async letter => {
    return pubnub.publish({
      channel: channel, message: { test: "Message"+letter }
    });
  } ));
  console.log(done);
}

pubnub.addListener({
  message: function(messageEvent) {
    console.log(messageEvent.message);
  },
  status: function (statusEvent) {
    if (statusEvent.category === connected) sendAllAtOnce();
  },
});

pubnub.subscribe({
  channels: [channel],
});

setTimeout( pubnub.unsubscribeAll, 5000 );
