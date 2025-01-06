import type { Application } from '../../declarations'
import { Id, NullableId, Service } from '@feathersjs/feathers'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    users: Service
  }
}

export const user = (app: Application) => {
  // Small reproduction of the routing issue between @feathersjs/express v4 and v5

  // This works, as there is a third segment which isn't matched by anything else
  app.use('/users/test/foo', (req, res) => {
    res.json({ message: 'Hello from express endpoint /users/test/foo' })
  })

  // By adding a passthrough service and your request handler in the express.before service options, we can return a response before reaching any of the feathers hooks as seen here:
  // https://github.com/feathersjs/feathers/blob/967ea54ae7f7e3d8169b137d5c184705706276a7/packages/express/src/rest.ts#L106
  // If you go to this endpoint, you will see the response from the express endpoint, there also
  // shouldn't be any logs in the console from the logger hook
  // @ts-expect-error there is no entry on ServiceTypes for this route
  app.use('/users/test', createEmptyPassthroughService(), {
    express: {
      before: [
        (req, res, next) => {
          // Optionally do whatever in the first middleware
          next()
        },
        (req, res) => {
          res.json({ message: 'Hello from express endpoint /users/test' })
        }
      ]
    }
  })

  // If you comment this app.use() out, the /users/test endpoint will work as expected
  app.use('users', {
    find: async () => {
      return { message: 'Hello from the user service' }
    },
    get: async (id: Id) => {
      return { message: `From users service: ${id}` }
    },
    create: async (data: any) => data,
    update: async (id: NullableId, data: any) => data,
    patch: async (id: NullableId, data: any) => data,
    remove: async (id: NullableId) => []
  } satisfies Service)
}

function createEmptyPassthroughService() {
  return {
    find: async () => [],
    get: async () => null,
    create: async (data: any) => data,
    update: async (id: NullableId, data: any) => data,
    patch: async (id: NullableId, data: any) => data,
    remove: async (id: NullableId) => []
  } satisfies Service
}
