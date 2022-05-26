# How to bind the packet in 2-Hop Agent Mode



In the 2-Hop Agent Flow:

BSC -> Teleport -> Rinkeby

The Agent performs two 1-Hop operations to achieve the outcome of a 2-hop. 

Hop-1 BSC -> Teleport generates Packet0 {bsctest, teleport, sequence0, data0}, 

Hop-2 Teleport - > Rinkeby generates Packet1 {teleport, rinkeby, sequence1, data1

During the procedure, there is no actual association between the two 1-hop operations except for the data. However, both packets are required to succeed in order to confirm that the total-actions of the transfer succeed. Therefore, both packets need to be bound to a single 2-Hop action.

To accomplish this, a unique identifier that is associated with packet0 is created when the [Agent contract]() on Teleport Chain receives packet0. 

Since the sequence of the corresponding packet transmission direction is unique, we can add an event in our [agent contract]():

```solidity
event SendEvent( 
    sha256( packet0.srcChain+packet0.destChain+packet0.sequence ),
    packet1.destChain,
    packet1.sequence )
```

The service application can monitor for this event and using the packet0 info (srcChain,destChain,sequence), it can attain the connection between 
Packet 0 and Packet 1. For more information on how to do this, please check the [last chapter](./ACK.md)

By checking the status of both packets on the destination chain, the status of this 2-Hop Process can be known.

![Bind Data Diagram](./bind.jpg)

## Examples in our official bridge implementation

Our official bridge uses 2-Hop Agent mode which makes it's code base a great example to learn more about this proccess. 

Specifically, the [Proxy contract]() on evm chain and [Agent contract]() on Teleport Chain is great to learn from. 
