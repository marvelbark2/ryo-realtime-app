import { Message } from "@/types.d";
import { GetApiPayload } from "ryo.js";

export function get({ context, getCookie }: GetApiPayload) {
    const userName = getCookie("userName");
    if (!userName) {
        throw new Error("Unauthorized");
    }

    const messages: Message[] | undefined = context.get("messages");

    if (!messages) {
        context.set("messages", []);
        return [];
    }

    const userMessages = messages.filter((message) => message.to === userName || message.from === userName);

    const groupedMessages: { [key: string]: Message[] } = {};

    userMessages.forEach((message) => {
        const key = message.from === userName ? message.to : message.from;
        if (!groupedMessages[key]) {
            groupedMessages[key] = [];
        }
        groupedMessages[key].push(message);
    });

    const res = Object.keys(groupedMessages)
        .map((key) => {
            const messages = groupedMessages[key].sort((a, b) => b.at - a.at);
            const lastMessage = messages[0];
            return {
                user: key,
                lastMessage,
            };
        })

    const usernames: string[] = context.get("usernames") || [];
    const users = usernames.filter((username: string) => username !== userName);

    const usersWithoutMessage = users.filter((username) => !res.find((user) => user.user === username));

    const result = [
        ...res,
        ...usersWithoutMessage.map((user) => ({
            user,
            lastMessage: undefined,
        }))
    ]

    return result.filter((userP) => userP.user && userP.user !== userName);
}