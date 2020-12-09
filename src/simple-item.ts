/// <reference path="../reference/cristalix.d.ts" />

import {nbt, int, short} from "./simple-nbt";

export type ItemData = {
  type: int,
  metadata: int,
  count: int,
  nbt?: NBTTagCompound,
};

export function item(data: ItemData): ItemStack {
  const item = new ItemStack(nbt({
    id: int(data.type),
    Damage: short(data.metadata),
    Count: int(data.count),
  }));
  const $nbt = data.nbt;
  if ($nbt) {
    item.setTagCompound($nbt);
  }
  return item;
}
