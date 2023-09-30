import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  OwnershipTransferred,
  Transfer,
  itemGotCanceled,
  itemGotDelivered,
  newItemBought,
  newTokensIssued,
  tokensAllocated
} from "../generated/Supercoin/Supercoin"

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}

export function createitemGotCanceledEvent(
  user: Address,
  amount: BigInt
): itemGotCanceled {
  let itemGotCanceledEvent = changetype<itemGotCanceled>(newMockEvent())

  itemGotCanceledEvent.parameters = new Array()

  itemGotCanceledEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  itemGotCanceledEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return itemGotCanceledEvent
}

export function createitemGotDeliveredEvent(
  user: Address,
  amount: BigInt
): itemGotDelivered {
  let itemGotDeliveredEvent = changetype<itemGotDelivered>(newMockEvent())

  itemGotDeliveredEvent.parameters = new Array()

  itemGotDeliveredEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  itemGotDeliveredEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return itemGotDeliveredEvent
}

export function createnewItemBoughtEvent(
  user: Address,
  amount: BigInt
): newItemBought {
  let newItemBoughtEvent = changetype<newItemBought>(newMockEvent())

  newItemBoughtEvent.parameters = new Array()

  newItemBoughtEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  newItemBoughtEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return newItemBoughtEvent
}

export function createnewTokensIssuedEvent(
  user: Address,
  amount: BigInt
): newTokensIssued {
  let newTokensIssuedEvent = changetype<newTokensIssued>(newMockEvent())

  newTokensIssuedEvent.parameters = new Array()

  newTokensIssuedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  newTokensIssuedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return newTokensIssuedEvent
}

export function createtokensAllocatedEvent(
  from: Address,
  to: Address,
  amount: BigInt
): tokensAllocated {
  let tokensAllocatedEvent = changetype<tokensAllocated>(newMockEvent())

  tokensAllocatedEvent.parameters = new Array()

  tokensAllocatedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  tokensAllocatedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  tokensAllocatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokensAllocatedEvent
}
