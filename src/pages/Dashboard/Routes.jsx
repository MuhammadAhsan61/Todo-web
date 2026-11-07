import React from 'react'
import { Route, Routes as RouterRoutes } from 'react-router-dom'
import Overview from './Overview'
import Todos from './Todos'
import Completed from './Completed'
import Settings from './Settings'
import PageNotFound from '../../components/PageNotFound'

const Index = () => {
    return (
        <RouterRoutes>
            <Route path='/' element={<Overview />} />
            <Route path='/todos' element={<Todos />} />
            <Route path='/completed' element={<Completed />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='*' element={<PageNotFound />} />
        </RouterRoutes>
    )
}

export default Index