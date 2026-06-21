export async function onRequestPost(context) {
  const { request, env } = context;

  const body = await request.json();

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@vindmy.com",
        to: ["admin@vindmy.com"],
        reply_to: body.email,
        html: `
          <h2>Verification Request</h2>

          <p><b>Name:</b> ${body.name}</p>
          <p><b>Surname:</b> ${body.surname}</p>
          <p><b>Email:</b> ${body.email}</p>
          <p><b>Mobile:</b> ${body.mobile}</p>
          <p><b>Alias:</b> ${body.alias}</p>
          <p><b>Vindmy Tag:</b> ${body.vindmyTag}</p>

          <hr>
          <p><b>Identity Verification Request:</b></p>
          <p>${body.identity}</p>

          <p><b>Business Verification Request:</b></p>
          <p>${body.business}</p>
        `
      })
    }
  );

  const data = await response.json();

  return Response.json(data);

  if (
  !body.name ||
  !body.surname ||
  !body.email ||
  !body.message ||
  !body.alias ||
  !body.vindmyTag ||
  !body.identity ||
  !body.business
) {
  return Response.json(
    { error: "Missing required fields" },
    { status: 400 }
  );
}
}
