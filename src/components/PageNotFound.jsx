import { Link } from "react-router-dom"

const PageNotFound = () => {
  return (
    <div className='bg-black grid items-center grid-cols-1 content-center h-screen'>
    <h1 className="font-bold font-sans text-gray-400 text-3xl text-center mx-auto"> <span className=" text-6xl mb-3 text-red-500 block">404</span> Page Not Found</h1>
    <p className="text-center text-gray-400 font-stretch-50% mt-3">This page is removed or cannot be access.</p>
    </div>
  )
}

export default PageNotFound