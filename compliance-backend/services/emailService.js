const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const path = require('path');

module.exports = class Email {
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

    // Mailtrap pour le développement
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
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
};

// Fonctions utilitaires pour envoyer des emails
exports.sendVerificationEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const user = { email, firstName: 'User' }; // Nom par défaut
  await new Email(user, url).sendVerification();
};

exports.sendPasswordResetEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const user = { email, firstName: 'User' }; // Nom par défaut
  await new Email(user, url).sendPasswordReset();
};