/// <reference path="../reference/cristalix.d.ts" />

import { nbt, int, short, string } from "./simple-nbt";

export type ItemData = {
  type: string,
  metadata: int,
  count: int,
  nbt?: NBTTagCompound,
};

export function item(data: ItemData): ItemStack {
  return create(data.type, data.metadata, data.count, data.nbt)
}

export function create(id: string, data: number, amount: number, tag?: NBTTagCompound) {
  const item = new ItemStack(nbt({
    id: string(id),
    Damage: short(data),
    Count: int(amount),
  }));
  if (tag) item.setTagCompound(tag);
  return item;
}