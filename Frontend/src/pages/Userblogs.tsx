import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useUserBlogs } from "../hooks";

export const Userblogs = () => {
    const { loading, blogs } = useUserBlogs();

    if (loading) {
        return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    return <div>
        <Appbar />
        <div  className="flex justify-center">
        {blogs.length === 0 ? (
                    <div className="mt-20 ml-5 font-libre font-semibold text-xl">
                        NO BLOGS AVAILABLE NOW,UPLOAD SOME !!!
                    </div>
                ) : (
                    <div>
                        {blogs.map(blog => (
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                authorName={blog.author.name || "Anonymous"}
                                title={blog.title}
                                content={blog.content}
                                publishedDate={blog.createdAt}
                                showButtons={true}
                            />
                        ))}
                    </div>
                )}
            </div>
    </div>
}