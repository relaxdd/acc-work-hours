import FilterEntity from './FilterEntity'
import { Actions, defTableFilter, useTableContext } from '@/context/TableContext'
import FilterDate from './FilterDate'
import scss from './Filter.module.scss'
import { createContext, useContext } from 'react'
import SortDate from '@/temps/filter/SortDate'

const defFilterContext = {
  isVisible: false,
  changeVisible: () => {
  },
  resetFilter: () => {
  },
}

const FilterContext = createContext(defFilterContext)
const useFilterContext = () => useContext(FilterContext)

/* Components */

const FilterOverview = () => {
  const [, dispatch] = useTableContext()
  const { resetFilter } = useFilterContext()

  function showModal(key: 'setting' | 'help') {
    dispatch({
      type: Actions.Visible,
      payload: { key, value: true },
    })
  }

  return (
    <div className={scss.between}>
      <div className={scss.overview}>
        <div>
          <input
            type="button"
            className="btn btn-warning"
            value="Аналитика"
            onClick={() => {
              alert("Скоро! Следите за обновлениями сайта ^_^")
            }}
          />
        </div>

        <div>
          <input
            type="button"
            className="btn btn-secondary"
            value="Настройки"
            onClick={() => showModal('setting')}
          />
        </div>

        <div>
          <input
            type="button"
            className="btn btn-light"
            value="Помощь"
            onClick={() => showModal('help')}
          />
        </div>
      </div>

      <div className={scss.overview}>
        <div>
          <SortDate/>
        </div>

        <div>
          <FilterDate/>
        </div>

        <div>
          <FilterEntity/>
        </div>

        <div>
          <input
            type="button"
            className="btn w-100 btn-outline-primary"
            value="Сбросить"
            onClick={resetFilter}
          />
        </div>
      </div>
    </div>
  )
}

// const FilterOptions = () => {
//   const [{ options }, dispatch, payload] = useTableContext()
//   const { isVisible } = useFilterContext()
//
//
////   useEffect(() => {
////     if (!isVisible) return
////     setValue('')
////   }, [isVisible])
//
//   return (
//     <div className={scss.options + (isVisible ? ' ' + scss.visible : '')}>
//       <div className={scss.options__inner}></div>
//     </div>
//   )
// }

const Filter = () => {
  const [, dispatch] = useTableContext()

  // const [isVisible, setVisible] = useState(false)

  function resetFilter() {
    dispatch({
      type: Actions.State,
      payload: {
        filter: defTableFilter,
        sorting: 'order-asc',
      },
    })
  }

  function changeVisible() {
    // setVisible(prev => !prev)
  }

  return (
    <FilterContext.Provider
      value={{ isVisible: false, changeVisible, resetFilter }}
    >
      <div className={scss.wrapper}>
        <FilterOverview/>
        {/* <FilterOptions/> */}
      </div>
    </FilterContext.Provider>
  )
}

export default Filter