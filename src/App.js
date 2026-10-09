import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Layout from './components/Layout'
import CaseStudy from './components/CaseStudy'
import Infrastructure from './components/Infrastructure'
import NotFound from './components/NotFound'
import './App.scss'
const Contact = lazy(() => import('./components/Contact'))
const Portfolio = lazy(() => import('./components/Portfolio'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const Videos = lazy(() => import('./components/YouTubeVideosAndTwitchStreams'))
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="work/:slug" element={<CaseStudy />} />
        <Route path="infrastructure" element={<Infrastructure />} />
        <Route path="contact" element={<Contact />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="blog" element={<Portfolio />} />
        <Route path="youtubeVideosAndTwitchStreams" element={<Videos />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
