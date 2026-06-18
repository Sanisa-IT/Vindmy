export async function onRequest(context) {
  return new Response(
    context.env.RESEND_API_KEY ? "Key Found" : "Key Missing"
  );
}