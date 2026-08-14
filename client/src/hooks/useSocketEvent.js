import { useEffect, useRef } from "react";
import { socket } from "../utils/socket";

export function useSocketEvent(eventName, handler) {
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        const listener = (...args) => handlerRef.current(...args);
        socket.on(eventName, listener);

        return () => socket.off(eventName, listener);
    }, [eventName]);
}
