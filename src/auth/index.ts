import type { ApiPayload, GetApiPayload } from "ryo.js";

export function get({ getCookie, context }: GetApiPayload) {
    const userName = getCookie("userName");
    if (context.has("usernames")) {
        const usernames = context.get("usernames");
        if (!usernames.includes(userName)) {
            context.set("usernames", [...new Set([...usernames, userName])]);
        }
    }
    return {
        isAuth: !!userName,
        userName,
    }
}

export async function post({ body, setCookie, context }: ApiPayload) {
    const pBody = await body();
    if (pBody) {
        const userName = (pBody as any).userName;
        setCookie("userName", userName);
        context.set("usernames", [...context.get("usernames"), userName]);
    }

    return {
        isAuth: true,
    }
}