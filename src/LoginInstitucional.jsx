import { useState } from 'react';
import { supabase } from './supabaseClient';
import './styles/estilos.css';
import logoCDA from './assets/logotipo_cda.png';

function LoginInstitucional() {
  const [alias, setAlias] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');

    const { data: usuario, error } = await supabase
      .from('usuario')
      .select('alias, nombreusuario, clave, nivelid, activo')
      .eq('alias', alias.trim().toLowerCase())
      .single();

    if (error || !usuario || !usuario.alias || !usuario.clave) {
      setMensaje('Alias no encontrado o datos incompletos');
      console.log('Respuesta incompleta:', usuario);
      return;
    }

    if (!usuario.activo) {
      setMensaje('Usuario inactivo');
      return;
    }

    if (usuario.clave !== clave) {
      setMensaje('Contraseña incorrecta');
      return;
    }

    const usuarioFinal = {
      alias: usuario.alias,
      nombre: usuario.nombreusuario || 'Sin nombre',
      nivelid: usuario.nivelid,
      activo: usuario.activo
    };

    localStorage.setItem('usuario', JSON.stringify(usuarioFinal));
    setMensaje('✅ Usuario validado. Redirigiendo...');

    switch (usuarioFinal.nivelid) {
      case 1:
        window.location.href = '/';
        break;
      case 2:
        window.location.href = '/';
        break;
      case 3:
        window.location.href = '/';
        break;
      default:
        setMensaje('Nivel no reconocido');
    }
  };

  return (
    <main>
      <header className="encabezado">
        <img src={logoCDA} alt="Logo institucional" />
        <h1>Grupo de Adoración y Alabanza</h1>
        <h2>Ingreso al sistema</h2>
      </header>

      <form className="formulario-dashboard" onSubmit={handleLogin}>
        <label>Alias institucional</label>
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>
        <p style={{ color: mensaje.includes('✅') ? 'green' : 'red' }}>{mensaje}</p>
      </form>
    </main>
  );
}

export default LoginInstitucional;