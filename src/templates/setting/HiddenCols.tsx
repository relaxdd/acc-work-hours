import React, { FC } from 'react'

interface HiddenColsProps {
  label: string,
  isDisabled: boolean,
  onChange: (value: boolean) => void
}

const HiddenCols: FC<HiddenColsProps> = ({ label, isDisabled, onChange }) => {
  return (
    <div className="form-check form-check-inline">
      <input
        type="checkbox"
        className="form-check-input"
        checked={isDisabled}
        onChange={() => onChange(!isDisabled)}
      />

      <label>{label}</label>
    </div>
  )
}

export default HiddenCols