import { BrowserRouter,Route,Routes } from "react-router-dom" 
import { FirstPage } from "./pages/FirstPage"
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { Blog } from "./pages/Blog"
import {Blogs} from "./pages/Blogs"
import {Publish} from "./pages/Publish"
import { Userblogs } from "./pages/Userblogs"
import { UpdateBlog } from "./pages/UpdateBlog"
import { ProfileUpdation } from "./pages/ProfileUpdation"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstPage/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/update" element={<ProfileUpdation/>} />
          <Route path="/blog/:id" element={<Blog/>}/>
          <Route path="/blogs" element={<Blogs/>}/>
          <Route path="/publish" element={<Publish/>}/>
          <Route path="/myBlogs" element={<Userblogs/>}/>
          <Route path="/update/:id" element={<UpdateBlog/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
