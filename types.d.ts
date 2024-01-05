export type Message = {
    id: string;
    content: string;
    from: string;
    to: string;
    at: number;
    read: boolean;
}

export type MessageHistory = {
    user: string;
    lastMessage?: Message;
}