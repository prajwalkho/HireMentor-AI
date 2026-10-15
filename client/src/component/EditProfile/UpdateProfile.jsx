import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Loader from '../Loader'
import toast from 'react-hot-toast'
import { axiosInstance, endPoints, getAssetUrl } from '../../api/axios'

const UpdateProfile = () => {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false)
  const [userData, setUserData] = useState({
    first_Name: '',
    last_Name: '',
    birth_Date: '',
    gender: '',
    email: '',
    profilePhoto: '',
    profileFile: null
  })
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) {
      setUserData({
        first_Name: storedUser.first_Name || '',
        last_Name: storedUser.last_Name || '',
        birth_Date: storedUser.birth_Date
          ? storedUser.birth_Date.split('T')[0]
          : '',
        gender: storedUser.gender || '',
        email: storedUser.email || '',
        profilePhoto: storedUser.profilePhoto || '',
        profileFile: null
      })
    }
  }, [])


  const [errors, setErrors] = useState({})

  const fields = [
    {
      label: 'First Name',
      name: 'first_Name',
      value: userData.first_Name,
      type: 'text',
      required: true
    },
    {
      label: 'Last Name',
      name: 'last_Name',
      value: userData.last_Name,
      type: 'text',
      required: true
    },
    {
      label: 'Date of Birth',
      name: 'birth_Date',
      value: userData.birth_Date,
      type: 'date',
      required: true
    },
    {
      label: 'Gender',
      name: 'gender',
      value: userData.gender,
      type: 'select',
      options: ['female', 'male', 'other'],
      required: true
    },
    {
      label: 'Email Address',
      name: 'email',
      value: userData.email,
      type: 'email',
      required: false
    }
  ]

  const handleInputChange = e => {
    const { name, value } = e.target
    setUserData(prevState => ({
      ...prevState,
      [name]: value || ''
    }))
  }
  const isTokenExpired = token => {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp * 1000
    return expiry < Date.now()
  }
  const getToken = () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    if (!token) {
      console.error('No token found, please log in again.')
      return null
    }

    if (isTokenExpired(token)) {
      console.error('Token expired, please log in again.')
      return null
    }
    return token
  }
  const handleUpdate = async () => {
    setLoader(true)
    try {
      const token = getToken()
      if (!token) {
        setLoader(false)
        return
      }

      const formData = new FormData()
      formData.append('first_Name', userData.first_Name)
      formData.append('last_Name', userData.last_Name)
      formData.append('birth_Date', userData.birth_Date)
      formData.append('gender', userData.gender)
      formData.append('email', userData.email)

      if (userData.profileFile) {
        formData.append('profilePhoto', userData.profileFile)
      }
      const response = await axiosInstance.put(
        `${endPoints.auth.updateProfile}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        toast.success('Profile updated successfully', response.data)
        const updatedUser = response.data.data;
        setUserData({
          ...userData,
          ...updatedUser,
          profilePhoto: updatedUser.profilePhoto,
        });
        localStorage.setItem('user', JSON.stringify(updatedUser))
        navigate(`/${updatedUser.role}`)
      } else {
        toast.success('Profile update failed', response.data.message)
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Token is invalid or expired. Please log in again.')
      } else {
        toast.error('Error updating profile', error)
      }
    } finally {
      setLoader(false)
    }
  }
  const getProfileImageUrl = () => {
    if (!userData?.profilePhoto) return 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
    
    // Handle data URL (newly selected file)
    if (typeof userData.profilePhoto === 'string' && userData.profilePhoto.startsWith('data:image')) {
      return userData.profilePhoto;
    }
    
    // Handle object or string from server
    const photoPath = typeof userData.profilePhoto === 'object' ? userData.profilePhoto.url : userData.profilePhoto;
    if (!photoPath) return 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
    
    return getAssetUrl(photoPath);
  };

  return (
    <div className='h-1/2'
      style={{
        backgroundImage: `url('/assets/1519804675919.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className='mx-auto px-5 max-w-4xl flex flex-col justify-center h-[78vh]'>
        <div className='space-y-2'>
          <div className='relative inline-block mb-6'>
            <h2 className='text-2xl font-semibold text-gray-900 pb-2.5'>
              Profile Update
            </h2>
            <div className='absolute bottom-0 left-0 w-full h-1 bg-emerald-600' />
          </div>
        </div>
        <div className='rounded-lg bg-white p-8 shadow-lg'>
          <div className='grid gap-8 md:grid-cols-[200px_1fr] grid-cols-1'>
            <div className='flex flex-col items-center gap-3 justify-center relative mb-[15px]'>
              <div className='relative'>
                <div className='border-4 border-[#005151] p-1'>
                {console.log("Profile photo:", userData?.profilePhoto)}
             <img
  src={getProfileImageUrl()}
  alt="Profile"
  className="h-[150px] w-[150px] shadow-md object-cover"
/>
                </div>
                <label htmlFor='file-upload' className='cursor-pointer'>
                  <img
                    src='/assets/pencil.svg'
                    alt=''
                    className='absolute -bottom-2 z-99 w-[30px] h-[30px] bg-white rounded-lg'
                    style={{ right: '-13px' }}
                  />
                  <input
                    id='file-upload'
                    type='file'
                    accept='image/*'
                    onChange={e => {
                      const file = e.target.files[0]
                      if (file) {
                        setUserData(prevState => ({
                          ...prevState,
                          profileFile: file
                        }))
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setUserData(prevState => ({
                            ...prevState,
                            profilePhoto: reader.result
                          }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className='hidden'
                  />
                </label>
              </div>
              <h2 className='text-xl font-semibold'>
                {userData.first_Name} {userData.last_Name}
              </h2>
            </div>
            <div className='grid gap-6'>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleUpdate()
                }}
              >
                <div className='grid gap-6 md:grid-cols-2'>
                  {fields.map((field, index) => (
                    <div key={index}>
                      <label className='mb-2 block text-sm font-medium text-gray-700'>
                        {field.label}
                        {field.required && (
                          <span className='text-red-500'>*</span>
                        )}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          className='w-full rounded-lg border border-gray-300 p-1.5 focus:ring focus:ring-[#4DC3AB] focus:outline-none'
                          name={field.name}
                          value={userData[field.name] || ''}
                          onChange={handleInputChange}
                        >
                          <option value='' disabled>
                            Select your gender
                          </option>
                          {field.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={userData[field.name] || ''}
                          onChange={handleInputChange}
                          className='w-full rounded-lg border border-gray-300 p-1.5 focus:ring focus:ring-[#4DC3AB] focus:outline-none'
                        />
                      )}
                      {errors[field.name] && (
                        <span className='text-red-500 text-sm'>
                          {errors[field.name]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className='flex justify-end items-center'>

                  <Link to={`/${JSON.parse(localStorage.getItem('user'))?.role}/edit-profile`} className='me-5  mt-[16px]'>
                    <button
                      className='bg-white border w-[170px] border-gray-300 font-semibold text-gray-700 py-2 px-4 rounded-lg'
                    >
                      Cancel
                    </button>
                  </Link>


                  <button
                    type='submit'
                    className='w-[170px] rounded-lg bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold border border-[#278a8a] px-4 py-2 mt-4 flex items-center'
                  >
                    {!loader ? (
                      <>
                        <svg
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM10.95 17.51C10.66 17.8 10.11 18.08 9.71 18.14L7.25 18.49C7.16 18.5 7.07 18.51 6.98 18.51C6.57 18.51 6.19 18.37 5.92 18.1C5.59 17.77 5.45 17.29 5.53 16.76L5.88 14.3C5.94 13.89 6.21 13.35 6.51 13.06L10.97 8.6C11.05 8.81 11.13 9.02 11.24 9.26C11.34 9.47 11.45 9.69 11.57 9.89C11.67 10.06 11.78 10.22 11.87 10.34C11.98 10.51 12.11 10.67 12.19 10.76C12.24 10.83 12.28 10.88 12.3 10.9C12.55 11.2 12.84 11.48 13.09 11.69C13.16 11.76 13.2 11.8 13.22 11.81C13.37 11.93 13.52 12.05 13.65 12.14C13.81 12.26 13.97 12.37 14.14 12.46C14.34 12.58 14.56 12.69 14.78 12.8C15.01 12.9 15.22 12.99 15.43 13.06L10.95 17.51ZM17.37 11.09L16.45 12.02C16.39 12.08 16.31 12.11 16.23 12.11C16.2 12.11 16.16 12.11 16.14 12.1C14.11 11.52 12.49 9.9 11.91 7.87C11.88 7.76 11.91 7.64 11.99 7.57L12.92 6.64C14.44 5.12 15.89 5.15 17.38 6.64C18.14 7.4 18.51 8.13 18.51 8.89C18.5 9.61 18.13 10.33 17.37 11.09Z'
                            fill='#278a8a'
                          />
                        </svg>
                        <span className='ms-1'>Update Profile</span>
                      </>
                    ) : (
                      <div className='w-full text-white rounded-lg'>
                        <Loader />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile
