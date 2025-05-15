import React from 'react'
import { useRouteError } from 'react-router-dom'

/* import Header from 'src/components/modules/Header'
import Footer from 'src/components/modules/Footer' */

const ErrorPage: React.FC = () => {
  const error: unknown = useRouteError()
  return (
    <>
      {/* <Header /> */}
      <div className="flex flex-col items-center justify-center bg-[#F4F7F8] px-4 pb-20 pt-12 text-center text-black">
        <h1 className="mb-2.5 text-[100px] md:text-[160px]">404</h1>
        <div className="mb-10 text-[32px] md:text-[50px]">
          <p>Page not found</p>
          {(error as Error)?.message !== '' ||
            (error as { statusText?: string })?.statusText}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  )
}

export default ErrorPage
