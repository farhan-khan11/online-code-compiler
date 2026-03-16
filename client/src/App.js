import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Landing from './Pages/Landing'
import Compiler from './Pages/Compiler'
import Dashboard from './Pages/Dashboard'
import PrivateRoutes from './Pages/PrivateRoutes'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />}></Route>
        <Route element={<PrivateRoutes />}>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/compiler/:id' element={<Compiler />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App