
import { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import { Avatar } from "./Avatar"
export const FullBlog = ({ blog }: {blog: Blog}) => {
    let formattedDate = "Date not available";
    const publishedDate = blog.createdAt;
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
    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 px-5 sm:px-10 w-full max-w-screen-xl pt-12">
                    <div className="col-span-12 sm:col-span-8">
                        <div className="text-3xl sm:text-5xl font-extrabold font-libre">
                            {blog.title}
                        </div>
                        <div className="text-slate-500 pt-2 font-chivo">
                            Posted on {formattedDate}
                        </div>
                        <div className="pt-4 font-chivo text-base sm:text-lg">
                            {blog.content}
                        </div>
                    </div>
                    <div className="hidden sm:block sm:col-span-4 ml-10">
                        <div className="text-slate-600 text-lg font-chivo mb-2">
                            Author
                        </div>
                        <div className="flex items-center">
                            <div className="pr-4 flex flex-shrink-0">
                                <Avatar size="big" name={blog.author.name || "Anonymous"} />
                            </div>
                            <div>
                                <div className="text-lg sm:text-xl font-bold font-chivo">
                                    {blog.author.name || "Anonymous"}
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    );
}
