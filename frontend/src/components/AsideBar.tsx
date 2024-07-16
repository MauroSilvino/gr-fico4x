import React, { useState } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface AsideBarProps {
  onMark(position: 'above' | 'below'): void
  userBalance: number
}

export const AsideBar = ({ onMark, userBalance }: AsideBarProps) => {
  const [entryValue, setEntryValue] = useState(1)

  return (
    <div className="relative flex w-[4.5rem] flex-col items-end justify-center gap-2 lg:w-28">
      <div className="fixed right-4 top-4 ml-4 rounded-md border border-[#4b5563] border-opacity-30 bg-[#1e2e43] bg-opacity-30 px-3 py-2">
        <p className="flex flex-col">
          <span className="ml-1 text-sm text-[#eee]">Saldo:</span>
          <span className="text-lg font-medium text-primary">
            {/* {userBalance.toLocaleString('pt-BR', {
              currency: 'BRL',
              style: 'currency',
            })} */}
            ${userBalance}
          </span>
        </p>
      </div>

      <div className="ml-4 rounded-md border border-[#4b5563] border-opacity-30 bg-[#1e2e43] px-3 py-2">
        <label htmlFor="value" className="text-base font-medium text-[#6b7280]">
          Valor
        </label>
        <div className="inline-flex items-center gap-2">
          <span className="text-lg text-[#6b7280]">$</span>
          <input
            id="value"
            type="number"
            className="w-full rounded-md bg-[#1e2e43] px-1 text-base outline-none focus:ring-1 focus:ring-[#6b7280] focus:ring-opacity-40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            value={entryValue}
            onChange={(event) => setEntryValue(Number(event.target.value))}
          />
        </div>
      </div>
      <div className="ml-4 flex w-full flex-col p-2">
        <span className="text-center text-xs text-[#eee] md:text-sm">
          Lucro
        </span>
        <span className="my-1 block text-center text-xl text-green-600 md:text-2xl lg:text-3xl xl:text-4xl">
          +85%
        </span>
        <span className="text-center text-base font-bold text-green-600 md:text-lg">
          +{(entryValue * 0.85).toFixed(2)}
        </span>
      </div>
      <button
        className="flex h-16 w-16 flex-col items-center justify-center rounded-md bg-green-600 p-2 text-center transition-all hover:bg-green-700 lg:h-24 lg:w-24 lg:p-4"
        type="button"
        onClick={() => onMark('above')}
      >
        <TrendingUp className="size-6 lg:size-7" />
        <p className="text-xs lg:text-lg">Acima</p>
      </button>
      <button
        className="flex h-16 w-16 flex-col items-center justify-center rounded-md bg-red-600 p-2 text-center transition-all hover:bg-red-900 lg:h-24 lg:w-24 lg:p-4"
        type="button"
        onClick={() => onMark('below')}
      >
        <TrendingDown className="size-6 lg:size-7" />
        <p className="text-xs lg:text-lg">Abaixo</p>
      </button>
    </div>
  )
}
