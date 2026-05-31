import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Loader from '../Loader'
import toast from 'react-hot-toast';
import { axiosInstance, endPoints } from '../../api/axios';

const RoleAddModel = ({ onClose, examData, setRoles }) => {
  const [loader, setLoader] = useState(false);
  const [roleName, setRoleName] = useState('')
  const [error, setError] = useState({
    date: '',
    roleName: ''
  })

  useEffect(() => {
    if (examData) {
      setRoleName(examData.roleName)
    } else {
      setRoleName('')
    }
  }, [examData])

  const handleSave = async () => {
    let valid = true
    const newError = { roleName: '' }

    if (!roleName) {
      newError.roleName = 'Please Enter Role Name'
      valid = false
    }

    if (!valid) {
      setError(newError)
      return
    }

    setError({ roleName: '' })
    const updatedData = { roleName }

    try {
      setLoader(true)
      const response = await axiosInstance.post(
        endPoints.roles.create,
        updatedData
      )

      const newRole = response.data.data
      toast.success('Role saved successfully:', newRole)
      setRoles(prevRoles => [newRole, ...prevRoles])
      setRoleName('')
      onClose()
      setLoader(false)
    } catch (error) {
      setLoader(false)
        toast.error('Role already exists.')
        setError({ roleName: 'Role already exists.' })
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]'>
      <div className='bg-white rounded-lg max-w-[410px] w-full p-6'>
        <h2 className='text-xl font-bold mb-4'>
          {examData ? 'Add Role' : 'Add Role Model'}
        </h2>
        <form>
          <div className='mb-4'>
            <label
              htmlFor='roleName'
              className='block text-sm font-medium mb-1'
            >
              Role Name
            </label>
            <input
              type='text'
              id='roleName'
              placeholder='Role Name'
              className='w-full border border-gray-300 rounded-lg px-3 py-2'
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
            />
            {error.roleName && <p className='text-red-500'>{error.roleName}</p>}
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

export default RoleAddModel

