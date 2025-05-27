export function shuffleArray<T extends unknown[]>(arr: T): T {
  let counter = arr.length,
    newArr,
    index;

  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;
    newArr = arr[counter];
    arr[counter] = arr[index];
    arr[index] = newArr;
  }

  return arr;
}
