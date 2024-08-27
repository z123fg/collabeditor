import React, { createContext, FC, ReactNode, useState } from "react";
import Emittery from "emittery";
import { Atom } from "../utils/collabpipe";

interface IMessage {
    type: "insert" | "delete" | "update";
    atom: Atom;
}

const CollabContext = createContext<any>(null);

interface CollabContainerProps {
    children: ReactNode;
}

const CollabContainer: FC<CollabContainerProps> = ({ children }) => {
    const [emitter] = useState(new Emittery());

    const subscribe = (cb: (message: IMessage) => void) => {
        const delayedCb = (message: IMessage) => {
            const timer = Math.random() * 3000;
            setTimeout(() => cb(message), timer);
        };
        emitter.on("main", delayedCb);
    };

    const publish = (message: IMessage) => {
        emitter.emit("main", message);
    };

    return <CollabContext.Provider value={{subscribe, publish}}>{children}</CollabContext.Provider>;
};

export default CollabContainer;
