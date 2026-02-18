//app/admin/page.tsx

"use client";

{/*
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            setError("Invalid username or password");
            return;
        }

        router.push("/admin");
    }
}
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-500 gap-10">
            {/* Title */} {/*
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
                Admin Page
            </h1>

            <form
                onSubmit={handleLogin}
                className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
                    {/* Email */}  {/*
                    <input
                        type="text"
                        placeholder="Username"
                        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-600"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* Password */}     {/*
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-red-600 font-semibold">{error}</p>
                    )}

                    {/* Button */}   {/*
                    <button
                        type="submit"
                        className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                        Login
                    </button>

            </form>
        </main>
    );
}            
*/}



import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            setError("Invalid username or password");
            return;
        }
        {/*Route to page after login*/}    
        router.push("/admin-panel");
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-500 gap-8">

        <h1 className="text-4xl font-bold text-white">
            Admin Login
        </h1>

        <form
            onSubmit={handleLogin}
            className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-6"
        >
            <input
            type="text"
            placeholder="Username"
            className="border p-3 rounded-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />

            <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
            <p className="text-red-600 font-semibold">{error}</p>
            )}

            <button
            type="submit"
            className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
            >
            Login
            </button>
        </form>
        </main>
    );
}
