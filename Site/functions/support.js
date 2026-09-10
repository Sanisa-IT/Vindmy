import {
  collectImages,
  escapeHtml,
  filesToAttachments,
  requireEnv,
} from "./_utils.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  const envError = requireEnv(env, ["RESEND_API_KEY", "RECAPTCHA_SECRET_KEY"]);
  if (envError) return envError;

  const formData = await request.formData();

  const name = formData.get("name");
  const surname = formData.get("surname");
  const email = formData.get("email");
  const mobile = formData.get("mobile");
  const category = formData.get("category");
  const subject = formData.get("subject");
  const alias = formData.get("alias");
  const vindmyTag = formData.get("vindmyTag");
  const message = formData.get("message");

  if (
    !name ||
    !surname ||
    !email ||
    !mobile ||
    !category ||
    !subject ||
    !message ||
    !alias ||
    !vindmyTag
  ) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

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
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const verifyResult = await verifyResponse.json();

  if (!verifyResult.success) {
    return Response.json(
      { error: "reCAPTCHA verification failed." },
      { status: 400 }
    );
  }

  const uploadResult = collectImages(formData, { required: false });
  if (uploadResult.error) return uploadResult.error;

  const attachments = await filesToAttachments(uploadResult.files);

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "noreply@vindmy.com",
      to: ["support@vindmy.com"],
      reply_to: String(email),
      subject: `[${String(category)}] ${String(subject)}`,
      html: `
        <h2>Support Request</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Surname:</b> ${escapeHtml(surname)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Mobile:</b> ${escapeHtml(mobile)}</p>
        <p><b>Category:</b> ${escapeHtml(category)}</p>
        <p><b>Subject:</b> ${escapeHtml(subject)}</p>
        <p><b>Alias:</b> ${escapeHtml(alias)}</p>
        <p><b>Vindmy Tag:</b> ${escapeHtml(vindmyTag)}</p>
        <hr>
        <p><b>Message:</b></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
      attachments,
    }),
  });

  const data = await resendResponse.json();

  if (!resendResponse.ok) {
    return Response.json(
      { error: data.message || "Failed to send email" },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}
