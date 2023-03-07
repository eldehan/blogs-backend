export function notFoundHandler(req, res, next) {
  const error = new Error(`Path ${req.originalUrl} not found`)
  error.status = 404
  next(error)
}

export function globalErrorHandler(error, req, res, next) {
  console.log(error.message)
  res.status(error.status || 500)
  res.json({ error: { message: error.message } })
}