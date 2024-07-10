import { Currency } from '@/layouts/DashboardView'

export interface CurrencyCard {
  id: Currency
  flags: {
    name: string
    src: string
  }[]
}

export const allCurrenciesList: CurrencyCard[] = [
  {
    id: 'EUR_USD',
    flags: [
      {
        name: 'EUR',
        src: './european_flag.png',
      },
      {
        name: 'USD',
        src: './us_flag.png',
      },
    ],
  },
  {
    id: 'EUR_JPY',
    flags: [
      {
        name: 'EUR',
        src: './european_flag.png',
      },
      {
        name: 'JPY',
        src: './japan_flag.png',
      },
    ],
  },
  {
    id: 'USD_BRL',
    flags: [
      {
        name: 'USD',
        src: './us_flag.png',
      },
      {
        name: 'BR',
        src: './br_flag.png',
      },
    ],
  },
  {
    id: 'USD_CAD',
    flags: [
      {
        name: 'USD',
        src: './us_flag.png',
      },
      {
        name: 'CAD',
        src: './ca_flag.png',
      },
    ],
  },
  {
    id: 'GBP_JPY',
    flags: [
      {
        name: 'GBP',
        src: './uk_flag.png',
      },
      {
        name: 'JPY',
        src: './japan_flag.png',
      },
    ],
  },
]

export const defaultCurrenciesList = [...allCurrenciesList]
