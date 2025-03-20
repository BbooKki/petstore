/*
TASK-ZJ:

Shunday function yozing, u berilgan arrayni ichidagi numberlarni qiymatini hisoblab qaytarsin.
MASALAN: reduceNestedArray([1, [1, 2, [4]]]) return 8
*/

function reduceNestedArray(array: any[]) {
  let result: number = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] instanceof Array) {
      result += reduceNestedArray(array[i]);
    } else {
      result += array[i];
    }
  }
  return result;
}

console.log(reduceNestedArray([1, [2, 3]]));
