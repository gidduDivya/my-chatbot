import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AuthCheckWrapper from './components/AuthCheckWrapper'
import { ToastProvider } from './components/Toast'
import ChatPage from './pages/chatpage'
import LoginPage from './pages/loginpage'
import RegisterPage from './pages/registerpage'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<AuthCheckWrapper />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/register" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App