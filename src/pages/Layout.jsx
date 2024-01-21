import { Outlet, Link ,useLocation} from "react-router-dom";
import { supabase } from '../supabaseClient';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from "../components/SessionContext";
import usericon  from '../../images/icons/user.svg';

const NavItem = ({ to, children }) => (
  <li>
    <Link to={to} className="text-md font-bold hover:text-purple-600">{children}</Link>
  </li>
);


const Layout = () => {
  const session = useContext(SessionContext);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const navItems = [
    { to: '/lostpets', name: 'Lost Pets' },
    { to: '/foundpets', name: 'Found Pets' },
    { to: '/signup', name: 'Sign Up', show: !session },
    { to: '/login', name: 'Login', show: !session },
    { to: '/profile', name: 'Profile', show: session },
  ];
  const { pathname } = useLocation();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    window.location.reload();
  }
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
   <header className="flex items-center justify-between relative  p-4 md:p-5">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="text-md md:text-lg font-extrabold  hover:text-purple-600 md:pr-5">Pawthway</Link>
        </div>
        

      {/* Nav items */}

      {/* Nav Links Static */}
      <nav className="flex-1 flex justify-center ">
         <ul className="flex text-sm md:text-md space-x-2 md:space-x-10 items-center">
         <li>
         <Link 
          to="/lostpets" 
          className={`text-md font-bold hover:text-purple-600 ${pathname === '/lostpets' ? 'text-violet-600' : ''}`}
        >
          Lost Pets
        </Link>
          </li>
          <li>
            <Link 
              to="/foundpets" 
              className={`text-md font-bold hover:text-purple-600 ${pathname === '/foundpets' ? 'text-violet-600' : ''}`}
            >
                Found Pets
            </Link>
          </li>
          </ul>
      </nav>
      {/* Nav Links Dynamic */}
      <nav className="flex-1 flex justify-end">
        <ul className="flex text-sm md:text-md space-x-2 md:space-x-10 items-center">
          {/* Search Bar */}
          <div className="hidden md:block">
            <input type="search" placeholder="Search" className="px-3 py-1 rounded-full border border-black" />
          </div>

          {/* Nav Links for  User Dropdown */}
          <div className="hidden md:block">
            <div className="flex">
              <img src={usericon} onClick={() => setToggleDropdown(!toggleDropdown)} alt="usericon" className="h-6 w-6"/>
              {toggleDropdown && (
                <div className="dropdown">
                  <div className="flex text-sm md:text-md space-x-2 md:space-x-10 items-center">
                    {session ? (
                      <>
                        <li>
                          <Link to="/profile" className="text-md font-bold hover:text-purple-600">Profile</Link>
                        </li>
                        <li>
                          <button onClick={handleLogout} className="text-md font-bold hover:text-purple-600">Logout</button>
                        </li>
                      </>
                    ) : (
                      !session && (
                        <div className="flex text-sm md:text-md space-x-2 md:space-x-10 items-center">
                          <li>
                            <Link to="/signup" className="text-md font-bold hover:text-purple-600">Sign Up</Link>
                          </li>
                          <li>
                            <Link to="/login" className="text-md font-bold hover:text-purple-600">Login</Link>
                          </li>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ul>
      </nav>
      
      {/* Mobile Button NavBar */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden flex-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* This is the div for the navbar that opens on mobile  */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 p-4 h-screen w-64 bg-white transition-transform duration-200 ease-in-out md:hidden z-50`}>
          <button onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <ul>
            {!session && (
              <>
                <li>
                  <Link to="/signup" className="text-md font-bold hover:text-purple-600">Sign Up</Link>
                </li>
                <li>
                  <Link to="/login" className="text-md font-bold hover:text-purple-600">Login</Link>
                </li>
              </>
            )}
            {session && (
              <>
                <li>
                  <Link to="/profile" className="text-md font-bold hover:text-purple-600">Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-md font-bold hover:text-purple-600">Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>

    </header>


    <main className="flex-grow">
    <Outlet />
     </main>


    <footer className="bg-black text-white py-10 mt-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">PawPathway</h2>
        <p className="mb-6">Your go-to hub for heartwarming pet reunions.</p>
        <p className="mt-6 text-sm text-gray-300">© {new Date().getFullYear()} PawPathway. All rights reserved.</p>
      </div>
    </footer>

    </div>
  );
};

export default Layout;

