const PubNub = require("pubnub");

const credentials = {
  publishKey: "pub-c-b18e5257-fc78-4f12-ad31-c5728d7592c7",
  subscribeKey: "sub-c-30c6dc01-d877-4707-9c54-4372868a9687",
  secretKey: "sec-c-YzUxNmI1MTYtYzQ5Yi00ZWZjLWFiNzYtNmVlMzdlZjc3MTE5",
  userId: "2727nomer2727"
};

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN"
};

class PubSub {
  constructor({blockchain}) {
    this.pubnub = new PubNub(credentials);

    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

    this.pubnub.addListener(this.listener());
    this.blockchain = blockchain;
  }

  listener() {
    return {
      message: (messageObject) => {
        const { channel, message } = messageObject;

        console.log(`Mesagge: ${message} on channel: ${channel}`)

        const parsedMessage = JSON.parse(message);

        if(channel === CHANNELS.BLOCKCHAIN) [
            this.blockchain.replaceChain(parsedMessage)
        ]
      },
    };
  }

  publish({channel, message}) {
    this.pubnub.publish({channel, message})
  }

  broadcastChain() {
    this.publish({
        channel: CHANNELS.BLOCKCHAIN,
        message: JSON.stringify(this.blockchain.chain)
    })
  }

  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: [Object.values(CHANNELS)]
    });
  }
}


module.exports = PubSub;
