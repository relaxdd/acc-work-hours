export const LS_ACTIVE_KEY = 'awenn2015_wh_active'
export const LS_TABLES_KEY = 'awenn2015_wh_tables'
export const LS_SETTING_KEY = 'awenn2015_wh_settings'

export const getLsTableKey = (id: string) => `awenn2015_wh_table_${id}`
export const getLsOptionsKey = (id: string) => `awenn2015_wh_options_${id}`

export const listOfTechs = [
  { key: 'php', text: 'PHP', rate: 320 },
  { key: 'wp', text: 'Wordpress', rate: 280 },
  { key: 'js', text: 'JavaScript', rate: 350 },
  { key: 'react', text: 'React', rate: 370 },
  { key: 'html', text: 'html', rate: 300 },
]