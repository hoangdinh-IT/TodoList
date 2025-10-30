import { useState } from 'react'
import './App.css'
import AppRouter from './routes/AppRouter'
import { SnackbarProvider } from './providers/SnackbarProvider'
import { DialogProvider } from './providers/DialogProvider'

function App() {
    return (
        <SnackbarProvider>
            <DialogProvider>
                <AppRouter />
            </DialogProvider>
        </SnackbarProvider>
    )
}

export default App;
