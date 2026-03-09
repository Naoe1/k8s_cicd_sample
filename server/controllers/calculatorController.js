// Calculator operations
const calculate = (req, res) => {
  const { operation, num1, num2 } = req.body;

  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    return res.status(400).json({
      success: false,
      error: "num1 and num2 must be numbers",
    });
  }

  let result;
  switch (operation) {
    case 'add':
      result = num1 + num2;
      break;
    case 'subtract':
      result = num1 - num2;
      break;
    case 'multiply':
      result = num1 * num2;
      break;
    case 'divide':
      if (num2 === 0) {
        return res.status(400).json({
          success: false,
          error: "Division by zero",
        });
      }
      result = num1 / num2;
      break;
    default:
      return res.status(400).json({
        success: false,
        error: "Invalid operation. Supported: add, subtract, multiply, divide",
      });
  }

  res.json({
    success: true,
    data: {
      operation,
      num1,
      num2,
      result,
    },
  });
};

export { calculate };