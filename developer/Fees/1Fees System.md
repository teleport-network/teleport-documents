
# Cross-Chain Fees Logic



## General System Design

User Applications pre-pay fees on the source chain to cover the gas expense on the relay chain and destination chain.

After paying fees, the Relayer will estimate whether these fees can cover the cost of cross-chain transactions. If not, the transaction will not get relayed. In this case, user Applications should [add more fees](./3HowToAddFees.md) to push the process forward. 

---

## Fee Rules

Teleport charges these fees to cover the gas spent on the destination chains, if the destination chain is Teleport Chain, we provide free relay. For more detailed fee rules, please check the following:



---

## Fee Estimator

The fees are based on the gas cost by custom contract calls and the current gas price. 

When integrating with the [official bridge](https://bridge.testnet.teleport.network/), you can use our [API]() to estimate the cost. 

When integrating directly with our XIBC contracts, the cost is based on the actions the user application wants to perform on the destination chain, developers need to estimate the expense themselves as of now; however, we will open an API to help with this soon.
