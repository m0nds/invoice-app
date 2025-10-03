import React from 'react'
import { useAuth } from '../context/AuthContext'

const CreateNew = () => {
  const { navigate } = useAuth()
  
  return (
    <div className="flex flex-col sm:flex-row p-4 lg:p-6 justify-between gap-4">
        <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-primaryBlack">Invoice</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <button className="bg-white border-stroke border text-xs lg:text-sm text-gray-500 font-medium px-6 lg:px-10 py-3 lg:py-4 rounded-full whitespace-nowrap">SEE WHAT'S NEW</button>
            <button 
              onClick={() => navigate('create-invoice')}
              className="bg-appBlue text-sm lg:text-base text-white px-8 lg:px-12 py-3 lg:py-4 font-medium rounded-full hover:bg-blue-700 transition-colors touch-manipulation"
            >
              CREATE
            </button>
        </div>
    </div>
  )
}

export default CreateNew