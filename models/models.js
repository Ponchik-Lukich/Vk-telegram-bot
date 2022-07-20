const User = require('./user.model.js');
const Domain = require('./domain.model.js');
const Member = require('./member.model.js');
const bufferMember = require('./bufferMember.model.js');
// User.hasMany(Domain);
//
// Domain.belongsTo(User);

module.exports = {
    User,
    Domain,
    Member,
    bufferMember
}
