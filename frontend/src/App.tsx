import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { RegisterPage } from "./pages/RegisterPage/RegisterPage"
import { FeedPage } from "./pages/FeedPage/FeedPage"
import { MainLayout } from "./layout/MainLayout"
import { ProfilePage } from "./pages/ProfilePage/ProfilePage"
import { FollowPage } from "./pages/FollowPage/FollowPage"
import { PostPage } from "./pages/PostPage/PostPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />} />
        <Route element={<MainLayout />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/follow" element={<FollowPage />} />
          <Route path="/posts/:id" element={<PostPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
