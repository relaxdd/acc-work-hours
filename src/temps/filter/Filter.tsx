import scss from "./Filter.module.scss"
import FilterLang from "./FilterLang"
import { Actions, defTableFilter, useTableContext } from "../../context/TableContext"
import FilterPaid from "./FilterPaid"
import FilterDate from "./FilterDate"

const Filter = () => {
  const [, dispatch] = useTableContext()

  function resetFilter() {
    dispatch({
      type: Actions.Rewrite,
      payload: { key: "filter", value: defTableFilter },
    })
  }

  return (
    <div className="row gx-3 justify-content-end">
      {/*<div className="col-3 d-flex justify-content-end align-items-center">*/}
      {/*  <FilterPaid />*/}
      {/*</div>*/}

      <div className="col-3">
        <FilterDate />
      </div>

      <div className="col-3">
        <div className={scss.wrapper}>
          <FilterLang />
        </div>
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

export default Filter