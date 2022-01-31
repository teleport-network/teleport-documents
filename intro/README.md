# Teleport Network

Teleport Network provides infrastructure and framework for cross-chain communication. It consists of a decentralized blockchain - Teleport Chain, a cross-chain protocol - XIBC, and developer SDKs for cross-chain dApps integration.

Some cross-chain application examples:

* **Cross-Chain DEX** users can swap tokens and provide liquidity on another chain by a single transaction.
* **Cross-Chain Lending Protocol** users can deposit tokens on one chain to borrow tokens on another chain.
* **Cross-Chain NFT Market** users can buy NFT on one chain from another chain.

### XIBC protocol

[XIBC protocol](../modules/XIBC/README.md) is a standard protocol based on [IBC](https://ibcprotocol.org/) for Teleport bridge implementation.

The protocol includes four modules, which are **client**, **packet**, **routing** and **basic applications**.

**Client** stores the trust root and verifies the packet(or acknowledgement) commitment proof.
**Packet** is the entry point for sending and receiving packets, and stores the packet(and acknowledgement).
**Routing** routes each sub-packet(or sub-acknowledgement) to each basic application to execute their own logic.
**Basic applications** are the cornerstone of application development on the XIBC protocol. They are token-transfer and remote-contract-call and multi-contract-call, you can directly use them for cross-chain transactions or develop your cross-chain dApps based on them.

#### XIBC client
There are currently two types of client
implementations for alternative relay approaches: 

Light client (for XIBC light client relayer)

[TSS Client](https://github.com/teleport-network/documents/blob/main/modules/XIBC/tss.md) (for XIBC TSS relayer)

The light client is for XIBC default relayer, which is trustless and permissionless. The cross-chain packet is verified on the destination chain. 
On the other hand, the TSS client is used where the light client is not feasible, for chains like Bitcoin which is not programmable, for layer2 like Arbitrum which doesn't have block to provide trust root, and for the dest chain Ethereum which is too expensive to verify trust root and state proof. The packet is verified by the TSS nodes instead of the destination chain.

## Architecture

### End-to-End Flow

#### Cross-chain interoperability between two chains

![avatar](./cross-chain.svg)

1. User sends a cross-chain transaction from the source chain via XIBC application contracts.
2. Source chain XIBC contracts generate cross-chain packets.
3. Relayer syncs the trust root, cross-chain packet and commitment proof from the source chain to destination chain. In most scenarios, the trust root is the merkle root of the state tree, and the proof of commitment is the merkle proof of the commitment in the state tree.
4. Destination chain XIBC contracts receive the cross-chain packet and verify the proof, and then execute the cross-chain packet and generate an acknowledgement.
5. Relayer syncs the trust root, the acknowledgement and the ack commitment proof from the destination chain to source chain.
6. Source chain XIBC contracts receive the ack and verify the proof, and then execute the acknowledgement. for instance, refund user funds if the cross-chain transfer fails.


#### Cross-chain interoperability between two chains via relay-chain

The Teleport Chain plays as a relay chain without any packet processing for business logic.

![avatar](./cross-chain-with-relay.svg)

1. User sends the cross-chain transaction with the specified relay chain from the source chain via the XIBC application contracts.
2. Source chain XIBC contracts generate cross-chain packets.
3. Relayer syncs the trust root, cross-chain packet and commitment proof from the source chain to relay chain.
4. Relay chain XIBC contracts receive the cross-chain data packet and verifies the proof, and then stores the data packet without any processing.
5. Relayer syncs the trust root, cross-chain packet and commitment proof from the relay chain to the destination chain.
6. On the destination chain, XIBC contracts receive the cross-chain packet and verify the proof, and then execute the cross-chain packet and generate an acknowledgement.
7. Relayer syncs the trust root, the acknowledgement, and the ack commitment proof from the destination chain to relay chain.
8. Relay chain XIBC contracts receive the cross-chain acknowledgement packet and verifies the proof, and then stores the acknowledgement without any processing.
9. Relayer syncs the trust root, the acknowledgement and the ack commitment proof from the relay chain to source chain.
10. Source chain XIBC contracts receives the acknowledgement and verify the proof, and then execute the acknowledgement. for instance, refund user funds if the cross-chain transfer fails.

### Develop your cross-chain dApps

XIBC protocol can be integrated with existing dApps seamlessly to empower them cross-chain interoperability. For example, add a cross-chain swap function to Uniswap, or add a cross-chain bidding function to OpenSea.

XIBC protocol basic application contract consists of three parts: token-transfer, remote-contract-call and multi-contract-call.

Token-transfer contract allows users or other contracts to invoke and initiate a cross-chain token-transfer packet. It also provides a shared cross-chain funding pool for all applications between the two chains.

Remote-contract-call contract allows users or other contracts to invoke and initiate a cross-chain contract-call packet.

Multi-call contract allows users or other contracts to call and initiate cross-chain packets, which contain multiple cross-chain token transfers and cross-chain contract-call sub-packets.

Developers can use the combination of the above three basic contracts to develop any cross-chain interoperability contracts.

Let us explain step by step the IBC protocol application design pattern of XIBC and how to develop an application through two examples

#### Remote contract call with token transfer

![avatar](./rcc-with-transfer.svg)

Step 1: User invokes the cross-chain method of dApp proxy

The cross-chain dApp proxy is deployed on the source chain by the developers for their dApp on the destination chain. The user now interacts with the proxy to initiate the cross-chain transaction. 

Step 2: The dApp proxy invokes XIBC multi-call contract

Step 3: XIBC multi-call contract invoke XIBC token-transfer contract and XIBC remote-contract-call contract to generate sub-packets

Step 4: XIBC packet initiates cross-chain packet

XIBC multi-call contract assembles all sub-packets into the cross-chain packet data and invokes the packet contract `[sendMultiPacket](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/core/packet/Packet.sol#L152)` function. Packet contract will verify the validity of the packet and store it.

Step 5: Relayers relay packet to the destination chain

Relayers relay the trust root, the packet and the packet proof to the destination chain.

Step 6: The packet is executed on the destination chain

On the Destination chain, XIBC contracts receive the cross-chain packets and verifies the proof, and then routes sub-packets to XIBC token-transfer contract and remote-contract-call contract. Basic application contracts execute their own logic and return sub-acknowledgements to the XIBC packet contract. Then the packet contract aggregates all sub-acknowledges and stores an acknowledgement corresponding to the packet.

Step 7: Relayers relay the acknowledgement back to the source chain

Step 8: The acknowledgement is executed on the source chain

Source chain XIBC packet contract receives the acknowledgement and verifies the proof, and then routes each sub-acknowledge to XIBC application contracts. 
XIBC token-transfer contract will [refund user funds if getting an error acknowledgement](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/apps/transfer/Transfer.sol#L434), RCC will store the [ack](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/apps/rcc/RCC.sol#L156) and users can execute their own exception handling logic by the ack.

#### Cross-chain transfer via Teleport using Teleport funding pool

In the above example, a token-transfer contract not only generates the cross-chain token transfer sub-packet, but also provides a cross-chain funding pool for cross-chain liquidity.

The teleport funding pool can be utilized via a cross-chain multi-call transaction.

![avatar](./2hop-transfer.svg)

Step 1: User initiates a transaction on the cross-chain dApp proxy

User initiates a transaction to the cross-chain transaction agent via Teleport basic application contract, 
which consists of token-transfer and remote-contract-call sub-operations on Teleport Chain.

Step 2: The dApp proxy invokes XIBC multi-call contract

Step 3: XIBC multi-call contract invokes XIBC token-transfer contract and XIBC remote-contract-call contract to generate sub-packets

Step 4: XIBC packet contract initiates a cross-chain packet

Step 5: Relayers relay the packet to Teleport Chain

Step 6: The packet is executed on Teleport Chain

Step 7: The cross-chain transaction agent contract invokes XIBC token-transfer contract and initiates next cross-chain packet

The token-transfer receiver on Teleport Chain is the remote-contract-call contract. So the remote-contract-call contract can carry the transferred token while invoking the cross-chain transfer agent contract on Teleport Chain.

Step 8: Relayers packet to the destination chain

Step 9: The packet is executed on the destination chain

The transferred token can be utilized for the dApp contract call, like token swap or staking.

Step 10: Relayers relay the acknowledgement back to Teleport Chain

Step 11: Relayers relay the acknowledgement back to the source chain

Step 12: Execute the acknowledgement on the source chain

