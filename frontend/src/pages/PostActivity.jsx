import { useState } from "react";
import axios from "axios";

export default function PostActivity() {
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = async () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            alert("No user logged in.");
            return;
        }
        
        const user = JSON.parse(userStr);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5055"}/api/activity`, {
                userId: user.userId,
                description,
                imageUrl,
            });
            alert("Activity Posted");
        } catch (err) {
            alert("Post failed.");
        }
    };

    return (
        <div className="flex flex-col items-center mt-20 space-y-4">
            <input
                className="border p-2"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                className="border p-2"
                placeholder="Image URL"
                onChange={(e) => setImageUrl(e.target.value)}
            />
            <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2"
            >
                Post Activity
            </button>
        </div>
    );
}