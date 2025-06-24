const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const path = require('path');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName || 'Utilisateur';
    this.url = url;
    this.from = `Système de Conformité <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'SendGrid',
        auth: {
          user: process.env.EMAIL_PROD_USER,
          pass: process.env.EMAIL_PROD_PASS
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async send(template, subject) {
    const templatePath = path.join(__dirname, `../views/email/${template}.pug`);

    const html = pug.renderFile(templatePath, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html)
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Bienvenue dans notre plateforme de conformité');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Réinitialisation de votre mot de passe'
    );
  }

  async sendVerification() {
    await this.send(
      'emailVerification',
      'Vérification de votre adresse email'
    );
  }
}

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const user = { email, firstName: 'User' };
  await new Email(user, url).sendVerification();
};

const sendPasswordResetEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/auth?mode=reset&token=${token}`; 
  const user = { email, firstName: 'User' }; 
  await new Email(user, url).sendPasswordReset(); 
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};