# Feathers express routing issue reproduction

Small reproduction of the weird routing behavior changes between Feathers v4 and v5.

See `src/services/users/users.ts` for more information.

This repo includes a `v4` branch, which contains identical code to the main branch (v5),
just with the Feathers dependencies downgraded to the latest v4.x.

You can run the app with `npm run dev` after installing dependencies.

## Update

I found a workaround to get the v4 routing behavior again, see the `v5/fix` branch for an example

TL;DR:

```ts
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
});
```
