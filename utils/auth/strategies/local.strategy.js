const { Strategy } = require('passport-local');
const boom = require('@hapi/boom');
const bcryptjs = require('bcryptjs');

const UserService = require('../../../services/user.service');
const service = new UserService();

const LocalStrategy = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  }, 
  async (username, password, done) => {
    try {
      const user = await service.findByEmail(username);
      if(!user) {
        done(boom.unauthorized(), false);
      }
      
      const isMatch = await bcryptjs.compare(password, user.password);
      if(!isMatch) {
        done(boom.unauthorized(), false);
      }
      delete user.dataValues.password;
      done(null, user);
      
    } catch (error) {
      done(error, false);
    }
});

module.exports = LocalStrategy;