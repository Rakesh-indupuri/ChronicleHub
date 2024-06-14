import z from "zod"

export const signupSchema=z.object(
    {
        name:z.string(),
        email:z.string().email(),
        password:z.string().min(6)
    }
)
export const signinSchema=z.object(
    {
        email:z.string().email(),
        password:z.string().min(6)
    }
)
export const blogSchema=z.object(
    {
        title:z.string(),
        content:z.string()
    }
)

export type SignupInput=z.infer<typeof signupSchema>
export type SigninInput=z.infer<typeof signinSchema>
export type BlogInput=z.infer<typeof blogSchema>