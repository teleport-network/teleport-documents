# How to pay fess

## General Process (1-Hop & 2-Hop with Relay Chain)

When invoking the XIBC application contracts, you need to specify the "fee" parameter.

```jsx
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

This is a data structure shown in the [Packet Library]():

```jsx
struct Fee {
        address tokenAddress; // zero address if base token
        uint256 amount;
    }
```

We currently support the bridged token as Fee.

See the [bridge token list]() here.

## 2-Hop Agent Mode

