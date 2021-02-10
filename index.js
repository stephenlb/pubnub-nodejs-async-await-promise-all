const PubNub = require('pubnub');
const pubnub = new PubNub({
  publishKey   : "demo",
  subscribeKey : "demo",
  keepAlive    : true,
});

const channel   = "async-await";
const connected = "PNConnectedCategory";
const letters   = ['A', 'B', 'C', 'D', 'E', 'F'];

async function sendAllAtOnce() {
  let done = await Promise.all(letters.map( async letter => {
    return pubnub.publish({
      channel: channel,
      message: { test: "Message"+letter },
    });
  } ));
  console.log("Parallel PubNub calls done.");
  console.log(done);
}

let received = 0;
pubnub.addListener({
  message: function(messageEvent) {
    console.log(messageEvent.message);
    if (++received == letters.length) {
      pubnub.unsubscribeAll();
    }
  },
  status: function (statusEvent) {
    if (statusEvent.category === connected) {
      sendAllAtOnce();
    }
  },
});

pubnub.subscribe({
  channels: [channel],
});
