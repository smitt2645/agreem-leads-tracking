const sequelize = require('../config/db');
const Lead = require('./Lead');
const Note = require('./Note');

Lead.hasMany(Note, {
  foreignKey: 'leadId',
  as: 'notes',
  onDelete: 'CASCADE',
  hooks: true
});

Note.belongsTo(Lead, {
  foreignKey: 'leadId',
  as: 'lead',
  onDelete: 'CASCADE'
});

module.exports = {
  sequelize,
  Lead,
  Note
};
