# Step2: Call the XIBC application contracts 

To start a cross-chain process, you need to interact with our XIBC application contract deployed on different Chains.

Based on different actions, you need to interact with the following contracts:


[transfer.sol](https://github.com/teleport-network/xibc-contracts/tree/main/evm/contracts/apps/multicall)



[rcc.sol](https://github.com/teleport-network/xibc-contracts/tree/main/evm/contracts/apps/multicall)


[multicall.sol:](https://github.com/teleport-network/xibc-contracts/tree/main/evm/contracts/apps/multicall)

## Transfer Application:

```solidity
function sendTransfer(
        TransferDataTypes.TransferData memory transferData,
        PacketTypes.Fee memory fee
    )
```

## RCC(RemoteContractCall) Application:

```solidity
function sendRemoteContractCall(
        RCCDataTypes.RCCData memory rccData,
        PacketTypes.Fee memory fee
    )
```

## MultiCall Application:

```solidity
function multiCall(
        MultiCallDataTypes.MultiCallData memory multiCallData,
        PacketTypes.Fee memory fee
    )
```

Besides CrossChain Data, you also need to specify the cross-chain fees to cover the gas spend during the process.

For how our fee system works, please check this:
[Cross-chain Fees Logic](../Fees/1Fees%20System.md)

It maybe helpful to check the [XIBC contract abi](../Resources/Testnet%20Contract%20Abi.md)