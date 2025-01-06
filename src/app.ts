// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express, { rest, errorHandler, static as serveStatic } from '@feathersjs/express'
import cors from 'cors'

import type { Application } from './declarations'
import { services } from './services/index'

const app: Application = express(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration())

// Set up Express middleware
app.use(cors())
app.use(serveStatic(app.get('public')))
app.use(errorHandler())

// Configure services and transports
app.configure(rest())
app.configure(services)

// Register hooks that run on all service methods
app.hooks({
  before: {},
  after: {},
  error: {}
})

export { app }
