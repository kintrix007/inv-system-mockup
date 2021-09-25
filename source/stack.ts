export type Id = keyof typeof Stack.maxSizes;

export class Stack {
    private _amount: number;
    public readonly maxSize: number;
    public readonly id: Id;
    private _missing: number = NaN;

    public static maxSizes = {
        wood: 10,
        plank: 10,
        stone: 16,
        coin: 64,
        berry: 32,
    } as const

    public static createStacks(id: Id, amount: number) {
        const
        stackSize      = this.maxSizes[id],
        stackCount     = Math.floor(amount / stackSize),
        leftoverAmount = amount % stackSize;
        let stacks: Stack[] = [];
        for (let i = 0; i < stackCount; i++) {
            stacks.push(new Stack(id, stackSize));
        }
        stacks.push(new Stack(id, leftoverAmount));
        return stacks;
    }

    constructor(itemId: Id, amount: number = Stack.maxSizes[itemId]) {
        this.id = itemId;
        this.maxSize = Stack.maxSizes[this.id];
        this._amount = Math.max(1, Math.min(this.maxSize, amount));
        this._missing = this.maxSize - this._amount;
    }

    public fill() {
        const missing = this.missing;
        this.amount = this.maxSize;
        return missing;
    }

    get missing() {
        return this._missing;
    }

    /**
     * Integer between `1` and `maxSize`;
     */
    set amount(newAmount: number) {
        this._amount = Math.max(1, Math.min(this.maxSize, newAmount));
        this._missing = this.maxSize - this.amount;
    }
    
    get amount() {
        return this._amount;
    }
}