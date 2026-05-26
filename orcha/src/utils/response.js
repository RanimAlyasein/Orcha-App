const sendSuccess = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

const sendList = (res, data, meta) =>
  res.status(200).json({ success: true, data, meta });

const sendError = (res, message, statusCode = 400, code = 'BAD_REQUEST') =>
  res.status(statusCode).json({ success: false, error: { message, code } });

module.exports = { sendSuccess, sendList, sendError };
