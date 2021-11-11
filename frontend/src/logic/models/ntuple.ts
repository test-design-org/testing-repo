import type { IInput } from "./dtos";
import { zip } from 'fp-ts/Array';

export class NTuple {
    list: IInput[];

    constructor(list: IInput[]) {
        this.list = list;
    }

    intersectsWith(other: NTuple): boolean {
        if(this.list.length !== other.list.length)
            return false;

        return zip(this.list, other.list)
                .every(([x,y]) => x.intersectsWith(y));
    }
}
