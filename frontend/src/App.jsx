import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RotaProtegida from './components/RotaProtegida';

import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

import UsuarioList from './pages/UsuarioList';
import UsuarioForm from './pages/UsuarioForm';

import ContaList from './pages/ContaList';
import ContaForm from './pages/ContaForm';

import TransacaoList from './pages/TransacaoList';
import TransacaoForm from './pages/TransacaoForm';

import CartaoList from './pages/CartaoList';
import CartaoForm from './pages/CartaoForm';
import Transferencia from './pages/Transferencia';
import Extrato from './pages/Extrato';
import Deposito from './pages/Deposito';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/usuarios/novo" element={<UsuarioForm />} />

          <Route path="/" element={<RotaProtegida><Home /></RotaProtegida>} />

          {/* Usuários */}
          <Route path="/usuarios" element={<RotaProtegida><UsuarioList /></RotaProtegida>} />
          <Route path="/usuarios/editar/:id" element={<RotaProtegida><UsuarioForm /></RotaProtegida>} />

          {/* Contas */}
          <Route path="/contas" element={<RotaProtegida><ContaList /></RotaProtegida>} />
          <Route path="/contas/nova" element={<RotaProtegida><ContaForm /></RotaProtegida>} />
          <Route path="/contas/editar/:id" element={<RotaProtegida><ContaForm /></RotaProtegida>} />

          {/* Transações */}
          <Route path="/transacoes" element={<RotaProtegida><TransacaoList /></RotaProtegida>} />
          <Route path="/transacoes/nova" element={<RotaProtegida><TransacaoForm /></RotaProtegida>} />
          <Route path="/transacoes/editar/:id" element={<RotaProtegida><TransacaoForm /></RotaProtegida>} />

          {/* Cartões */}
          <Route path="/cartoes" element={<RotaProtegida><CartaoList /></RotaProtegida>} />
          <Route path="/cartoes/novo" element={<RotaProtegida><CartaoForm /></RotaProtegida>} />
          <Route path="/cartoes/editar/:id" element={<RotaProtegida><CartaoForm /></RotaProtegida>} />

          {/* Transferência, Depósito e Extrato */}
          <Route path="/transferir" element={<RotaProtegida><Transferencia /></RotaProtegida>} />
          <Route path="/depositar" element={<RotaProtegida><Deposito /></RotaProtegida>} />
          <Route path="/extrato" element={<RotaProtegida><Extrato /></RotaProtegida>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
