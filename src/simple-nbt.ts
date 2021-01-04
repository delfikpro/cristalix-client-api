/// <reference path="../reference/cristalix.d.ts" />

export type NbtData = { [key: string]: NBTTagCompound | NBTBase };

export function long(v: long): NBTTagLong {
  return new NBTTagLong(v);
}

export function double(v: double): NBTTagDouble {
  return new NBTTagDouble(v);
}

export function int(v: int): NBTTagInt {
  return new NBTTagInt(v);
}

export function float(v: float): NBTTagFloat {
  return new NBTTagFloat(v);
}

export function short(v: short): NBTTagShort {
  return new NBTTagShort(v);
}

export function byte(v: byte): NBTTagByte {
  return new NBTTagByte(v);
}

export function boolean(v: boolean): NBTTagByte {
  return new NBTTagByte(v ? 1 : 0);
}

export function string(v: string): NBTTagString {
  return new NBTTagString(v);
}

export function bytes(v: byte[]): NBTTagByteArray {
  return new NBTTagByteArray(v);
}

export function ints(v: int[]): NBTTagIntArray {
  return new NBTTagIntArray(v);
}

export function longs(v: long[]): NBTTagLongArray {
  return new NBTTagLongArray(v);
}

export function strings(v: string[]): NBTTagList {
  return new NBTTagList(v.map(string));
}

export function list(values: NBTBase[]): NBTTagList {
  return new NBTTagList(values);
}

export function number(v: number): NBTPrimitive {
  return (v >= -128 && v <= 127) ? new NBTTagByte(v)
      : (v >= -32768 && v <= 32767) ? new NBTTagShort(v)
          : (v >= 0x80000000 && v <= 0x7fffffff) ? new NBTTagInt(v)
              : new NBTTagLong(v);
}

export function nbt(data: NbtData): NBTTagCompound {
  const result = new NBTTagCompound();
  for (const key in data) {
    result.setTag(key, data[key] as NBTBase);
  }
  return result;
}
