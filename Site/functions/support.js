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
        subject: "New Support Request",
        html: `
          <h2>Support Request</h2>
          <p><b>Name:</b> ${body.name}</p>
          <p><b>Email:</b> ${body.email}</p>
          <p><b>Message:</b></p>
          <p>${body.message}</p>
        `
      })
    }
  );

  const data = await response.json();

  return Response.json(data);
}