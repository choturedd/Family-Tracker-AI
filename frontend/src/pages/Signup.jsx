import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5055"}/api/auth/register`, {
                name,
                email,
                password,
            });
            alert("Signup successful! Please login.");
            navigate("/");
        } catch (err) {
            setError(err.response?.data || "Signup failed");
        }
    };

    return (
        <div className="flex flex-col items-center mt-20 space-y-4">
            <h2 className="text-2xl font-bold">Sign Up</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
                className="border p-2"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
            />
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
                onClick={handleSignup}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Sign Up
            </button>
            <p className="mt-4">
                Already have an account?{" "}
                <Link to="/" className="text-blue-600 underline">
                    Login
                </Link>
            </p>
        </div>
    );
}
