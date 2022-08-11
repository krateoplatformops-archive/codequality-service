const axios = require('axios')
const { envConstants } = require('../constants')

const getEndpoint = async (name) => {
  return (await axios.get(`${envConstants.SECRET_URI}/endpoint/${name}`)).data
}

module.exports = {
  getEndpoint
}
