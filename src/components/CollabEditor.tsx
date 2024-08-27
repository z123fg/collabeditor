import { useState } from "react";
import { MAX_INDEX, State } from "../utils/collabpipe";

const CollabEditor = () => {
    const [state, setState] = useState<State>([
        [[[[0, 0]], 0], null],
        [[[[MAX_INDEX, 0]], 0], null],
    ]);

    return <div>
        <pre></pre>
    </div>
}

export default CollabEditor;