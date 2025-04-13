import nodemailer from 'nodemailer';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { Assignment } from '../entities/assignment.entity';
import { UserRole } from '../interfaces/types';
import { EmailConfig } from '../config/email';
import { renderAssignmentNotification } from '../tamplates/notification.tempate';

export class NotificationService {
  private transporter = nodemailer.createTransport(EmailConfig.transport);

  async sendAssignmentNotification(assignment: Assignment, student: User): Promise<void> {
    const userRepo = AppDataSource.getRepository(User);
    const teachers = await userRepo.find({
      where: { role: UserRole.TEACHER },
    });

    const subject = assignment.subject?.name || 'General';
    const subjectLine = `[New Assignment] ${subject} - ${assignment.title}`;

    const emailHtml = renderAssignmentNotification({
      studentName: student.name,
      submitTime: assignment.createdAt.toLocaleString(),
      subject: subject,
      title: assignment.title,
      contentPreview: assignment.content.slice(0, 100),
      assignmentLink: `${process.env.APP_URL}/assignments/${assignment.id}`,
    });

    // it will send max 5 email in 1 batch for prevent rate-limit SMTP
    const BATCH_SIZE = 5;
    for (let i = 0; i < teachers.length; i += BATCH_SIZE) {
      const batch = teachers.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(teacher => this.sendWithRetry({
          from: EmailConfig.defaults.from,
          to: teacher.email,
          subject: subjectLine,
          html: emailHtml,
          text: `New assignment submitted by ${student.name}: ${assignment.title}`,
        }))
      );
      if (i + BATCH_SIZE < teachers.length) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // delay 10 sec / batch
      }
    }
  }

  private async sendWithRetry(mailOptions: nodemailer.SendMailOptions, retries = 3): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${mailOptions.to}`);
    } catch (error: any) {
      if (retries > 0) {
        console.warn(`Retrying email to ${mailOptions.to} (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.sendWithRetry(mailOptions, retries - 1);
      }
      throw new Error(`Failed to send email to ${mailOptions.to}: ${error.message}`);
    }
  }
}