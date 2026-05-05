export function buildWelcomeEmail(displayName: string): string {
  const firstName = displayName.split(' ')[0]

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Welcome to DOGSTUD</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:40px 0;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1F4D3A;padding:32px 48px;text-align:center;">
            <img src="https://dogstud.com/dogstud-logo.png" alt="DOGSTUD" height="52" style="display:block;margin:0 auto;"/>
          </td>
        </tr>

        <!-- Hero -->
        <tr>
          <td style="background:#1F4D3A;padding:0 48px 36px;text-align:center;border-bottom:4px solid #2F7D5C;">
            <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.3;">
              Welcome to DOGSTUD, ${firstName}.
            </h1>
            <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.72);line-height:1.6;">
              Your breeder profile is live. Start listing your studs and connecting with breeders nationwide.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 48px;">

            <!-- Steps -->
            <p style="margin:0 0 24px;font-size:14px;font-weight:700;color:#1a1a1a;text-transform:uppercase;letter-spacing:0.8px;">Get started in 3 steps</p>

            <!-- Step 1 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td width="44" valign="top">
                  <div style="width:36px;height:36px;border-radius:50%;background:#1F4D3A;color:#fff;font-weight:700;font-size:15px;text-align:center;line-height:36px;">1</div>
                </td>
                <td valign="top" style="padding-left:12px;">
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">Complete your profile</p>
                  <p style="margin:4px 0 0;font-size:14px;color:#666;line-height:1.5;">Add your kennel name, location, and bio so breeders know who they're dealing with.</p>
                </td>
              </tr>
            </table>

            <!-- Step 2 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td width="44" valign="top">
                  <div style="width:36px;height:36px;border-radius:50%;background:#1F4D3A;color:#fff;font-weight:700;font-size:15px;text-align:center;line-height:36px;">2</div>
                </td>
                <td valign="top" style="padding-left:12px;">
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">Post your first listing</p>
                  <p style="margin:4px 0 0;font-size:14px;color:#666;line-height:1.5;">Add photos, stud fee, breed, health testing, and pedigree. The more detail, the more inquiries.</p>
                </td>
              </tr>
            </table>

            <!-- Step 3 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="44" valign="top">
                  <div style="width:36px;height:36px;border-radius:50%;background:#1F4D3A;color:#fff;font-weight:700;font-size:15px;text-align:center;line-height:36px;">3</div>
                </td>
                <td valign="top" style="padding-left:12px;">
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">Get inquiries directly</p>
                  <p style="margin:4px 0 0;font-size:14px;color:#666;line-height:1.5;">Breeders contact you straight from your listing. No middleman, no platform fees.</p>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <div style="text-align:center;margin:0 0 8px;">
              <a href="https://dogstud.com/dashboard/listings/new"
                style="display:inline-block;padding:15px 36px;background:#2F7D5C;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:700;font-size:15px;letter-spacing:0.2px;">
                List Your First Stud →
              </a>
            </div>

            <p style="text-align:center;margin:16px 0 0;font-size:13px;color:#999;">
              Or <a href="https://dogstud.com/studs" style="color:#2F7D5C;text-decoration:none;">browse existing listings</a> to see what's live.
            </p>

          </td>
        </tr>

        <!-- Divider block -->
        <tr>
          <td style="background:#f9f9f7;border-top:1px solid #ebebeb;padding:28px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding-right:12px;">
                  <p style="margin:0;font-size:13px;font-weight:600;color:#1a1a1a;">Questions?</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#666;">Email us at <a href="mailto:hello@dogstud.com" style="color:#2F7D5C;text-decoration:none;">hello@dogstud.com</a> — we reply fast.</p>
                </td>
                <td width="50%" style="padding-left:12px;border-left:1px solid #e5e5e5;">
                  <p style="margin:0;font-size:13px;font-weight:600;color:#1a1a1a;">Your dashboard</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#666;"><a href="https://dogstud.com/dashboard" style="color:#2F7D5C;text-decoration:none;">dogstud.com/dashboard</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 48px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#bbb;">© 2026 DOGSTUD &nbsp;·&nbsp; <a href="https://dogstud.com" style="color:#2F7D5C;text-decoration:none;">dogstud.com</a></p>
            <p style="margin:6px 0 0;font-size:11px;color:#ccc;">Proven Dog Studs. Trusted Breeders.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
