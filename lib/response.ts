export const response = (statusCode: number, body: object | string) => ({
  statusCode,
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
