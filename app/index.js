//////////////////////////
// Calculator Code
//////////////////////////
import document from "document";

let numbers = document.getElementsByClassName("number");
let constants = document.getElementsByClassName("constant");
let binOps = document.getElementsByClassName("binary operation");
let unOps = document.getElementsByClassName("unary operation");
let container = document.getElementById("container");
let answer = document.getElementById("answer");
let equal = document.getElementById("equal");
let clear = document.getElementById("clear");
let decimal = document.getElementById("decimal");
let push = document.getElementById("push");
let pull = document.getElementById("pull");
let VTList = document.getElementById("my-list");
let stackClear = document.getElementById("stackClear");
let approximate = document.getElementById("approximate");

let stored = "0";
let operation;
let clearNext = true;
let broken = false;
let decimalSet = false;
let stack = [];
let waitClearTimeout = null;

container.value = 2;

VTList.delegate = {
  getTileInfo: function (index) {
    return {
      type: "my-pool",
      value: stack[stack.length - index - 1],
      index: stack.length - index - 1,
    };
  },
  configureTile: function (tile, info) {
    if (info.type == "my-pool") {
      tile.getElementById("text").text =
        info.value.length > 16 ? `${info.value.substr(0, 13)}...` : `${info.value}`;
      let touch = tile.getElementById("touch-me");
      touch.onclick = () => {
        if (!broken && stack.length > 0) {
          answer.text = info.value;
          stack.splice(info.index, 1);
          if (answer.text.indexOf(".") >= 0) {
            decimalSet = true;
          }
          clear.text = "C";
          VTList.length = stack.length;
          container.value = 2;
        }
      };
    }
  },
};

VTList.length = stack.length;

stackClear.onclick = function () {
  stack = new Array();
  VTList.length = stack.length;
};

function clearOperator() {
  if (operation) {
    operation.style.fill = "crimson";
    operation = "";
  }
}

function compute() {
  let operator = operation.id;
  let firstNum = parseFloat(stored);
  let secNum = parseFloat(answer.text);
  if (secNum < -9007199254740991 || secNum > 9007199254740991) {
    approximate.style.visibility = "visible";
  }
  if (operator === "plus") {
    answer.text = "" + (firstNum + secNum);
  } else if (operator === "minus") {
    answer.text = "" + (firstNum - secNum);
  } else if (operator === "multiply") {
    answer.text = "" + firstNum * secNum;
  } else if (operator === "divide") {
    if (secNum === 0) {
      setToBroken();
    } else {
      answer.text = "" + firstNum / secNum;
    }
  } else if (operator === "exponent") {
    if (firstNum === 0 && secNum === 0) {
      setToBroken();
    } else {
      answer.text = "" + Math.pow(firstNum, secNum);
    }
  } else if (operator === "log") {
    if (firstNum === 0 || secNum === 0) {
      setToBroken();
    } else {
      answer.text = "" + Math.log(secNum) / Math.log(firstNum);
    }
  }
  if (parseFloat(answer.text) < -9007199254740991 || parseFloat(answer.text) > 9007199254740991) {
    approximate.style.visibility = "visible";
  }
  stored = "0";
  clearOperator();
}

constants.forEach((constant) => {
  let cid = constant.id;
  constant.onclick = function () {
    if (!broken) {
      clear.text = "C";
      if (cid === "e") {
        answer.text = `${Math.E}`;
        clearNext = false;
        decimalSet = true;
      } else if (cid === "pi") {
        answer.text = `${Math.PI}`;
        clearNext = false;
        decimalSet = true;
      }
      constant.style.fill = "blue";
      setTimeout(() => {
        constant.style.fill = "fb-red";
      }, 150);
    }
  };
});

equal.onclick = function () {
  if (operation) {
    compute();
    container.value = 2;
  }
  clearNext = true;
};

binOps.forEach(function (operator) {
  operator.onclick = function () {
    if (!broken) {
      if (
        parseFloat(answer.text) < -9007199254740991 ||
        parseFloat(answer.text) > 9007199254740991
      ) {
        approximate.style.visibility = "visible";
      }
      clearOperator();
      clear.text = "C";
      operation = operator;
      operator.style.fill = "blue";
      stored = answer.text;
      clearNext = true;
      decimalSet = false;
    }

    container.value = 2;
  };
});

unOps.forEach(function (operator) {
  let opId = operator.id;
  operator.onclick = function () {
    let num = parseFloat(answer.text);
    if (!broken) {
      if (num < -9007199254740991 || num > 9007199254740991) {
        approximate.style.visibility = "visible";
      }
      if (opId === "reciprocal") {
        if (num === 0) {
          setToBroken();
        } else {
          answer.text = "" + 1 / num;
        }
      } else if (opId === "factorial") {
        if (num >= 0 && Math.round(num) === num && num < 171) {
          let result = 1;
          while (num > 0) {
            result *= num;
            num = num - 1;
          }
          answer.text = "" + result;
        } else {
          setToBroken();
        }
      } else if (opId === "sin") {
        answer.text = "" + Math.sin(num);
      } else if (opId === "cos") {
        answer.text = "" + Math.cos(num);
      } else if (opId === "tan") {
        answer.text = "" + Math.tan(num);
      } else if (opId === "plus-minus") {
        answer.text = "" + (0 - num);
      } else if (opId === "flip") {
        let temp = stored;
        stored = answer.text;
        answer.text = "" + temp;
      }

      if (
        parseFloat(answer.text) < -9007199254740991 ||
        parseFloat(answer.text) > 9007199254740991
      ) {
        approximate.style.visibility = "visible";
      }

      decimalSet = false;

      operator.style.fill = "blue";
      setTimeout(() => {
        operator.style.fill = "darkred";
      }, 150);
    } else {
      container.value = 2;
    }
  };
});

function toggleClearBtnColor() {
  if (clear.style.fill !== "#DAA520") {
    //fb-red
    clear.style.fill = "#DAA520"; //goldenrod
  } else {
    clear.style.fill = "#F83C40"; //fb-red
  }
}

function setToBroken() {
  answer.text = "Error";
  approximate.style.visibility = "hidden";
  broken = true;
  clear.text = "AC";
  container.value = 2;
  toggleClearBtnColor();
  waitClearTimeout = setInterval(toggleClearBtnColor, 1000);
}

push.onclick = function () {
  if (!broken && answer.text != "0") {
    stack.push(answer.text);
    answer.text = "0";
    decimalSet = false;
    VTList.length = stack.length;
    clear.text = "AC";
    push.style.fill = "blue";
    setTimeout(() => {
      push.style.fill = "fb-red";
    }, 150);
  }
};

pull.onclick = function () {
  if (!broken && stack.length > 0) {
    answer.text = stack.pop();
    if (answer.text.indexOf(".") != -1) {
      decimalSet = true;
    }
    clearNext = false;
    clear.text = "C";
    VTList.length = stack.length;
    pull.style.fill = "blue";
    setTimeout(() => {
      pull.style.fill = "fb-red";
    }, 150);
  }
};

numbers.forEach(function (element) {
  element.onclick = function () {
    if (!broken) {
      if (clearNext) {
        answer.text = "0";
        if (element.text != "0") {
          clearNext = false;
        }
      }
      if (answer.text.length < 19) {
        if (answer.text === "0") {
          answer.text = element.text;
        } else {
          answer.text += element.text;
        }
        clear.text = "C";

        element.style.fill = "blue";
        setTimeout(() => {
          element.style.fill = "fb-red";
        }, 150);
      }
    }
  };
});

decimal.onclick = function () {
  if (!broken) {
    if (clearNext) {
      answer.text = "0.";
      clearNext = false;
    }
    if (!decimalSet && answer.text.length < 17) {
      answer.text = answer.text + ".";
      clear.text = "C";
      decimal.style.fill = "blue";
      setTimeout(() => {
        decimal.style.fill = "fb-red";
      }, 150);
    }
    decimalSet = true;
  }
};

clear.onclick = function () {
  if (clear.text === "AC") {
    clearOperator();
    stored = "0";
  }
  if (parseFloat(stored) > -9007199254740991 && parseFloat(stored) < 9007199254740991) {
    approximate.style.visibility = "hidden";
  }
  clear.text = "AC";
  clear.style.fill = "fb-red";
  answer.text = "0";
  clearNext = true;
  clearInterval(waitClearTimeout);
  broken = false;
  decimalSet = false;
  clear.style.fill = "blue";
  setTimeout(() => {
    clear.style.fill = "fb-red";
  }, 150);
};

//////////////////////////
// Tip Calculator Code
//////////////////////////
let hd = document.getElementById("hundreds_dollars");
let td = document.getElementById("tens_dollars");
let od = document.getElementById("ones_dollars");
let tc = document.getElementById("tens_cents");
let oc = document.getElementById("ones_cents");

let tipElem = document.getElementById("tip");
let totalElem = document.getElementById("newTotal");

let percentage;
let tip;
let total;

function round_to_precision(x, precision) {
  var y = +x + (precision === undefined ? 0.5 : precision / 2);
  return y - (y % (precision === undefined ? 1 : +precision));
}

function recompute() {
  if (tip) {
    total = hd.value * 100 + td.value * 10 + od.value * 1 + tc.value * 0.1 + oc.value * 0.01;
    tipElem.text = "Tip: $" + round_to_precision(total * tip, 0.01).toFixed(2);
    totalElem.text = "New Total: $" + round_to_precision(total * (1 + tip), 0.01).toFixed(2);
  }
}

let response = function () {
  recompute();
};
hd.addEventListener("select", response);
td.addEventListener("select", response);
od.addEventListener("select", response);
tc.addEventListener("select", response);
oc.addEventListener("select", response);

let percentages = document.getElementsByClassName("percentage");
percentages.forEach(function (element) {
  element.onclick = function () {
    if (percentage) {
      percentage.style.fill = "fb-red";
    }
    percentage = element;
    element.style.fill = "blue";
    tip = parseInt(element.text.slice(0, 2)) / 100;
    recompute();
  };
});
