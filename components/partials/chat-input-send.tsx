import useCurrentUser from "@/lib/use-current-user";
import useMyUsername from "@/lib/use-my-username";
import { Message } from "@/types.d";
import { useRef } from "react";

export default function ChatInputSend() {
    const currentUser = useCurrentUser();
    const myUsername = useMyUsername();
    const inputRef = useRef<HTMLInputElement>(null);

    const sendMessage = async () => {
        if (!inputRef.current || !currentUser) return
        const payload: Message = {
            id: '',
            from: myUsername,
            to: currentUser,
            at: Date.now(),
            read: false,
            content: inputRef.current.value
        }

        const res = await fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            inputRef.current.value = '';
        }
    }

    const sendIsTyping = async (isTyping: boolean) => {
        const payload = {
            to: currentUser || "",
            is: isTyping
        }

        await fetch('/messages/subscribe/typing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

    }
    return (
        <div className="flex flex-row items-center justify-between p-4 bg-base-200">
            <div className="flex flex-row items-center space-x-8 w-full">
                <input ref={inputRef} type="text" placeholder="Type here" className="input input-ghost w-full"
                    onKeyDown={(e) => {
                        sendIsTyping(true)
                    }}

                    onKeyUp={(e) => {
                        sendIsTyping(false)
                    }}
                />
                <button
                    onClick={sendMessage}
                    className="btn btn-ghost"
                >
                    send
                </button>
            </div>
        </div>
    )
}