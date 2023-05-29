import React from 'react'
import { useTableContext } from '@/context/TableContext'

const TableHead = () => {
  const [{ options: { hiddenCols } }] = useTableContext()

  return (
    <>
      <colgroup>
        {!hiddenCols.number && (
          <col width="5%"/>
        )}
        <col width="18%"/>
        <col width="12.5%"/>
        <col width="12.5%"/>
        <col width="10%"/>
        <col width="10%"/>
        <col width="6%"/>
        <col width="6%"/>
        {!hiddenCols.description && (
          <col width="20%"/>
        )}
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
        <th>Сущность</th>
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