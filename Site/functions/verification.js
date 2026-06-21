export async function onRequestPost(context) {
  const { request, env } = context;
  // Parse form data (supports multipart/form-data including file uploads)
  const formData = await request.formData();

  const get = (key) => (formData.get(key) ? String(formData.get(key)) : "");

  // basic validation
  if (!get("name") || !get("surname") || !get("email")) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  // helper: ArrayBuffer -> base64 (works in Workers / browser env)
  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 0x8000; // keep memory use sane
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
    <h2>Verification Request</h2>
    <p><b>Name:</b> ${get("name")}</p>
    <p><b>Surname:</b> ${get("surname")}</p>
    <p><b>Email:</b> ${get("email")}</p>
    <p><b>Mobile:</b> ${get("mobile")}</p>
    <p><b>Alias:</b> ${get("alias")}</p>
    <p><b>Vindmy Tag:</b> ${get("vindmyTag")}</p>
    <hr>
    <p><b>Identity Verification Request:</b></p>
    <p>${get("identity")}</p>
    <p><b>Business Verification Request:</b></p>
    <p>${get("business")}</p>
  `;

  const payload = {
    from: "noreply@vindmy.com",
    to: ["support@vindmy.com"],
    reply_to: get("email"),
    html
  };

  if (attachments.length) {
    payload.attachments = attachments;
  }

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
