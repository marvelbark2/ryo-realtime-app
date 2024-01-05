import { UserProvider } from "@/lib/use-current-user";
import ChatHistory from "../partials/chat-history";
import ChatInputSend from "../partials/chat-input-send";
import ChatUser from "../partials/chat-user-body";

import { useState } from "react";
import { MyUsernameProvider } from "@/lib/use-my-username";

export default function ChatView({ userName }: { userName: string }) {
    const [selectedUser, setSelectedUser] = useState<string>('');
    return (
        <MyUsernameProvider user={userName}>
            <div className="flex flex-row space-x-4 w-full h-screen border-opacity-50">
                <div className="flex flex-col w-1/4 h-full bg-base-100">
                    <span className="text-2xl font-bold p-4">Messages</span>
                    <ChatHistory selectedUser={selectedUser} onClickUser={setSelectedUser} />
                </div>
                <div class="divider divider-horizontal"></div>
                <div className="flex flex-col w-3/4 h-full bg-base-100 border-opacity-50">
                    <UserProvider user={selectedUser}>
                        <ChatUser />
                    </UserProvider>
                </div>
            </div >
        </MyUsernameProvider>
    )
}