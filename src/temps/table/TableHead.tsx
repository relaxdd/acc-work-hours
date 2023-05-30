import React from 'react'
import { useTableContext } from '@/context/TableContext'
import { getTypedKeys } from '@/utils'

const sizes = {
  allShow: [5, 18, 12.5, 12.5, 10, 10, 5, 5, 22],
  isNumberHide: [15, 14, 14, 10, 10, 7.5, 7.5, 22],
  isEntityHide: [5, 18, 14, 14, 10, 7.5, 7.5, 24],
  isDescrHide: [5, 20, 17.5, 17.5, 12.5, 12.5, 7.5, 7.5],
  allHide: [20, 20, 20, 20, 10, 10],
}

type ColProps = { width?: number }

const TableHead = () => {
  const [{ options: { hiddenCols } }] = useTableContext()
  const initialsCols = 9

  function iterateCols(fn: (i: number, props: ColProps) => React.ReactNode) {
    const qty = getTypedKeys(hiddenCols).reduce((num, key) => {
      if (hiddenCols[key]) num -= 1
      return num
    }, initialsCols)

    const list = []

    for (let i = 0; i < qty; i++) {
      const props = ((): ColProps => {
        if (qty === 9)
          return { width: sizes.allShow[i]! }
        else if (qty === 6)
          return { width: sizes.allHide[i]! }
        else if (qty === 8 && hiddenCols.number)
          return { width: sizes.isNumberHide[i]! }
        else if (qty === 8 && hiddenCols.entity)
          return { width: sizes.isEntityHide[i]! }
        else if (qty === 8 && hiddenCols.description)
          return { width: sizes.isDescrHide[i]! }
        else
          return {}
      })()


      list.push(fn(i, props))
    }

    return list
  }

  return (
    <>
      <colgroup>
        {iterateCols((i, props) => (
          <col key={i} {...props} />
        ))}
      </colgroup>
      <thead>
      <tr>
        {!hiddenCols.number && (
          <th>№</th>
        )}
        <th>Дата</th>
        <th>Начал</th>
        <th>Закончил</th>
        <th>Часов</th>
        {!hiddenCols.entity && (
          <th>Сущность</th>
        )}
        <th>Опл.</th>
        <th>Вбр.</th>
        {!hiddenCols.description && (
          <th>Описание</th>
        )}
      </tr>
      </thead>
    </>
  )
}

export default TableHead