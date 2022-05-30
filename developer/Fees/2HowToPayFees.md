<!--
order：2
-->
# How to pay fess

## General Process (1-Hop & 2-Hop with Relay Chain)

When invoking the XIBC application contracts, the "fee" parameter must be specified.

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

This is the data structure shown in the [Packet Library](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/libraries/packet/Packet.sol):

```solidity
struct Fee {
        address tokenAddress; // zero address if base token
        uint256 amount;
    }
```

We currently support the bridged token as a form of fee.


## 2-Hop Agent Mode

In the agent mode, you need the agent contract on Teleport chain to pay fees for the second Hop (Teleport -> destination chain).

You can use your own method to achieve this outcome based on the logic of your program.

However, we also provide an example of how to do this in our [official bridge implementation](../Code-Examples/4.2-HopAgent(Official-Bridge).md).

In summary, the proccess is as follows: 

1. Start a cross-chain transfer to the agent contract (Teleport Chain)
   (The transfer amount should include the real transfer amount as well as the fees you want to provide to the agent contract)
2. Add the parameter "fee amount" to indicate how much you want to provide during the remote agent contract call; it is recommended that you do this in the form of a proxy contract.
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
3. Add an extra function in the agent contract to calculate the agent contract fees/real transfer amount. You must be careful to consider the prices of tokens on different chains.
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


