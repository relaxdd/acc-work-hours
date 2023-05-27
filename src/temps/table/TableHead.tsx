import React from 'react'

const TableHead = () => {
  return (
    <>
      <colgroup>
        <col width="5%" />
        <col width="18%" />
        <col width="12.5%" />
        <col width="12.5%" />
        <col width="10%" />
        <col width="10%" />
        <col width="6%" />
        <col width="6%" />
        <col width="20%" />
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
        <th>Описание</th>
      </tr>
      </thead>
    </>
  )
}

export default TableHead