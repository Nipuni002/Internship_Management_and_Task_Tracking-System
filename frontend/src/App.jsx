import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'font-sans text-sm',
              duration: 3000,
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #334155',
              },
            }}
          />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
