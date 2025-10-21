import { HandlerResponse } from '@netlify/functions';

export const response = (
  statusCode: number,
  body: object | string
): HandlerResponse => ({
  statusCode,
  body: typeof body === 'string' ? body : JSON.stringify(body),
});

export const errorResponse = (
  err: unknown,
  action: 'create' | 'update' | 'delete' | 'process'
): HandlerResponse => {
  console.error(err);
  if (err instanceof Error)
    return response(
      err.message?.startsWith('Bad request')
        ? 400
        : err.message?.startsWith('Unauthorized')
        ? 401
        : err.message?.startsWith('Forbidden')
        ? 403
        : 500,
      {
        error:
          err.message ||
          `Failed to ${action} ${
            action === 'process' ? 'request' : 'document'
          }.`,
      }
    );
  return response(500, 'Unknown server error');
};
