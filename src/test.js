function* foo() {
  yield 'a';
  yield 'b';
  return 'c';
}

function* bar() {
  yield 'x';
  yield yield* foo();
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
