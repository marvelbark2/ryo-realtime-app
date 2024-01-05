import { join } from "path";
import { writeFileSync, readFileSync } from "fs";

export function init({ context }: { context: Map<string, any> }) {
    const file = join(process.cwd(), "db.json");
    const data = JSON.parse(readFileSync(file, "utf-8"));
    context.set("usernames", data.usernames);
    context.set("messages", data.messages);

    setInterval(() => {
        const file = join(process.cwd(), "db.json");
        writeFileSync(file, JSON.stringify({
            usernames: context.get("usernames"),
            messages: context.get("messages"),
        }))
    }, 15000)
}