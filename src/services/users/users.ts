import type { Application } from '../../declarations'
import { Id, NullableId, Service, ServiceMethods } from '@feathersjs/feathers'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    users: Service<unknown>
  }
}

export const user = (app: Application) => {
  // Small reproduction of the routing issue between @feathersjs/express v4 and v5

  // This works, as there is a third segment which isn't matched by anything else
  app.use('/users/test/foo', (req, res) => {
    res.json({ message: 'Hello from express endpoint /users/test/foo' })
  })

  // This is broken, due to the app.use('users', ...) below also registering users/:__id
  // Go to http://localhost:3030/users/test to see the issue, it will return the users service get
  // call instead ("From users service: test")
  app.use('/users/test', (req, res) => {
    res.json({ message: 'Hello from express endpoint /users/test' })
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
  } satisfies ServiceMethods<unknown>)
}
