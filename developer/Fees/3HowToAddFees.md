# How to Add Fees

In the worst case, somehow user applications paid fees based on the suggestions, but due to some unexpected reasons like extreme market change or sudden gas rise up. The fees paid can't cover the gas cost. So the Relayer will not relay this action.

Under this situation, you can add more fees for your cross-chain action (Packet).

Call the addPacketFee function in Packet.sol to 

```solidity

function addPacketFee(
        string memory sourceChain,
        string memory destChain,
        uint64 sequence,
        uint256 amount
    )

```

You will need some Packet info include sourceChainName,destination ChainName and sequence to specify which packet you want to boost.

You can learn how to [get these info here](../Cross-Chain-Tracking/1Track.md).
