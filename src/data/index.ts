export const LS_ACTIVE_KEY = 'awenn2015_wh_active'
export const LS_TABLES_KEY = 'awenn2015_wh_tables'
export const LS_VERSION_KEY = 'awenn2015_wh_version'

export const getLsTableKey = (id: string) => `awenn2015_wh_table_${id}`
export const getLsOptionsKey = (id: string) => `awenn2015_wh_options_${id}`

export function getLocalVersion() {
  return +(localStorage.getItem(LS_VERSION_KEY) ?? '214023')
}