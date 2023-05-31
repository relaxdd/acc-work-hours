import { FC, ReactNode, useMemo } from 'react'
import { useTableContext } from '@/context/TableContext'
import { getQtyCols } from '@/utils'

type WrapperProps = {
  children: ReactNode
}

const Container: FC<WrapperProps> = ({ children }) => {
  const [{ options: { hiddenCols } }] = useTableContext()

  const qty = useMemo(() => {
    return getQtyCols(hiddenCols)
  }, [hiddenCols])

  return (
    <div className="container-lg" style={{ paddingTop: '15px' }}>
      <div className="row d-flex justify-content-center">
        <div className={`col-11 col-lg-${qty === 9 ? '10' : '9'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Container