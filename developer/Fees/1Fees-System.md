
# Cross-Chain Fees Logic



## General System Design

User Applications pre-pay fees on the source chain to cover the gas expense on the relay chain and destination chain.

After paying fees, the Relayer will estimate whether these fees can cover the cost of cross-chain transactions. If not, the transaction will not get relayed. In this case, user Applications should [add more fees](./3HowToAddFees.md) to push the process forward. 

---

## Fee Rules

Teleport charges these fees to cover the gas spent on the destination chains, if the destination chain is Teleport Chain, we provide free relay. For more detailed fee rules, please check the following:

### 1-Hop

#### Ethereum (high gas cost chain) => Teleport

**Transfer**


- `relay packet`： Free
- `relay ack`： ACK won’t return
- `relay err ack`： The relayer provides paid relay interface, and the user provides the route and sequence to actively return error ACK.

A cross-chain transfer should not generate an error ACK if the sending route is bound. If the sending route is not bound, an ACK error occurs and the user needs to return the ACK at his own expense.

**RCC**

- `relay packet`： Free
- `relay (err) ack`： The relayer provides paid relay interface, and the user provides the route and sequence to actively return error ACK.

**MultiCall**

- `relay packet`： Free
- `relay (err) ack`： The relayer provides paid relay interface, and the user provides the route and sequence to actively return error ACK.

#### 2. ChainA （low gas cost chain） => Teleport

**Transfer**

- `relay packet`： Prepaid
- `relay (err) ack`：Automatic return ACK

**RCC**

- `relay packet`： Prepaid
- `relay (err) ack`：Automatic return ACK

**MultiCall**

- `relay packet`：Prepaid
- `relay (err) ack`：Automatic return ACK

#### 3. Teleport => ChainA

**Transfer**

- `relay packet`：Prepaid
- `relay (err) ack`：Automatic return ACK

**RCC**

- `relay packet`：Prepaid
- `relay (err) ack`：Automatic return ACK

**MultiCall**

- `relay packet`：Prepaid
- `relay (err) ack`：Automatic return ACK

### 2-Hop 

- `relay packet`：Prepaid
- `relay (err) ack`：Automatic return ACK


---

## Fee Estimator

The fees are based on the gas cost by custom contract calls and the current gas price. 

When integrating with the [official bridge](https://bridge.testnet.teleport.network/), you can use our [API]() to estimate the cost. 

When integrating directly with our XIBC contracts, the cost is based on the actions the user application wants to perform on the destination chain, developers need to estimate the expense themselves as of now; however, we will open an API to help with this soon.