import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'suggestion' | 'feedback';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, type }: FeedbackRequest = await req.json();

    if (!name || !email || !message) {
      throw new Error('Name, email, and message are required');
    }

    const emailResponse = await resend.emails.send({
      from: "Sacred Shifter <noreply@sacredshifter.com>",
      to: ["kentburchard@sacredshifter.com"],
      replyTo: email,
      subject: `${type === 'suggestion' ? 'Feature Suggestion' : 'Feedback'}: ${subject || 'From Features Coming Soon Page'}`,
      html: `
        <h2>New ${type === 'suggestion' ? 'Feature Suggestion' : 'Feedback'} from Sacred Shifter</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Sent from the Features Coming Soon page</em></p>
      `,
    });

    console.log("Feedback email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, message: 'Feedback sent successfully!' }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-feedback function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);