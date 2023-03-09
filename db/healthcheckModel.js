import mongoose from 'mongoose'

const HealthCheckSchema = new mongoose.Schema(
  {
    event: String,
  },
  {
    collection: 'HealthCheck',
    minimize: false,
  },
)

const HealthChecks = mongoose.model?.HealthChecks || mongoose.model('HealthCheck', HealthCheckSchema)

export default HealthChecks