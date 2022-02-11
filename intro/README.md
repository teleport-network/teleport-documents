# Teleport Network

Teleport Network provides an infrastructure and framework for cross-chain communication. It consists of a decentralized blockchain - Teleport Chain, a cross-chain protocol - XIBC, and developer SDKs for cross-chain dApps integration.

A few examples of cross-chain practices:

* **Cross-Chain DEX** - complete cross-chain token swap and liquidity providing in a single transaction
* **Cross-Chain Lending Protocol** - supply tokens to borrow other tokens from a different chain
* **Cross-Chain NFT Market** - cross-chain NFT purchase

### XIBC protocol

[XIBC protocol](https://chain-docs.teleport.network/modules/XIBC) is a standard protocol based on [IBC](https://ibcprotocol.org/) for Teleport bridge implementation including four modules - **client**, **packet**, **routing** and **basic applications**.

**Client** - stores the trust root and verifies packet(or acknowledgement) commitment proof. Currently there are two types of client implementations for alternative relay approaches:
* **Light client for XIBC light client relayer**: trustless and permissionless, making sure cross-chain packet is verified on the destination chain; 
* **TSS client for XIBC TSS relayer**: used where the light client is not feasible (for chains like Bitcoin which is not programmable, for layer2 like Arbitrum which doesn't have block to provide trust root, and for the dest chain Ethereum which is too expensive to verify trust root and state proof). The packet is verified by TSS nodes instead of the destination chain nodes.
   
**Packet** - Packet module is the entry point for sending and receiving cross-chain packets. It also stores the packets(and the acknowledgement).

**Routing** - routes each sub-packet(or sub-acknowledgement) to each basic application to execute their own logic.

**Basic applications** - the cornerstone of application development based on the XIBC protocol. The module contains  token-transfer, remote-contract-call and multi-contract-call, which can be directly adopted for cross-chain transactions or cross-chain dApps development.

## Architecture

### End-to-End Flow

#### Cross-chain interoperability between two chains

![avatar](./cross-chain.svg)

1. A user sends a cross-chain transaction from the source chain via XIBC application contracts.
2. Source chain XIBC contracts generate cross-chain packets.
3. Relayer syncs the trust root, cross-chain packet and commitment proof from the source chain to the destination chain. In most curcumstances, the trust root is the merkle root of the state tree, and the proof of commitment is the merkle proof of the commitment in the state tree.
4. Destination chain XIBC contracts receive the cross-chain packet and verify the proof. Subsequently the cross-chain packet is executed to generate an acknowledgement.
5. Relayer syncs the trust root, acknowledgement and ack commitment proof from the destination chain to source chain.
6. Source chain XIBC contracts receive the ack and verify the proof, and then execute the acknowledgement. For instance, a user will have his funds returned if the cross-chain transfer fails.


#### Cross-chain interoperability between two chains via relay-chain

Teleport Chain acts as a relay chain without any packet processing for business logic.

![avatar](./cross-chain-with-relay.svg)

1. A user sends the cross-chain transaction with the specified relay chain from the source chain via the XIBC application contracts.
2. Source chain XIBC contracts generate cross-chain packets.
3. Relayer syncs the trust root, cross-chain packet and commitment proof from the source chain to relay chain.
4. Relay chain XIBC contracts receive the cross-chain data packet and verifies the proof, and then stores the data packet without any processing.
5. Relayer syncs the trust root, cross-chain packet and commitment proof from the relay chain to the destination chain.
6. On the destination chain, XIBC contracts receive the cross-chain packet and verify the proof, then execute the cross-chain packet and generate an acknowledgement.
7. Relayer syncs the trust root, the acknowledgement, and the ack commitment proof from the destination chain to relay chain.
8. Relay chain XIBC contracts receive the cross-chain acknowledgement packet and verifies the proof, then stores the acknowledgement without any processing.
9. Relayer syncs the trust root, acknowledgement and ack commitment proof from the relay chain to source chain.
10. Source chain XIBC contracts receives the acknowledgement and verify the proof, and then execute the acknowledgement. For instance, a user will have his funds returned if the cross-chain transfer fails.

### Develop your cross-chain dApps

Existing dApps can be integrated with XIBC protocol seamlessly for cross-chain interoperability. For example, Uniswap can become a cross-chain dex by simply adding the cross-chain swap function powered by XIBC.

XIBC protocol basic application contract consists of three parts: token-transfer, remote-contract-call, and multi-contract-call:

* **Token-transfer contract** allows users or other contracts to invoke and initiate a cross-chain token-transfer packet. It also provides a shared cross-chain funding pool for all applications between any two chains.

* **Remote-contract-call contract** also allows users or other contracts to invoke and initiate a cross-chain contract-call packet.

* **Multi-call contract** allows users or other contracts to call and initiate cross-chain packets, including cross-chain contract-call sub-packets with/without multiple cross-chain token transfers.

Developers can use the combination of the above three basic application contracts to develop any cross-chain interoperable contracts.

Below shows the IBC protocol application design of XIBC step by step as well as how to develop an application. 

#### Remote contract-call with token transfer

![avatar](./rcc-with-transfer.svg)

Step 1: A user invokes the cross-chain method of dApp proxy

The cross-chain dApp proxy is deployed on the source chain by the developers for their dApp on the destination chain. The user now interacts with the proxy to initiate the cross-chain transaction. 

Step 2: The dApp proxy invokes XIBC multi-call contract

Step 3: XIBC multi-call contract invokes XIBC token-transfer contract and XIBC remote-contract-call contract to generate sub-packets

Step 4: XIBC packet initiates cross-chain packet

XIBC multi-call contract assembles all sub-packets into the cross-chain packet data and invokes the packet contract `[sendMultiPacket](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/core/packet/Packet.sol#L152)` function. Packet contract will verify the validity of the packet and store it.

Step 5: Relayers relay packet to the destination chain

Relayers relay the trust root, the packet and the packet proof to the destination chain.

Step 6: The packet is executed on the destination chain

On the Destination chain, XIBC contracts receive the cross-chain packets and verifies the proof, and then routes sub-packets to XIBC token-transfer contract and remote-contract-call contract. Basic application contracts execute their own logic and return sub-acknowledgements to the XIBC packet contract. Then the packet contract aggregates all sub-acknowledges and stores an acknowledgement corresponding to the packet.

Step 7: Relayers relay the acknowledgement back to the source chain and the acknowledgement will be executed by XIBC token-transfer contract and XIBC remote-contract-call contract.

Source chain XIBC packet contract receives the acknowledgement and verifies the proof, and then routes each sub-acknowledgement to XIBC application contracts. 
XIBC token-transfer contract will [return funds to users when encountering an acknowledgement error.](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/apps/transfer/Transfer.sol#L434), RCC will store the [ack](https://github.com/teleport-network/xibc-contracts/blob/main/evm/contracts/apps/rcc/RCC.sol#L156) and users can execute their own exception handling logic by the ack.

#### Cross-chain transfer via Teleport funding pool

In the above example, a token-transfer contract not only generates the cross-chain token transfer sub-packet, but also provides a cross-chain funding pool for cross-chain liquidity.

Teleport funding pool can be utilized via a cross-chain multi-call transaction.

![avatar](./2hop-transfer.svg)

Step 1: A user initiates a transaction on the cross-chain dApp proxy

A user initiates a transaction to the cross-chain transaction agent via Teleport basic application contracts.

Step 2: The dApp proxy invokes XIBC multi-call contract

Step 3: XIBC multi-call contract invokes XIBC token-transfer contract and XIBC remote-contract-call contract to generate sub-packets

Step 4: XIBC packet contract initiates a cross-chain packet

Step 5: Relayers relay the packet to Teleport Chain

Step 6: The packet is executed on Teleport Chain

Step 7: The cross-chain transaction agent contract invokes XIBC token-transfer contract and initiates next cross-chain packet

The token-transfer receiver on Teleport Chain is the remote-contract-call contract which carries the transferred token while invoking the cross-chain transfer agent contract on Teleport Chain.

Step 8: Relayers packet to the destination chain

Step 9: The packet is executed on the destination chain

The transferred token can be utilized for the dApp contract call, like token swap or staking.

Step 10: Relayers relay the acknowledgement back to Teleport Chain

Step 11: Relayers relay the acknowledgement back to the source chain and the acknowledgement will be executed by XIBC token-transfer contract and XIBC remote-contract-call contract.

