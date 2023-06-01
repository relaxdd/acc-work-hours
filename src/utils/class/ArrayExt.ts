class ArrayExt {
  public static move<T>(arr: T[], from: number, to: number): T[] {
    if (to === from || to >= arr.length)
      return arr

    const temp = arr[from]
    const inc = to < from ? -1 : 1

    for (let k = from; k !== to; k += inc)
      arr[k] = arr[k + inc]!

    arr[to] = temp!

    return arr
  }

  public static swap<T>(arr: T[], from: number, to: number) {
    const temp = arr[from]
    arr[from] = arr[to]!
    arr[to] = temp!
  }

  public static swapByKey<T extends Object, K extends keyof T>(arr: T[], from: number, to: number, key: K) {
    const temp = arr[from]![key]
    arr[from]![key] = arr[to]![key]
    arr[to]![key] = temp
  }
}

export default ArrayExt