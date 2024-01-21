import React from 'react'
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const DeleteFoundPetButton = ({finder_id, pet_Id, session}) => {
  const [showButton, setShowButton] = useState(false);
  let user_id;
  if (session && session.user) {
    user_id = session.user.id;
  }

  const navigate = useNavigate();

  const deletePet = async () => {
    const { error } = await supabase
      .from('foundpets')
      .delete()
      .eq('id', pet_Id)

    if (error) console.log("Error deleting pet: ", error);
    navigate('/foundpets');
  }

  if (finder_id === user_id) {
    return (
      <div className='pt-5'>
      <p className='text-xs text-red-500' onClick={() => setShowButton(true)}>Pet has been found? <span className='font-bold'>Click Here</span></p>
      {showButton && 
        <button onClick={deletePet} className="text-xs bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
          Delete
        </button>
      }
    </div>
    )
  } else {
    return null; // Don't render anything if the user_ids don't match
  }
}

export default DeleteFoundPetButton