export function createRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return {
    next() {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    },
    range(min, max) {
      return min + this.next() * (max - min);
    },
    int(min, max) {
      return Math.floor(this.range(min, max + 1));
    },
    choice(array) {
      return array[this.int(0, array.length - 1)];
    },
  };
}
