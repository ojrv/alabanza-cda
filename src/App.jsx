import { useState, useEffect } from 'react';
import LoginInstitucional from './LoginInstitucional';
import DashboardOperativo from './DashboardOperativo';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  return (
    <>
      {usuario ? (
        <DashboardOperativo />
      ) : (
        <LoginInstitucional />
      )}
    </>
  );
}

export default App;