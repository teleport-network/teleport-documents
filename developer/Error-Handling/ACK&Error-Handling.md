<!--
order：1
-->

# Acknowledgement



## What is ACK?

Within Teleport network, when each packet is sent the relay will provide an option to relay an ACK message to inform the contract or the developer of the excution results of this Packet.

```solidity
struct Acknowledgement {
    bytes[] results; //tx results
    string message; //error messages destination tx generated
    string relayer; //for fees purpose
}
```

Under most situations, the ACK will actively return to the source chain via the relayer.
However, there are exceptions:

For Ethereum (and other chains with higher gas costs), users will need to manually pay fees to let the relayer return the ACK if needed, otherwise the transfer Packet will not relay ACK's due to cost control.

## Check ack status

You can check the status of an ACK's in the Packet.sol contract by calling the getAckStatus method in Packet.sol 

```solidity

function getAckStatus(
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence
    )
```

The method will check the ackStatus mapping and return the following:

```solidity

mapping(bytes => uint8) public ackStatus; // 0 => not found , 1 => success , 2 => err

```
If you don't understand the parameters, check the [Track your Packet](../Cross-Chain-Tracking/1Track.md) section.


## How to get your ACK's

When the ACK is realyed back to the souce chain, it will be stored in the source chain's RCC.sol contract.

```solidity

mapping(bytes32 => bytes) public override acks;

```

To get the ACK's, you need to [get your packet info](../Cross-Chain-Tracking/1Track.md) first and construct the keys by encoding your cross-chain data.


![How to reslove ACK](./ACKProcess.png)


