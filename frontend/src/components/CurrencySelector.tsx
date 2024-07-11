import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, X } from 'lucide-react'

import { Currency } from '@/layouts/DashboardView'
import {
  allCurrenciesList,
  CurrencyCard,
  defaultCurrenciesList,
} from '@/mock/CurrencyList'

interface CurrencySelectorProps {
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>
}

export const CurrencySelector = ({ setCurrency }: CurrencySelectorProps) => {
  const [currenciesList, setCurrenciesList] = useState<CurrencyCard[]>(
    defaultCurrenciesList,
  )

  async function handleAddCurrencyCard(id: string) {
    const selectedItem = allCurrenciesList.find((item) => item.id === id)
    if (!selectedItem) return
    const newList = [...currenciesList, selectedItem]
    setCurrenciesList(newList)

    /* Save List to Local Storage */
    localStorage.setItem('grafico_currency_list', JSON.stringify(newList))
  }

  async function handleRemoveCurrencyCard(id: string) {
    const newList = currenciesList.filter((item) => item.id !== id)
    setCurrenciesList(newList)

    /* Save List to Local Storage */
    localStorage.setItem('grafico_currency_list', JSON.stringify(newList))
  }

  useEffect(() => {
    const hasStorageCurrenciesList = localStorage.getItem(
      'grafico_currency_list',
    )
    /* Get Local Storage list and Set It on currenciesList */
    if (hasStorageCurrenciesList)
      setCurrenciesList(JSON.parse(hasStorageCurrenciesList))
  }, [])

  return (
    <div className="inline-flex flex-wrap gap-1 md:mx-3 md:gap-3">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
            type="button"
            title="Adicionar moeda"
          >
            <Plus size={20} />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[98] bg-[rgba(0,0,0,.50)]" />
          <Dialog.Content className="fixed left-2 top-16 z-[99] max-h-[85vh] w-[96vw] max-w-md rounded-md bg-gray-800 px-3 py-3 focus:outline-none md:left-4 md:px-6 md:py-4">
            <Dialog.Title className="text-lg font-medium">
              Escolha uma moeda
            </Dialog.Title>
            <div className="mt-2 flex flex-wrap gap-2">
              {allCurrenciesList.map((currencyCard) => {
                return (
                  <Dialog.Close key={currencyCard.id} asChild>
                    <button
                      className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 disabled:opacity-30 md:px-3"
                      type="button"
                      disabled={
                        currenciesList.find(
                          (item) => item.id === currencyCard.id,
                        )
                          ? true
                          : false
                      }
                      onClick={() => handleAddCurrencyCard(currencyCard.id)}
                    >
                      <div className="relative mr-1 block size-6">
                        {currencyCard.flags.map((flag, index) => {
                          return (
                            <img
                              key={flag.name}
                              className={
                                index === 0
                                  ? 'absolute bottom-1.5 right-1.5 block size-5'
                                  : 'absolute left-1.5 top-1.5 block size-5'
                              }
                              width={20}
                              height={20}
                              src={flag.src}
                              alt={flag.name + ' flag'}
                            />
                          )
                        })}
                      </div>
                      <span className="text-xs text-white md:text-sm">
                        {currencyCard.flags[0].name}/
                        {currencyCard.flags[1].name}
                      </span>
                    </button>
                  </Dialog.Close>
                )
              })}
            </div>
            <Dialog.Close asChild>
              <button className="absolute right-3 top-3" aria-label="Fechar">
                <X size={20} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {currenciesList.map((currencyCard) => {
        return (
          <div
            key={currencyCard.id}
            className="relative rounded-md border border-gray-700 transition-all hover:bg-gray-700"
          >
            <button
              className="z-[1] inline-flex items-center px-2 py-2 md:px-3"
              type="button"
              onClick={(event) => {
                console.log(event.currentTarget)
                setCurrency(currencyCard.id)
              }}
            >
              <div className="relative mr-1 block size-6">
                {currencyCard.flags.map((flag, index) => {
                  return (
                    <img
                      key={flag.name}
                      className={
                        index === 0
                          ? 'absolute bottom-1.5 right-1.5 block size-5'
                          : 'absolute left-1.5 top-1.5 block size-5'
                      }
                      width={20}
                      height={20}
                      src={flag.src}
                      alt={flag.name + ' flag'}
                    />
                  )
                })}
              </div>
              <span className="block pr-3 text-xs text-white md:text-sm">
                {currencyCard.flags[0].name}/{currencyCard.flags[1].name}
              </span>
            </button>
            <button
              className="absolute right-1 top-1 z-[2] text-gray-200 hover:text-gray-400"
              aria-label="Remover moeda"
              type="button"
              onClick={() => handleRemoveCurrencyCard(currencyCard.id)}
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
