import type { Message } from "@/types.d";
import type { ApiPayload } from "ryo.js";
import { v4 as uuidv4 } from "uuid";

export async function post({ body, context }: ApiPayload) {
    const parsedBody: Message | undefined = await body() as any;
    if (parsedBody) {
        const messages: Message[] | undefined = context.get("messages");
        parsedBody.id = uuidv4()
        if (!messages) {
            context.set("messages", [parsedBody]);
        } else {
            const newMessages = [...messages, parsedBody];
            context.set("messages", newMessages);
        }
        return parsedBody;
    }
}