module.exports = {
  id: {type: 'UUID', required: true},
  _deleted: {type: 'Boolean', required: true, default: false},
  firstName: {type: 'String', required: true},
  lastName: {type: 'String'},
  emailId: {type: 'String', required: true, unique: true, check: 'regex'},
  authPassword: {type: 'String', required: true, check: 'bcrypt'},
  profilePic: {type: 'URL'},
  active: {type: 'Boolean', default: true, required: true},
  userRole: {type: 'String', required: true, values: 'From Constants'},
  authToken: {type: 'String', required: true},
  secretKey: {type: 'String', required: true},
  createdAt: {type: 'Timestamp'},
  updatedAt: {type: 'Timestamp'},
};