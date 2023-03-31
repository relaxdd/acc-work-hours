import { FC, ReactNode } from 'react'

type WrapperProps = {
  children: ReactNode
}

const Wrapper: FC<WrapperProps> = ({ children }) => (
  <div className="container" style={{paddingTop: "15px"}}>
    <div className="row d-flex justify-content-center">
      <div className="col-10">
        {children}
      </div>
    </div>
  </div>
)

export default Wrapper