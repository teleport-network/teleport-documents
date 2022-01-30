# Relayers

Relayer algorithms are the "physical" connection layer of XIBC — off-chain processes responsible for relaying data between two chains running the IBC protocol by scanning the state of each chain, constructing appropriate datagrams, and executing them on the opposite chain as allowed by the protocol. 

Relayer has different process logic for each XIBC client, now there are two process implementations:

* Light client relayer
* TSS relayer

## Light client relayer

## TSS relayer