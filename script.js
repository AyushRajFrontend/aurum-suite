const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button, .scientific-row button");
const historyBox = document.querySelector(".history-box");
const clickSound = document.getElementById("clickSound");
const history = document.getElementById("history");
const clearHistory = document.getElementById("clearHistory");
const sciToggle = document.getElementById("sciToggle");
const scientificRow = document.getElementById("scientificRow");
const calcMode = document.getElementById("calcMode");
const convertMode = document.getElementById("convertMode");
const calculatorSection = document.getElementById("calculatorSection");
const converterSection = document.getElementById("converterSection");
const currencyTab = document.getElementById("currencyTab");
const lengthTab = document.getElementById("lengthTab");
const weightTab = document.getElementById("weightTab");
const tempTab = document.getElementById("tempTab");
const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const swapBtn = document.getElementById("swapBtn");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");


let input = "";

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
    const value = button.textContent;
    
    if (value === "SCI" || value === "🗑") {
    return;
    }

    if (value === "√") {
     if (!input) return;
     input = Math.sqrt(eval(input)).toString();
     display.textContent = input;
    }

    else if (value === "x²") {
     if (!input) return;
     input = Math.pow(eval(input), 2).toString();
     display.textContent = input;
    }
    
    else if (value === "C") {
      input = "";
      display.textContent = "0";
    }

    else if (value === "DEL") {
      input = input.slice(0, -1);
      display.textContent = input || "0";
    }

else if (value === "=") {
  try {
    let expression = input
      .replace(/×/g, "*")
      .replace(/÷/g, "/");

    // SMART PERCENT LOGIC
    expression = expression.replace(
      /(\d+)([+\-*/])(\d+)%/g,
      (_, num1, operator, num2) => {
        num1 = parseFloat(num1);
        num2 = parseFloat(num2);

        if (operator === "+") {
          return num1 + (num1 * num2 / 100);
        }

        if (operator === "-") {
          return num1 - (num1 * num2 / 100);
        }

        if (operator === "*") {
          return num1 * (num2 / 100);
        }

        if (operator === "/") {
          return num1 / (num2 / 100);
        }
      }
    );

    // SIMPLE 50%
    expression = expression.replace(/(\d+)%/g, (_, num) => {
      return parseFloat(num) / 100;
    });

    const result = eval(expression);

    if(history.textContent.includes("No history")){
      history.innerHTML = "";
    }

    history.innerHTML =
      `<div>${input} = ${result}</div>` + history.innerHTML;

    input = result.toString();
    display.textContent = input;

  } catch {
    display.textContent = "Error";
    input = "";
  }
}

    else {
      input += value;
      display.textContent = input;
    }
  });
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key) || key === ".") {
    input += key;
    display.textContent = input;
  }

  else if (key === "+"
    || key === "-"
    || key === "*"
    || key === "/"
    || key === "%") {
    input += key;
    display.textContent = input;
  }

  else if (key === "Enter") {
  try {
    let expression = input
      .replace(/×/g, "*")
      .replace(/÷/g, "/");

    expression = expression.replace(
      /(\d+)([+\-*/])(\d+)%/g,
      (_, num1, operator, num2) => {
        num1 = parseFloat(num1);
        num2 = parseFloat(num2);

        if (operator === "+") return num1 + (num1 * num2 / 100);
        if (operator === "-") return num1 - (num1 * num2 / 100);
        if (operator === "*") return num1 * (num2 / 100);
        if (operator === "/") return num1 / (num2 / 100);
      }
    );

    expression = expression.replace(/(\d+)%/g, (_, num) => parseFloat(num) / 100);

    input = eval(expression).toString();
    display.textContent = input;
  } catch {
    display.textContent = "Error";
    input = "";
  }
}

  else if (key === "Backspace") {
    input = input.slice(0, -1);
    display.textContent = input || "0";
  }

  else if (key === "Escape") {
    input = "";
    display.textContent = "0";
  }
});

clearHistory.addEventListener("click", () => {
  history.innerHTML = "No history";
});

sciToggle.addEventListener("click", () => {
  scientificRow.classList.toggle("active");
});

calcMode.addEventListener("click", () => {
  localStorage.setItem("appMode", "calc");

  calculatorSection.classList.remove("hidden");
  converterSection.classList.add("hidden");
  historyBox.classList.remove("hidden");

  display.textContent = "0";
  input = "";

  calcMode.classList.add("active");
  convertMode.classList.remove("active");
});

convertMode.addEventListener("click", () => {
  localStorage.setItem("appMode", "convert");

  calculatorSection.classList.add("hidden");
  converterSection.classList.remove("hidden");
  historyBox.classList.add("hidden");

  display.textContent = "CONVERT";

  convertMode.classList.add("active");
  calcMode.classList.remove("active");
});

convertBtn.addEventListener("click", async () => {
  const amt = parseFloat(amount.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amt) {
    display.textContent = "Enter amount";
    return;
  }

  try {

    // CURRENCY
    if (convertModeType === "currency") {
      display.textContent = "Converting...";

      const res = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${from}`
      );

      const data = await res.json();
      const rate = data.rates[to];
      const result = (amt * rate).toFixed(2);

     const symbols = {
     USD: "$",
     INR: "₹",
     EUR: "€",
     GBP: "£",
     JPY: "¥",
      AED: "د.إ"
     };

     display.textContent =
     `${symbols[to] || ""}${result}`;
}

    // LENGTH
    else if (convertModeType === "length") {
      const lengthMap = {
        inch: 0.0254,
        feet: 0.3048,
        cm: 0.01,
        meter: 1,
        km: 1000
      };

      const meters = amt * lengthMap[from];
      const result = meters / lengthMap[to];

      display.textContent = `${result.toFixed(2)} ${to}`;
    }

    // WEIGHT
    else if (convertModeType === "weight") {
      const weightMap = {
        kg: 1,
        lb: 0.453592,
        gram: 0.001
      };

      const kg = amt * weightMap[from];
      const result = kg / weightMap[to];

      display.textContent = `${result.toFixed(2)} ${to}`;
    }

    // TEMP
    else if (convertModeType === "temp") {
      let result;

      if (from === "C" && to === "F") {
        result = (amt * 9/5) + 32;
      }

      else if (from === "F" && to === "C") {
        result = (amt - 32) * 5/9;
      }

      else {
        result = amt;
      }

      display.textContent = `${result.toFixed(2)} ${to}`;
    }

  } catch {
    display.textContent = "Failed";
  }
});

let convertModeType = "currency";

function setActiveTab(activeTab){
  document.querySelectorAll(".convert-tab").forEach(tab => {
    tab.classList.remove("active");
  });

  if(activeTab){
    activeTab.classList.add("active");
  }
}

function loadOptions(type){
  fromCurrency.innerHTML = "";
  toCurrency.innerHTML = "";

  let options = [];

  if(type === "currency"){
    options = ["INR","USD","EUR","GBP","JPY","AED"];
  }

  else if(type === "length"){
    options = ["inch","feet","cm","meter","km"];
  }

  else if(type === "weight"){
    options = ["kg","lb","gram"];
  }

  else if(type === "temp"){
    options = ["C","F"];
  }

  options.forEach(option => {
    fromCurrency.innerHTML += `<option>${option}</option>`;
    toCurrency.innerHTML += `<option>${option}</option>`;
  });
    if (swapBtn) {
  if(type === "temp"){
    swapBtn.style.display = "none";
  } else {
    swapBtn.style.display = "block";
  }
}
}

if (currencyTab) {
  currencyTab.addEventListener("click", () => {
    convertModeType = "currency";
    setActiveTab(currencyTab);
    loadOptions("currency");
  });
}

if (lengthTab) {
  lengthTab.addEventListener("click", () => {
    convertModeType = "length";
    setActiveTab(lengthTab);
    loadOptions("length");
  });
}

if (weightTab) {
  weightTab.addEventListener("click", () => {
    convertModeType = "weight";
    setActiveTab(weightTab);
    loadOptions("weight");
  });
}

if (tempTab) {
  tempTab.addEventListener("click", () => {
    convertModeType = "temp";
    setActiveTab(tempTab);
    loadOptions("temp");
  });
}

loadOptions("currency");

if (swapBtn) {
swapBtn.addEventListener("click", () => {
  swapBtn.style.transform = "rotate(180deg)";

  setTimeout(() => {
    swapBtn.style.transform = "rotate(0deg)";
  }, 400);

  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
});
}

const savedMode = localStorage.getItem("appMode");

if(savedMode === "convert"){
  convertMode.click();
}