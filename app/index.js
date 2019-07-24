//////////////////////////
// Calculator Code
//////////////////////////
import document from "document";

let numbers = document.getElementsByClassName("number");
let operations = document.getElementsByClassName("operation");
let answer = document.getElementById("answer");
let equal = document.getElementById("equal");
let clear = document.getElementById("clear");
let decimal = document.getElementById("decimal");

let stored = "";
let operation;
let clearNext = true;
let broken = false;
let decimalSet = false;

function clearOperator() {
  if (operation) {
    operation.style.fill = "fb-red";
    operation = "";
  }
}

function compute() {
  let operator = operation.id;
  let firstNum = parseFloat(stored);
  let secNum = parseFloat(answer.text);
  if (operator === "plus") {
    answer.text = "" + (firstNum + secNum);
  } else if (operator === "minus") {
    answer.text = "" + (firstNum - secNum);
  } else if (operator === "multiply") {
    answer.text = "" + (firstNum * secNum);
  } else {
    if (secNum === 0) {
      answer.text = "Undefined";
      broken = true;
    } else {
      answer.text = "" + (firstNum / secNum);
    }
  }
  clearOperator();
}

equal.onclick = function(evt) {
  if (operation) {
    compute();
  }
  clearNext = true;
};

operations.forEach(function(operator) {
  operator.onclick = function(evt) {
    clearOperator();
    if (answer.text) {
      operation = operator;
      operator.style.fill = "blue";
      stored = answer.text;
      clearNext = true;
    }
  }
});

numbers.forEach(function(element) {
  element.onclick = function(evt) {
    if (!broken) {
      if (clearNext) {
        answer.text = "";
        if (element.text != "0") {
          clearNext = false;
        }
      }
      if (answer.text.length < 20) {
        if (answer.text != "" || element.text != "0") {
          answer.text = answer.text + "" + element.text;
        }
      }
    }
  }
});

decimal.onclick = function(evt) {
  if (!broken && !decimalSet) {
    if (clearNext) {
      answer.text = "0";
      clearNext = false;
    }
    if (answer.text.length < 10) {
      answer.text = answer.text + ".";
    }
    decimalSet = true;
  }
}

clear.onclick = function(evt) {
  clearOperator();
  answer.text = "";
  stored = "";
  clearNext = true;
  broken = false;
  decimalSet = false;
}

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
let totalWithTip;

function round_to_precision(x, precision) {
    var y = +x + (precision === undefined ? 0.5 : precision/2);
    return y - (y % (precision === undefined ? 1 : +precision));
}

function recompute() {
  total = (hd.value * 100) + (td.value * 10) + (od.value * 1) + (tc.value * 0.1) + (oc.value * 0.01);
  tipElem.text = "Tip: $" + round_to_precision((total * tip), 0.01).toFixed(2);
  totalElem.text = "New Total: $" + round_to_precision((total * (1 + tip)), 0.01).toFixed(2);
}

let response = function(evt) {recompute()};
hd.addEventListener("select", response);
td.addEventListener("select", response);
od.addEventListener("select", response);
tc.addEventListener("select", response);
oc.addEventListener("select", response);

let percentages = document.getElementsByClassName("percentage");
percentages.forEach(function(element) {
  element.onclick = function(evt) {
    if (percentage) {
      percentage.style.fill = "fb-red";
    }
    percentage = element;
    element.style.fill = "blue";
    tip = parseInt(element.text.slice(0,2)) / 100;
    recompute();
  }
});
