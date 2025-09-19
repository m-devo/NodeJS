const [, , action, ...numbers] = process.argv;
console.log("🚀 ~ params:", action, numbers);

function add(...numbers) {

    if (numbers.some(num => isNaN(parseFloat(num)))) {
        console.log("Please write a valid number");
        return 0;
    }

  return numbers.reduce((p, n) => {
    return parseFloat(p) + parseFloat(n);
  }, 0);
}

function divide(...numbers) {
    if (numbers.includes('0') || numbers.includes(0)) {
        console.log("Dividing by Zero is not Valid");
        return 0;
    }

    if (numbers.some(num => isNaN(parseFloat(num)))) {
        console.log("Please write a valid number");
        return 0;
    }

    return numbers.reduce(function(p, n){
        return parseFloat(p) / parseFloat(n)
    })
}

function sub(...numbers){
      if (numbers.some(num => isNaN(parseFloat(num)))) {
        console.log("Please write a valid number");
        return 0;
    }

    return numbers.reduce(function (p, n) {
        return parseFloat(p) - parseFloat(n)
    })
}

function multi(...numbers) {
    if (numbers.some(num => isNaN(parseFloat(num)))) {
        console.log("Please write a valid number");
        return 0;
    }

    return numbers.reduce(function (p, n) {
        return parseFloat(p) * parseFloat(n)
    }, 1)
}

let result;
switch (action) {
  case "add":
    result = add(...numbers);
    break;
  case "divide":
    result = divide(...numbers);
    break;
  case "sub":
    result = sub(...numbers)
  case "multi":
    result = multi(...numbers)
  default:
    break;
}

console.log("your result is: ", result);
