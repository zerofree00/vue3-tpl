import service from './../util/request.js'

export function getUser() {
  return service({
    url: '/users',
    method: 'get'
  })
}
export const recdelete = data => service.post('/api/recDoc/delete', data) //删除收文
