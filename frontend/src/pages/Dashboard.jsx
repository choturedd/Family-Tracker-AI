import { useEffect, useState } from "react";
import axios from "axios";
import Chatbot from "../components/Chatbot";

export default function Dashboard() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL || "http://localhost:5055"}/api/activity`)
            .then((res) => setActivities(res.data));
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Activities</h2>
                <a href="/post" className="bg-green-600 text-white px-4 py-2 rounded">
                    + Post New Activity
                </a>
            </div>
            {activities.map((a) => (
                <div key={a.id} className="border p-4 mb-2">
                    <p>{a.description}</p>
                    <p className="text-sm text-gray-500">{a.imageUrl}</p>
                </div>
            ))}
            <Chatbot />
        </div>
    );
}