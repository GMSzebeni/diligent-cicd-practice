import { AppError } from "./app-error.js";

export function validateAddParams(params) {
  if(params.length !== 1) {
    throw new AppError('Give a title as the only parameter in parenthesis.');
  }
  const [title] = params;
  if(typeof title !== 'string' || title?.length === 0) {
    throw new AppError('The title must be a non zero length string.')
  }
  return params;
}

export function validateCompleteParams(params) {
  const id = params;
  if(isNaN(id)) {
    throw new AppError("Id must be numeric type.")
  }
  if(id === null) {
    throw new AppError("To Do cannot be found.");
  }
  return params;
}