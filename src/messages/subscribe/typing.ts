import type { ApiPayload } from "ryo.js";

type Payload = {
    to: string
    is: boolean
}
export async function post({ body, context, getCookie }: ApiPayload) {
    const parsedBody: Payload | undefined = await body() as any;
    const loggedUser = getCookie('userName')
    if (parsedBody) {
        const typings = context.get("typing");
        const obj = {
            from: loggedUser,
            to: parsedBody.to,
            is: parsedBody.is
        }
        if (!typings) {
            context.set("typing", [obj]);
        } else {
            const typing = typings.find((typing: any) => typing.from === loggedUser && typing.to === parsedBody.to);
            if (typing) {
                typing.is = parsedBody.is;
            } else {
                typings.push(obj);
            }
            context.set("typing", typings);
        }
        return parsedBody;
    }
}