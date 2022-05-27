# How to pay fess

## General Process (1-Hop & 2-Hop with Relay Chain)

When invoking the XIBC application contracts, you need to specify the "fee" parameter.

```solidity
function multiCall(
        MultiCallDataTypes.MultiCallData memory multiCallData,
        PacketTypes.Fee memory fee
    )

function sendRemoteContractCall(
        RCCDataTypes.RCCData memory rccData,
        PacketTypes.Fee memory fee
    )

function sendTransfer(
        TransferDataTypes.TransferData memory transferData,
        PacketTypes.Fee memory fee
    )
```

This is a data structure shown in the [Packet Library](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/libraries/packet/Packet.sol):

```solidity
struct Fee {
        address tokenAddress; // zero address if base token
        uint256 amount;
    }
```

We currently support the bridged token as Fee.


## 2-Hop Agent Mode

In the agent mode, you need agent contract on teleport chain to pay fees for the second Hop (teleport -> destination chain).

You can use you own way to achieve this based on your business logic.

We also provide the example of how to do it in our [official bridge implementation](../Code-Examples/4.2-HopAgent(Official-Bridge).md), check the link for details.

In short is the following steps:

1. Start a cross-chain transfer to the agent contract (teleport chain)
   (This transfer amount should include the real transfer amount and the fees you want to give to the agent contract)
2. add a fee amount parameter to indicate how much you want to give in remote agent contract call, recommend you do this in proxy contract.
```solidity
Proxy.send()

function send(
        address refundAddressOnTeleport,
        string memory destChain,
        MultiCallDataTypes.TransferData memory erc20transfer,
        TransferDataTypes.TransferData memory rccTransfer,
        uint256 feeAmount ///fees you want to give to agent contract which come from the assets you transferred to agent contract
    )
```
3. add an extra function in agent contract to calculate the agent contract fees/real transfer amount. You need to be careful of the precise of tokens on different chain.
```solidity
    function checkPacketSyncAndGetAmountSrcChain(
        address tokenAddress,
        string memory destChain,
        uint256 feeAmount
    )
        private
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        ...

        uint256 realAmountRecv = transferPacket.amount.toUint256() *
            10**uint256(scaleSrc);
        uint256 realFeeAmount = feeAmount * 10**uint256(scaleSrc);
        uint256 realAmountAvailable = realAmountRecv - realFeeAmount;
        uint256 realAmountSend = realAmountAvailable / 10**uint256(scaleDest);
        token.approve(address(transferContractAddress), realAmountRecv);
        return (0, realFeeAmount, realAmountAvailable, realAmountSend);
    }

```


