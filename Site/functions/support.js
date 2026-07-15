export async function onRequestPost(context) {
  const { request, env } = context;

  // Parse as FormData — not JSON (frontend sends multipart/form-data)
  const formData = await request.formData();

  const name      = formData.get("name");
  const surname   = formData.get("surname");
  const email     = formData.get("email");
  const mobile    = formData.get("mobile");
  const category  = formData.get("category");
  const subject   = formData.get("subject");
  const alias     = formData.get("alias");
  const vindmyTag = formData.get("vindmyTag");
  const message   = formData.get("message");

  // Validation — at the TOP before anything else runs
  if (!name || !surname || !email || !subject || !message || !alias || !vindmyTag) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Verify reCAPTCHA token before doing any expensive work
  const captchaToken = formData.get("g-recaptcha-response");
  if (!captchaToken) {
    return Response.json({ error: "Missing reCAPTCHA token" }, { status: 400 });
  }

  const verifyData = new URLSearchParams();
  verifyData.append("secret", env.RECAPTCHA_SECRET_KEY);
  verifyData.append("response", captchaToken);

  const verifyResponse = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      body: verifyData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  const verifyResult = await verifyResponse.json();

  if (!verifyResult.success) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "reCAPTCHA verification failed."
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  // Convert uploaded files to Base64 for Resend attachments
  // Cloudflare Workers have no Node.js Buffer — use chunked Uint8Array + btoa
  const files = formData.getAll("documents");
  const attachments = await Promise.all(
    files
      .filter(file => file && file.size > 0) // ignore empty file inputs
      .map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array  = new Uint8Array(arrayBuffer);

        // Process in chunks to avoid call stack overflow on large files
        const chunkSize = 8192;
        let binary = "";
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, i + chunkSize);
          binary += String.fromCharCode(...chunk);
        }

        return {
          filename: file.name,
          content:  btoa(binary), // Resend expects Base64-encoded content
        };
      })
  );

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:     "noreply@vindmy.com",
      to:       ["support@vindmy.com"],
      reply_to: email,
      subject:  `[${category}] ${subject}`,
      html: `
        <h2>Support Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Surname:</b> ${surname}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Category:</b> ${category}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Alias:</b> ${alias}</p>
        <p><b>Vindmy Tag:</b> ${vindmyTag}</p>
        <hr>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
      attachments, // empty array if no files uploaded — Resend handles this fine
    }),
  });

  const data = await resendResponse.json();

  // Return proper error so frontend alert shows the real problem
  if (!resendResponse.ok) {
    return Response.json(
      { error: data.message || "Failed to send email" },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}