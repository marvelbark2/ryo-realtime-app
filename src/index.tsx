import AuthView from "@/components/views/AuthView";
import ChatView from "@/components/views/ChatView";
import { useState, useEffect } from "react";

export default function App() {
    const [userName, setUserName] = useState();
    useEffect(() => {
        const loadAuth = async () => {
            const res = await fetch("/auth");
            const data = await res.json();
            if (data.isAuth)
                setUserName(data.userName);
        }

        loadAuth();
    }, []);
    return (
        <div class="bg-base-50 min-w-max min-h-screen flex items-center justify-center" data-theme="winter">
            {
                typeof userName === "string" ? (
                    <ChatView userName={userName} />
                ) : (
                    <AuthView />
                )
            }
        </div>
    );
}