const jwt = require('jsonwebtoken');

const secret = 'my_super_app_secret-1446';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcxMjQ5NzQ4N30.KJpcYE3DrX1eT4928S9_qCoLYG00TSFKsBdjUtnrk_c'


const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log({payload});