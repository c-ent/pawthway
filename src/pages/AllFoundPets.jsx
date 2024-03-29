import React, { useState, useEffect } from 'react'
import FoundPetCard from '@components/FoundPetCard'
import { Link } from 'react-router-dom'
import FoundPetForm from '@components/FoundPetForm'
import loadingimg from '../../images/icons/dogvector.svg'
import { supabase } from '../supabaseClient'
import Pagination from '../components/Pagination'
import SortControls from '../components/SortControls'
import Loading from '../components/Loading'

const AllFoundPets = () => {
  const [foundPets, setFoundPets] = useState([]) // state to hold the dogs data
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('id');
  const [sortDirection, setSortDirection] = useState(true); // Initialize as boolean true
  const [formsubmited, setFormSubmitted] = useState(false); // Initialize as boolean true
  const [sortField, setSortField] = useState('id');
  const [page, setPage] = useState(1);
  const limit = 12;
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    getFoundPets().then(() => setIsLoading(false));
  }, [sortOption, sortDirection, formsubmited, page])


  async function getFoundPets() {
    let startIndex = (page - 1) * limit;
    let endIndex = startIndex + limit - 1;
  
    let { data: foundPets, error } = await supabase
      .from('foundpets')
      .select('*')
      .order(sortOption, { ascending: sortDirection })
      .range(startIndex, endIndex)
  
    if (error) {
      console.error('Error fetching dogs: ', error);
    } else {
      setFoundPets(foundPets)
      setHasNextPage(foundPets.length === limit);
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
    <div className='mx-auto max-w-screen-xl p-4' >
      <div className='flex flex-col items-center p-5 md:p-10 text-center'>
       
       <h1 className="text-4xl md:text-6xl font-bold pb-4 text-center m-auto">Found Pets</h1>
       <p className='pb-4'>Seeking a lost pet? We're here to assist in your search.</p>
       <div className=''>
       <FoundPetForm setFormSubmitted={setFormSubmitted}/>
     </div>
    
   </div>

    

      <SortControls
        handleNewestClick={handleNewestClick} 
        handleSortChange={handleSortChange} 
        handleSortDirectionChange={handleSortDirectionChange} 
        sortOption={sortOption} 
        sortDirection={sortDirection}
        componentType='foundPets'
      />    
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {foundPets.map((pet) => (
          <Link key={pet.id} to={`/foundpets/${pet.id}`}>
            <FoundPetCard pet={pet} />
          </Link>
        ))}
      </div>
      
      {!isLoading && 
        <Pagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
      }

      {isLoading && 
       <Loading />
      }


      {
        !isLoading && foundPets.length === 0 && 
        <div className='flex justify-center items-center my-20'>
          <h1 className='text-2xl font-bold'>No Pets Found</h1>
        </div>
      }
    </div>
  )
}

export default AllFoundPets