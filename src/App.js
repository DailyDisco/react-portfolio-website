import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import Layout from './components/Layout'
import './App.scss'
import Portfolio from './components/Portfolio'
import Blog from './components/Portfolio'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

// to do: add a page for projects with video examples that lead to the project site itself.
// to do: add "SOCIALS" in the highlight yellow color and bold down the side of the nav bar near socials buttons to hightlight them.
// to do: make the website responsive to mobile.