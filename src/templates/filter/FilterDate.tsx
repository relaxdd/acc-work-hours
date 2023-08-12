import { Actions, useTableContext } from '@/context/TableContext'
import { useMemo } from "react"

const FilterDate = () => {
  const [{ modifiedTable, filter }, dispatch] = useTableContext()

  function convertToPretty(dt: string) {
    const date = new Date(dt)

    return new Intl.DateTimeFormat('ru-Ru', {
      day: "numeric",
      month: "long",
    }).format(date)
  }

  function dispatchFilter(value: string) {
    dispatch({
      type: Actions.Filter,
      payload: {
        key: "date", value,
      },
    })
  }

  const list = useMemo(() => {
    if (!modifiedTable.length) return []

    const dates = modifiedTable.map(it => it.start.split("T")[0]!)

    return [...(new Set(dates))].map((it) => ({
      base: it, pretty: convertToPretty(it),
    }))
  }, [modifiedTable])

  return (
    <select
      className="form-select"
      value={filter.date}
      onChange={({ target }) => dispatchFilter(target.value)}
    >
      <option value="none">Дата</option>
      {list.map(({ base, pretty }, i) => (
        <option value={base} key={i}>{pretty}</option>
      ))}
    </select>
  )
}

export default FilterDate