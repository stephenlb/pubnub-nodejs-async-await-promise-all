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
      channel: channel,
      message: { test: "Message"+letter },
    });
  })
  .concat(
    pubnub.fetchMessages({
      channels: [channel],
      count: 2,
    })
  ));
  console.log("Parallel PubNub calls complete", done);
}

let received = 0;
pubnub.addListener({
  message: function(messageEvent) {
    console.log("Received", messageEvent.message);
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
