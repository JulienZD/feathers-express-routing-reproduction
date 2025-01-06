// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express, { rest, errorHandler, cors, static as serveStatic } from '@feathersjs/express'
import socketio from '@feathersjs/socketio'

import { configurationValidator } from './configuration'
import type { Application } from './declarations'
import { services } from './services/index'
import { channels } from './channels'

const app: Application = express(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(serveStatic(app.get('public')))
app.use(errorHandler())

// Configure services and transports
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(channels)
app.configure(services)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [
      // Add a logger hook to illustrate how the express route doesn't go through here
      async (context, next) => {
        console.log('Before', context.method, context.path, context.id)
        await next()
        console.log('After', context.method, context.path, context.id)
      }
    ]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
