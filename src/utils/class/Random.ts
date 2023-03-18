class Random {
  static int(min: number, max: number): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  static shuffle<T = any>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5)
  }

  static uuid(): string {
    const alph = [
      ["a", "A"],
      ["j", "J"],
      ["x", "X"],
      ["c", "C"],
      ["d", "D"],
      ["h", "H"],
      ["o", "O"],
      ["l", "L"],
      ["z", "Z"],
      ["g", "G"],
    ]

    return this.shuffle(String(Date.now()).split("").map(char => alph[+char]![this.int(0, 1)])).join("")
  }
}

export default Random