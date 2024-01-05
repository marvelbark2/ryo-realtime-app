import { useState } from "react";
export default function AuthView() {
    const [userName, setUserName] = useState("");

    const onEnter = async () => {
        const res = await fetch("/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userName })
        });
        if (res.ok) {
            window.location.reload();
        }
    };
    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Login!</h2>
                <p>
                    <label className="label">
                        <span className="label-text">What is your username?</span>
                    </label>
                    <input onInput={(e) => setUserName(e.currentTarget.value)} type="text" placeholder="Username" className="input input-bordered w-full max-w-xs" />
                </p>
                <div className="card-actions justify-end">
                    <button onClick={onEnter} className="btn btn-primary">Enter</button>
                </div>
            </div>
        </div>
    )
}