import FilterLang from './FilterLang'
import { Actions, defTableContext, defTableFilter, ITableOptions, useTableContext } from '../../context/TableContext'
import FilterDate from './FilterDate'
import scss from './Filter.module.scss'
import { FC, useState } from 'react'
import { BaseDispatch } from '../../types'
import { LS_OPTION_KEY } from '../../data'

interface FOverviewProps {
  changeVisible: () => void,
  resetFilter: () => void
}

const FilterOverview: FC<FOverviewProps> = ({ changeVisible, resetFilter }) => (
  <div className={scss.overview}>
    <div>
      <input
        type="button"
        className="btn btn-secondary"
        value="Настройки"
        onClick={changeVisible}
      />
    </div>
    <div className="col-3">
      <FilterDate />
    </div>

    <div className="col-3">
      <FilterLang />
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

const FilterOptions = ({ isVisible }: { isVisible: boolean }) => {
  const [{ options }, dispatch] = useTableContext()

  const changeOptionsField: BaseDispatch<ITableOptions> = (key, value) => {
    const data = {
      ...options,
      [key]: value || defTableContext.options[key]!,
    }

    dispatch({
      type: Actions.Rewrite,
      payload: { key: 'options', value: data },
    })

    localStorage.setItem(LS_OPTION_KEY, JSON.stringify(data))
  }

  return (
    <div className={scss.options + (isVisible ? ' ' + scss.visible : '')}>
      <div className={scss.options__inner}>
        <label htmlFor="dtRoundStep">
          <span>Шаг округления</span>
          <select
            id="dtRoundStep"
            className="form-select mt-2"
            value={options.dtRoundStep}
            onChange={({ target }) => changeOptionsField('dtRoundStep', +target.value)}
          >
            <option value="5">5 Минут</option>
            <option value="10">10 Минут</option>
            <option value="15">15 Минут</option>
          </select>
        </label>
      </div>
    </div>
  )
}

const Filter = () => {
  const [, dispatch] = useTableContext()
  const [isVisible, setVisible] = useState(false)

  function resetFilter() {
    dispatch({
      type: Actions.Rewrite,
      payload: { key: 'filter', value: defTableFilter },
    })
  }

  return (
    <div className={scss.wrapper}>
      <FilterOverview
        changeVisible={() => setVisible(prev => !prev)}
        resetFilter={resetFilter}
      />

      <FilterOptions isVisible={isVisible} />
    </div>
  )
}

export default Filter