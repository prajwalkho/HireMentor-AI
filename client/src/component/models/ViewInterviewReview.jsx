import React, { useEffect, useState } from 'react'
import eye from '../../../public/assets/eye.svg'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const ViewInterviewReview = ({
  isOpen,
  onClose,
  data: initialData,
  profileImage
}) => {
  if (!isOpen) return null

  const [interviewData, setInterviewData] = useState(initialData)
  const [showFullImage, setShowFullImage] = useState(false)

  // useEffect(() => {
  //     const getInterview = async () => {
  //       try {
  //         const { data } = await axios.get(
  //           `${import.meta.env.VITE_BASE_URL}/api/v2/interview/${data.id}`
  //         )
  //         setInterviewData(data?.interviews)
  //         toast.success('Data fetched successfully')
  //       } catch (error) {
  //         toast.error('Error fetching data', error)
  //       }
  //     }
  //     getInterview()
  // }, [])



  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]'>
      <div className='bg-white w-full max-w-lg overflow-auto p-6 shadow-lg relative rounded-lg'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none'
        >
          <span className='text-2xl font-bold'>&times;</span>
        </button>

        <div className='flex flex-col h-full'>
          <h2 className='text-2xl font-semibold mb-4'>Interview Review</h2>
          <div className='space-y-2 flex-1'>
            <div className='mb-4 flex items-center'>
              <img
                src={profileImage}
                alt='Profile'
                className='w-24 h-24 rounded-full object-cover cursor-pointer'
                onClick={() => setShowFullImage(true)}
              />
              <div className='ml-4 flex flex-wrap w-full justify-between'>
                <div className='ml-5'>
                  <label className='font-bold'>Name</label>
                  <p className='max-w-[144px] break-all'>{interviewData?.candidateName || 'N/A'}</p>
                </div>
                <div className='mr-24'>
                  <label className='font-bold'>Gender</label>
                  <p>{interviewData?.gender || 'N/A'}</p>
                </div>
              </div>
            </div>


            <div className='ml-4 flex flex-wrap w-full justify-between pt-2'>
              <div>
                <p>
                  <strong>Email</strong> <p>{interviewData?.candidateEmail}</p>
                </p>
              </div>
              <div className='mr-5'>
                <strong>Role Status</strong>
                <div className="flex flex-wrap w-full">
                  <div className="max-w-[144px] break-all">
                    {interviewData?.role || 'N/A'}
                  </div>
                </div>
              </div>

            </div>

            <div className='ml-4 flex flex-wrap w-full justify-between pt-2'>
              <div>
                <p>
                  <strong>Live Interview Time</strong>{' '}
                  <p>
                    {new Date(
                      `${interviewData?.interviewDate}T${interviewData?.interviewTime}`
                    ).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'UTC'
                    })}
                  </p>
                </p>
              </div>
              <div className='mr-4'>
                <p>
                  <strong>Live Interview Date</strong>{' '}
                  <p>{interviewData?.interviewDate.split('-').reverse().join('-')}</p>
                </p>
              </div>
            </div>


            <div className='ml-4 pt-2'>
              <p>
                <strong>Google Meet Link</strong>{' '}
                <Link
                  to={interviewData?.sharedLink.googleMeetLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 underline'
                >
                  <p> {interviewData?.sharedLink.googleMeetLink}</p>
                </Link>
              </p>
            </div>



            <div className='flex justify-between flex-wrap w-full ml-4 pt-2'>
              <div className='flex flex-col  pt-2'>
                <strong>Live Interview Status</strong>
                {interviewData?.status === 'Pending' ? (
                  <button className='py-2 px-2 sm:px-6 '>
                    <button className=' text-red-600 bg-red-100 px-4 py-1 rounded-full capitalize'>
                      {interviewData?.status}
                    </button>
                  </button>
                ) : (
                  <button className='py-2 px-2 sm:px-6'>
                    <button className='text-[#4DC3AB] bg-[#d3f5eeb4] px-4 py-1 rounded-full capitalize'>
                      {interviewData?.status}
                    </button>
                  </button>
                )}
              </div>

              <div className='flex flex-col ml-4 pt-2'>
                <strong>Interview Status</strong>
                {interviewData?.selected === 'Selected' ? (
                  <button className='py-2 px-2 sm:px-6 '>
                    <button className='text-white bg-[#4DC3AB] px-4 py-1 rounded-full capitalize'>
                      {interviewData?.selected}
                    </button>
                  </button>
                ) : (
                  <button className='py-2 px-2 sm:px-6'>
                    <button className='text-white bg-[#E74C3C] px-4 py-1 rounded-full capitalize'>
                      {interviewData?.selected === 'Not_Selected'
                        ? 'Not Selected'
                        : guard.selected}
                    </button>
                  </button>
                )}
              </div>
              {showFullImage && (
                <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[10000]'>
                  <div className='relative'>
                    <img
                      src={profileImage}
                      alt='Full-size Profile'
                      className='max-w-full max-h-full object-contain'
                    />
                    <button
                      onClick={() => setShowFullImage(false)}
                      className='absolute top-4 right-4 text-white text-2xl font-bold'
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewInterviewReview
