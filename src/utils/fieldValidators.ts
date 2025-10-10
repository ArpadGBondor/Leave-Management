interface ValidatorResponse {
  valid: boolean;
  message: string;
}
const response = (valid: boolean, message: string): ValidatorResponse => ({
  valid,
  message,
});
export function emailValidator(email: string): ValidatorResponse {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return response(false, 'Please enter your email address.');
  } else if (!emailRegex.test(email)) {
    return response(false, 'Please enter a valid email address.');
  }
  return response(true, '');
}

export function passwordValidator(password: string): ValidatorResponse {
  if (!password.trim()) {
    return response(false, 'Please enter your password.');
  } else if (password.trim().length < 6) {
    return response(false, 'Password is too short.');
  }
  return response(true, '');
}
