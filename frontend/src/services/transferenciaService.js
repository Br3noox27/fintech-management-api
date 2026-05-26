import api from './api';

const transferenciaService = {
  transferir: (dados) => api.post('/api/contas/transferir', dados),
};

export default transferenciaService;
