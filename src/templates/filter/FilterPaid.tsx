import React from 'react'

const FilterPaid = () => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value=""
        id="flexCheckDefault"
      />

      <label
        className="form-check-label"
        htmlFor="flexCheckDefault"
      >
        Работа оплачена
      </label>
    </div>
  )
}

export default FilterPaid