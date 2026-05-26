import api from './api';

const cartaoService = {
  listar: () => api.get('/api/cartoes'),
  listarPorUsuario: (usuarioId) => api.get(`/api/cartoes/usuario/${usuarioId}`),
  buscarPorId: (id) => api.get(`/api/cartoes/${id}`),
  criar: (cartao) => api.post('/api/cartoes', cartao),
  atualizar: (id, cartao) => api.put(`/api/cartoes/${id}`, cartao),
  deletar: (id) => api.delete(`/api/cartoes/${id}`)
};

export default cartaoService;
