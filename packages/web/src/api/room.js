import client from '../utils/client'

const create = (body) => client({url: 'room', method: 'POST', body});
const get = ({userId, room}) => client({url: `room/${userId}/${room}`, method: 'GET'});

export default {
  create,
  get
}
