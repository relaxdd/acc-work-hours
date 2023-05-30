import FilterTech from './FilterTech'
import { Actions, defTableFilter, useTableContext } from '@/context/TableContext'
import FilterDate from './FilterDate'
import scss from './Filter.module.scss'
import { createContext, useContext, useEffect } from 'react'

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
            disabled
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
          <FilterDate/>
        </div>

        <div>
          <FilterTech/>
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
  const [, dispatch, payload] = useTableContext()

  // const [isVisible, setVisible] = useState(false)

  function resetFilter() {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('filter', defTableFilter),
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