import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5055"}/api/auth/login`, {
                email,
                password,
            });
            localStorage.setItem("user", JSON.stringify(res.data));
            navigate("/dashboard");
        } catch (err) {
            alert("Login Failed: " + (err.response?.data || err.message));
        }
    };

    return (
        <div className="flex flex-col items-center mt-20 space-y-4">
            <input
                className="border p-2"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                className="border p-2"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2"
            >
                Login
            </button>
            <p className="mt-4">
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-600 underline">
                    Sign Up
                </a>
            </p>
        </div>
    );
}