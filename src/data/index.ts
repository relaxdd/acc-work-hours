import { LangEnum, ListOfRate } from '../types'

const LS_DATA_KEY = 'awenn2015_wh_table'

export const LS_ACTIVE_KEY = 'awenn2015_wh_active'
export const LS_TABLES_KEY = 'awenn2015_wh_tables'
export const LS_OPTION_KEY = '_awenn2015_wh_options'

export const getLsTableKey = (id: string) => `${LS_DATA_KEY}_${id}`

export const listOfLang: { [key in LangEnum]: string } = {
  php: 'PHP',
  wp: 'Wordpress',
  js: 'JavaScript',
  react: 'React',
  html: 'Html',
}

export const defListOfRate: ListOfRate = {
  php: 320,
  wp: 280,
  js: 350,
  react: 350,
  html: 300,
}

export const DateTimeRoundStep = 15