export function buildOnboardingEmail1(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:40px 0;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:#1F4D3A;padding:28px 40px 24px;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">Your listing takes 60 seconds</h1>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;">Hey ${firstName},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">
            You just joined DOGSTUD. Here's what to do next:
          </p>
          <ol style="margin:0 0 24px;padding-left:20px;font-size:15px;color:#444;line-height:2;">
            <li>Click the button below</li>
            <li>Enter your dog's name, breed, city, and one sentence</li>
            <li>Hit Publish — you're live</li>
          </ol>
          <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
            That's it. Breeders are already searching. The sooner you're listed, the sooner they find you.
          </p>
          <div style="text-align:center;">
            <a href="https://dogstud.com/dashboard/listings/new"
              style="display:inline-block;padding:14px 32px;background:#2F7D5C;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:700;font-size:15px;">
              Create Your Listing →
            </a>
          </div>
        </td></tr>
        <tr><td style="padding:20px 40px;text-align:center;border-top:1px solid #ebebeb;">
          <p style="margin:0;font-size:12px;color:#bbb;">© 2026 DOGSTUD · <a href="https://dogstud.com" style="color:#2F7D5C;text-decoration:none;">dogstud.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function buildOnboardingEmail2(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:40px 0;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:#1F4D3A;padding:28px 40px 24px;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">Breeders are searching right now</h1>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;">Hey ${firstName},</p>
          <p style="margin:0 0 20px;font-size:15px;color:#444;line-height:1.6;">
            You haven't listed your stud yet. Here's why it matters:
          </p>
          <ul style="margin:0 0 28px;padding-left:20px;font-size:15px;color:#444;line-height:2.2;">
            <li>Breeders search DOGSTUD daily — unlisted studs get zero inquiries</li>
            <li>Every day without a listing is a breeding opportunity you missed</li>
            <li>It takes 60 seconds — no credit card, no approval process</li>
          </ul>
          <div style="text-align:center;">
            <a href="https://dogstud.com/dashboard/listings/new"
              style="display:inline-block;padding:14px 32px;background:#2F7D5C;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:700;font-size:15px;">
              List Now (It's Free) →
            </a>
          </div>
        </td></tr>
        <tr><td style="padding:20px 40px;text-align:center;border-top:1px solid #ebebeb;">
          <p style="margin:0;font-size:12px;color:#bbb;">© 2026 DOGSTUD · <a href="https://dogstud.com" style="color:#2F7D5C;text-decoration:none;">dogstud.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function buildOnboardingEmail3(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:40px 0;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:#1F4D3A;padding:28px 40px 24px;text-align:center;">
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Quick question about your stud</h1>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;">Hey ${firstName},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">
            We noticed you signed up but haven't listed yet. Is there something stopping you?
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">
            If you have questions, just reply to this email. We read every one.
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
            If you're ready, your listing is 60 seconds away:
          </p>
          <div style="text-align:center;">
            <a href="https://dogstud.com/dashboard/listings/new"
              style="display:inline-block;padding:14px 32px;background:#2F7D5C;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:700;font-size:15px;">
              Create My Listing →
            </a>
          </div>
        </td></tr>
        <tr><td style="padding:20px 40px;text-align:center;border-top:1px solid #ebebeb;">
          <p style="margin:0;font-size:12px;color:#bbb;">© 2026 DOGSTUD · <a href="https://dogstud.com" style="color:#2F7D5C;text-decoration:none;">dogstud.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
