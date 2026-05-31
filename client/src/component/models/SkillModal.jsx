
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../Loader'
import toast from 'react-hot-toast'
import { axiosInstance, endPoints } from '../../api/axios'

const SkillModal = ({ onClose, skill, isEditing, onSave,fetchSkills }) => {
  const [skillName, setSkillName] = useState('')
  const [error, setError] = useState('')
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (isEditing && skill) {
      setSkillName(skill.title || '')
    }
  }, [isEditing, skill])

  const handleSave = async () => {
    if (!skillName.trim()) {
      setError('Skill name is required');
      return;
    }
  
    setError('');
    setLoader(true);
  
    try {
      
      let savedSkill;
      if (isEditing && skill && skill._id) {
        const response = await axiosInstance.put(
          `${endPoints.skills.update}/${skill._id}`,
          { title: skillName }
        );
        savedSkill = response.data.skill;
      } else {
        const response = await axiosInstance.post(
          endPoints.skills.create,
          { title: skillName }
        );
        if(response.status===201)
        savedSkill = response.data.skill;
      }
  
      // onSave(savedSkill);
      fetchSkills()
      onClose();
      toast.success('Skill to be edited:', skill);
    } catch (error) {
      toast.error('skill already exists.');
      const errorMessage = 'skill already exists.';
      setError(errorMessage);
    } finally {
      setLoader(false);
    }
  };
  
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]'>
      <div className='bg-white rounded-lg max-w-[410px] w-full p-6'>
        <h2 className='text-xl font-bold mb-4'>
          {isEditing ? 'Edit Skill' : 'Create Skill'}
        </h2>
        <form>
          <div className='mb-4'>
            <label
              htmlFor='skillName'
              className='block text-sm font-medium mb-1'
            >
              Title
            </label>
            <input
              type='text'
              id='skillName'
              className='w-full border border-gray-300 rounded-lg px-3 py-2'
              placeholder='Enter skill name'
              value={skillName}
              onChange={e => setSkillName(e.target.value)}
            />
            {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
          </div>
          <div className='flex items-center justify-between'>
            <button
              type='button'
              className='mr-2 px-4 py-2 rounded-lg bg-gray-200 w-full'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type='button'
              className='px-4 py-2 rounded-lg bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold border border-[#278a8a] w-full'
              onClick={handleSave}
              disabled={loader}
            >
              {!loader ? "Save" : <Loader />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SkillModal
