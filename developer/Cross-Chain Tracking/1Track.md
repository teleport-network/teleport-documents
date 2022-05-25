# How to track your Packet generate by your cross-chain call

In the XIBC system, your cross-chain message is represented by Packet.

[xibc-contracts/Packet.sol at main · teleport-network/xibc-contracts](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/core/packet/Packet.sol)

Every time you send a cross-chain call, a Packet will be generated. We use sequence to uniquely identifies this Packet.

You can use sequence, source chain name, and destination chain name as parameters to specify a unique cross-chain transaction. Furthermore, you can perform actions like [adding extra fees](../Fees/3HowToAddFees.md), [checking Ack status, and resolving ack results](../Error%20Handling/ACK%20&%20Error%20Handling.md).

## Track the Packet by monitoring the event

When the Packet is sent, our XIBC contract will emit an event called PacketSent.

```javascript
event PacketSent(PacketTypes.Packet packet);

library PacketTypes {
    struct Packet {
        uint64 sequence; // unique id of the packet
        string sourceChain; 
        string destChain;
        string relayChain; // '' if 1-Hop
        string[] ports; 
        bytes[] dataList; //cross-chain data
    }
}
```

You can monitor the event using the scripts to check your Packet.

The packet consists of the sequence and dest/source Chain info. You can use this info to perform the actions you want.

You can writing scripts like this to achieve this:

```javascript

```