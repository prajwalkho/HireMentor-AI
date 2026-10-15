import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../Loader'
import { getAssetUrl } from '../../api/axios'

const EditProfiles = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [loader, setLoader] = useState(false)
  const formatDate = dateString => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const handleEditProfileClick = () => {
    setLoader(true)
    setTimeout(() => setLoader(false), 6000)
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  const getProfileImageUrl = () => {
    if (!user?.profilePhoto) return 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
    
    const photoPath = typeof user.profilePhoto === 'object' ? user.profilePhoto.url : user.profilePhoto;
    if (!photoPath) return 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
    
    return getAssetUrl(photoPath);
  };

  return (
    <div className='h-1/2'
      style={{
        backgroundImage: `url('/assets/1519804675919.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='mx-auto px-5 max-w-4xl flex flex-col justify-center h-[78vh]'>
        <div className='mb-6 flex items-center'>
          <div className='space-y-2'>
            <div className='relative inline-block'>
              <h2 className='text-2xl font-semibold text-gray-900m pb-2.5'>
                Profile
              </h2>
              <div className='absolute bottom-0 left-0 w-full h-1 bg-emerald-600' />
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-10 shadow-lg '>
          <div className='grid gap-8 md:grid-cols-[200px_1fr] grid-cols-1'>
            <div className='flex flex-col items-center gap-3 justify-center'>
            
              <img
  src={getProfileImageUrl()}
  alt='Profile'
  className='h-[150px] w-[150px] object-cover shadow-md transition-transform duration-300 hover:scale-105'
/>
              <h2 className='text-xl font-semibold'>
                {user.first_Name && user.last_Name
                  ? `${user.first_Name} ${user.last_Name}`
                  : 'User Name'}
              </h2>
            </div>

            <form className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='block font-medium text-gray-700'>
                    First Name
                  </label>
                  <p
                    className='w-full rounded-lg border-gray-300'
                    style={{ margin: '0' }}
                  >
                    {user.first_Name}
                  </p>
                </div>
                <div className='space-y-2'>
                  <label className='block font-medium text-gray-700'>
                    Last Name
                  </label>
                  <p
                    className='w-full rounded-lg border-gray-300'
                    style={{ margin: '0' }}
                  >
                    {user.last_Name}
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='block font-medium text-gray-700'>
                    Date of Birth
                  </label>
                  <p
                    className='w-full rounded-lg border-gray-300'
                    style={{ margin: '0' }}
                  >
                    {formatDate(user.birth_Date)}
                  </p>
                </div>
                <div className='space-y-2'>
                  <label className='block font-medium text-gray-700'>
                    Gender
                  </label>
                  <p
                    className='w-full rounded-lg border-gray-300'
                    style={{ margin: '0' }}
                  >
                    {user.gender}
                  </p>
                </div>
              </div>
              <div className='space-y-2'>
                <label className='block font-medium text-gray-700'>
                  Email
                </label>
                <p
                  className='w-full rounded-lg border-gray-300'
                  style={{ margin: '0' }}
                >
                  {user.email}
                </p>
              </div>
            </form>
          </div>
          <div className='flex justify-end gap-4'>
            <Link
              to={`/${user.role}/change-password`}
              className='w-full md:w-[170px] rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-300 px-4 py-2 mt-4 flex items-center justify-center'
            >
              <span className='ms-1'>Change Password</span>
            </Link>
            <Link
              to={`/${user.role}/update-profile`}
              type='submit'
              className='w-full md:w-[170px] rounded-lg bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold border border-[#278a8a] px-4 py-2 mt-4 flex items-center justify-center'
              onClick={handleEditProfileClick}
              disabled={loader}
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
                  <span className='ms-1'>Edit Profile</span>
                </>
              ) : (
                <div className='w-full text-white rounded-lg'>
                  <Loader />
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfiles;
