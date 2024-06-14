
import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useState } from "react"; 
import { Spinner } from "./Spinner"; 
interface BlogCardProps {
    id: string;
    authorName: string;
    title: string;
    content: string;
    publishedDate?: Date | string;
    showButtons?: boolean;
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate,
    showButtons = false
}: BlogCardProps) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); 

    let formattedDate = "Date not available";
    if (publishedDate) {
        const date = new Date(publishedDate);
        if (date instanceof Date && !isNaN(date.getTime())) {
            formattedDate = date.toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    const deleteRequest = async ({ id }: { id: string }) => {
        setLoading(true);  
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog/delete/${id}`, null, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            if (response.status === 200) {
                navigate('/myBlogs');
                window.location.reload();
            }
        } catch (e) {
            console.log(e);
            alert('Error while deleting Blog');
        } finally {
            setLoading(false); 
        }
    }

    return (
        <div key={id} className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md">
            <div className="flex items-center">
                <Avatar name={authorName} />
                <div className="font-chivo font-extralight pl-2 text-sm flex justify-center flex-col">{authorName}</div>
                <div className="flex justify-center flex-col pl-2">
                    <Circle />
                </div>
                <div className="font-chivo pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
                    {formattedDate}
                </div>
                {showButtons && (
                    <div className="ml-auto flex items-center space-x-2">
                        <button 
                            onClick={() => {
                                navigate(`/update/${id}`);
                            }}
                            type="button" 
                            className="font-chivo text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-2 py-1" 
                            style={{ minWidth: '80px' }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                deleteRequest({ id });
                            }}
                            type="button"
                            className={`font-chivo text-white ${loading ? 'bg-white text-gray-800' : 'bg-red-700 hover:bg-red-800'} font-medium rounded-lg text-sm px-2 py-1 flex justify-center items-center`}
                            style={{ minWidth: '80px' }}
                            disabled={loading} 
                        >
                            {loading ? <Spinner /> : 'Delete'}
                        </button>
                    </div>
                )}
            </div>
            <Link to={`/blog/${id}`} className="block">
                <div className="font-libre text-xl font-semibold pt-2">
                    {title}
                </div>
                <div className="pt-2 font-chivo text-md font-thin">
                    {content.length > 75 ? content.slice(0, 100) + "..." : content}
                </div>
                <div className="font-chivo text-slate-500 text-sm font-thin pt-4">
                    {`${Math.ceil(content.length / 500)} minute(s) read`}
                </div>
            </Link>
        </div>
    );
}

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500"></div>;
}