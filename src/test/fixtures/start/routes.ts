// @ts-nocheck
Route.get('/foo', 'UserController.destroy')
Route.get('/test', 'FooController.methodA')
Route.get('/bar', 'NotExistingController.destroy')
