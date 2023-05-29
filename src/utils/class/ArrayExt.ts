class ArrayExt {
  public static move<T>(arr: T[], from: number, to: number): T[] {
    if (to === from || to >= arr.length)
      return arr

    const target = arr[from]
    const inc = to < from ? -1 : 1

    for (let k = from; k !== to; k += inc)
      arr[k] = arr[k + inc]!

    arr[to] = target!

    return arr
  }
}

export default ArrayExt