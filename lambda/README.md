## Lambda Deployment Notes

The `generate-output` function exposes Court Room (or Tabs) snapshots as fully rendered HTML pages. It acts as a thin proxy over the Next.js REST API.

### Prerequisites

- Node.js 18+ runtime (AWS Lambda or equivalent).
- Environment variable `OUTPUT_SERVICE_BASE_URL` pointing to the publicly accessible Next.js deployment (e.g. `https://your-app.example.com`).
- Network access from the Lambda environment to the Next.js API.

### Packaging

1. Zip the folder contents (this file + `index.mjs`):
   ```bash
   zip -r generate-output.zip index.mjs README.md
   ```
2. Upload the archive to AWS Lambda (Node.js 18 runtime). Set the handler to `index.handler`.
3. Configure environment variables:
   - `OUTPUT_SERVICE_BASE_URL=https://<your-domain>`
4. (Optional) Attach the function to API Gateway with a route such as `GET /outputs/{id}`.

### Invocation Example

```bash
curl "https://your-api.example.com/outputs/ck123" \
  -H "Accept: text/html"
```

The Lambda function fetches the snapshot via `/api/outputs/:id` and returns the stored HTML so it can be rendered directly in a browser or embedded into another LMS component.
