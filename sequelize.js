const Sequelize = require('sequelize')
const UsersModel = require('./models/user')
const MessagesModel = require('./models/message')


const sequelize = new Sequelize('testdb', 'root', '12345', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const Users = UsersModel(sequelize, Sequelize)
const Messages = MessagesModel(sequelize, Sequelize)


sequelize.sync({ force: false, alter: true })
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  Users,
  Messages
}
