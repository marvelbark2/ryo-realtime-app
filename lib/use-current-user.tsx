import { createContext, useContext } from "react";
const UserContext = createContext<string | null>(null);

export default function useCurrentUser() {
    const user = useContext(UserContext);
    return user;
}

export function UserProvider({ children, user }: { children: any, user: string | null }) {
    if (!user) return null
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}