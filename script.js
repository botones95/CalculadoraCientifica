function appendInput(value) {
  // Verificar si se necesita cerrar automáticamente los paréntesis
  let expression = document.getElementById('display').value;
  let openParenthesesCount = (expression.match(/\(/g) || []).length;
  let closeParenthesesCount = (expression.match(/\)/g) || []).length;

  if (value === ')' && openParenthesesCount > closeParenthesesCount) {
      // Agregar paréntesis de cierre solo si hay paréntesis de apertura sin cerrar
      document.getElementById('display').value += value;
  } else if (value === 'sin' || value === 'cos' || value === 'tan' || value === 'log') {
      document.getElementById('display').value += value + '(';
  } else if (value === '=') {
      // Cerrar automáticamente los paréntesis si es necesario antes de calcular el resultado
      let missingCloseParentheses = openParenthesesCount - closeParenthesesCount;
      for (let i = 0; i < missingCloseParentheses; i++) {
          expression += ')';
      }
      document.getElementById('display').value = expression;
      calculate();
  } else {
      document.getElementById('display').value += value;
  }
}

function clearDisplay() {
  document.getElementById('display').value = '';
}

function calculate() {
  let expression = document.getElementById('display').value;
  try {
      let result = evaluateExpression(expression);
      document.getElementById('display').value = result;
      addToHistory(expression + ' = ' + result);
      clearDisplay();
      updateCalculatorDisplay(result); // Actualizar el campo de la calculadora con el resultado
  } catch (error) {
      if (error instanceof SyntaxError) {
          let errorMessage = getErrorMessage(expression);
          alert(errorMessage);
      } else {
          alert('Error en la expresión');
      }
  }
}

function evaluateExpression(expression) {
  // Reemplazar las funciones trigonométricas y logaritmo con los métodos correspondientes de JavaScript
  expression = expression.replace(/sin\(/g, 'Math.sin(');
  expression = expression.replace(/cos\(/g, 'Math.cos(');
  expression = expression.replace(/tan\(/g, 'Math.tan(');
  expression = expression.replace(/log\(/g, 'Math.log(');

  return eval(expression);
}

function addToHistory(item) {
  const historyList = document.getElementById('history-list');
  const li = document.createElement('li');
  li.textContent = item;
  historyList.appendChild(li);
}

function clearHistory() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = ''; // Elimina todos los elementos de la lista
}

function updateCalculatorDisplay(value) {
  document.getElementById('display').value = value;
}

function getErrorMessage(expression) {
  if (expression.includes('sin')) {
      return 'Debes escribir la expresión correctamente. Por ejemplo, "sin(0)"';
  } else if (expression.includes('cos')) {
      return 'Debes escribir la expresión correctamente. Por ejemplo, "cos(0)"';
  } else if (expression.includes('tan')) {
      return 'Debes escribir la expresión correctamente. Por ejemplo, "tan(0)"';
  } else if (expression.includes('log')) {
      return 'Debes escribir la expresión correctamente. Por ejemplo, "log(1)"';
  } else {
      return 'Debes escribir la expresión correctamente.';
  }
}

document.addEventListener('keydown', function(event) {
  const key = event.key;
  if ((/[0-9\/\*\-\+\.\(\)]/).test(key)) {
      appendInput(key);
      event.preventDefault();
  } else if (key === 'Enter') {
      calculate();
  }
});
