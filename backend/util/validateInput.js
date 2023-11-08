const validateInput = (...inputs) => {
  let x = true;
  inputs.forEach((input) => {
    if (!input || input == "") {
      x = false;
    }
  });

  return x;
};

module.exports = validateInput;
