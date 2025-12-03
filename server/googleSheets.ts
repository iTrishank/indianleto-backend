import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

export async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

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
      quotationData.createdAt
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:H',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    throw error;
  }
}

export async function ensureSheetHeaders(spreadsheetId: string) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A1:H1'
    });

    const existingHeaders = getResponse.data.values?.[0];
    
    if (!existingHeaders || existingHeaders.length === 0) {
      const headers = [[
        'Quote ID',
        'Customer Name',
        'Phone',
        'Email',
        'Products',
        'Total Amount (INR)',
        'Notes',
        'Created At'
      ]];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1:H1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: headers
        }
      });
    }
  } catch (error) {
    console.error('Error ensuring sheet headers:', error);
  }
}
