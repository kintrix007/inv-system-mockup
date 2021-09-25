import { Inventory } from "./inventory";
import { Stack } from "./stack";

let temp: Stack | undefined = undefined;

function main() {
    const inv = new Inventory(20);
    inv.addItems("wood", 9);
    inv.addItems("berry", 17);
    inv.addItems("wood", 9);
    inv.addItems("coin", 23);
    inv.addItems("wood", 11);
    inv.addStack("plank");
    inv.addStack("coin");
    inv.addStack("stone");
    inv.addStack("stone");
    inv.addItems("wood", 8);
    inv.addItems("berry", 14);
    inv.addItems("coin", 5);
    console.log(inv.toString());
    
    inv.removeItems("coin", 20);
    console.log(inv.toString());
    
    inv.removeItems("coin", 20);
    console.log(inv.toString());
    
    inv.removeItemsMax("coin", 20);
    console.log(inv.toString());
    
    temp = inv.removeStackFrom(0);
    if (temp) inv.addStackTo(35, temp);
    console.log(inv.toString());
}

main();
