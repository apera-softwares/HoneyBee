import React from 'react'

interface NoChartDataProps {
    message:string;
}
const NoChartData:React.FC<NoChartDataProps> = ({message}) => {
  return (
        <div className="flex items-center justify-center mt-10 lg:mt-16">
              <p className=" bg-gray-200 font-medium text-gray-500  px-6 py-3 rounded-lg">
               {message}
              </p>
            </div>
  )
}

export default NoChartData
