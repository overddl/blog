import 'core-js/features/array/from';
import 'core-js/features/array/includes';

class Person{};
typeof a;
const arr = [1,2,3,4,5];
arr.includes(v => v > 2);

const [x, y, z, ...arr2] = arr;
const arr3 = Array.from(arr2);

const gen = function*(x) {
  return yield x + 1
}

const g = gen(2);
console.log(g.next());
console.log(g.next());
console.log(g.next(2));