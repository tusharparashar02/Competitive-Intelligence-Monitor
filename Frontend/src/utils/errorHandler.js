export function extractErrorMessage(error) {
  // Backend ApiResponse.Message field
  if (error?.response?.data?.message) return error.response.data.message;

  // Backend ApiResponse.Errors array (validation errors)
  const errors = error?.response?.data?.errors;
  if (Array.isArray(errors) && errors.length > 0) return errors[0];

  // Network / axios message (e.g. "Cannot connect to server")
  if (error?.message) return error.message;

  return 'Something went wrong, please try again.';
}
