# Important XIBC concepts you need to know

To start building, it's always good to get a fully understanding of how our powerful infrastructure - XIBC Protocol works.

We have provided a detail explaination [in here](https://chain-docs.teleport.network/modules/XIBC/#). If you want to get whole controll of the underlying logic, please check this page.

If you want to start to build your applications as simple as possible, here we have quick summary of some import concepts you need to know.

## Packet

Contracts communicate with each other by sending packets over XIBC ports. 

All XIBC packets contain:

- **Sequence** to optionally enforce ordering

- Source clientID

- Destination clientID

- Relay clientID

If the relay chain is specified, it means the relay chain mode is used.

- A set of sub-packets. each packet contains:

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

Contracts [send custom application data](../Integration-Guide-(Testnet)/2DataType.md) to each other inside the **data_list []byte** field of the XIBC sub-packet. Sub-packet data is completely opaque to XIBC handlers. The sender contract must encode their application-specific packet information into the Data field of packets;

## XIBC applications

#### Transfer

Transfer means move assets from one chain to another chain. This is the most basic application to the cross-chain protocol.

A common example is the bridge applications include our [official bridge](https://bridge.testnet.teleport.network/).

To notice is that single transfer application will not generate acknowleges.

#### RCC (RemoteContractCall)

Remote Contract Call means invoke the destination chain's contract from the source chain.

For example, you send a transcation on BNB chain to calling the veCRV vote funtion on Ethereum. In this process, no assets being transferred just simple contract call happens.

#### MultiCall

In most cases, if we want to acheieve some goals, there should be at least one assets transfer and 1 remote contract call in one cross-chain process. You can call multicall function

## Proxy

In the best practice, developers can deploy a Proxy contract to make the process easier. For example, check out our official bridges [Proxy Contract](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/apps/agent/Proxy.sol).

The contract did several things include:

1. Encode contract abi to form RCC data.
2. Form transfer application data.
3. Using the RCC data and transfer data to form Multicall data.
4. Construct id for the first Hop.(This is important in the agent mode)



## Agent

We have mentiond in the [Get Started](../Integration-Guide-(Testnet)/1Get-Started.md) Sections that teleport support three different ways to integrate.

The agent mode is the more complex one, in this mode, unlike the relay chain mode, you should deploy an agent contract yourself to help you handle the extra logic on realy chain and start the cross-chain process from teleport to destination chain.

For example, our official bsc-eth bridge implementation process:

1. Construct a transfer to move the assets and fees to the agent contract on the realy chain (teleport)
2. Construct a remote contract call to invoke the send() function of the agent contract.
3. Construct a Multicall based on 1.2 
4. the send() function will using the assets and fees transferred to start a cross-chain transfer to move the assets to the user address on destination chain. 

You can see that the assets here have three verisons:

1.Source Chain version

2.Destination Chain version

3.Teleport Chain version

You can see this process as a combination of two process:

1.Source Chain -> Teleport

2.Teleport -> Destination Chain


Using agent mode can utilize you the liquidity on Teleport Chain, and you can also do some extra logic on the relay chain for example swap the assets to another assets using the teleport-chain's DEX.

## ACKs

Contracts also write application-specific acknowledgements when processing a packet. Acknowledgements can be done:

- Synchronously on OnRecvPacket if the contract processes packets as soon as they are received from XIBC contract.

- Asynchronously if the contract processes packets at some later point after receiving the packet.

This acknowledgement data is opaque to XIBC much like the packet Data and is treated by XIBC as a simple byte string []byte. The receiver contracts must encode their acknowledgement so that the sender contact can decode it correctly.

The acknowledgement can encode whether the packet processing succeeded or failed, along with additional information that allows the sender contract to take appropriate action.

After the acknowledgement has been written by the receiving chain, a relayer relays the acknowledgement back to the original sender contract which then executes application-specific acknowledgment logic using the contents of the acknowledgement. This acknowledgement can involve rolling back packet-send changes in the case of a failed acknowledgement (refunding senders).

After an acknowledgement is received successfully on the original sender the chain, the XIBC contact deletes the corresponding packet commitment as it is no longer needed.

