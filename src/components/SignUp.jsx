import React from 'react'
import { supabase } from '../supabaseClient'
import { useState } from 'react'
import logo from '../../images/icons/logo-blck.svg'
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [firstName, setfirstName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const [signUpError, setSignUpError] = useState(null);

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) console.error(error);
        else {
          navigate('/'); // navigate to dashboard
        }
      };

      const handleSignUp = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName,
              },
            },
          })
          if (error) {
            console.error(error);
            setSignUpError(error.message);
          } 
        else console.log(data)
        handleLogin()
      }
  
    return (
        <div className=" flex flex-col items-center justify-center  py-10 px-4 sm:px-6 lg:px-8">
            <div className='pt-16'>
                <img src={logo} alt="logo" className="w-20 h-20 md:w-28 md:h-28"/>
            </div>
            {signUpError && <p className="text-red-500">{signUpError}</p>}
            <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
            <div>
                <label htmlFor="firstName" className="">Name</label>
                <input id="firstName" name="firstName" type="firstName" value={firstName} onChange={(e) => setfirstName(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Display Name" />
            </div>
            <div>
                <label htmlFor="email-address" className="">Email</label>
                <input id="email-address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email" />
            </div>
            <div>
                <label htmlFor="password" className="">Password</label>
                <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
                <div>
                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
     
    )
}

export default SignUp