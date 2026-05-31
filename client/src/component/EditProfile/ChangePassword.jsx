import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { axiosInstance, endPoints } from '../../api/axios'
import Loader from '../Loader'

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('New passwords do not match')
    }
    if (passwords.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }

    setLoader(true)
    try {
      const response = await axiosInstance.post(endPoints.auth.changePassword, passwords)

      if (response.data.success) {
        toast.success('Password changed successfully')
        navigate(`/${user.role}/edit-profile`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoader(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md mx-auto'>
        <div className='bg-white p-8 rounded-xl shadow-lg border border-gray-100'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900'>Change Password</h2>
            <p className='mt-2 text-sm text-gray-600'>Secure your account with a new password</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Current Password</label>
              <input
                type='password'
                name='oldPassword'
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all'
                value={passwords.oldPassword}
                onChange={handleInputChange}
                placeholder='••••••••'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
              <input
                type='password'
                name='newPassword'
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all'
                value={passwords.newPassword}
                onChange={handleInputChange}
                placeholder='••••••••'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Confirm New Password</label>
              <input
                type='password'
                name='confirmPassword'
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all'
                value={passwords.confirmPassword}
                onChange={handleInputChange}
                placeholder='••••••••'
              />
            </div>

            <div className='flex items-center justify-between gap-4 pt-2'>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loader}
                className='flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all font-semibold flex justify-center items-center'
              >
                {loader ? <Loader /> : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
