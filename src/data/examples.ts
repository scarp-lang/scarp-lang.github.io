import hello from '../examples/hello.srp?raw';
import helloOutput from '../examples/hello.stdout?raw';
import functions from '../examples/functions.srp?raw';
import functionsOutput from '../examples/functions.stdout?raw';
import numerics from '../examples/numerics.srp?raw';
import numericsOutput from '../examples/numerics.stdout?raw';

export const examples = [
  { id: 'hello', label: 'The basics', filename: 'hello.srp', code: hello, output: helloOutput },
  { id: 'functions', label: 'Functions', filename: 'functions.srp', code: functions, output: functionsOutput },
  { id: 'numerics', label: 'Numerics', filename: 'numerics.srp', code: numerics, output: numericsOutput },
];
