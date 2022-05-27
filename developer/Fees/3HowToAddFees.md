# How to Add Fees

In a worst case scenario where market conditions are extreme or gas suddenly rises and the fees estimated and paid by the user application cannot cover the gas cost, the relayer will not relay the action. 

In this situation, additional fees can be added to the cross-chain transaction (Packet).

Call the addPacketFee function in Packet.sol to 

```solidity

function addPacketFee(
        string memory sourceChain,
        string memory destChain,
        uint64 sequence,
        uint256 amount
    )

```

Some Packet info will be required such as the sourceChainName,destination ChainName and sequence to specify which packet you want to boost.

You can learn how to [get these info here](../Cross-Chain-Tracking/1Track.md).
