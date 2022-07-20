import React from 'react'

function Login() {
  return (
    <div className='flex'>
      <div className='relative'>
        <input type="text" id="username" className='block rounded-lg px-2.5 pb-2.5 pt-5 w-1/2 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer' />
        <label for="username" className='absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4'>ชื่อผู้ใช้</label>
      </div>
      <div className='relative'>
        <input type="password" id="username" />
        <label for="username">ชื่อผู้ใช้</label>
      </div>
    </div>
  )
}

export default Login