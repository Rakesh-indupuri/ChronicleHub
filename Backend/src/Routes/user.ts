import { Hono } from "hono";
export const userRouter= new Hono<{
	Bindings: {
		DATABASE_URL: string
        JWT_SECRET: string
	},
    Variables:{
        userId:string;
    }
}>();
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
import { signupSchema ,signinSchema} from "@rakesh_indupuri/medium-common";
import {verify} from 'hono/jwt'
import { JWTPayload } from "hono/utils/jwt/types";
interface JwtPayload extends JWTPayload{
    id: string;
}


userRouter.use('/update', async (c, next) => {
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
      return c.json({ error: "unauthorizexd" });
    }
});


userRouter.post('/signup',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const {success} = signupSchema.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({message:"Incorrect inputs"})
    }
      try {
            const user = await prisma.user.create({
                data: {
                  name:body.name,
                  email: body.email,
                  password: body.password
                }
            });
            const token = await sign({ id: user.id, name: user.name }, c.env.JWT_SECRET);
            return c.json({ token });
        } catch(e) {
            c.status(403);
            return c.json({ error: "error while signing up" });
        }    
  })
  

userRouter.post('/signin',async (c)=>{
const prisma=new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
const body=await c.req.json();
const {success} = signinSchema.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({message:"Incorrect inputs"})
    }
try{
    const user=await prisma.user.findUnique({
    where:{
        email:body.email 
    }
    });
    if(!user){
        c.status(406);
        return c.json({error:"user not found"})
    }
    if(user.password===body.password){
        const token = await sign({ id: user.id, name: user.name }, c.env.JWT_SECRET);
        return c.json({ token });
    }else{
        c.status(403)
        return c.json({error:"Incorrect Password"})
    }
}catch{
    c.status(406)
    return c.json({error:"Error while signining in"})
}
})


userRouter.put('/update', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
        c.status(411);
        return c.json({ message: "Incorrect inputs" });
    }
    const id = c.get('userId');
    try {
        await prisma.user.update({
            where: { id: id },
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
            },
        });
        c.status(200);
        return c.json({ message: "Updated Successfully" });
    } catch (e) {
        console.log("Handler: Update Error", e);
        c.status(500);
        return c.json({ message: "Error while updating" });
    }
});
