import "regenerator-runtime/runtime";
import React from 'react'
import ReactDOM from 'react-dom/client'
import './globals.css';
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import AIContextProvider from "./context/AIContext"

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AIContextProvider>
      <React.StrictMode>
        <App />
        <Toaster />
      </React.StrictMode>
    </AIContextProvider>
  </QueryClientProvider>
)
