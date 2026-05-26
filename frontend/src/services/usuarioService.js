import api from './api';


const RotaApiUsuario = '/api/usuarios';

const usuarioService = {
  listar: () => api.get(RotaApiUsuario),
  buscarPorId: (id) => api.get(`${RotaApiUsuario}/${id}`),
  criar: (usuario) => api.post(RotaApiUsuario, usuario),
  atualizar: (id, usuario) => api.put(`${RotaApiUsuario}/${id}`, usuario),
  deletar: (id) => api.delete(`${RotaApiUsuario}/${id}`),
  login: (email, senha) => api.post(`${RotaApiUsuario}/login`, { email, senha })
};

export default usuarioService;