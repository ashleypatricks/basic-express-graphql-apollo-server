/*
  CURSOR BASED PAGINATION BASE 64 STRING HANDLING
  -----------------------------------------------

  When we first implemented cursor based pagination we were sending the task id field value as it is into the
  resolver. Just say we changed the cursor from the "_id" field to the "createdAt" field which is a date, then
  we would be sending a date string back to the client instead of the _id string. That implementation detail
  should be hidden from the client. The client should just have access to a string, and they will need to pass
  that string without knowing what is chosen as a cursor behind the scenes.

  Therefore we should make it possible to pass values as a based64 encoded string, and this is actually recommended
  by GraphQL docs, that the nextPageCursor should be passed as an "opaque string", which basically means that the
  implementation detail is hidden.

  There is also a benefit on the server side using base64 encoding. You don't have to change the type inside of the schema
  over and over again. So if you change the _id to createdAT, then you don't have to change the type of the cursor from
  string to date inside of the type defintion. If you make the cursor a base64 value then you just use a string for everything.
*/

/**
 * String To Base 64
 * @param data
 */
const stringToBase64 = (data: any) => Buffer.from(data).toString('base64');

/**
 *  Base 64 To String
 * @param data
 */
const base64ToString = (data: any) =>
  Buffer.from(data, 'base64').toString('ascii');

export { stringToBase64, base64ToString };
