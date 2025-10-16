# Feedback Summary (Assignment 2)

| Participant | Cohort   | Session Date | Key Observations                                                                                                                                              | Follow-up Actions                                                   | REDCap Survey |
|-------------|----------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|---------------|
| Li Wei      | Family   | 10 Oct 2025  | Appreciated the visible timer and stage cards; suggested larger font for the countdown when working on a laptop at arm’s length.                              | Increase font size of the timer display and make it bold.           | ✔ Submitted (10 Oct 20:34) |
| Zhang Mei   | Family   | 10 Oct 2025  | Found distraction messages engaging, but wanted clearer severity hints (e.g., colours for normal vs urgent).                                                 | Add colour-coded dots or chips based on message severity.           | ✔ Submitted (10 Oct 21:05) |
| Chen Hao    | Friend   | 11 Oct 2025  | Tabs generator is intuitive; recommended a quick preview modal before copying HTML to reduce context switching.                                              | Investigate adding an inline preview modal next to the output area. | ✔ Submitted (11 Oct 09:12) |
| Liu Yan     | Friend   | 11 Oct 2025  | Court Room save feedback was clear; requested the ability to download the generated HTML snapshot directly as a `.html` file.                                | Explore adding a “Download Snapshot” button after save success.     | ✔ Submitted (11 Oct 10:27) |
| Grace Lee   | Industry | 12 Oct 2025  | Praised REST API design; suggested adding pagination/query parameters to `/api/outputs` for production scenarios.                                            | Plan pagination & filtering options for future release.             | ✔ Submitted (12 Oct 14:43) |
| Aaron Smith | Industry | 12 Oct 2025  | Liked the AWS deployment walkthrough; advised adding a `/api/health` endpoint to support uptime monitoring in production dashboards.                         | Create a lightweight health-check route before final deployment.    | ✔ Submitted (12 Oct 15:18) |

## Interview Notes

- Each participant joined a 15–20 minute screen-share session via Zoom or Teams.
- Demonstrated Tabs Generator, Court Room workflow (including save button), and API/Lambda endpoints.
- Collected verbal consent for using anonymised feedback in coursework.
- Confirmed completion of the REDCap ethical survey immediately after each session (timestamps recorded above).
- Stored raw notes privately in `docs/feedback-notes/` (not included in submission archive per privacy guidance).

## Key Insights

1. **Accessibility & Readability**  
   Family participants highlighted timer readability and message severity clarity—prioritise UI tweaks (font size, colour badges).

2. **Workflow Enhancements**  
   Friends requested better post-generation workflow (HTML preview, download option), aligning with LMS usage patterns.

3. **Operational Concerns**  
   Industry participants emphasised scalability (pagination) and observability (health-check endpoint). These are logged in project backlog for Assignment 3.

## Next Steps

1. Adjust timer typography and introduce severity badge colours (amber/red).
2. Prototype quick preview/download features for the saved HTML snapshots.
3. Extend `/api/outputs` with optional `limit`, `offset`, and `fromDate` query parameters.
4. Add `/api/health` route returning status metadata for deployment readiness.
5. Document above items in the change log and incorporate into sprint planning for the next milestone.
