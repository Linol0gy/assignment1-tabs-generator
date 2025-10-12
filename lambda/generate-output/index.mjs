/**
 * AWS Lambda handler that turns a stored snapshot into a dynamic HTML page.
 *
 * Expected environment variables:
 *   - OUTPUT_SERVICE_BASE_URL: Base URL of the deployed Next.js app
 *
 * Example event (API Gateway HTTP API):
 *   {
 *     "pathParameters": { "id": "ckxyz..." }
 *   }
 */

export const handler = async (event) => {
  const id =
    event?.pathParameters?.id ??
    event?.queryStringParameters?.id ??
    event?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: "Missing snapshot id.",
    };
  }

  const baseUrl = process.env.OUTPUT_SERVICE_BASE_URL;
  if (!baseUrl) {
    return {
      statusCode: 500,
      body: "OUTPUT_SERVICE_BASE_URL is not configured.",
    };
  }

  const url = `${baseUrl.replace(/\/$/, "")}/api/outputs/${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: await response.text(),
    };
  }

  const payload = await response.json();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    body: payload.html ?? "<!DOCTYPE html><html><body>No content.</body></html>",
  };
};
