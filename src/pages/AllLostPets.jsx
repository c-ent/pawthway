import React, { useState, useEffect, useContext } from 'react'
import LostPetcard from '@components/LostPetcard'
import { Link } from 'react-router-dom';
import LostPetForm from '@components/LostPetForm'
import loadingimg from '../../images/icons/loading.svg'
import { supabase } from '../supabaseClient'
import { SessionContext } from '../components/SessionContext'
import Pagination from '../components/Pagination';
import SortControls from '../components/SortControls';

const AllLostPets = () => {
  const session = useContext(SessionContext);
  const [missingPets, setmissingPets] = useState([]) // state to hold the dogs data
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('created_at');
  const [sortDirection, setSortDirection] = useState(false); // Initialize as boolean true
  const [formsubmited, setFormSubmitted] = useState(false); // Initialize as boolean true
  const [page, setPage] = useState(1);
  const limit = 12;
  const [hasNextPage, setHasNextPage] = useState(true);
  useEffect(() => {
    getmissingPets().then(() => setIsLoading(false));
  }, [sortOption, sortDirection, formsubmited, page])

  async function getmissingPets() {
    let startIndex = (page - 1) * limit;
    let endIndex = startIndex + limit - 1;
  
    let { data: missingPets, error } = await supabase
      .from('missingPets')
      .select('*')
      .order(sortOption, { ascending: sortDirection })
      .range(startIndex, endIndex)
  
    if (error) {
      console.error('Error fetching dogs: ', error);
    } else {
      setmissingPets(missingPets)
      // Check if there's a next page
      setHasNextPage(missingPets.length === limit);
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

      <SortControls
        handleNewestClick={handleNewestClick} 
        handleSortChange={handleSortChange} 
        handleSortDirectionChange={handleSortDirectionChange} 
        sortOption={sortOption} 
        sortDirection={sortDirection} 
        componentType='missingPets'
      />

      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {missingPets.map((pet) => (
          <Link key={pet.id} to={`/lostpets/${pet.id}`}>
            <LostPetcard pet={pet} />
          </Link>
        ))}
        
      </div>
      {isLoading && 
        <div className='flex justify-center items-center mt-20'>
          <img src={loadingimg} className='animate-ping' alt='loading' />
        </div>
      }

      {
        !isLoading && missingPets.length === 0 && 
        <div className='flex justify-center items-center mt-20'>
          <h1 className='text-2xl font-bold'>No Pets Found</h1>
        </div>
      }
      {!isLoading && 
        <Pagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
      }
  </div>
  )
}

export default AllLostPets