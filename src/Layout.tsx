
import Navbar from './Navbar'

import Footer from './Footer'

import { Outlet } from 'react-router'
import { useLocation } from "react-router";
import { useEffect } from 'react';
function Layout() {


  const location = useLocation();

  useEffect(() => {
    console.log("Route changed:", location.pathname);
  }, [location]);
  return (
    <>
<Navbar/>
    <Outlet key={location.pathname}/>
    <Footer/>
      
    </>
  )
}

export default Layout
