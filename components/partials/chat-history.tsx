import { MessageHistory } from "@/types.d";
import { useState, useEffect } from "react";

export default function ChatHistory({ selectedUser, onClickUser }: { selectedUser: string, onClickUser: (user: string) => void }) {
    const [chatHistory, setChatHistory] = useState<MessageHistory[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        const loadMessagesHistory = async () => {
            try {
                const response = await fetch('/messages/history', {
                    signal: controller.signal
                });
                const data = await response.json();
                setChatHistory(data);
            } catch (error) {
                console.log(error);
            }
        }

        loadMessagesHistory()
        return () => {
            controller.abort();
        }
    }, [])

    return (
        <div className="flex flex-col space-y-2 p-4">
            {
                chatHistory.map((message) => (
                    <div
                        key={message.user}
                        className={`flex flex-row items-center space-x-2 ${message.user === selectedUser ? 'bg-base-300 rounded-xl' : ''} hover:bg-base-300 hover:rounded-xl p-2 cursor-pointer`}
                        onClick={() => onClickUser(message.user)}
                    >
                        <div className="w-12 h-12 bg-primary-content rounded-full"></div>
                        <div className="flex flex-col">
                            <span className="font-bold">{message.user}</span>
                            <span className="text-gray-500">{message.lastMessage?.content || ""}</span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}