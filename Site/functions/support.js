export async function onRequestPost(context) {
  const { request, env } = context;

  // Parse multipart form data so file uploads are handled
  const formData = await request.formData();

  const get = (k) => (formData.get(k) ? String(formData.get(k)) : "");

  // basic validation
  if (!get("name") || !get("surname") || !get("email") || !get("subject") || !get("message")) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  // helper: ArrayBuffer -> base64 (works in Workers / browser env)
  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }
    return btoa(binary);
  }

  // collect attachments from file inputs
  const attachments = [];
  for (const entry of formData.entries()) {
    const [key, value] = entry;
    if (value instanceof File) {
      const arrayBuffer = await value.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      attachments.push({
        type: value.type || "application/octet-stream",
        name: value.name || "attachment",
        data: base64
      });
    }
  }

  const html = `
    <h2>Support Request</h2>
    <p><b>Name:</b> ${get("name")}</p>
    <p><b>Surname:</b> ${get("surname")}</p>
    <p><b>Email:</b> ${get("email")}</p>
    <p><b>Mobile:</b> ${get("mobile")}</p>
    <p><b>Category:</b> ${get("category")}</p>
    <p><b>Subject:</b> ${get("subject")}</p>
    <p><b>Alias:</b> ${get("alias")}</p>
    <p><b>Vindmy Tag:</b> ${get("vindmyTag")}</p>
    <hr>
    <p><b>Message:</b></p>
    <p>${get("message")}</p>
  `;

  const payload = {
    from: "noreply@vindmy.com",
    to: ["support@vindmy.com"],
    reply_to: get("email"),
    subject: `[${get("category")}] ${get("subject")}`,
    html
  };

  if (attachments.length) payload.attachments = attachments;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), { status: response.status, headers: { "content-type": "application/json" } });

}
