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
        to: ["support@vindmy.com"],
        reply_to: body.email,
        subject: `[${body.category}] ${body.subject}`,
        html: `
          <h2>Support Request</h2>

          <p><b>Name:</b> ${body.name}</p>
          <p><b>Email:</b> ${body.email}</p>
          <p><b>Mobile:</b> ${body.mobile}</p>
          <p><b>Category:</b> ${body.category}</p>
          <p><b>Subject:</b> ${body.subject}</p>

          <hr>

          <p><b>Message:</b></p>
          <p>${body.message}</p>
        `
      })
    }
  );

  const data = await response.json();

  return Response.json(data);

  if (
  !body.name ||
  !body.email ||
  !body.subject ||
  !body.message
) {
  return Response.json(
    { error: "Missing required fields" },
    { status: 400 }
  );
}

}
