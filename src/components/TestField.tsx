import React, { useEffect, useRef, useState } from "react";
import { createAtom, insert, MAX_INDEX, State } from "../utils/collabpipe";
import { prettyPrint } from "prettier-print";
const TestField = () => {
    const [state, setState] = useState<State>([
        [[[[0, 0]], 0], null],
        [[[[MAX_INDEX, 0]], 0], null],
    ]);

    const ref = useRef<any>();

    useEffect(() => {
        prettyPrint([state], { inspectEl: ref.current, replaceCircularReference: false });
    }, [state]);

    const [createValue, setCreateValue] = useState("");
    const [deleteValue, setDeletetValue] = useState("");
    const [updateValue, setUpdateValue] = useState("");
    const handleCreate = () => {
        const args = createValue.split(" ");
        if (args.length !== 5 || args.some((item) => item === undefined)) {
            alert("invalid input");
            return;
        }
        const [content, prevIndex, nextIndex, vClock, siteNumber] = args;
        const newAtom = createAtom(content, state[+prevIndex], state[+nextIndex], +vClock, +siteNumber);
        console.log("newAtom", JSON.stringify(newAtom, null, 2));
        setState(insert(state, newAtom));
    };
    const handleDelete = () => {};
    const handleUpdate = () => {};
    return (
        <div>
            <div>
                <input value={createValue} onChange={(e) => setCreateValue(e.target.value)} />{" "}
                <button onClick={handleCreate}>create</button>
            </div>
            <div>
                <input value={deleteValue} onChange={(e) => setDeletetValue(e.target.value)} />{" "}
                <button onClick={handleDelete}>delete</button>
            </div>
            <div>
                <input value={updateValue} onChange={(e) => setUpdateValue(e.target.value)} />{" "}
                <button onClick={handleUpdate}>update</button>
            </div>
            <div ref={ref}></div>
        </div>
    );
};

export default TestField;
