# Getting Started

## Teleport supports different cross-chain approaches which include:

1-Hop: Chain A to Chain B

2-Hop: Teleport as Relay Chain

2-Hop: Teleport Agent Pool

Based on your application needs, you can select different approaches to develop and get the corresponding guide.

## The difference between them 

![Difference](./3types.jpg)

### 1-Hop 

This is the way in which you transfer assets and/or messages directly from Chain A to Chain B. We currently support the connections from the following chains to the teleport Chain.

- BNB Chain
- Ethereum (Rinkeby)
- Arbitrum

examples:

A. ChainA to ChainB specific Assets bridge with own liquidity

B. Peg Blue-Chip Assets on Teleport Chain

C. [Cross-chain contract call](./../Code-Examples/1.1-HopPingPong.md)

In practice, you can using this mode by simply specify the following 3 parameters:

SourceChain: Chain A

RelayChain: '' (Yes,this means without relay chain)

destChain: Chain B

### 2-Hop with teleport as Relay Chain

This design is mainly for the consideration of scalability. We use the Teleport chain as the relay chain in the architecture design, in this way, newly added blockchains won’t have to construct links with each existing chain, it only needs to connect to the relay chain (Teleport Chain). By integrating with this, you can build applications to send assets and/or messages from any chain to any chain we supported.

examples:

A. Universal assets bridge with third-party liquidity

B. cross-chain swap/lend/farm based on A

In practice, you can using this mode by simply specify the following 3 parameters:

SourceChain: Chain A

RelayChain: teleport

destChain: Chain B

### 2-Hop as Transportation Hub

On the basis of the strong scalability, this approach enables user applications to handle additional logic on the Teleport chain as a relay chain and, more importantly, to take advantage of the massive liquidity provided by Teleport.

In this model, cross-chain messages are re-packet through the Teleport network (developers need to deploy contracts on the Teleport chain to handle the transmit logic).

examples:

A. Official Teleport Bridge：[Code Example](../Code-Examples/4.2-HopAgent(Official-Bridge).md)

B. Cross-chain swap using teleport liquidity

In practice, you can think this mode as the combination of two 1-Hops, so 

First Hop:

SourceChain: Chain A

RelayChain: ''

destChain: teleport

Second Hop:

SourceChain: teleport

RealyChain: ''

destChain: Chain B