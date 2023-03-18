import { FC, ReactNode } from 'react'

type WrapperProps = {
  children: ReactNode
}

const Wrapper: FC<WrapperProps> = ({ children }) => (
  <div className="container">
    <div className="row d-flex justify-content-center mt-3">
      <div className="col-9">
        {children}
      </div>
    </div>
  </div>
)

export default Wrapper