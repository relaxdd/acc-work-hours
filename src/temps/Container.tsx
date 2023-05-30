import { FC, ReactNode } from 'react'

type WrapperProps = {
  children: ReactNode
}

const Container: FC<WrapperProps> = ({ children }) => (
  <div className="container-lg" style={{paddingTop: "15px"}}>
    <div className="row d-flex justify-content-center">
      <div className="col-11 col-lg-10">
        {children}
      </div>
    </div>
  </div>
)

export default Container