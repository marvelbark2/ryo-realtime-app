import useCurrentUser from "@/lib/use-current-user";
import { Message } from "@/types.d";

export default function ChatBubble({ message }: { message: Message }) {
    const currentUser = useCurrentUser();
    if (!currentUser) return null;

    const isEnd = message.to === currentUser;

    const date = new Date(message.at);

    const formattedDate = `${date.getHours()}:${date.getMinutes()}`;

    return (
        <div className={`chat ${isEnd ? "chat-end" : "chat-start"}`}>
            {/* <div className="chat-image avatar">
                <div className="flex justify-center items-center w-10 rounded-full bg-primary-content">
                    <span className="text-secondary">{currentUser.slice(0, 2)}</span>
                </div>
            </div> */}
            <div className="chat-image avatar placeholder">
                <div className="bg-primary-content text-neutral-content rounded-full w-12">
                    <span className="text-secondary">{currentUser.slice(0, 2)}</span>
                </div>
            </div>
            <div className="chat-header">
                {message.from}
                <time className="text-xs opacity-50">{formattedDate}</time>
            </div>
            <div className="chat-bubble">{message.content}</div>
            <div className="chat-footer opacity-50">
                {message.read ? 'Seen at' : "Delivered at"} {formattedDate}
            </div>
        </div>
    )
}