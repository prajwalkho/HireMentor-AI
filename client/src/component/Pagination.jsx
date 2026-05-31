import React from 'react'
import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'

const Pagination = ({ totalPages = 1, currentPage, setCurrentPage }) => {
    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
    };

    return (
        <div>
            {totalPages > 0 && (
                <div className="md:flex md:justify-between gap-4 items-center p-2 mt-2 md:mt-0">
                    <div className="flex items-center mb-3 md:mb-0">
                        <span className="text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                    <ReactPaginate
                        previousLabel={
                            <svg
                                className='w-[40px] h-[40px] border p-2.5 rounded-[5px]'
                                fill='none'
                                stroke='#4B5563'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.8}
                                    d='M15 19l-7-7 7-7'
                                />
                            </svg>
                        }
                        nextLabel={
                            <svg
                                className='w-[40px] h-[40px] border p-2.5 rounded-[5px]'
                                fill='none'
                                stroke='#4B5563'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.8}
                                    d='M9 5l7 7-7 7'
                                />
                            </svg>
                        }
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={totalPages}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={1}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                        pageClassName={'page-item'}
                        previousClassName={'previous-class-name'}
                        nextClassName={'next-class-name'}
                    />
                </div>
            )}
        </div>
    )
}


Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
};

export default Pagination
