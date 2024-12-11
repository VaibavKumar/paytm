import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users, setUsers] = useState([
        {
            username: "vaibav",
            firstName: "vk",
            lastName: "kumar"
        }
    ]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const source = axios.CancelToken.source(); // Create cancel token
        axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${encodeURIComponent(filter)}`, {
            cancelToken: source.token
        })
            .then(response => {
                const users = response.data.user.map((user, index) => ({
                    ...user,
                    _id: user._id || index // Ensure unique IDs
                }));
                setUsers(users);
            })
    }, [filter]);

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {users.map((user,key) => (
                    <User user={user} />
                ))}
            </div>
        </>
    );
};

function User({ user  }) {
    const navigate = useNavigate();
    return (
        <div className="mb-4">
            <div className="flex justify-between">
                <div className="flex">
                    <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                        <div className="flex flex-col justify-center h-full text-xl">
                            {user.firstName[0]}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center h-full">
                        <div>
                            {user.firstName} {user.lastName || ""}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <Button
                        onClick={(e) => {
                            navigate(`/send?id=${user._id}&name=${user.firstName}`);
                        }}
                        label={"Send Money"}
                    />
                </div>
            </div>
        </div>
    );
}
