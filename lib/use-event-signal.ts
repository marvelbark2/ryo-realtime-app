import { useEffect, useRef, useState } from "react";

export default function useEventSignal<T>(source: string) {
    const [value, setValue] = useState<T>();
    const eventSource = useRef<EventSource | null>(null);

    useEffect(() => {
        if (window) {
            if (!eventSource.current) {
                eventSource.current = new EventSource(source)
            }
            eventSource.current.onmessage = (event) => {
                setValue(JSON.parse(event.data));
            };
        }
        return () => {
            if (window && eventSource.current)
                eventSource.current.close();
        };
    }, []);

    return value;
}