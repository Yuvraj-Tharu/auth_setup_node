/**
 * @desc    This file contains Success and Error response for sending to client
 */

/**
 * @desc    Send any success response
 * @param   {string} message
 * @param   {number} statusCode
 * @param   {object | array} data
 * @param   {string} [token]
 * @returns {object}
 */
const success = (message: string, statusCode: number, data: object | any[]) => {
  return {
    status: 'success',
    statusCode: statusCode,
    message: message,
    data,
  };
};

// List of common HTTP request codes
const codes = [200, 204, 400, 404, 401, 402, 403, 404, 422, 424, 429, 500, 503];

/**
 * @desc    Send any error response
 * @param   {string} message
 * @param   {object | array} error
 * @param   {number} statusCode
 * @returns {Promise<object>}
 */
const apiError = async (
  message: string,
  error: object | any[],
  statusCode: number,
): Promise<object> => {
  const findCode = codes.find((code) => code === statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  let response: any = {
    status: 'error',
    statusCode: statusCode,
    message: message,
    error: error,
  };

  return response;
};

export { success, apiError };
