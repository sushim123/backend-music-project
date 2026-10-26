import { User } from './User.js';
import { Project } from './Project.js';


User.hasMany(Project, {
  foreignKey: 'userId',
  as: 'projects',
  onDelete: 'CASCADE'
});

Project.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

export {
  User,
  Project
};
