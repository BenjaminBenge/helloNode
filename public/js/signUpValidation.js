function formValidate() {
    const firstName = document.getElementById("firstName").value.trim();
    const secondName = document.getElementById("secondName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const ninNumber = document.getElementById("ninNumber").value.trim();
    const phone = document.getElementById("phone").value.trim();
  
    // Store the error display elements
    let firstNameError = document.getElementById("firstNameError");
    let secondNameError = document.getElementById("secondNameError");
    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");
    let confirmPasswordError = document.getElementById("confirmPasswordError");
    let ninNumberError = document.getElementById("ninNumberError");
    let phoneError = document.getElementById("phoneError");
  
    // Clear previous error messages
    firstNameError.textContent = "";
    secondNameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    ninNumberError.textContent = "";
    phoneError.textContent = "";
  
    let isValid = true;
  
    // Validate First Name
    if (firstName === "") {
      firstNameError.textContent = "Please enter your first name (2–100 letters).";
      isValid = false;
    }
  
    // Validate Second Name
    if (secondName === "") {
      secondNameError.textContent = "Please enter your second name (2–100 letters).";
      isValid = false;
    }
  
    // Validate Email
    if (email === "") {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }
  
    // Validate Password
    if (password === "") {
      passwordError.textContent = "Please enter your password.";
      isValid = false;
    }
  
    // Validate Confirm Password
    if (confirmPassword === "") {
      confirmPasswordError.textContent = "Please confirm your password.";
      isValid = false;
    } else if (password !== confirmPassword) {
      confirmPasswordError.textContent = "Passwords do not match.";
      isValid = false;
    }
  
    // Validate National ID Number
    if (ninNumber === "") {
      ninNumberError.textContent = "Please enter your National ID Number.";
      isValid = false;
    }
  
    // Validate Phone Number
    if (phone === "") {
      phoneError.textContent = "Please enter your phone number.";
      isValid = false;
    }
  
    if (isValid) {
      alert("Successfully submitted!");
      return true;
    } else {
      return false;
    }
  }
  