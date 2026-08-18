/**
 * Académie des Enfants Kairouan — enrollment web app.
 *
 * One Apps Script does two jobs with zero API keys:
 *   1. Appends every form submission as a row in this spreadsheet.
 *   2. Sends a Gmail notification to the owner (set the NOTIFY_EMAIL
 *      script property: Project Settings → Script properties → add).
 *
 * Deploy: Extensions → Apps Script → paste this file → Deploy → New
 * deployment → Web app → Execute as: Me → Access: Anyone →
 * copy the /exec URL into backend/.env as SHEETS_WEBAPP_URL.
 */
function doPost(e) {
  const body = JSON.parse(e.postData.contents);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('Inscriptions') || ss.insertSheet('Inscriptions');
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Date', 'Parent', 'Enfant', 'Âge', 'Téléphone', 'Message', 'Langue']);
  }
  sh.appendRow([
    new Date(),
    body.name || '',
    body.child_name || '',
    body.age || '',
    body.phone || '',
    body.message || '',
    body.lang || 'fr',
  ]);

  const notify = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (notify) {
    MailApp.sendEmail({
      to: notify,
      subject: 'Nouvelle inscription — ' + (body.child_name || 'enfant'),
      htmlBody:
        '<h2>Nouvelle demande d\u2019inscription</h2>' +
        '<p><b>Parent :</b> ' + esc(body.name) + '</p>' +
        '<p><b>Enfant :</b> ' + esc(body.child_name) + '</p>' +
        '<p><b>Âge :</b> ' + esc(body.age) + '</p>' +
        '<p><b>Téléphone :</b> ' + esc(body.phone) + '</p>' +
        (body.message ? '<p><b>Message :</b> ' + esc(body.message) + '</p>' : ''),
    });
  }

  return ContentService.createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
