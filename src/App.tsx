import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Add from './admin/add'
import Admin from './admin/admin'
import Update from './admin/update'
import Signup from './home/signup'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth/admin' element={<Admin />} />
        <Route path='/auth/admin/add' element={<Add />} />
        <Route path='/auth/admin/update/:id' element={<Update />} />
        <Route path='/signup' element={<Signup/> } />
        
        
        

    </Routes>
    
    </BrowserRouter>
  )
}

export default App
