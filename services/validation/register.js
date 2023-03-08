import Validator from 'validator'
import isEmpty from 'is-empty'

export default function (data) {
  let errors = {}

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : ""
  data.email = !isEmpty(data.email) ? data.email : ""
  data.password = !isEmpty(data.password) ? data.password : ""
  data.passwordConfirmation = !isEmpty(data.passwordConfirmation) ? data.passwordConfirmation : ""

  // Name checks
  if (Validator.isEmpty(data.username)) {
    errors.message = "Username field is required"
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.message = "Email field is required"
  } else if (!Validator.isEmail(data.email)) {
    errors.message = "Email is invalid"
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.message = "Password field is required"
  }

  if (Validator.isEmpty(data.passwordConfirmation)) {
    errors.message = "Confirm password field is required"
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.message = "Password must be at least 6 characters"
  }

  if (!Validator.equals(data.password, data.passwordConfirmation)) {
    errors.message = "Passwords must match"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

