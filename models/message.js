module.exports = (sequelize, type) => {
    return sequelize.define('message', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        persNmr: type.STRING,
        firstName: type.STRING,
        lastName: type.STRING,
        adress: type.STRING,
        postalCode: type.STRING
    })
}
