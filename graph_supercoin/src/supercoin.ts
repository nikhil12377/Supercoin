import {
  itemGotCanceled as itemGotCanceledEvent,
  itemGotDelivered as itemGotDeliveredEvent,
  newItemBought as newItemBoughtEvent,
  newTokensIssued as newTokensIssuedEvent,
  tokensAllocated as tokensAllocatedEvent,
} from "../generated/Supercoin/Supercoin";
import {
  itemGotCanceled,
  itemGotDelivered,
  newItemBought,
  newTokensIssued,
  tokensAllocated,
} from "../generated/schema";

export function handleitemGotCanceled(event: itemGotCanceledEvent): void {
  let entity = new itemGotCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleitemGotDelivered(event: itemGotDeliveredEvent): void {
  let entity = new itemGotDelivered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlenewItemBought(event: newItemBoughtEvent): void {
  let entity = new newItemBought(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlenewTokensIssued(event: newTokensIssuedEvent): void {
  let entity = new newTokensIssued(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handletokensAllocated(event: tokensAllocatedEvent): void {
  let entity = new tokensAllocated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
