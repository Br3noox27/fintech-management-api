import api from './api';

const contaService = {
  listar: () => api.get('/api/contas'),
  listarPorUsuario: (usuarioId) => api.get(`/api/contas/usuario/${usuarioId}`),
  buscarPorId: (id) => api.get(`/api/contas/${id}`),
  criar: (conta) => api.post('/api/contas', conta),
  atualizar: (id, conta) => api.put(`/api/contas/${id}`, conta),
  deletar: (id) => api.delete(`/api/contas/${id}`),
  depositar: (id, dados) => api.post(`/api/contas/${id}/depositar`, dados),
  transferir: (dados) => api.post('/api/contas/transferir', dados),
};

export default contaService;