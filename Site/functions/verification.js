export async function onRequestPost(context) {
  console.log("VERIFICATION FUNCTION HIT");

  const { request, env } = context;

  const body = await request.json();

  console.log(body);

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
        subject: `Profile Verification Request - ${body.alias}`,
        html: `
          <h2>Profile Verification Request</h2>

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
}
