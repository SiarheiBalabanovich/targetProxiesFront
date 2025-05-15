import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

/* import Header from 'src/components/modules/Header'
import Footer from 'src/components/modules/Footer' */

const Root: React.FC = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      {/* <Header /> */}
      <Outlet />
      {/* <Footer /> */}
    </>
  )
}

export default Root
