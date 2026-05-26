import api from './api';

const transacaoService = {
  listar: () => api.get('/api/transacoes'),
  listarPorConta: (contaId) => api.get(`/api/transacoes/conta/${contaId}`),
  buscarPorId: (id) => api.get(`/api/transacoes/${id}`),
  criar: (transacao) => api.post('/api/transacoes', transacao),
  atualizar: (id, transacao) => api.put(`/api/transacoes/${id}`, transacao),
  deletar: (id) => api.delete(`/api/transacoes/${id}`)
};

export default transacaoService;