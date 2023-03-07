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
    errors.username = "Name field is required"
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required"
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid"
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required"
  }

  if (Validator.isEmpty(data.passwordConfirmation)) {
    errors.passwordConfirmation = "Confirm password field is required"
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters"
  }

  if (!Validator.equals(data.password, data.passwordConfirmation)) {
    errors.passwordConfirmation = "Passwords must match"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

