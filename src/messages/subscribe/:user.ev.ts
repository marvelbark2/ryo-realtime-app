import { Message } from "@/types.d";
import type { SSEPayload } from "RyoApi";

export default {
    invalidate: 400,
    runner: ({ params, getCookie, context }: SSEPayload) => {
        const loggedUser = getCookie('userName')
        if (loggedUser && params) {
            const userToSubscribe = params.user;

            const messages: Message[] = context.get("messages");
            const typings = context.get("typing");
            if (!messages) return;

            const receivedMessages = messages.filter(message => message.to === loggedUser && message.from === userToSubscribe);
            const sentMessages = messages.filter(message => message.from === loggedUser && message.to === userToSubscribe);

            const allMessages = [...receivedMessages, ...sentMessages].sort((a, b) => a.at - b.at);

            const typing = typings?.find((typing: any) => typing.from === userToSubscribe && typing.to === loggedUser);
            return {
                messages: allMessages,
                isTyping: typing?.is || false,
            }
        }
    }
}