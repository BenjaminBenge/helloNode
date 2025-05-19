
  function formValidate(isLogin = false) {
    // Common elements
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    const emailError = document.getElementById("emailError") || document.getElementById("errorEmail");
    const passwordError = document.getElementById("passwordError") || document.getElementById("errorPassword");

    if (emailError) emailError.textContent = "";
    if (passwordError) passwordError.textContent = "";

    let isValid = true;

    // If it's a login form, only check email and password
    if (isLogin) {
      if (!email) {
        emailError.textContent = "Please enter your email.";
        isValid = false;
      }

      if (!password) {
        passwordError.textContent = "Please enter your password.";
        isValid = false;
      }

      return isValid;
    }

    // Full form validation for sign-up
    const firstName = document.getElementById("firstName")?.value.trim();
    const secondName = document.getElementById("secondName")?.value.trim();
    const confirmPassword = document.getElementById("confirmPassword")?.value.trim();
    const ninNumber = document.getElementById("ninNumber")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();

    const firstNameError = document.getElementById("firstNameError");
    const secondNameError = document.getElementById("secondNameError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const ninNumberError = document.getElementById("ninNumberError");
    const phoneError = document.getElementById("phoneError");

    if (firstNameError) firstNameError.textContent = "";
    if (secondNameError) secondNameError.textContent = "";
    if (confirmPasswordError) confirmPasswordError.textContent = "";
    if (ninNumberError) ninNumberError.textContent = "";
    if (phoneError) phoneError.textContent = "";

    // Validate First Name
    if (!firstName) {
      firstNameError.textContent = "Please enter your first name (2–100 letters).";
      isValid = false;
    }

    // Validate Second Name
    if (!secondName || ) {
      secondNameError.textContent = "Please enter your second name (2–100 letters).";
      isValid = false;
    }

    // Validate Email
    if (!email) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Validate Password
    if (!password) {
      passwordError.textContent = "Please enter your password.";
      isValid = false;
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      confirmPasswordError.textContent = "Please confirm your password.";
      isValid = false;
    } else if (password !== confirmPassword) {
      confirmPasswordError.textContent = "Passwords do not match.";
      isValid = false;
    }

    // Validate National ID Number
    if (!ninNumber) {
      ninNumberError.textContent = "Please enter your National ID Number.";
      isValid = false;
    }

    // Validate Phone Number
    if (!phone) {
      phoneError.textContent = "Please enter your phone number.";
      isValid = false;
    }

    if (isValid) {
      alert("Successfully submitted!");
    }

    return isValid;
  }
