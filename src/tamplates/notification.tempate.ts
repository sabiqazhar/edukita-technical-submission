interface TemplateData {
    studentName: string;
    submitTime: string;
    subject: string;
    title: string;
    contentPreview: string;
    assignmentLink: string;
  }
  
  export function renderAssignmentNotification(data: TemplateData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { font-size: 12px; color: #6c757d; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Assignment Submitted</h1>
          </div>
          <div class="content">
            <p><strong>Student:</strong> ${data.studentName}</p>
            <p><strong>Submitted At:</strong> ${data.submitTime}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Title:</strong> ${data.title}</p>
            <p><strong>Preview:</strong></p>
            <blockquote>${data.contentPreview}</blockquote>
            <a href="${data.assignmentLink}" 
               style="display: inline-block; padding: 10px 15px; background: #007bff; color: white; text-decoration: none;">
              View Assignment
            </a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Edukita Assignment System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  