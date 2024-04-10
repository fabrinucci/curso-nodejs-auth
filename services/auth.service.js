const boom = require('@hapi/boom');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('../config/config');

const UserService = require('./user.service');
const service = new UserService();

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);

    if(!user) {
      throw boom.unauthorized();
    }
    
    const isMatch = await bcryptjs.compare(password, user.password);
    if(!isMatch) {
      throw boom.unauthorized();
    }

    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role
    };
    const token = jwt.sign(payload, config.jwtSecret)
    return { 
      user,
      token
    };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtRecoverySecret, {
      expiresIn: '15min',
    });

    const link = `https://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, { recoveryToken: token });

    const emailInfo = {
      from: config.mailerEmail,
      to: user.email,
      subject: 'Email para recuperar contraseña',
      html: `<b>Ingresa a este link para recuperar tu contraseña: ${link}</b>`,
    }

    const rta = await this.sendMail(emailInfo);
    return rta;
  }

  async sendMail(infoEmail) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.mailerEmail,
        pass: config.mailerPassword,
      },
    });

    await transporter.sendMail(infoEmail);
    return { message: 'email sent' } 
  }
}

module.exports = AuthService;