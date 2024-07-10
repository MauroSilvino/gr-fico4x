import React from 'react'

import { Currency } from '@/layouts/DashboardView'

interface CurrencySelectorProps {
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>
}

export const CurrencySelector = ({ setCurrency }: CurrencySelectorProps) => {
  return (
    <div className="inline-flex flex-wrap gap-1 md:mx-3 md:gap-3">
      <button
        className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
        type="button"
        onClick={() => setCurrency('EUR_USD')}
      >
        <div className="relative mr-1 block size-6">
          <img
            className="absolute bottom-1.5 right-1.5 block size-5"
            width={20}
            height={20}
            src="./european_flag.png"
            alt="EUR flag"
          />
          <img
            className="absolute left-1.5 top-1.5 z-[2] block size-5"
            width={20}
            height={20}
            src="./us_flag.png"
            alt="US flag"
          />
        </div>
        <span className="text-xs text-white md:text-sm">EUR/USD</span>
      </button>
      <button
        className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
        type="button"
        onClick={() => setCurrency('EUR_JPY')}
      >
        <div className="relative mr-1 block size-6">
          <img
            className="absolute bottom-1.5 right-1.5 block size-5"
            width={20}
            height={20}
            src="./european_flag.png"
            alt="EUR flag"
          />
          <img
            className="absolute left-1.5 top-1.5 z-[2] block size-5"
            width={20}
            height={20}
            src="./japan_flag.png"
            alt="JPY flag"
          />
        </div>
        <span className="text-xs text-white md:text-sm">EUR/JPY</span>
      </button>
      <button
        className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
        type="button"
        onClick={() => setCurrency('USD_BRL')}
      >
        <div className="relative mr-1 block size-6">
          <img
            className="absolute bottom-1.5 right-1.5 block size-5"
            width={20}
            height={20}
            src="./us_flag.png"
            alt="US flag"
          />
          <img
            className="absolute left-1.5 top-1.5 z-[2] block size-5"
            width={20}
            height={20}
            src="./br_flag.png"
            alt="BR flag"
          />
        </div>
        <span className="text-xs text-white md:text-sm">USD/BRL</span>
      </button>
      <button
        className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
        type="button"
        onClick={() => setCurrency('USD_CAD')}
      >
        <div className="relative mr-1 block size-6">
          <img
            className="absolute bottom-1.5 right-1.5 block size-5"
            width={20}
            height={20}
            src="./us_flag.png"
            alt="US flag"
          />
          <img
            className="absolute left-1.5 top-1.5 z-[2] block size-5"
            width={20}
            height={20}
            src="./ca_flag.png"
            alt="CAD flag"
          />
        </div>
        <span className="text-xs text-white md:text-sm">USD/CAD</span>
      </button>
      <button
        className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
        type="button"
        onClick={() => setCurrency('GBP_JPY')}
      >
        <div className="relative mr-1 block size-6">
          <img
            className="absolute bottom-1.5 right-1.5 block size-5"
            width={20}
            height={20}
            src="./uk_flag.png"
            alt="GBP flag"
          />
          <img
            className="absolute left-1.5 top-1.5 z-[2] block size-5"
            width={20}
            height={20}
            src="./japan_flag.png"
            alt="JPY flag"
          />
        </div>
        <span className="text-xs text-white md:text-sm">GBP/JPY</span>
      </button>
    </div>
  )
}
