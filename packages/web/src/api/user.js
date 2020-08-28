import client from '../utils/client'

const get = () => client({url: 'user', method: 'GET'});

export default {
  get
}
