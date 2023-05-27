import FilterLang from './FilterLang'
import { Actions, defTableFilter, useTableContext } from '../../context/TableContext'
import FilterDate from './FilterDate'
import scss from './Filter.module.scss'
import { createContext, useContext } from 'react'

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
  const [, dispatch, payload] = useTableContext()
  const { resetFilter } = useFilterContext()

  function showSettingModal() {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('settingVisible', true),
    })
  }

  return (
    <div className={scss.overview}>
      <div>
        <input
          type="button"
          className="btn btn-secondary"
          value="Настройки"
          onClick={showSettingModal}
        />
      </div>
      <div className="col-3">
        <FilterDate/>
      </div>

      <div className="col-3">
        <FilterLang/>
      </div>

      <div className="col-2">
        <input
          type="button"
          className="btn w-100 btn-outline-primary"
          value="Сбросить"
          onClick={resetFilter}
        />
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