import { createContext, useContext } from "react";
const UserContext = createContext<string>("");

export default function useMyUsername() {
    const user = useContext(UserContext);
    return user;
}

export function MyUsernameProvider({ children, user }: { children: any, user: string }) {
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}