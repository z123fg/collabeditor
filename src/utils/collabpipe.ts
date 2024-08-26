/* 
[
    [
        [
            [
                [0, 0]
            ],
            0
        ], 
        null
    ],    // Minimum sequence atom

  [[[[6589, 1]], 0], "Hello, world!"],
  [[[[32767, 0]], 1], null] // Maximum sequence atom
]

*/

export type Identifier = [number, number]; //second element is site number

export type Position = Identifier[];

export type AtomIdentifier = [Position, number]; //second element is the vector clock, not used for comparison, used for ensure unique identifier for each site

export type Atom = [AtomIdentifier, string | null]; //second element is the value of the content, not used for comparison

export type State = Atom[];

export const MAX_INDEX = 5;
if (MAX_INDEX <= 2) throw Error("max index has to be greater than 2");

let state: State = [
    [[[[0, 0]], 0], null],
    [[[[MAX_INDEX, 0]], 0], null],
];

export const createAtom = (
    content: string,
    prev: Atom,
    next: Atom,
    vClock: number,
    siteNumber: number
): Atom => {
    const [prevPosition] = prev[0];
    const [nextPosition] = next[0];
    const newPosition: Position = [];

    let success = false;

    let i = 0;
    while (i < prevPosition.length || i < nextPosition.length) {
        const prevIndex = i < prevPosition.length ? prevPosition[i][0] : 0;
        const nextIndex = i < nextPosition.length ? nextPosition[i][0] :0;

        if (prevIndex === nextIndex) {
            newPosition.push([prevIndex, siteNumber]);
        } else if (prevIndex < nextIndex - 1) {
            // Found space to create a new index
            const newIndex = prevIndex + Math.floor((nextIndex - prevIndex) / 2);
            newPosition.push([newIndex, siteNumber]);
            success = true;
            break;
        } else {  
            newPosition.push([prevIndex, siteNumber]);
        }
        i++;
    }
console.log("success", success)
    if (!success) {
        const newIndex = 0 + Math.floor((MAX_INDEX - 0) / 2);
        newPosition.push([newIndex, siteNumber]);
    }

    const newAtom: Atom = [[newPosition, ++vClock], content];
    return newAtom;
};

export const insert = (state: State, atom: Atom) => {
    const newState = [...state];
    return insertSorted(newState, atom, logootCompareFn);
};

export const remove = (state: State, atom: Atom) => {
    const { found, index } = binarySearch(state, atom, logootCompareFn);
    if (found) {
        return [...state].splice(index, 1);
    } else {
        return state;
    }
};

export const update = (state: State, atom: Atom) => {
    const { found, index } = binarySearch(state, atom, logootCompareFn);
    if (found) {
        const newState = [...state];
        newState[index] = atom;
    } else {
        return state;
    }
};

const insertSorted = <T>(arr: T[], element: T, compareFn: (a: T, b: T) => number): T[] => {
    const { index, found } = binarySearch(arr, element, compareFn);

    if (!found) {
        arr.splice(index, 0, element); // Insert the element only if it's not already found
    } else {
        throw Error("inserting duplicate atom!");
    }

    return arr;
};

const logootCompareFn = (atomA: Atom, atomB: Atom): number => {
    const [positionA, idA] = atomA[0];
    const [positionB, idB] = atomB[0];

    // 比较 Position
    for (let i = 0; i < Math.min(positionA.length, positionB.length); i++) {
        const [indexA, siteA] = positionA[i];
        const [indexB, siteB] = positionB[i];

        if (indexA !== indexB) {
            return indexA - indexB;
        }
        if (siteA !== siteB) {
            return siteA - siteB;
        }
    }

    // 如果位置数组的前部分相等，较长的 Position 较大
    if (positionA.length !== positionB.length) {
        return positionA.length - positionB.length;
    }

    throw new Error("Duplicate Position detected, this should not happen.");
};

const binarySearch = <T>(
    arr: T[],
    target: T,
    compareFn: (a: T, b: T) => number
): { index: number; found: boolean } => {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const comparison = compareFn(arr[mid], target);

        if (comparison === 0) {
            return { index: mid, found: true }; // Exact match found
        } else if (comparison < 0) {
            low = mid + 1; // Search in the right half
        } else {
            high = mid - 1; // Search in the left half
        }
    }

    return { index: low, found: false }; // No exact match, return insertion point
};

/* 
[[128,1]]
[[128,1],[0,1]] 
*/
