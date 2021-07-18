import dotenv from 'dotenv-safe';
import add from '@src/math/add';

dotenv.config();

console.log(add(1, 5));

if (add(1, 5) === NaN) {
  console.log('a is not a number');
}
