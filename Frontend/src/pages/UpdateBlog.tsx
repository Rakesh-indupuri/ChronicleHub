
import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { Spinner } from "../components/Spinner";  

export const UpdateBlog = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);  
    const navigate = useNavigate();
    const { id } = useParams();

    const handleUpdate = async () => {
        setLoading(true);  
        try {
            const response = await axios.put(
                `${BACKEND_URL}/api/v1/blog/update/${id}`,
                {
                    title,
                    content: description,
                },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (response.status === 200) {
                navigate(`/blog/${id}`);
            } else {
                alert("Error while updating the blog");
            }
        } catch (e) {
            console.error(e);
            alert("Error while updating the blog");
        } finally {
            setLoading(false);  
        }
    };

    return (
        <div>
            <Appbar />
            <div className="flex justify-center pt-8">
                <div className="max-w-screen-lg w-full px-4 sm:px-0">
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className="font-chivo w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
                        placeholder="Update Title"
                    />
                    <TextEditor onChange={(e) => setDescription(e.target.value)} />
                    <button
                        onClick={handleUpdate}
                        type="submit"
                        className={`font-chivo mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center ${loading ? 'text-gray-800 bg-white' : 'text-white bg-blue-700 hover:bg-blue-800'} rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900`}
                        disabled={loading}  
                    >
                        {loading ? <Spinner /> : 'Update post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

function TextEditor({ onChange }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <div className="mt-2">
            <div className="w-full mb-4">
                <div className="flex items-center justify-between border">
                    <div className="my-2 bg-white rounded-b-lg w-full">
                        <label className="sr-only">Update Article</label>
                        <textarea
                            onChange={onChange}
                            id="editor"
                            rows={8}
                            className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2"
                            placeholder="Update Article"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
