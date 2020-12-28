// Java
declare type long = number;
declare type double = number;
declare type int = number;
declare type float = number;
declare type char = number;
declare type short = number;
declare type byte = number;

declare interface Closeable {

    close(): void;
}

declare abstract class InputStream implements Closeable {

    read(): int;

    read(b: byte[], off: int, length: int): int;

    skip(n: long): long;

    available(): int;

    mark(readlimit: number): void;

    reset(): void;

    markSupported(): boolean;

    close(): void;
}

declare class DataInputStream extends InputStream {

    constructor(stream: InputStream);

    readFully(b: byte[], off: int, len: int): void;

    skipBytes(n: int): int;

    readBoolean(): boolean;

    readByte(): byte;

    readUnsignedByte(): byte;

    readShort(): short;

    readUnsignedShort(): short;

    readChar(): char;

    readInt(): int;

    readLong(): long;

    readFloat(): float;

    readDouble(): double;

    readUTF(): string;
}

declare interface DataOutput {

    write(b: byte[], off: int, len: int): void;

    writeBoolean(v: boolean): void;

    writeByte(v: int): void;

    writeShort(v: int): void;

    writeChar(v: int): void;

    writeInt(v: int): void;

    writeLong(v: long): void;

    writeFloat(v: float): void;

    writeDouble(v: double): void;

    writeBytes(s: string): void;

    writeChars(s: string): void;

    writeUTF(s: string): void;
}

declare interface Flushable {

    flush(): void;
}

declare abstract class OutputStream implements Closeable, Flushable {
    write(b: byte[], off: int, len: int): void;

    close(): void;

    flush(): void;
}

declare class ChunkProvider {

    getLoadedChunk(x: int, z: int): Chunk;

    provideChunk(x: int, z: int): Chunk;
  
    tick(): boolean;
  
    makeString(): string;
  
    isChunkGeneratedAt(x: int, z: int): boolean;
  
    load(x: int, z: int): Chunk;
  
    unload(x: int, z: int): void;
  
    put(chunk: Chunk): void;
}

declare class Block {

    static getIdFromBlock(block: Block): number;
    
    static getStateId(state: IBlockState): number;
    
    static getBlockById(id: number): Block;
    
    static getStateById(id: number): IBlockState;
}

declare interface IBlockState {

}

declare type Runnable = () => {};
declare type Consumer<T> = (data: T) => {};

declare class EntityArmorStand extends EntityLivingBase {

    setSmall(value: boolean): void;

    isSmall(): boolean;
  
    setShowArms(value: boolean): void;
  
    getShowArms(): boolean;
  
    setNoBasePlate(value: boolean): void;
  
    hasNoBasePlate(): boolean;
  
    setMarker(value: boolean): void;
  
    hasMarker(): boolean;

}

declare class Chunk {

    getHeight(pos: BlockPos): number;

    getHeightValue(x: int, z: int): number;
  
    getTopFilledSegment(): number;
  
    // getBlockStorageArray(): ExtendedBlockStorage[];
  
    generateSkylightMap(): void;
  
    getBlockState(x: int, y: int, z: int): IBlockState;
  
    setBlockState(pos: BlockPos, state: IBlockState): IBlockState;
  
    // getLightFor(p_getLightFor_1_: EnumSkyBlock, x: number, y: number, z: number): number;
  
    // setLightFor(p_setLightFor_1_: EnumSkyBlock, x: number, y: number, z: number, dflt: number): void;
  
    getLightSubtracted(x: int, y: int, z: int, dflt: int): number;
  
    canSeeSky(x: int, y: int, z: int): boolean;
  
    isEmpty(): boolean;
  
    getPrecipitationHeightY(x: int, z: int): int;
  
    isPopulated(): boolean;
  
    wasTicked(): boolean;
  
    isEmptyBetween(x: int, z: int): boolean;
  
    // setStorageArrays(arrays: ExtendedBlockStorage[]): void;
  
    // read(buffer: PacketBuffer, extractedSize: number, full: boolean): void;
  
    // getBiome(x: number, z: number, provider: BiomeProvider): Biome;
  
    getBiomeArray(): byte[];
  
    setBiomeArray(biomeArray: byte[]): void;
  
    resetRelightChecks(): void;
  
    enqueueRelightChecks(): void;
  
    checkLight(): void;
  
    isLoaded(): boolean;
  
    markLoaded(loaded: boolean): void;
  
    getWorld(): World;
  
    getHeightMap(): byte[];
  
    setHeightMap(heightMap: byte[]): void;
  
    isTerrainPopulated(): boolean;
  
    setTerrainPopulated(terrainPopulated: boolean): void;
  
    isLightPopulated(): boolean;
  
    setLightPopulated(lightPopulated: boolean): void;
  
    getLowestHeight(): int;
  
    getX(): int;
  
    getZ(): int;
  
    getKey(): long;
}

declare enum EnumPlayerModelParts {
    CAPE = 'CAPE',
    JACKET = 'JACKET',
    LEFT_SLEEVE = 'LEFT_SLEEVE',
    RIGHT_SLEEVE = 'RIGHT_SLEEVE',
    LEFT_PANTS_LEG = 'LEFT_PANTS_LEG',
    RIGHT_PANTS_LEG = 'RIGHT_PANTS_LEG',
    HAT = 'HAT',
}

declare class EntityPlayer extends EntityLivingBase {

    getScore(): int;

    setScore(score: int): void;

    // TODO dropItem && dropItemAndGetStack

    getDigSpeed(state: IBlockState): float;

    canHarvestBlock(state: IBlockState): boolean;

    getArmorVisibility(): float;

    // TODO openEditSign,displayVillagerTradeGui,openBook

    isUser(): boolean;

    getGameProfile(): GameProfile;

    setGameProfile(profile: GameProfile): void;

    isInBed(): boolean;

    isPlayerSleeping(): boolean;

    isPlayerFullyAsleep(): boolean;

    getSleepTimer(): int;

    addExperience(count: int): void;

    addExperienceLevel(count: int): void;

    xpBarCap(): int;

    // TODO getFoodStats

    canEat(check: boolean): boolean;

    shouldHeal(): boolean;

    isAllowEdit(): boolean;

    canPlayerEdit(pos: BlockPos, facing: EnumFacing, stack: ItemStack): boolean;

    addItemStackToInventory(stack: ItemStack): boolean;

    isSpectator(): boolean;

    isCreative(): boolean;

    isWearing(part: EnumPlayerModelParts): boolean;

    hasReducedDebug(): boolean;

    setReducedDebug(reduced: boolean): void;

    setPrimaryHand(side: EnumHandSide): void;

    getCooldownPeriod(): float;

    getCooledAttackStrength(adjustTicks: float): float;

    resetCooldown(): void;

    getLuck(): float;

    setWearing(part: EnumPlayerModelParts): void;

    getInventory(): InventoryPlayer;
}

declare abstract class AbstractClientPlayer extends EntityPlayer {

    hasPlayerInfo(): boolean;

    getPlayerInfo(): NetworkPlayerInfo;

    setPlayerInfo(info: NetworkPlayerInfo): void;

    hasSkin(): boolean;

    getLocationSkin(): ResourceLocation;

    getLocationCape(): ResourceLocation;

    getLocationElytra(): ResourceLocation;

    getSkinType(): string;

    getFovModifier(): float;

    hasElytraCape(): boolean;
}

declare class EntityPlayerSP extends AbstractClientPlayer {

    getServerBrand(): string;

    getPermissionLevel(): int;

    setXPStats(currentXP: float, maxXP: int, level: int): void;

    isRidingHorse(): boolean;

    isCurrentViewEntity(): boolean;

    isRowingBoat(): boolean;

    isAutoJumpEnabled(): boolean;
}

declare enum EntityEquipmentSlot {
    MAINHAND = 'MAINHAND',
    OFFHAND = 'OFFHAND',
    FEET = 'FEET',
    LEGS = 'LEGS',
    CHEST = 'CHEST',
    HEAD = 'HEAD',
}

declare enum EnumHand {
    MAIN_HAND = 'MAIN_HAND',
    OFF_HAND = 'OFF_HAND',
}

declare enum EnumHandSide {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

declare class EntityLivingBase extends Entity {

    getHealth(): float;

    getMaxHealth(): float;

    isMovementBlocked(): boolean;

    setMovementBlocked(blocked: boolean): void;

    getHeldItemMainhand(): ItemStack;

    getHeldItemOffhand(): ItemStack;

    getItemStackFromSlot(slot:EntityEquipmentSlot): ItemStack;

    isHandActive(): boolean;

    getActiveHand(): EnumHand;

    setActiveHand(hand: EnumHand): void;

    getActiveItemStack(): ItemStack;

    getItemInUseCount(): int;

    getItemInUseMaxCount(): int;

    isActiveItemStackBlocking(): boolean;

    isElytraFlying(): boolean;

    getTicksElytraFlying(): boolean;

    isChild(): boolean;

    // TODO potions

    isEntityUndead(): boolean;

    setHealth(health: float): void;

    isOnLadder(): boolean;

    performHurtAnimation(): void;

    getTotalArmorValue(): int;

    getArrowCountInEntity(): int;

    setArrowCountInEntity(count: int): void;

    swingArm(hand: EnumHand): void;

    getHeldItem(hand: EnumHand): ItemStack;

    setHeldItem(hand: EnumHand, stack: ItemStack): void;

    hasItemInSlot(slot: EntityEquipmentSlot): boolean;

    jump(): void;

    travel(x: float, y: float,  z: float): void;

    getAIMoveSpeed(): float;

    setAIMoveSpeed(speed: float): void;

    canEntityBeSeen(entity: Entity): boolean;

    setRenderYawOffset(yawOffset: float): void;

    getPrimaryHand(): EnumHandSide;

    isJumping(): boolean;

    getRotationYawHead(): float;

    setRotationYawHead(rotationYawHead: float): void;

    getAbsorptionAmount(): float;

    setAbsorptionAmount(absorptionAmount: float): void;
}

declare class PluginMessages {
    static on(handle: any, channel: string, listener: (e: ByteBuf) => void, priority?: number): void;

    static off(channel: string, listener: (e: ByteBuf) => void): void;

    static off(handle: any): void;

    static emit(channel: string, data: ByteBuf): void;
}


declare class ByteBuf {

    readItemStack(): ItemStack;

    readInt(): int;

    readVarInt(): int;
    
    readLong(): long;

    readDouble(): double;

    readableBytes(): int;

    nioBuffer(): ByteBuffer;

    writeFloat(value: float): ByteBuf;

    resetReaderIndex(): void;
    
    resetWriterIndex(): void;
}

declare class ByteBuffer {

    asFloatBuffer(): FloatBuffer;
}

declare class FloatBuffer {

    clear(): void;

    put(value: byte): FloatBuffer;

    flip(): void;

    putFloat(value: float): FloatBuffer;
}


declare class Unpooled {

    static buffer(initialCapacity?: int): ByteBuf;

    static directBuffer(initialCapacity?: int): ByteBuf;
}

declare class UtilNetty {

    static writeString(buf: ByteBuf, str: string): void;

    static readString(buf: ByteBuf, maxLength: int): string;
}

declare class WorldExtensions {
    static setTotalTime(time: long): void;

    static setTime(time: long): void;
}

// BOTH
declare class Display {
    static getTitle(): string;

    static isFullscreen(): boolean;

    static setTitle(title: string): void;

    static isActive(): boolean;

    static getAdapter(): string;

    static getVersion(): string;

    static getX(): int;

    static getY(): int;

    static getWidth(): int;

    static getHeight(): int;
}

declare class GL11 {

    static GL_LIGHT0: int;
    static GL_LIGHT1: int;
    static GL_POSITION: int;
    static GL_DIFFUSE: int;
    static GL_AMBIENT: int;
    static GL_SPECULAR: int;
    static GL_LIGHT_MODEL_AMBIENT: int;
    static GL_LESS: int;
    static GL_EQUAL: int;
    static GL_LEQUAL: int;
    static GL_NEVER: int;
    static GL_GREATER: int;
    static GL_NOTEQUAL: int;
    static GL_GEQUAL: int;
    static GL_ALWAYS: int;
    static GL_POLYGON_OFFSET_FILL: int;
    static GL_ZERO: int;
    static GL_ONE: int;
    static GL_SRC_COLOR: int;
    static GL_ONE_MINUS_SRC_COLOR: int;
    static GL_DST_COLOR: int;
    static GL_ONE_MINUS_DST_COLOR: int;
    static GL_SRC_ALPHA: int;
    static GL_ONE_MINUS_SRC_ALPHA: int;
    static GL_DST_ALPHA: int;
    static GL_ONE_MINUS_DST_ALPHA: int;
    static GL_CONSTANT_COLOR: int;
    static GL_ONE_MINUS_CONSTANT_COLOR: int;
    static GL_CONSTANT_ALPHA: int;
    static GL_ONE_MINUS_CONSTANT_ALPHA: int;
    static GL_COLOR_BUFFER_BIT: int;
    static GL_TEXTURE_2D: int;
    
    static glTranslatef(x: float, y: float, z: float): void;

    static glPolygonOffset(factor: float, units: float): void;

    static glScalef(x: float, y: float, z: float): void;

    static glRotatef(degrees: float, x: float, y: float, z: float): void;

    static glColor4f(a: float, r: float, g: float, b: float): void;

    static glPushMatrix(): void;

    static glPopMatrix(): void;

    static glPushAttrib(attrib: int): void;

    static glPopAttrib(): void;

    static glEnable(property: int): void;

    static glDisable(property: int): void;

    static glLight(par1: int, par2: int, buffer: FloatBuffer): void;

    static glLightModel(par1: int, buffer: FloatBuffer): void;

    static glDepthFunc(func: int): void;

    static glDepthMask(enabled: boolean): void;

    static glBlendFunc(srcFactor: int, dstFactor: int): void;

    static glBlendFunci(buf: int, srcFactor: int, dstFactor: int): void;

    // static glDisableLighting(): void;

    // static glEnableLighting(): void;
}

declare class GL14 {

    static glBlendColor(r: float, g: float, b: float, a: float): void;
}

declare class GlStateManager {

    static disableLighting(): void;

    static enableLighting(): void;

    static disableBlend(): void;

    static enableBlend(): void;

    static tryBlendFuncSeparate(a: int, b: int, c: int, d: int): void;

    static disableTexture2D(): void;

    static enableTexture2D(): void;

    static disableDepth(): void;

    static enableDepth(): void;

    static disableLight(par1: int): void;
    
    static disableColorMaterial(): void;

    static enableLight(par1: int): void;
    
    static enableColorMaterial(): void;

    static colorMaterial(par1: int, par2: int): void;

    static shadeModel(par1: int): void;
}

declare class RenderHelper {

    static enableStandardItemLighting(): void;

    static enableGUIStandardItemLighting(): void;

    static disableStandardItemLighting(): void;
}

declare class Textures {

    static bindTexture(textureLocation: string | ResourceLocation): void;
}

declare class Draw {

    static getFps(): int;

    static drawHorizontalLine(startX: int, endX: int, y: int, color: int): void;

    static drawVerticalLine(x: int, startY: int, endY: int, color: int): void;

    static drawRect(left: number, top: int, right: int, bottom: int, color: int): void;

    static drawStringWithShadow(text: string, x: int, y: int, color?: int): int;

    static drawString(text: string, x: int, y: int, color?: int, dropShadow?: boolean): int;

    static getStringWidth(text: string): int;

    static getCharWidth(char: number): int;

    static trimStringToWidth(text: string, width: int, reverse?: boolean): string;

    static drawSplitString(text: string, x: int, y: int, wrapWidth: int, textColor?: int): void;

    static drawScaledCustomSizeModalRect(x: int, y: int, u: int, v: int, uWidth: int, vHeight: int, width: int, height: int, tileWidth : int, tileHeight: int): void;

    static getResolution(): ScaledResolution;

    static renderItemAndEffectIntoGUI(item: ItemStack, x: int, y: int): void;

    static displayItemActivation(item: ItemStack): void;
}

declare type EnumFacing = 'DOWN' | 'UP' | 'NORTH' | 'SOUTH' | 'WEST' | 'EAST';
declare type EquipmentSlot = 'FEET' | 'LEGS' | 'CHEST' | 'HEAD' | 'OFFHAND';

declare type ChatEvent = {
    message: string,
    readonly command: boolean,
    cancelled: boolean,
};
declare type KeyPressEvent = {
    key: number,
    cancelled: boolean,
};
declare type NameRenderEvent = {
    entity: Entity,
    x: float,
    y: float,
    z: float,
    cancelled: boolean,
};
declare type RenderPassEvent = {
    pass: int,
    partialTicks: float,
};
declare type WindowClickEvent = {
    windowId: int,
    slotId: int,
    mouseButton: int,
    clickType: int,
    cancelled: boolean,
};
declare type CancellableRenderEvent = {
    cancelled: boolean,
};
declare type MousePressEvent = {
    readonly key: int,
    pressed: boolean,
};

declare type EventAction = 'chat_send' | 'gui_overlay_render' | 'game_loop' | 'static KEY_press' | 'server_connect' | 'server_switch' | 'overlay_render' | 'game_tick_pre' | 'game_tick_post' | 'player_list_render' | 'air_bar_render' | 'hotbar_render' | 'potions_render' | 'exp_render' | 'armor_render' | 'health_render' | 'hunger_render' | 'mouse_press' | string;
declare type Listener<T> = (event: T) => void;

declare class Events {

    static on<T>(listener: any, action: EventAction, consumer: Listener<T>, priority?: int): void;

    static off<T>(action: EventAction, consumer: Listener<T>): void;

    static off(listener: any): void;

    static post<T>(action: EventAction | string, event: T): T;
}

declare class Config {

    static load(name: string): any;

    static save(name: string, content: any): void;
}

declare class ChatExtensions {

    static sendChatMessage(message: string): void;

    static printChatMessage(message: string): void;
}

declare type GameType = 'NOT_SET' | 'SURVIVAL' | 'CREATIVE' | 'ADVENTURE' | 'SPECTATOR';

declare const plugin: any;

declare class Item {}

declare abstract class NBTBase {
    getId(): byte;

    copy(): NBTBase;

    isEmpty(): boolean;

    getString(): string;
}

declare abstract class NBTPrimitive extends NBTBase {
    getLong(): long;

    getInt(): int;

    getShort(): short;

    getByte(): byte;

    getDouble(): double;

    getFloat(): float;
}

declare class NBTTagLong extends NBTPrimitive {
    constructor();

    constructor(data: long);

    copy(): NBTTagLong;
}

declare class NBTTagDouble extends NBTPrimitive {
    constructor();

    constructor(data: double);

    copy(): NBTTagDouble;
}

declare class NBTTagInt extends NBTPrimitive {
    constructor();

    constructor(data: int);

    copy(): NBTTagInt;
}

declare class NBTTagFloat extends NBTPrimitive {
    constructor();

    constructor(data: float);

    copy(): NBTTagFloat;
}

declare class NBTTagShort extends NBTPrimitive {
    constructor();

    constructor(data: short);

    copy(): NBTTagShort;
}

declare class NBTTagByte extends NBTPrimitive {
    constructor();

    constructor(data: byte);

    copy(): NBTTagByte;
}

declare class NBTTagString extends NBTBase {

    constructor();

    constructor(data: string);

    copy(): NBTTagString;
}

declare class NBTTagByteArray extends NBTBase {

    constructor();

    constructor(data: byte[]);

    getByteArray(): byte[];

    copy(): NBTTagIntArray;
}

declare class NBTTagIntArray extends NBTBase {

    constructor();

    constructor(data: int[]);

    getIntArray(): int[];

    copy(): NBTTagIntArray;
}

declare class NBTTagLongArray extends NBTBase {

    constructor();

    constructor(data: long[]);

    getLongArray(): long[];

    copy(): NBTTagLongArray;
}

declare class NBTTagEnd extends NBTBase {}

declare class NBTTagList extends NBTBase {

    constructor(array: NBTBase[]);

    constructor(size: int);

    constructor();

    appendTag(nbt: NBTBase): void;

    set(idx: number, nbt: NBTBase): void;

    getCompoundTagAt(idx: int): NBTTagCompound;

    getIntAt(idx: int): int | 0;

    getIntArrayAt(idx: int): int[];

    getDoubleAt(idx: int): double | 0;

    getFloatAt(idx: int): float | 0;

    getStringTagAt(idx: int): string | '';

    get(idx: int): NBTBase | NBTTagEnd;

    tagCount(): int;
}

declare class NBTTagCompound extends NBTBase {

    constructor(size: int, loadFactor: float);

    constructor();

    getSize(): int;

    setTag(key: string, value: NBTBase): void;

    setByte(key: string, value: byte): void;

    setShort(key: string, value: short): void;

    setInteger(key: string, value: int): void;

    setLong(key: string, value: long): void;

    setUniqueId(key: string, value: UUID): void;

    getUniqueId(key: string): UUID | null;

    hasUniqueId(key: string): boolean;

    setFloat(key: string, value: float): void;

    setDouble(key: string, value: double): void;

    setString(key: string, value: string): void;

    setByteArray(key: string, value: byte[]): void;

    setIntArray(key: string, value: int[]): void;

    setBoolean(key: string, value: boolean): void;

    getTag(key: string): NBTBase | null;

    getTagId(key: string): byte | 0;

    getByte(key: string): byte | 0;

    getShort(key: string): short | 0;

    getInteger(key: string): int | 0;

    getLong(key: string): long | 0;

    getFloat(key: string): float | 0;

    getDouble(key: string): double | 0;

    // @ts-ignore
    getString(key: string): string | '';

    getByteArray(key: string): byte[];

    getIntArray(key: string): int[];

    getCompoundTag(key: string): NBTTagCompound;

    getTagList(key: string, type: byte): NBTTagList;

    getBoolean(key: string): boolean;

    removeTag(key: string): void;
}

declare class CompressedStreamTools {

    static readCompressed(input: InputStream): NBTTagCompound;

    static writeCompressed(compound: NBTTagCompound, stream: OutputStream): void;

    static read(stream: DataInputStream): NBTTagCompound;

    static write(compound: NBTTagCompound, output: DataOutput): void;
}

declare class ItemStack {

  constructor(block: Block);

  constructor(block: Block, count: int);

  constructor(block: Block, count: int, meta: int);

  constructor(item: Item);

  constructor(item: Item, count: int);

  constructor(item: Item, count: int, meta: int);

  constructor(nbt: NBTTagCompound);

  isEmpty(): boolean;

  splitStack(amount: int): ItemStack;

  getItem(): Item;

  getDestroySpeed(block: IBlockState): int;

  getMaxStackSize(): int;

  isStackable(): boolean;

  isItemStackDamageable(): boolean;

  isItemDamaged(): boolean;

  getItemDamage(): int;

  getMetadata(): int;

  setItemDamage(meta: int): void;

  getMaxDamage(): int;

  copy(): ItemStack;

  isItemEqual(other: ItemStack): boolean;

  isItemEqualIgnoreDurability(other: ItemStack): boolean;

  getTranslationKey(): string;

  getTagCompound(): NBTTagCompound;

  getOrCreateSubCompound(key: string): NBTTagCompound;

  getSubCompound(key: string): NBTTagCompound | null;

  removeSubCompound(key: string): void;

  getEnchantmentTagList(): NBTTagList;

  setTagCompound(nbt: NBTTagCompound): void;

  getDisplayName(): string;

  setTranslatableName(name: string): ItemStack;

  setStackDisplayName(name: string): ItemStack;

  clearCustomName(): void;

  hasDisplayName(): boolean;

  hasEffect(): boolean;

  isItemEnchantable(): boolean;

  isItemEnchanted(): boolean;

  setTagInfo(key: string, value: NBTBase): void;

  canEditBooks(): boolean;

  getRepairCost(): int;

  getTextComponent(): ITextComponent;

  getCount(): int;

  setCount(count: int): void;

  grow(quantity: int): void;

  shrink(quantity: int): void;

  static areItemStackTagsEqual(stackA: ItemStack, stackB: ItemStack): boolean;

  static areItemStacksEqual(stackA: ItemStack, stackB: ItemStack): boolean;

  static areItemsEqual(stackA: ItemStack, stackB: ItemStack): boolean;

  static areItemsEqualIgnoreDurability(stackA: ItemStack, stackB: ItemStack): boolean;
}

declare interface RenderItem {

    renderItemIntoGUI(stack: ItemStack, x: int, y:  int): void;

    renderItemAndEffectIntoGUI(stack: ItemStack, x: int, y: int): void;

    renderItemOverlayIntoGUI(fr: FontRenderer, stack: ItemStack, x: int, y: int, text: string): void;
}
declare const renderItem: RenderItem;

declare interface WorldNameable {

    getName(): string;

    hasCustomName(): boolean;

    getDisplayName(): ITextComponent;
}

declare interface Inventory extends WorldNameable {

    getSizeInventory(): int;

    isEmpty(): boolean;

    getStackInSlot(slot: int): ItemStack;

    decrStackSize(slot: int, quantity: int): ItemStack;

    removeStackFromSlot(slot: int): ItemStack;

    setInventorySlotContents(slot :int, stack: ItemStack): void;

    getInventoryStackLimit(): int;

    markDirty(): void;

    isUsableByPlayer(player: EntityPlayer): boolean;

    isItemValidForSlot(slot: int, stack: ItemStack): boolean;

    getField(field: int): int;

    setField(field: int, value: int): void;

    getFieldCount(): int;

    clear(): void;
}

declare interface InventoryBasic extends Inventory{

    addItem(stack: ItemStack): ItemStack;
}

declare interface InventoryPlayer extends Inventory {

    getCurrentItem(): ItemStack;

    getFirstEmptyStack(): int;

    getSlotFor(stack: ItemStack): int;

    findSlotMatchingUnusedItem(stack: ItemStack): int;

    getBestHotbarSlot(): int;

    armorItemInSlot(slot: int): ItemStack;

    getTimesChanged(): int;

    getItemStack(): ItemStack;

    getActiveSlot(): int;
}

declare interface InventoryPlayerRemote extends InventoryPlayer {

    setPickedItemStack(stack: ItemStack): void;

    pickItem(slot: int): void;

    changeCurrentItem(slot: int): void;

    clearMatchingItems(item: Item, metadata: int, count: int, tag: NBTTagCompound): int;

    storeItemStack(stack: ItemStack): int;

    addItemStackToInventory(stack: ItemStack): boolean;

    add(preferredSlot: int, stack: ItemStack): boolean;

    deleteStack(stack: ItemStack): void;

    getDestroySpeed(state: IBlockState): float;

    canHarvestBlock(state: IBlockState): boolean;

    dropAllItems(): void;

    setItemStack(itemStack: ItemStack): void;

    copyInventory(inventory: InventoryPlayer): void;
}

declare class ContainerLocalMenu implements InventoryBasic {

    constructor(type: string, title: ITextComponent, slotsCount: int)

    addItem(stack: ItemStack): ItemStack;

    clear(): void;

    decrStackSize(slot: int, quantity: int): ItemStack;

    getDisplayName(): ITextComponent;

    getField(field: int): int;

    getFieldCount(): int;

    getInventoryStackLimit(): int;

    getName(): string;

    getSizeInventory(): int;

    getStackInSlot(slot: int): ItemStack;

    hasCustomName(): boolean;

    isEmpty(): boolean;

    isItemValidForSlot(slot: int, stack: ItemStack): boolean;

    isUsableByPlayer(player: EntityPlayer): boolean;

    markDirty(): void;

    removeStackFromSlot(slot: int): ItemStack;

    setField(field: int, value: int): void;

    setInventorySlotContents(slot: int, stack: ItemStack): void;
}

declare class InventoryDeprecated {

    static getStackInSlot(slot: int): ItemStack;

    static getMaxDamage(slot: int): int | 0;

    static getItemDamage(slot: int): int | 0;

    static getDurability(slot: int): int | 0;

    static getItemDisplayName(slot: int): string | '';

    static getCount(slot: int): int | 0;

    static isEquipped(slot: int): boolean | false;

    static getActiveSlot(): int | 0;
}

declare class Keyboard {
    static KEY_NONE: int;
    static KEY_ESCAPE: int;
    static KEY_1: int;
    static KEY_2: int;
    static KEY_3: int;
    static KEY_4: int;
    static KEY_5: int;
    static KEY_6: int;
    static KEY_7: int;
    static KEY_8: int;
    static KEY_9: int;
    static KEY_0: int;
    static KEY_MINUS: int; /* - on main keyboard */
    static KEY_EQUALS: int;
    static KEY_BACK: int; /* backspace */
    static KEY_TAB: int;
    static KEY_Q: int;
    static KEY_W: int;
    static KEY_E: int;
    static KEY_R: int;
    static KEY_T: int;
    static KEY_Y: int;
    static KEY_U: int;
    static KEY_I: int;
    static KEY_O: int;
    static KEY_P: int;
    static KEY_LBRACKET: int;
    static KEY_RBRACKET: int;
    static KEY_RETURN: int; /* Enter on main keyboard */
    static KEY_LCONTROL: int;
    static KEY_A: int;
    static KEY_S: int;
    static KEY_D: int;
    static KEY_F: int;
    static KEY_G: int;
    static KEY_H: int;
    static KEY_J: int;
    static KEY_K: int;
    static KEY_L: int;
    static KEY_SEMICOLON: int;
    static KEY_APOSTROPHE: int;
    static KEY_GRAVE: int; /* accent grave */
    static KEY_LSHIFT: int;
    static KEY_BACKSLASH: int;
    static KEY_Z: int;
    static KEY_X: int;
    static KEY_C: int;
    static KEY_V: int;
    static KEY_B: int;
    static KEY_N: int;
    static KEY_M: int;
    static KEY_COMMA: int;
    static KEY_PERIOD: int; /* . on main keyboard */
    static KEY_SLASH: int; /* / on main keyboard */
    static KEY_RSHIFT: int;
    static KEY_MULTIPLY: int; /* * on numeric keypad */
    static KEY_LMENU: int; /* left Alt */
    static KEY_SPACE: int;
    static KEY_CAPITAL: int;
    static KEY_F1: int;
    static KEY_F2: int;
    static KEY_F3: int;
    static KEY_F4: int;
    static KEY_F5: int;
    static KEY_F6: int;
    static KEY_F7: int;
    static KEY_F8: int;
    static KEY_F9: int;
    static KEY_F10: int;
    static KEY_NUMLOCK: int;
    static KEY_SCROLL: int; /* Scroll Lock */
    static KEY_NUMPAD7: int;
    static KEY_NUMPAD8: int;
    static KEY_NUMPAD9: int;
    static KEY_SUBTRACT: int; /* - on numeric keypad */
    static KEY_NUMPAD4: int;
    static KEY_NUMPAD5: int;
    static KEY_NUMPAD6: int;
    static KEY_ADD: int; /* + on numeric keypad */
    static KEY_NUMPAD1: int;
    static KEY_NUMPAD2: int;
    static KEY_NUMPAD3: int;
    static KEY_NUMPAD0: int;
    static KEY_DECIMAL: int; /* . on numeric keypad */
    static KEY_F11: int;
    static KEY_F12: int;
    static KEY_F13: int; /*                     (NEC PC98) */
    static KEY_F14: int; /*                     (NEC PC98) */
    static KEY_F15: int; /*                     (NEC PC98) */
    static KEY_F16: int; /* Extended Function keys - (Mac) */
    static KEY_F17: int;
    static KEY_F18: int;
    static KEY_KANA: int; /* (Japanese keyboard)            */
    static KEY_F19: int; /* Extended Function keys - (Mac) */
    static KEY_CONVERT: int; /* (Japanese keyboard)            */
    static KEY_NOCONVERT: int; /* (Japanese keyboard)            */
    static KEY_YEN: int; /* (Japanese keyboard)            */
    static KEY_NUMPADEQUALS: int; /*=on numeric keypad (NEC PC98) */
    static KEY_CIRCUMFLEX: int; /* (Japanese keyboard)            */
    static KEY_AT: int; /*                     (NEC PC98) */
    static KEY_COLON: int; /*                     (NEC PC98) */
    static KEY_UNDERLINE: int; /*                     (NEC PC98) */
    static KEY_KANJI: int; /* (Japanese keyboard)            */
    static KEY_STOP: int; /*                     (NEC PC98) */
    static KEY_AX: int; /*                     (Japan AX) */
    static KEY_UNLABELED: int; /*                        (J3100) */
    static KEY_NUMPADENTER: int; /* Enter on numeric keypad */
    static KEY_RCONTROL: int;
    static KEY_SECTION: int; /* Section symbol (Mac) */
    static KEY_NUMPADCOMMA: int; /* , on numeric keypad (NEC PC98) */
    static KEY_DIVIDE: int; /* / on numeric keypad */
    static KEY_SYSRQ: int;
    static KEY_RMENU: int; /* right Alt */
    static KEY_FUNCTION: int; /* Function (Mac) */
    static KEY_PAUSE: int; /* Pause */
    static KEY_HOME : int; /* Home on arrow keypad */
    static KEY_UP: int; /* UpArrow on arrow keypad */
    static KEY_PRIOR: int; /* PgUp on arrow keypad */
    static KEY_LEFT: int; /* LeftArrow on arrow keypad */
    static KEY_RIGHT: int; /* RightArrow on arrow keypad */
    static KEY_END: int; /* End on arrow keypad */
    static KEY_DOWN: int; /* DownArrow on arrow keypad */
    static KEY_NEXT: int; /* PgDn on arrow keypad */
    static KEY_INSERT: int; /* Insert on arrow keypad */
    static KEY_DELETE: int; /* Delete on arrow keypad */
    static KEY_CLEAR: int; /* Clear key (Mac) */
    static KEY_LMETA: int; /* Left Windows/Option key */
    static KEY_RMETA: int; /* Right Windows/Option key */
    static KEY_APPS: int; /* AppMenu key */
    static KEY_POWER: int;
    static KEY_SLEEP: int;

    static isKeyDown(key: int): boolean;

    static getEventKey(): int;

    static getEventCharacter(): int;

    static getEventKeyState(): boolean;

    static getKeyName(key: number): string;

    static getKeyIndex(keyName: string): int;
}

declare class ScaledResolution {

    getScaledWidth(): int;

    getScaledHeight(): int;

    getScaledWidth_double(): int;

    getScaledHeight_double(): int;

    getScaleFactor(): int;
}

declare class Mouse {
    static isButtonDown(button: int): boolean;

    static getButtonName(button: int): string | undefined;

    static getButtonIndex(buttonName: string): int | -1;

    static getEventButton(): int;

    static getEventButtonState(): int;

    static getEventDX(): int;

    static getEventDY(): int;

    static getEventX(): int;

    static getEventY(): int;

    static getEventDWheel(): int;

    static getX(): int;

    static getY(): int;

    static getDX(): int;

    static getDY(): int;

    static getDWheel(): int;

    static getButtonCount(): int;

    static hasWheel(): boolean;

    static isGrabbed(): boolean;

    static getMouseX(resolution: ScaledResolution): int;

    static getMouseY(resolution: ScaledResolution): int;
}


declare class BlockPos {

    getX(): int;
    
    getY(): int;

    getZ(): int;
}

declare class Runtime {
    static exit(code: int): void;

    static halt(code: int): void;

    static freeMemory(): long;

    static maxMemory(): long;

    static totalMemory(): long;
}

declare class System {
    static exit(code: int): void;

    static halt(code: int): void;

    static getOsName(): string;

    static getOsVersion(): string;

    static currentTimeMillis(): long;

    static nanoTime(): long;
}

declare class Timer {

    renderPartialTicks(): float;
}
declare const timer: Timer;

declare class World {
    static getTime(): long | 0;

    static getTotalTime(): long | 0;

    // RayTraceResult rayTraceBlocks(Vec3d start, Vec3d end, boolean stopOnLiquid,
    //     boolean ignoreBlockWithoutBoundingBox, boolean returnLastUncollidableBlock);
  
    spawnEntity(entity: Entity): boolean;
  
    removeEntity(entity: Entity): void;
  
    getThunderStrength(p_getThunderStrength_1_: float): float;
  
    setThunderStrength(p_setThunderStrength_1_: float): void;
  
    getRainStrength(p_getRainStrength_1_: float): float;
  
    setRainStrength(p_setRainStrength_1_: float): void;
  
    setBlockState(pos: BlockPos, state: IBlockState, flag: int): boolean;
  
    setBlockToAir(p_setBlockToAir_1_: BlockPos): boolean;
  
    destroyBlock(p_destroyBlock_1_: BlockPos, p_destroyBlock_2_: boolean): boolean;
  
    getBlockState(p_getBlockState_1_: int, p_getBlockState_2_: int, p_getBlockState_3_: int): IBlockState;
  
    getChunkProvider(): ChunkProvider;
  
    markBlockRangeForRenderUpdate(p1: int, p2: int, p3: int, p4: int, p5: int, p6: int): void;
  
    makeFireworks(x: double, y: double, z: double, motionX: double, motionY: double, motionZ: double, data: NBTTagCompound): void;
  
    setChunkProvider(chunkProvider: ChunkProvider): void;
  
    // void spawnParticle(EnumParticleTypes types, boolean isLongDistance, double x, double y, double z,
        // double motionX, double motionY, double motionZ, int... data);

}

declare class Property {

    constructor(value: string, name: string);

    constructor(name: string, value: string, signature: string);

    getName(): string;

    getValue(): string;

    getSignature(): string;

    hasSignature(): boolean;
}

declare class PropertyMap {

    // TODO
}

declare class GameProfile {

    constructor(id: UUID, name: string);

    getId(): UUID;

    getName(): string;

    getProperties(): PropertyMap;

    isComplete(): boolean;

    isLegacy(): boolean;
}

declare class NetworkPlayerInfo {

    getGameProfile(): GameProfile;

    getResponseTime(): int;

    hasLocationSkin(): boolean;

    getSkinType(): string;

    getLocationSkin(): ResourceLocation;

    getLocationCape(): ResourceLocation;

    getLocationElytra(): ResourceLocation;

    getDisplayName(): ITextComponent;

    setResponseTime(responseTime: int): void;

    setDisplayName(displayName: ITextComponent): number;

    getLastHealth(): int;

    setLastHealth(lastHealth: int): void;

    getDisplayHealth(): int;

    setDisplayHealth(displayHealth: int): void;

    getLastHealthTime(): long;

    setLastHealthTime(lastHealthTime: long): void;

    getHealthBlinkTime(): long;

    setHealthBlinkTime(healthBlinkTime: long): void;

    getRenderVisibilityId(): long;

    setRenderVisibilityId(renderVisibilityId: long): void;

    setSkinType(skinType: string): void;
}

declare interface NetHandlerPlayClient {

    getPlayerInfo(key: UUID | string): NetworkPlayerInfo | null;

    getPlayerInfos(): NetworkPlayerInfo[];

    addPlayerInfo(info: NetworkPlayerInfo): void;

    removePlayerInfo(key: UUID | string): void;
}

declare const connection: NetHandlerPlayClient | null;

declare enum RayTraceHitType {
    MISS = 'MISS',
    BLOCK = 'BLOCK',
    ENTITY = 'ENTITY',
}

declare interface RayTraceResult {

    getBlockPos(): BlockPos | null;

    getHitVec(): Vec3d | null;

    getSideHit(): EnumFacing;

    getHitType(): RayTraceHitType;

    getEntityHit(): Entity;
}

declare interface GuiIngame {

    printChatMessage(component: ITextComponent | string): void;

    printActionMessage(component: ITextComponent | string): void;

    displayTitle(title: string, subTitle: string, fadeIn: int, displayTime: int, fadeOut: int): void;

    clearChatMessagges(clearSent: boolean): void;
}
declare const ingameGUI: GuiIngame;

declare interface Minecraft {

    getPlayer(): EntityPlayerSP;

    getWorld(): World;

    setIngameFocus(): void;

    setIngameNotInFocus(): void;

    closeScreen(): void;

    getFontRenderer(): FontRenderer;

    getGalacticFontRenderer():  FontRenderer;

    getRenderItem(): RenderItem;

    getRenderViewEntity(): Entity;

    isShowingDebugInfo(): boolean;

    getTimer(): Timer;

    getSkinManager(): SkinManager;

    getConnection(): NetHandlerPlayClient;

    getMouseOver(): RayTraceResult;

    getResolution(): ScaledResolution;

    // loadWorld(world: WorldClient): void;
}
declare const minecraft: Minecraft;

declare class Vec3d {

    getX(): double;

    getY(): double;

    getZ(): double;
}

declare class ProfileTexture {

    constructor(url: string, metadata: {[key: string]: string});
}

declare enum ProfileTextureType {
    
    SKIN = 'SKIN',
    CAPE = 'CAPE',
    ELYTRA = 'ELYTRA',
}

declare class ResourceLocation {

    constructor(input: string);

    constructor(namespace: string, path: string);

    getPath(): string;

    getNamespace(): string;
}

declare type SkinAvailableCallback = (type: ProfileTextureType, location: ResourceLocation, texture: ProfileTexture) => void;

declare interface SkinManager {

    loadSkin(texture: ProfileTexture, type: ProfileTextureType, callback: SkinAvailableCallback): ResourceLocation;
}
declare const skinManager: SkinManager;

declare class PrintStream {

    println(message: any): void
}
declare const stdout: PrintStream;
declare const stderr: PrintStream;

declare class FontRenderer {

    drawString(text: string, x: int, y: int, color: int, dropShadow: boolean): int;

    drawStringWithShadow(text: string, x: int, y: int, color: int): int;

    getStringWidth(text: string): int;

    getCharWidth(char: char): int;

    trimStringToWidth(text: string, width: int, reverse: boolean) : string;

    drawSplitString(text: string, x: int, y: int, wrapWidth: int, color: int): void;

    getWordWrappedHeight(text: string, maxLength: int): int;

    getUnicodeFlag(): boolean;

    listFormattedStringToWidth(text: string, wrapWidth: int): string[];
}
declare const fontRenderer: FontRenderer;
declare const standardGalacticFontRenderer: FontRenderer;

declare class KeyBinding {

    isKeyDown(): boolean;

    getKeyCategory(): string;

    getKeyDescription(): string;

    getKeyCodeDefault(): int;

    getKeyCode(): int;
}
declare const keybinds: {[key: string]: KeyBinding};

declare class Entity {

    getEntityId(): int;

    getUniqueID(): UUID;

    getDisplayName(): ITextComponent;

    getName(): string;

    hasCustomName(): boolean;

    getCustomNameTag(): string;

    getAlwaysRenderNameTag(): boolean;

    getLastX(): double;

    getPrevX(): double;

    getX(): double;

    getLastY(): double;

    getPrevY(): double;

    getY(): double;

    getLastZ(): double;

    getPrevZ(): double;

    getZ(): double;

    getRotationYaw(): float;

    getRotationPitch(): float;

    getPrevRotationYaw(): float;

    getPrevRotationPitch(): float;

    getMotionX(): double;

    getMotionY(): double;

    getMonitionZ(): double;

    isOnGround(): boolean;

    getPositionEyes(partialTicks: float): Vec3d;
}

declare class EntityList {

    static newEntityFromNbt(compound: NBTTagCompound, world: World): Entity;

    newEntityById(id: int, world: World): Entity;
}

declare interface ITextComponent {

    setStyle(style: Style): ITextComponent;

    getStyle(): Style;

    appendText(text: string): ITextComponent;

    appendSibling(component: ITextComponent): ITextComponent;

    getUnformattedComponentText(): String;

    getUnformattedText(): String;

    getFormattedText(): String;

    getSiblings(): ITextComponent[];

    createCopy(): ITextComponent;
}

declare class TextComponentString implements ITextComponent {

    constructor(text: string);

    getText(): string;

    appendSibling(component: ITextComponent): ITextComponent;

    appendText(text: string): ITextComponent;

    createCopy(): ITextComponent;

    getFormattedText(): String;

    getSiblings(): ITextComponent[];

    getStyle(): Style;

    getUnformattedComponentText(): String;

    getUnformattedText(): String;

    setStyle(style: Style): ITextComponent;
}

declare class Style {

    // getColor(): TextFormatting;

    getBold(): boolean;

    getItalic(): boolean;

    getStrikethrough(): boolean;

    getUnderlined(): boolean;

    getObfuscated(): boolean;

    isEmpty(): boolean;

    // getClickEvent(): ClickEvent;

    // getHoverEvent(): HoverEvent;

    // setColor(TextFormatting color): Style;

    setBold(bold: boolean): Style;

    setItalic(italic: boolean): Style;

    setStrikethrough(strikethrough: boolean): Style;

    setUnderlined(underlined: boolean): Style;

    setObfuscated(obfuscated: boolean): Style;

    // setClickEvent(ClickEvent event): Style;

    // setHoverEvent(HoverEvent event): Style;

    getFormattingCode(): String;

    createShallowCopy(): Style;

    createDeepCopy(): Style;
}

declare class UUID {

    constructor(mostSigBits: long, leastSigBits: long);

    getLeastSignificantBits(): long;

    getMostSignificantBits(): long;

    version(): int;

    variant(): int;

    timestamp(): long;

    clockSequence(): long;

    node(): long;

    static fromString(string: string): UUID;

    static randomUUID():UUID;
}

// export {
//     EntityPlayerSP,
//     EntityPlayer,
//     EntityLivingBase,
//     PlayerExtensions,
//     PluginMessages,
//     ByteBuf,
//     ByteBuffer,
//     FloatBuffer,
//     Unpooled,
//     UtilNetty,
//     WorldExtensions,
//     Display,
//     GL11,
//     GL12,
//     GlStateManager,
//     RenderHelper,
//     Textures,
//     Draw,
//     EnumFacing,
//     EquipmentSlot,
//     ChatEvent,
//     KeyPressEvent,
//     NameRenderEvent,
//     RenderPassEvent,
//     EventAction,
//     Listener,
//     Events,
//     Config,
//     ChatExtensions,
//     GameType,
//     plugin,
//     ItemStack,
//     Inventory,
//     Keyboard,
//     ScaledResolution,
//     Mouse,
//     BlockPos,
//     Runtime,
//     JavaSystem,
//     Timer,
//     timer,
//     World,
//     Minecraft,
//     minecraft,
//     Vec3d,
//     ProfileTexture,
//     ProfileTextureType,
//     ResourceLocation,
//     SkinAvailableCallback,
//     SkinManager,
//     skinManager,
//     PrintStream,
//     stdout,
//     fontRenderer,
//     FontRenderer,
//     KeyBinding,
//     keybinds,
//     Entity,
//     Player,
//     ITextComponent,
//     Style,
//     UUID
// }
