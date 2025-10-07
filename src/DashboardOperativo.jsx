import { useEffect, useState } from 'react';
import './styles/panel.css';
import './styles/layout.css';
import './styles/sesion.css'; // cuando lo tengamos listo
import logoCDA from './assets/logotipo_cda.png';
import { supabase } from './supabaseClient';

function DashboardOperativo() {
  const [nivel, setNivel] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [bloques, setBloques] = useState([]);
  const [funcionesPorBloque, setFuncionesPorBloque] = useState({});

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const u = JSON.parse(usuarioGuardado);
      setUsuario(u);

      switch (u.nivelid) {
        case 1:
          setNivel('admin');
          break;
        case 2:
          setNivel('editor');
          break;
        case 3:
          setNivel('lector');
          break;
        default:
          setNivel('visitante');
      }
    } else {
      setNivel('visitante');
    }

    const ahora = new Date();
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    setFecha(ahora.toLocaleDateString('es-ES', opcionesFecha));

    const actualizarHora = () => {
      const ahora = new Date();
      const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      setHora(ahora.toLocaleTimeString('es-ES', opcionesHora));
    };

    actualizarHora();
    const intervalo = setInterval(actualizarHora, 1000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.nivelid) return;

    const cargarBloquesYFunciones = async () => {
      const { data: bloquesActivos, error: errorBloques } = await supabase
        .from('bloque_funciones')
        .select('idbloque, titulo')
        .eq('activo', true)
        .order('orden', { ascending: true });

      if (errorBloques || !bloquesActivos) {
        console.error('Error al cargar bloques:', errorBloques);
        return;
      }

      const { data: funcionesVisibles, error: errorFunciones } = await supabase
        .from('funciones')
        .select('idfuncion, nombre, modulo, bloqueid, nivelminimo, activo')
        .order('orden', { ascending: true });

      if (errorFunciones || !funcionesVisibles) {
        console.error('Error al cargar funciones:', errorFunciones);
        return;
      }

      const funcionesFiltradas = funcionesVisibles.filter(
        (f) => (f.activo === true || f.activo === null) && f.nivelminimo <= usuario.nivelid
      );

      const funcionesAgrupadas = {};
      bloquesActivos.forEach((bloque) => {
        funcionesAgrupadas[bloque.idbloque] = funcionesFiltradas.filter(
          (f) => f.bloqueid === bloque.idbloque
        );
      });

      setBloques(bloquesActivos);
      setFuncionesPorBloque(funcionesAgrupadas);
    };

    cargarBloquesYFunciones();
  }, [usuario]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    window.location.reload();
  };

  const formatearNombre = (nombre) => {
    if (!nombre) return '';
    return nombre
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="envoltorio">
      <header className="encabezado">
        <img src={logoCDA} alt="Logo institucional" />
        <h1>Iglesia Casa del Alfarero</h1>
        <h2>Grupo de Adoración y Alabanza</h2>
      </header>

      <div id="infoSesion">
        <p><span className="icono usuario"></span><strong>{usuario?.nombre || 'Visitante'}</strong></p>
        <p><span className="icono rol"></span><strong>{nivel}</strong></p>
        <p><span className="icono fecha"></span><strong>{fecha}</strong></p>
        <p><span className="icono hora"></span><strong>{hora}</strong></p>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      <main style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ maxWidth: '700px', width: '100%', padding: '1em', boxSizing: 'border-box' }}>
          <h3 style={{ textAlign: 'center', color: '#b8860b' }}>Panel de funciones por bloque</h3>
          <p style={{ fontSize: '0.9em', color: '#999', textAlign: 'center' }}>
            Funciones visibles: {Object.values(funcionesPorBloque).flat().length}
          </p>
          <div id="panelFuncionesPorRol">
            {bloques
              .filter((bloque) => funcionesPorBloque[bloque.idbloque]?.length > 0)
              .map((bloque) => (
                <div key={bloque.idbloque} className="bloque-rol">
                  <h4>{bloque.titulo}</h4>
                  {funcionesPorBloque[bloque.idbloque].map((f) => (
                    <button
                      key={f.idfuncion}
                      className="boton-funcion"
                      disabled
                      style={{ marginBottom: '8px' }}
                    >
                      {formatearNombre(f.nombre)}
                    </button>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardOperativo;