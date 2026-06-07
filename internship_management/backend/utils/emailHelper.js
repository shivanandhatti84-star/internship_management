const { Resend } = require("resend");
const nodemailer = require("nodemailer");

// Initialize Resend with the API key from environment variables
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("your_api_key")) {
    return null;
  }

  return new Resend(apiKey);
};

// Initialize Nodemailer SMTP transporter
const getSMTPTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: { user, pass },
    family: 4 // Force IPv4 to bypass ENETUNREACH IPv6 routing errors on Render
  });
};

const getSMTPSender = () => {
  const fromEmail = process.env.EMAIL_FROM;
  const smtpUser = process.env.SMTP_USER;

  if (fromEmail && fromEmail.includes("<")) {
    const displayName = fromEmail.split("<")[0].trim();
    return `${displayName} <${smtpUser}>`;
  }
  return `Internship Management System <${smtpUser}>`;
};

const getRecipientEmail = (email) => {
  const verifiedTestEmail = "shivanandhatti84@gmail.com";
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const hasSMTP = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

  // Only redirect if using Resend's default sandbox domain and SMTP is NOT configured
  if (!hasSMTP && fromEmail === "onboarding@resend.dev" && email && email.toLowerCase() !== verifiedTestEmail.toLowerCase()) {
    console.log(`[Resend Sandbox Redirect] Redirecting email from ${email} to ${verifiedTestEmail}`);
    return { target: verifiedTestEmail, redirected: true };
  }
  return { target: email, redirected: false };
};

/**
 * Sends mentor assignment notification emails to both student and mentor.
 */
const sendMentorAssignmentEmails = async ({
  studentEmail,
  studentName,
  studentUsn,
  mentorEmail,
  mentorName,
  mentorUsn,
  company
}) => {
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const resendClient = getResendClient();
  const smtpTransporter = getSMTPTransporter();

  const originalStudentEmail = studentEmail;
  const originalMentorEmail = mentorEmail;

  const studentDest = getRecipientEmail(studentEmail);
  const mentorDest = getRecipientEmail(mentorEmail);

  // HTML templates
  const studentHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">Mentor Assigned Successfully</h2>
      ${studentDest.redirected ? `
      <p style="background-color: #fff3cd; color: #856404; padding: 10px; border-radius: 4px; font-size: 13px; margin-bottom: 15px;">
        <strong>[Sandbox Mode Alert]</strong> This email was originally sent to <strong>${originalStudentEmail}</strong>, but was redirected here to enable local testing.
      </p>` : ''}
      <p>Dear <strong>${studentName}</strong> (USN: ${studentUsn}),</p>
      <p>We are pleased to inform you that a mentor has been assigned for your internship at <strong>${company}</strong>.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4A90E2;">
        <h4 style="margin: 0 0 10px 0; color: #333;">Mentor Details:</h4>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${mentorName}</p>
        <p style="margin: 5px 0;"><strong>USN/ID:</strong> ${mentorUsn}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${originalMentorEmail}</p>
      </div>
      <p>Please get in touch with your mentor to discuss your internship progress and evaluations.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #777; text-align: center;">This is an automated notification from the Internship Management System.</p>
    </div>
  `;

  const mentorHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">New Student Assignment</h2>
      ${mentorDest.redirected ? `
      <p style="background-color: #fff3cd; color: #856404; padding: 10px; border-radius: 4px; font-size: 13px; margin-bottom: 15px;">
        <strong>[Sandbox Mode Alert]</strong> This email was originally sent to <strong>${originalMentorEmail}</strong>, but was redirected here to enable local testing.
      </p>` : ''}
      <p>Dear <strong>${mentorName}</strong>,</p>
      <p>You have been assigned as the mentor for the following student's internship at <strong>${company}</strong>:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4A90E2;">
        <h4 style="margin: 0 0 10px 0; color: #333;">Student Details:</h4>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${studentName}</p>
        <p style="margin: 5px 0;"><strong>USN:</strong> ${studentUsn}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${originalStudentEmail}</p>
      </div>
      <p>Please reach out to the student to guide them and schedule their evaluations.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #777; text-align: center;">This is an automated notification from the Internship Management System.</p>
    </div>
  `;

  // Try SMTP first if credentials exist
  if (smtpTransporter) {
    try {
      const smtpSender = getSMTPSender();
      await smtpTransporter.sendMail({
        from: smtpSender,
        to: studentDest.target,
        subject: `Mentor Assigned for your Internship at ${company}`,
        html: studentHtml
      });
      console.log(`[SMTP] Assignment email sent to Student: ${studentDest.target}`);

      await smtpTransporter.sendMail({
        from: smtpSender,
        to: mentorDest.target,
        subject: `New Student Assigned: ${studentName} (${studentUsn})`,
        html: mentorHtml
      });
      console.log(`[SMTP] Assignment email sent to Mentor: ${mentorDest.target}`);
      return;
    } catch (err) {
      console.error("[SMTP] Error sending assignment emails, falling back:", err);
    }
  }

  // Fallback to Resend Client
  if (!resendClient) {
    console.log("=== SIMULATED MENTOR ASSIGNMENT EMAILS ===");
    console.log(`To Student: [${studentDest.target}]`);
    console.log(`Subject: Mentor Assigned - ${company}`);
    console.log(`To Mentor: [${mentorDest.target}]`);
    console.log(`Subject: New Student Assigned - ${company}`);
    console.log("==========================================");
    return;
  }

  try {
    const studentRes = await resendClient.emails.send({
      from: fromEmail,
      to: studentDest.target,
      subject: studentDest.redirected
        ? `[Redirected] Mentor Assigned for your Internship at ${company} (To: ${originalStudentEmail})`
        : `Mentor Assigned for your Internship at ${company}`,
      html: studentHtml
    });
    if (studentRes.error) console.error("Resend Student error details:", studentRes.error);

    const mentorRes = await resendClient.emails.send({
      from: fromEmail,
      to: mentorDest.target,
      subject: mentorDest.redirected
        ? `[Redirected] New Student Assigned: ${studentName} (To: ${originalMentorEmail})`
        : `New Student Assigned: ${studentName} (${studentUsn})`,
      html: mentorHtml
    });
    if (mentorRes.error) console.error("Resend Mentor error details:", mentorRes.error);
  } catch (error) {
    console.error("Error sending assignment emails via Resend HTTP API:", error);
    throw error;
  }
};

/**
 * Sends evaluation scheduled notification email to student.
 */
const sendEvaluationScheduledEmail = async ({
  studentEmail,
  studentName,
  mentorName,
  evaluationNumber,
  scheduledAt
}) => {
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const resendClient = getResendClient();
  const smtpTransporter = getSMTPTransporter();

  const originalStudentEmail = studentEmail;
  const studentDest = getRecipientEmail(studentEmail);

  const formattedDate = new Date(scheduledAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #E67E22; border-bottom: 2px solid #E67E22; padding-bottom: 10px;">Internship Evaluation Scheduled</h2>
      ${studentDest.redirected ? `
      <p style="background-color: #fff3cd; color: #856404; padding: 10px; border-radius: 4px; font-size: 13px; margin-bottom: 15px;">
        <strong>[Sandbox Mode Alert]</strong> This email was originally sent to <strong>${originalStudentEmail}</strong>, but was redirected here to enable local testing.
      </p>` : ''}
      <p>Dear <strong>${studentName}</strong>,</p>
      <p>Your mentor, <strong>${mentorName}</strong>, has scheduled <strong>Evaluation #${evaluationNumber}</strong> for you.</p>
      <div style="background-color: #fdf5e6; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #E67E22;">
        <h4 style="margin: 0 0 10px 0; color: #333;">Schedule Details:</h4>
        <p style="margin: 5px 0;"><strong>Evaluation:</strong> Evaluation #${evaluationNumber}</p>
        <p style="margin: 5px 0;"><strong>Scheduled Date & Time:</strong> ${formattedDate}</p>
        <p style="margin: 5px 0;"><strong>Evaluator:</strong> ${mentorName}</p>
      </div>
      <p>Please be prepared and ensure you are available at the scheduled time. Contact your mentor if you have any questions.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #777; text-align: center;">This is an automated notification from the Internship Management System.</p>
    </div>
  `;

  // Try SMTP first
  if (smtpTransporter) {
    try {
      const smtpSender = getSMTPSender();
      await smtpTransporter.sendMail({
        from: smtpSender,
        to: studentDest.target,
        subject: `Internship Evaluation Scheduled: Evaluation #${evaluationNumber}`,
        html: htmlContent
      });
      console.log(`[SMTP] Evaluation scheduled email sent to Student: ${studentDest.target}`);
      return;
    } catch (err) {
      console.error("[SMTP] Error sending evaluation email, falling back:", err);
    }
  }

  // Resend Fallback
  if (!resendClient) {
    console.log("=== SIMULATED EVALUATION SCHEDULED EMAIL ===");
    console.log(`To Student: [${studentDest.target}]`);
    console.log(`Subject: Internship Evaluation Scheduled - Evaluation #${evaluationNumber}`);
    console.log("=============================================");
    return;
  }

  try {
    const res = await resendClient.emails.send({
      from: fromEmail,
      to: studentDest.target,
      subject: studentDest.redirected
        ? `[Redirected] Internship Evaluation Scheduled: Evaluation #${evaluationNumber} (To: ${originalStudentEmail})`
        : `Internship Evaluation Scheduled: Evaluation #${evaluationNumber}`,
      html: htmlContent
    });
    if (res.error) console.error("Resend Evaluation error details:", res.error);
  } catch (error) {
    console.error("Error sending evaluation scheduled email via Resend HTTP API:", error);
    throw error;
  }
};

module.exports = {
  sendMentorAssignmentEmails,
  sendEvaluationScheduledEmail
};
