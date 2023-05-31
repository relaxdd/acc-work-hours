import { useEffect } from 'react'

function useLog(data: any, deps: any[] = []) {
  deps = deps.length ? [data, ...deps] : [data]

  useEffect(() => {
    console.log(data)
  }, deps)
}

export default useLog