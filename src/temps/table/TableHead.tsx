import React from 'react'

const TableHead = () => {
  return (
    <>
      <colgroup>
        <col width="5%" />
        <col width="22.5%" />
        <col width="17.5%" />
        <col width="17.5%" />
        <col width="12.5%" />
        <col width="12.5%" />
        <col width="6.25%" />
        <col width="6.25%" />
      </colgroup>
      <thead>
      <tr>
        <th>№</th>
        <th>Дата</th>
        <th>Начал</th>
        <th>Закончил</th>
        <th>Часов</th>
        <th>ЯП</th>
        <th>Оп.</th>
        <th>Вб.</th>
      </tr>
      </thead>
    </>
  )
}

export default TableHead