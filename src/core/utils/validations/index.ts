import { RegisterOptions } from "react-hook-form";

export const passwordValidation: RegisterOptions = {
  required: "This field is required",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters long",
  },
  validate: {
    hasNumber: (value) =>
      /\d/.test(value) || "Password must contain at least one number",
    hasLowerCase: (value) =>
      /[a-z]/.test(value) ||
      "Password must contain at least one lowercase letter",
    hasUpperCase: (value) =>
      /[A-Z]/.test(value) ||
      "Password must contain at least one uppercase letter",
    hasSpecialChar: (value) =>
      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
      "Password must contain at least one special character",
  },
};

export const nameValidation: RegisterOptions = {
  required: "This field is required",
};

export const emailValidation: RegisterOptions = {
  required: "This field is required",
  pattern: {
    value: /^\S+@\S+$/i,
    message: "Invalid email address",
  },
};
