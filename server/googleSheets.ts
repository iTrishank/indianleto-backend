import { google } from "googleapis";

/**
 * Creates an authenticated Google Sheets client using
 * a Service Account (works in VS Code / local / servers).
 *
 * Required env vars:
 * - GOOGLE_SERVICE_ACCOUNT_KEY  (JSON string of service account key)
 */
export async function getUncachableGoogleSheetClient() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!keyJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY env var is not set");
  }

  let key: any;
  try {
    key = JSON.parse(keyJson);
  } catch (err) {
    throw new Error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY JSON");
  }

  if (!key.client_email || !key.private_key) {
    throw new Error("Service account key is missing client_email or private_key");
  }

  const jwtClient = new google.auth.JWT(
    key.client_email,
    undefined,
    key.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  await jwtClient.authorize();

  return google.sheets({
    version: "v4",
    auth: jwtClient,
  });
}

/**
 * Appends one quotation row to the Google Sheet
 */
export async function appendQuotationToSheet(
  spreadsheetId: string,
  quotationData: {
    quoteId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    products: string;
    totalAmount: number;
    notes: string;
    createdAt: string;
  }
) {
  try {
    const sheets = await getUncachableGoogleSheetClient();

    const values = [[
      quotationData.quoteId,
      quotationData.customerName,
      quotationData.customerPhone,
      quotationData.customerEmail,
      quotationData.products,
      quotationData.totalAmount,
      quotationData.notes,
      quotationData.createdAt,
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:H",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    return response.data;
  } catch (error) {
    console.error("Error appending to Google Sheet:", error);
    throw error;
  }
}

/**
 * Ensures header row exists in the Google Sheet
 */
export async function ensureSheetHeaders(spreadsheetId: string) {
  try {
    const sheets = await getUncachableGoogleSheetClient();

    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:H1",
    });

    const existingHeaders = getResponse.data.values?.[0];

    if (!existingHeaders || existingHeaders.length === 0) {
      const headers = [[
        "Quote ID",
        "Customer Name",
        "Phone",
        "Email",
        "Products",
        "Total Amount (INR)",
        "Notes",
        "Created At",
      ]];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Sheet1!A1:H1",
        valueInputOption: "USER_ENTERED",
        requestBody: { values: headers },
      });
    }
  } catch (error) {
    console.error("Error ensuring sheet headers:", error);
  }
}
console.log("ENV SHEET ID:", process.env.GOOGLE_SHEET_ID);
