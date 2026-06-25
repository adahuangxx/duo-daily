import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CalendarPage } from './pages/CalendarPage'
import { FilesPage } from './pages/FilesPage'
import { FileViewPage } from './pages/FileViewPage'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route path="/" element={<CalendarPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/file/*" element={<FileViewPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
