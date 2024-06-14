import { Hono } from "hono";
export const blogRouter= new Hono<{
	Bindings: {
		DATABASE_URL: string
        JWT_SECRET: string
	},
    Variables:{
        userId:string;
    }
}>();
interface JwtPayload extends JWTPayload{
    id: string;
}
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {verify} from 'hono/jwt'
import { JWTPayload } from "hono/utils/jwt/types";
import { blogSchema } from "@rakesh_indupuri/medium-common";

blogRouter.use('/*', async (c, next) => {
    const header = c.req.header('Authorization');
    if (!header) {
      c.status(403);
      return c.json({ error: "unauthorized" });
    }
  
    const token = header.split(" ")[1];
    try {
      const response = await verify(token, c.env.JWT_SECRET) as unknown as JwtPayload; 
      if (!response || !response.id) {
        c.status(403);
        return c.json({ error: "unauthorized" });
      }
      c.set("userId", response.id);
      await next();
    } catch (error) {
      c.status(403);
      console.log(error)
      return c.json({ error: "unauthorized" });
    }
  });

  blogRouter.get('/bulk',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
    const blogs=await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            },
            createdAt:true 
        }
    });
    c.status(200)
    console.log("Blogs found:", blogs);
    return c.json({blogs})
    }catch(error){
        c.status(411);
        console.log(error)
        return c.json({ error: "Error while Fetching Blogs" });
    }
 })

blogRouter.get('/userBlogs',async (c)=>{
    const userId=c.get('userId')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
        const blogs=await prisma.user.findMany({
            where:{
                id:userId
            },select: {
                posts:{
                    select:{
                        content: true,
                        title: true,
                        id: true,
                        author: {
                            select: {
                                name: true
                            }
                        },
                    createdAt:true
                    }
                } 
            }
        })
        c.status(200)
        return c.json({blogs})
    }catch(error){
        c.status(411);
        console.log(error)
        return c.json({ error: "Error while Fetching User Blogs" });
    }
})
blogRouter.post('/delete/:id',async (c)=>{
    const id = c.req.param('id')
    const userId=c.get("userId")
	const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const blog = await prisma.post.findUnique({
            where: { id },
        });

        if (!blog) {
            c.status(404)
            return c.json({ error: "Blog post not found." });
        }

        if (blog.authorId !== userId) {
            c.status(403)
            return c.json({ error: "Unauthorized: You can only delete your own blog posts." });
        }
        await prisma.post.delete({
            where: { id },
        });
        c.status(200)
        return c.json({ message: "Blog post deleted successfully." });
    } catch (error) {
        console.log(error);
        c.status(500)
        return c.json({ error: "Error while deleting the blog post." });
    }
}) 
blogRouter.get('/:id', async(c) => {
    try{
	const id = c.req.param('id')
	const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blog=await prisma.post.findUnique({
        where:{
            id:id
        },select: {
            id: true,
            title: true,
            content: true,
            author: {
                select: {
                    name: true
                }
            },
            createdAt:true
        }
    })
    console.log(blog)
    return c.json(blog)
    }catch(error){
        c.status(411);
        console.log(error)
        return c.json({ error: "Error while Fetching Blog post" });
    }
})

blogRouter.post('/addBlog', async (c) => {
    const userId=c.get('userId')
    console.log(userId)
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
    const body = await c.req.json();
    const {success} = blogSchema.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({message:"Incorrect inputs"})
    }
    const blog=await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:userId,
            published:true
        }
    })
    return c.json({id:blog.id})
    }catch(error){
        c.status(500);
        console.log(error)
        return c.json({ error: "Internal Server Error" });
    }
})
blogRouter.put('/update/:id', async (c) => {
    const userId=c.get('userId')
    const id=c.req.param('id')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const {success} = blogSchema.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({message:"Incorrect inputs"})
    }
    const blog=await prisma.post.update({
        where:{
            id:id,
            authorId:userId
        },
        data:{
            title:body.title,
            content:body.content
        }
    })
    return c.text("Updated post")
})