const { Resend } = require("resend");

// Initialize Resend with the API key from environment variables
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("your_api_key")) {
    console.warn("⚠️ Resend API Key is not configured. Email sending will be simulated.");
    return null;
  }

  return new Resend(apiKey);
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

  // HTML templates
  const studentHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">Mentor Assigned Successfully</h2>
      <p>Dear <strong>${studentName}</strong> (USN: ${studentUsn}),</p>
      <p>We are pleased to inform you that a mentor has been assigned for your internship at <strong>${company}</strong>.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4A90E2;">
        <h4 style="margin: 0 0 10px 0; color: #333;">Mentor Details:</h4>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${mentorName}</p>
        <p style="margin: 5px 0;"><strong>USN/ID:</strong> ${mentorUsn}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${mentorEmail}</p>
      </div>
      <p>Please get in touch with your mentor to discuss your internship progress and evaluations.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #777; text-align: center;">This is an automated notification from the Internship Management System.</p>
    </div>
  `;

  const mentorHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">New Student Assignment</h2>
      <p>Dear <strong>${mentorName}</strong>,</p>
      <p>You have been assigned as the mentor for the following student's internship at <strong>${company}</strong>:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4A90E2;">
        <h4 style="margin: 0 0 10px 0; color: #333;">Student Details:</h4>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${studentName}</p>
        <p style="margin: 5px 0;"><strong>USN:</strong> ${studentUsn}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${studentEmail}</p>
      </div>
      <p>Please reach out to the student to guide them and schedule their evaluations.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #777; text-align: center;">This is an automated notification from the Internship Management System.</p>
    </div>
  `;

  if (!resendClient) {
    console.log("=== SIMULATED MENTOR ASSIGNMENT EMAILS ===");
    console.log(`To Student: [${studentEmail}]`);
    console.log(`Subject: Mentor Assigned - ${company}`);
    console.log(`Content: Mentor ${mentorName} has been assigned.`);
    console.log(`To Mentor: [${mentorEmail}]`);
    console.log(`Subject: New Student Assigned - ${company}`);
    console.log(`Content: Student ${studentName} (${studentUsn}) has been assigned.`);
    console.log("==========================================");
    return;
  }

  try {
    // Send to Student
    const studentRes = await resendClient.emails.send({
      from: fromEmail,
      to: studentEmail,
      subject: `Mentor Assigned for your Internship at ${company}`,
      html: studentHtml
    });
    if (studentRes.error) {
      console.error("Resend Student error details:", studentRes.error);
    } else {
      console.log(`Assignment email successfully sent to Student: ${studentEmail} (ID: ${studentRes.data?.id})`);
    }

    // Send to Mentor
    const mentorRes = await resendClient.emails.send({
      from: fromEmail,
      to: mentorEmail,
      subject: `New Student Assigned: ${studentName} (${studentUsn})`,
      html: mentorHtml
    });
    if (mentorRes.error) {
      console.error("Resend Mentor error details:", mentorRes.error);
    } else {
      console.log(`Assignment email successfully sent to Mentor: ${mentorEmail} (ID: ${mentorRes.data?.id})`);
    }
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

  if (!resendClient) {
    console.log("=== SIMULATED EVALUATION SCHEDULED EMAIL ===");
    console.log(`To Student: [${studentEmail}]`);
    console.log(`Subject: Internship Evaluation Scheduled - Evaluation #${evaluationNumber}`);
    console.log(`Content: Evaluation scheduled at ${formattedDate} by ${mentorName}`);
    console.log("=============================================");
    return;
  }

  try {
    const res = await resendClient.emails.send({
      from: fromEmail,
      to: studentEmail,
      subject: `Internship Evaluation Scheduled: Evaluation #${evaluationNumber}`,
      html: htmlContent
    });
    if (res.error) {
      console.error("Resend Evaluation error details:", res.error);
    } else {
      console.log(`Evaluation scheduled email successfully sent to Student: ${studentEmail} (ID: ${res.data?.id})`);
    }
  } catch (error) {
    console.error("Error sending evaluation scheduled email via Resend HTTP API:", error);
    throw error;
  }
};

module.exports = {
  sendMentorAssignmentEmails,
  sendEvaluationScheduledEmail
};
