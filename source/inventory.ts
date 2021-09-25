import { Stack, Id } from "./stack";

export class Inventory {
    private _slots: Array<Stack | undefined> = [];

    constructor(public readonly size: number) {
        this._slots = Array(size);
    }

    public isFull(): boolean {
        return !this.hasEmpty(1);
    }

    public hasEmpty(slots: number): boolean {
        return this.getEmptySlotCount() - slots > 0;
    }

    public getEmptySlotCount() {
        return this.size - this.getItems.length;
    }

    public getItems() {
        return this._slots.filter(<T>(x: T): x is Exclude<T, undefined> => x !== undefined)
    }

    public getItemsWithIdx() {
        return this._slots
        .map((x, idx) => [idx, x] as const)
        .filter(([,x]) => x !== undefined) as [number, Stack][];
    }

    public getStacks(id: Id) {
        return this.getItems().filter(x => x.id === id);
    }

    public getStacksWithIdx(id: Id) {
        return this.getItemsWithIdx()
        .filter(([,stack]) => stack.id === id);
    }

    /**
     * Adds a stack of `id`, without splitting it between already exsiting non-full stacks.
     * @returns whether or not it succeeded.
     */
    public addStack(id: Id, amount: number = Stack.maxSizes[id]): boolean {
        return this.generalAddStack(new Stack(id, amount));
    }

    public addStackTo(idx: number, stack: Stack): boolean {
        if (idx >= this.size || this._slots[idx] !== undefined) return false;
        this._slots[idx] = stack;
        return true;
    }

    public removeStackFrom(idx: number): Stack | undefined {
        if (idx >= this.size || this._slots[idx] === undefined) return undefined;
        const slot = this._slots[idx]!;
        this._slots[idx] = undefined;
        return slot;
    }

    /**
     * Adds `amount` of items of type `id` to the inventory.
     * @param number by default it is one full stack.
     * @returns the amount of items that didn't fit, or if all of the items fit, 0.
     */
    public addItems(id: Id, amount: number = Stack.maxSizes[id]): number {
        const maxSize = Stack.maxSizes[id];
        const total = this.fillStacks(id, amount);

        const stackCount = Math.floor(total / maxSize);
        const leftoverAmount = total % maxSize;
        const fullStacks = Array.from({length: stackCount}, () => new Stack(id));
        const rejected = this.addStacks(fullStacks);
        const rejectedCount = rejected.map(x => x.amount).reduce((a, b) => a + b, 0);
        
        if (leftoverAmount > 0) {
            return rejectedCount + +this.generalAddStack(new Stack(id, leftoverAmount))
        } else {
            return rejectedCount;
        }
    }

    /**
     * Removes `amount` of items of type `id` to the inventory.
     * Does not remove if there aren't enough items.
     * @returns undefined if the there are enough items in the inventory, or the amount of missing items, if there aren't enough.
     */
    public removeItems(id: Id, amount: number): number | undefined {
        const stacks = this.getStacksWithIdx(id);
        const total = stacks.reduce((sum, [,stack]) => sum + stack.amount, 0);
        if (total < amount) return undefined;
        return this.generalRemoveItems(stacks, amount);
    }
    
    /**
     * Removes `amount` of items of type `id` to the inventory.
     * Removes as much as possible, even if it isn't enough.
     * @returns the amount of missing items, if there aren't enough,
     */
    public removeItemsMax(id: Id, amount: number): number {
        const stacks = this.getStacksWithIdx(id);
        return this.generalRemoveItems(stacks, amount);
    }

    private fillStacks(id: Id, amount: number) {
        const stacks = this.getStacks(id);
        let amountLeft = amount;
        for (const stack of stacks) {
            // console.log({missing: stack.missing})
            if (amountLeft <= stack.missing) {
                stack.amount += amountLeft;
                amountLeft = 0;
                break;
            } else {
                amountLeft -= stack.fill();
            }
            // console.log({amountLeft})
        }
        return amountLeft;
    }

    private generalAddStack(stack: Stack): boolean {
        for (let i = 0; i < this.size; i++) {
            if (this._slots[i] === undefined) {
                this._slots[i] = stack;
                return true;
            }
        }
        return false;
    }

    private generalRemoveItems(targetStacks: [number, Stack][], amount: number) {
        let amountLeft = amount;
        let removedAmount = 0;
        for (const [idx, stack] of targetStacks) {
            if (amountLeft <= 0) {
                break;
            } else if (amountLeft < stack.amount) {
                stack.amount -= amountLeft;
                removedAmount += amountLeft;
                break;
            } else {
                amountLeft -= stack.amount;
                removedAmount += stack.amount;
                this._slots[idx] = undefined;
            }
        }
        return removedAmount;
    }

    private addStacks(stacks: Stack[]): Stack[] {
        return stacks.filter(x => !this.generalAddStack(x));
    }


    public toString(): string {
        return `Inventory(${this.size}) [` + this.getItemsWithIdx().map(([idx, x]) => `[ ${idx}: ${x.amount} ${x.id} ]`).join(", ") + "]";
    }
}
