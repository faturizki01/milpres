import { Injectable } from '@nestjs/common'
import { createTransport } from 'nodemailer'

@Injectable()
export class MailService {
  private transporter: any

  constructor() {
    // Use mock SMTP for development, real SMTP for production
    if (process.env.NODE_ENV === 'production') {
      this.transporter = createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    } else {
      // Mock transporter for development
      this.transporter = createTransport({
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '1025'),
        secure: false,
        ignoreTLS: true,
      })
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || 'noreply@milpers.id',
        to: email,
        subject: 'Selamat datang di Milpers!',
        html: `
          <h1>Selamat datang, ${name}!</h1>
          <p>Akun Anda telah berhasil dibuat.</p>
          <p>Anda sekarang dapat login ke dashboard admin untuk mengelola konten.</p>
          <a href="${process.env.ADMIN_URL || 'https://admin.milpers.id'}/login" style="display: inline-block; padding: 10px 20px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">
            Login ke Dashboard
          </a>
          <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
          <p>Terima kasih,<br/>Tim Milpers</p>
        `,
      })
      console.log(`✓ Welcome email sent to ${email}`)
      return true
    } catch (error) {
      console.error(`✗ Failed to send welcome email to ${email}:`, error)
      return false
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      const resetUrl = `${process.env.ADMIN_URL || 'https://admin.milpers.id'}/reset-password?token=${resetToken}`
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || 'noreply@milpers.id',
        to: email,
        subject: 'Reset Password - Milpers',
        html: `
          <h1>Reset Password Anda</h1>
          <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
          <p>Klik link di bawah untuk membuat password baru:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
          <p><strong>Link ini berlaku selama 1 jam.</strong></p>
          <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
          <p>Terima kasih,<br/>Tim Milpers</p>
        `,
      })
      console.log(`✓ Password reset email sent to ${email}`)
      return true
    } catch (error) {
      console.error(`✗ Failed to send password reset email to ${email}:`, error)
      return false
    }
  }

  async sendContentPublishedEmail(email: string, contentTitle: string, contentUrl: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || 'noreply@milpers.id',
        to: email,
        subject: `Konten "${contentTitle}" telah dipublikasikan!`,
        html: `
          <h1>Konten Dipublikasikan</h1>
          <p>Artikel "<strong>${contentTitle}</strong>" Anda telah dipublikasikan!</p>
          <a href="${contentUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">
            Lihat Konten
          </a>
          <p>Terima kasih telah berkontribusi,<br/>Tim Milpers</p>
        `,
      })
      console.log(`✓ Content published email sent to ${email}`)
      return true
    } catch (error) {
      console.error(`✗ Failed to send content published email to ${email}:`, error)
      return false
    }
  }
}
