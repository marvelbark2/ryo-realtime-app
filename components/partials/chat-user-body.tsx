import useEventSignal from "@/lib/use-event-signal";
import ChatInputSend from "./chat-input-send";
import { useRef, useEffect } from "react";
import { Message } from "@/types.d";
import ChatBubble from "./chat-bubble";
import useCurrentUser from "@/lib/use-current-user";

let mounted = false;
export default function ChatUser() {
    const currentUser = useCurrentUser()
    const subMessages = useEventSignal<{ messages: Message[], isTyping: boolean }>(`/messages/subscribe/${currentUser}.ev`);


    return (
        <>
            <div className="flex flex-row items-center justify-between p-4 bg-base-200">
                <div className="flex flex-row items-center space-x-2">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="flex flex-col">
                        <span className="font-bold">{currentUser}</span>
                    </div>
                </div>
            </div>

            <div class="divider"></div>
            <div class="mt-4 p-3 overflow-hidden overflow-y-scroll h-full">
                {
                    (subMessages?.messages ?? []).map((message) => (
                        <ChatBubble key={message.id} message={message} />
                    ))
                }
            </div>

            <div class="divider"></div>
            <div className="w-full">
                {
                    subMessages?.isTyping && (
                        <span class="text-sm font-light text-info-content">is typing
                            <span className="loading loading-ring loading-xs"></span>
                        </span>
                    )
                }

                <ChatInputSend />
            </div>
        </>
    )
}