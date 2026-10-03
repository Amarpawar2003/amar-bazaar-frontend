import { ElectricBolt } from '@mui/icons-material'
import { Avatar } from '@mui/material'
import { teal } from '@mui/material/colors'
import React from 'react'

const OrderItem = () => {
  return (
    <div className='text-smbg-white p-5 space-y-4 border rounded-md cursor-pointer'>
      <div className='flex items-center gap-5'>

      </div>
      <Avatar sizes='small' sx={{bgcolor:teal[500]}}>
        <ElectricBolt/>
      </Avatar>

      <div>
        <h1 className='font-bold text-primary-color'> PENDING </h1>
        <p> Arriving By mon,15 jul</p>
      </div>

      <div className='p-5 bg-teal-50 flex gap-3' >
        <div>
          <img className='w-[170px]' src="/images/smartwatch.jpg" alt="" />
        </div>
        <div className='w-ful space-y-2'> 
          <h1 className='font-bold'> krushna clothing </h1>
          <p> Cellecor RAY 1.43 AMOLED | 700 NITS | ADD| BT-Calling | AI 
            voice | Split Screen Smartwatch (Blck strap, free Size)</p>
            <p>
              <strong> Size :</strong>
              Free
            </p>

        </div>

      </div>
    </div>

  )
}

export default OrderItem