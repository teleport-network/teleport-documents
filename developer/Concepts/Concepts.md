<!--
order：1
-->
# Important XIBC concepts you need to know

Before you begin to build, it is always beneficial to understand how the infrastructure which you are building on works. In this case, how you can best take advantage of our XIBC Protocol. 

We have provided a detailed explaination [here](https://chain-docs.teleport.network/modules/XIBC/#). This page will explain the underlying logic of the protocol. 

Here is a quick summary of some import concepts you will need to know as you begin to build on Teleport's XIBC framework.

## Packet

Contracts communicate with each other by sending packets over XIBC ports. 

All XIBC packets contain:

- **Sequence** used to optionally enforce ordering

- Source clientID

- Destination clientID

- Relay clientID

If the relay chain is specified, then the relay chain mode is used.

- A set of sub-packets. Where each packet contains:

  - PortID This port allows the contracts to know the receiver contract of a given packet.
  
  - Data

```Solidity
message Packet {
    // number corresponds to the order of sends and receives, where a Packet
    // with an earlier sequence number must be sent and received before a Packet
    // with a later sequence number.
    uint64 sequence = 1;
    // identifies the chain id of the sending chain.
    string source_chain = 2;
    // identifies the chain id of the receiving chain.
    string destination_chain = 3;
    // identifies the chain id of the relay chain.
    string relay_chain = 4;
    // identifies the ports on the sending chain and destination chain
    repeated string ports = 5;
    // actual opaque bytes transferred directly to the application module
    repeated bytes data_list = 6;
}
```

Contracts [send custom application data](../Integration-Guide-(Testnet)/2DataType.md) to each other inside the **data_list []byte** field of the XIBC sub-packet. Sub-packet data is completely opaque to XIBC handlers. The sender contract must encode their application-specific packet information into the Data field of packets.

## XIBC applications

#### Transfer

Transfer is the term used to describe the action of moving assets from one chain to another chain. This is the most basic application of the cross-chain protocol.

A common example of this would be bridge applications, including our [official bridge](https://bridge.testnet.teleport.network/).

An important thing to notice is that single transfer applications will not generate acknowlegements on the protocol.

#### RCC (RemoteContractCall)

Remote Contract Call describes the proccess of invoking the destination chain's contract from the source chain.

For example, you execute a transcation on BNB chain which calls the veCRV vote funtion on Ethereum. In this process, no assets will be transferred, only a simple contract call will occur. 

#### MultiCall

In most cases, there will be at least one asset transfer and one remote contract call during a cross-chain transaction process. In this instance, you would use the MultiCall function. 

## Proxy

Developers can deploy a Proxy contract to make the cross-chain transaction process even easier. As an example, check out our official bridge [Proxy Contract](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/apps/agent/Proxy.sol).

This contract does several things including:

1. Encode contract abi to form RCC data.
2. Form transfer application data.
3. Using the RCC data and transfer data to form Multicall data.
4. Construct id for the first Hop.(This is important in the agent mode)



## Agent

We have previously mentioned in the [Get Started](../Integration-Guide-(Testnet)/1Get-Started.md) sections that Teleport supports three different methods of integration. 

The agent mode is the more complex one, in this mode, unlike the relay chain mode, you should deploy an agent contract yourself to help you handle the extra logic on the relay chain and start the cross-chain process from Teleport to the destination chain.

For example, this is our official bsc-eth bridge implementation process:

1. Construct a transfer to move the assets and fees to the agent contract on the realy chain (Teleport)
2. Construct a remote contract call to invoke the send() function of the agent contract.
3. Construct a Multicall based on 1&2 
4. The send() function will use the assets and fees transferred to start a cross-chain transfer to move the assets to the user address on the destination chain. 

You can see that the assets here have three verisons:

1.Source Chain version

2.Destination Chain version

3.Teleport Chain version

You can see this process as a combination of two process:

1.Source Chain -> Teleport

2.Teleport -> Destination Chain


Using agent mode allows you to utilize the liquidity on Teleport Chain, and allows you implement extra logic on the relay chain if you desire to. For example, you could swap one asset to another using Teleport-chain's DEX.

## ACKs

Contracts also write application-specific acknowledgements when processing a packet. Acknowledgements can be written in the following ways:

- Synchronously on OnRecvPacket if the contract processes packets as soon as they are received from XIBC contract.

- Asynchronously if the contract processes packets at some later point after receiving the packet.

This acknowledgement data is opaque to XIBC much like the packet Data and is treated by XIBC as a simple byte string []byte. The receiver contracts must encode their acknowledgement so that the sender contact can decode it correctly.

The acknowledgement can encode whether proccessing the packet was successful or if it failed, along with additional information that allows the sender contract to take appropriate action.

After the acknowledgement has been written by the receiving chain, a relayer relays the acknowledgement back to the original sender contract which then executes application-specific acknowledgment logic using the contents of the acknowledgement. This acknowledgement can involve rolling back packet-send changes in the case of a failed acknowledgement (refunding senders).

After an acknowledgement is received successfully on the chain which the transaction originated from, the XIBC contact deletes the corresponding packet commitment as it is no longer needed.
