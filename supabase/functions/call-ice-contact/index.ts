import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface ICEContactRequest {
  contact_phone?: string;
  contact_email?: string;
  contact_name: string;
  user_name: string;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: number;
  };
  activation_type: 'call' | 'message' | 'location_share';
}

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        }
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { contact_phone, contact_email, contact_name, user_name, message, location, activation_type }: ICEContactRequest = await req.json();

    console.log('🚨 ICE contact activation:', { contact_name, user_name, activation_type });

    const results: any[] = [];

    // SMS Fallback via Twilio (if configured)
    if (contact_phone && Deno.env.get("TWILIO_SID")) {
      try {
        console.log('📱 Attempting SMS via Twilio to:', contact_phone);
        
        const twilioSid = Deno.env.get("TWILIO_SID");
        const twilioAuth = Deno.env.get("TWILIO_AUTH");
        const twilioFrom = Deno.env.get("TWILIO_FROM");

        if (!twilioSid || !twilioAuth || !twilioFrom) {
          throw new Error('Twilio credentials not configured');
        }

        // Create enhanced message with location if available
        let enhancedMessage = `🚨 EMERGENCY ALERT from ${user_name} via Sacred Shifter\n\n${message}`;
        
        if (location) {
          enhancedMessage += `\n\n📍 Location: https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
          enhancedMessage += `\nAccuracy: ±${location.accuracy || 'unknown'}m`;
          enhancedMessage += `\nTimestamp: ${new Date(location.timestamp).toLocaleString()}`;
        }

        enhancedMessage += '\n\nPlease respond immediately. This message was sent through Sacred Shifter\'s emergency contact system.';

        const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${twilioSid}:${twilioAuth}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: contact_phone,
            From: twilioFrom,
            Body: enhancedMessage,
          }),
        });

        if (twilioResponse.ok) {
          const twilioData = await twilioResponse.json();
          results.push({
            type: 'sms',
            status: 'sent',
            provider: 'twilio',
            sid: twilioData.sid,
            to: contact_phone
          });
          console.log('✅ SMS sent successfully via Twilio');
        } else {
          const errorData = await twilioResponse.text();
          console.error('❌ Twilio SMS failed:', errorData);
          results.push({
            type: 'sms',
            status: 'failed',
            provider: 'twilio',
            error: errorData
          });
        }
      } catch (error) {
        console.error('❌ SMS Error:', error);
        results.push({
          type: 'sms',
          status: 'failed',
          provider: 'twilio',
          error: error.message
        });
      }
    }

    // Email Fallback via Supabase Edge Functions (if configured)
    if (contact_email) {
      try {
        console.log('📧 Attempting email to:', contact_email);
        
        // Create enhanced email content
        let emailContent = `
<!DOCTYPE html>
<html>
<head>
    <title>🚨 Emergency Alert from ${user_name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .alert { background: #ff4444; color: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .message { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .location { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { font-size: 12px; color: #666; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="alert">
        <h1>🚨 EMERGENCY ALERT</h1>
        <p><strong>From:</strong> ${user_name}</p>
        <p><strong>Contact:</strong> ${contact_name}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="message">
        <h2>Message:</h2>
        <p>${message}</p>
    </div>
`;

        if (location) {
          emailContent += `
    <div class="location">
        <h2>📍 Location Information:</h2>
        <p><strong>Coordinates:</strong> ${location.latitude}, ${location.longitude}</p>
        <p><strong>Accuracy:</strong> ±${location.accuracy || 'unknown'}m</p>
        <p><strong>Timestamp:</strong> ${new Date(location.timestamp).toLocaleString()}</p>
        <p><a href="https://maps.google.com/maps?q=${location.latitude},${location.longitude}" target="_blank">🗺️ View on Google Maps</a></p>
    </div>
`;
        }

        emailContent += `
    <div class="footer">
        <p>This emergency alert was sent through Sacred Shifter's emergency contact system.</p>
        <p><strong>Please respond immediately.</strong></p>
        <p>Sacred Shifter - Consciousness-Aware Communication Platform</p>
    </div>
</body>
</html>`;

        // Use Resend API (if configured) or fallback to basic email
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        
        if (resendApiKey) {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Sacred Shifter Emergency <emergency@sacred-shifter.com>',
              to: [contact_email],
              subject: `🚨 URGENT: Emergency Alert from ${user_name}`,
              html: emailContent,
            }),
          });

          if (resendResponse.ok) {
            const resendData = await resendResponse.json();
            results.push({
              type: 'email',
              status: 'sent',
              provider: 'resend',
              id: resendData.id,
              to: contact_email
            });
            console.log('✅ Email sent successfully via Resend');
          } else {
            const errorData = await resendResponse.text();
            console.error('❌ Resend email failed:', errorData);
            results.push({
              type: 'email',
              status: 'failed',
              provider: 'resend',
              error: errorData
            });
          }
        } else {
          console.log('⚠️ No email provider configured, skipping email');
          results.push({
            type: 'email',
            status: 'skipped',
            reason: 'No email provider configured'
          });
        }
      } catch (error) {
        console.error('❌ Email Error:', error);
        results.push({
          type: 'email',
          status: 'failed',
          error: error.message
        });
      }
    }

    // Return results
    const response = {
      success: results.some(r => r.status === 'sent'),
      activation_type,
      contact_name,
      results,
      timestamp: new Date().toISOString()
    };

    console.log('🚨 ICE activation complete:', response);

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('❌ ICE contact function error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
