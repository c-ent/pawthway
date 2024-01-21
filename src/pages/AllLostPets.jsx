import React, { Suspense, useState, useEffect, useContext } from 'react'
import LostPetcard from '@components/LostPetcard'
import { Link } from 'react-router-dom';
import LostPetForm from '@components/LostPetForm'
import loadingimg from '../../images/icons/loading.svg'
import { supabase } from '../supabaseClient'
import { SessionContext } from '../components/SessionContext'

const AllLostPets = () => {
  const [missingPets, setmissingPets] = useState([]) // state to hold the dogs data
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('created_at');
  const [sortDirection, setSortDirection] = useState(false); // Initialize as boolean true
  const [formsubmited, setFormSubmitted] = useState(false); // Initialize as boolean true
  const session = useContext(SessionContext);


  useEffect(() => {
    getmissingPets().then(() => setIsLoading(false));
  }, [sortOption, sortDirection,formsubmited]) // Add sortDirection as a dependency

  async function getmissingPets() {
    let { data: missingPets, error } = await supabase
      .from('missingPets')
      .select('*')
      .order(sortOption, { ascending: sortDirection }) // Call order function once
    if (error) {
      console.error('Error fetching dogs: ', error);
    } else {
      setmissingPets(missingPets)
    }
  }

  const handleSortChange = (e) => {
    if (e.target.value === 'highest') {
      setSortOption('reward');
      setSortDirection(true); // false for descending order
    } else if (e.target.value === 'lowest') {
      setSortOption('reward');
      setSortDirection(false); // true for ascending order
    } else {
      setSortOption(e.target.value);
    }
  }

  const handleSortDirectionChange = (e) => {
    setSortDirection(e.target.value === 'true'); // Convert string to boolean
  }

  const handleNewestClick = () => {
    setSortOption('created_at');
    setSortDirection(false);
  }
  

  return (
    <div className='mx-auto max-w-screen-xl p-4 md:p-0' >
      
      <div className='flex items-center justify-between pt-10'>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold pb-5">Missing Pets</h1>
        </div>
        
        <div className='flex flex-col justify-end'>
          <LostPetForm  setFormSubmitted={setFormSubmitted}/>
        </div>
      </div>

      <div className='flex gap-2 md:gap-5 pb-4'>
        <button 
          onClick={handleNewestClick} 
          className='px-2 py-2 bg-violet-500 text-white text-xs md:text-md rounded'
        >
          Show Newest
        </button>

        <select 
        value={sortOption} 
        onChange={handleSortChange} 
        className=' py-2 bg-violet-500 text-white rounded text-xs md:text-md'
      >
        <option value="id">Sort by ID</option>
        <option value="name">Sort by Name</option>
        <option value="highest">Highest Reward</option>
        <option value="lowest">Lowest Reward</option>
      </select>

      <select 
        value={sortDirection} 
        onChange={handleSortDirectionChange} 
        className='px-2 py-2 bg-violet-500 text-white rounded text-xs md:text-md'
      >
        <option value="false">Ascending</option>
        <option value="true">Descending</option>
      </select>
    </div>

    {isLoading && 
      <div className='flex justify-center items-center mt-20'>
        <img src={loadingimg} className='animate-ping' alt='loading' />
      </div>
    }

    <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {missingPets.map((pet) => (
        <Link key={pet.id} to={`/lostpets/${pet.id}`}>
          <LostPetcard pet={pet} />
        </Link>
      ))}
    </div>
  </div>
  )
}

export default AllLostPets