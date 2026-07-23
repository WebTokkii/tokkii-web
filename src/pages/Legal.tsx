import React, { useState } from 'react';
import { ShieldCheck, Scale, FileText, Lock, AlertTriangle, Mail } from 'lucide-react';

const Legal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminos' | 'privacidad' | 'dmca'>('terminos');

  return (
    <div className="app-container" style={{ minHeight: '85vh', padding: '3rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header Legal */}
      <article className="hero-main glass" style={{ textAlign: 'center', padding: '40px 24px', marginBottom: '2.5rem' }}>
        <div className="eyebrow" style={{ display: 'inline-flex', margin: '0 auto 16px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', color: '#00e5ff' }}>
          <ShieldCheck size={16} /> Términos Legales & Protección de Derechos
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '12px' }}>Aviso Legal, Privacidad y Política DMCA</h1>
        <p style={{ color: 'var(--muted)', maxWidth: '750px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
          Conoce en detalle los términos de servicio, uso de contenido de terceros bajo el marco de Uso Justo (Fair Use), tratamiento de datos personales y nuestro procedimiento expreso de atención a reclamos de derechos de autor.
        </p>
      </article>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('terminos')}
          style={{
            padding: '12px 24px',
            borderRadius: '14px',
            border: activeTab === 'terminos' ? '2px solid #00e5ff' : '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'terminos' ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.03)',
            color: activeTab === 'terminos' ? '#00e5ff' : 'var(--muted)',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Scale size={18} /> Términos de Servicio y Uso Justo
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('privacidad')}
          style={{
            padding: '12px 24px',
            borderRadius: '14px',
            border: activeTab === 'privacidad' ? '2px solid #00d27f' : '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'privacidad' ? 'rgba(0, 210, 127, 0.15)' : 'rgba(255,255,255,0.03)',
            color: activeTab === 'privacidad' ? '#00d27f' : 'var(--muted)',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Lock size={18} /> Política de Privacidad
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dmca')}
          style={{
            padding: '12px 24px',
            borderRadius: '14px',
            border: activeTab === 'dmca' ? '2px solid #ff4d4d' : '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'dmca' ? 'rgba(255, 77, 77, 0.15)' : 'rgba(255,255,255,0.03)',
            color: activeTab === 'dmca' ? '#ff4d4d' : 'var(--muted)',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <AlertTriangle size={18} /> Protocolo DMCA / Retiro de Contenido
        </button>
      </div>

      {/* TABS CONTENT */}
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>

        {/* TAB 1: TERMINOS DE SERVICIO & FAIR USE */}
        {activeTab === 'terminos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ color: '#00e5ff', fontSize: '1.8rem', margin: 0, fontWeight: 900 }}>
              1. Términos de Servicio y Propiedad Intelectual de Terceros
            </h2>

            <p>
              El sitio web <strong>EvilTokkii</strong> (en adelante, "la Plataforma") opera como un portal independiente de entretenimiento, noticias, actividades interactivas, trivias y difusión para la comunidad gaming. Al acceder o utilizar la Plataforma, aceptas expresamente cumplir con las condiciones estipuladas en este documento.
            </p>

            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '1rem' }}>1.1. Uso de Contenido de Terceros y Marcas Registradas</h3>
            <p>
              La Plataforma hace referencia, muestra y utiliza nombres, logotipos, carátulas, imágenes promocionales, fragmentos audiovisuales y marcas registradas pertenecientes a diversas empresas de entretenimiento, distribuidores y desarrolladores de videojuegos (incluyendo, entre otros: Nintendo Co., Ltd., Sony Interactive Entertainment, Microsoft Corporation, Ubisoft, Activision Blizzard, Electronic Arts, Capcom, Bandai Namco, etc.).
            </p>
            <div style={{ background: 'rgba(0, 229, 255, 0.06)', borderLeft: '4px solid #00e5ff', padding: '1rem', borderRadius: '8px' }}>
              <strong>Declaración Expresa de No Afiliación:</strong> EvilTokkii es un proyecto fan-made independiente y <strong>NO posee ningún vínculo, patrocinio, afiliación, aprobación oficial ni licencia directa</strong> otorgada por ninguna de las marcas o empresas de videojuegos mencionadas. Todas las marcas registradas, nombres comercializados y contenidos protegidos son propiedad exclusiva de sus respectivos dueños.
            </div>

            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '1rem' }}>1.2. Doctrina de Uso Justo (Fair Use Disclaimer)</h3>
            <p>
              El material visual y promocional desplegado en nuestras trivias, minijuegos y artículos informativos (tales como portadas sin logos, siluetas, marcas corporativas o fragmentos de sonido) tiene como **único propósito** la transformación con fines educativos, informativos, de trivia temática, crítica y entretenimiento interactivo comunitario. Dicho uso se ampara bajo los principios universales de <strong>Fair Use (Uso Justo)</strong> estipulados en la legislación internacional y la Sección 107 del Acto de Derechos de Autor (Copyright Act).
            </p>

            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '1rem' }}>1.3. Limitación de Responsabilidad</h3>
            <p>
              EvilTokkii y sus administradores no asumen responsabilidad alguna por pérdidas, daños emergentes o disputas derivadas de la interrupción del servicio, cambios en API de terceros, o de la visualización de contenidos. El sistema de puntos e incentivos dentro de los minijuegos carece de valor monetario en el mercado real y no constituye un sistema de apuestas de dinero ni juego de azar regulado.
            </p>
          </div>
        )}

        {/* TAB 2: POLITICA DE PRIVACIDAD */}
        {activeTab === 'privacidad' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ color: '#00d27f', fontSize: '1.8rem', margin: 0, fontWeight: 900 }}>
              2. Política de Privacidad y Tratamiento de Datos
            </h2>

            <p>
              Nos tomamos muy en serio la privacidad de nuestros usuarios y visitantes. Esta política describe la información que recopilamos, cómo se utiliza y cómo se protege dentro de nuestra plataforma.
            </p>

            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '1rem' }}>2.1. Información Recopilada</h3>
            <p>
              • <strong>Autenticación con Twitch:</strong> Cuando inicias sesión mediante OAuth2 con Twitch o proveedores compatibles, únicamente recibimos tu identificador público (`user_id`), nombre de usuario (`username`) y la URL de tu avatar público.<br/>
              • <strong>Progreso e Historial de Minijuegos:</strong> Guardamos de forma segura las puntuaciones, registros diarios de partidas e historial de puntos para actualizar el marcador global comunitarios.<br/>
              • <strong>Datos Técnicos Anónimos:</strong> Podremos utilizar contadores estadísticos estándar (Google Analytics / Cloudflare Web Analytics) para analizar el volumen de tráfico sin almacenar cookies invasivas ni vender datos personales.
            </p>

            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '1rem' }}>2.2. No Comercialización de Datos</h3>
            <div style={{ background: 'rgba(0, 210, 127, 0.08)', borderLeft: '4px solid #00d27f', padding: '1rem', borderRadius: '8px' }}>
              <strong>Compromiso Absoluto:</strong> EvilTokkii <strong>NUNCA venderá, alquilará, compartirá ni transferirá información personal</strong> o identificadores de usuarios a agencias publicitarias, brokers de datos o terceros comerciales.
            </div>

            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '1rem' }}>2.3. Control de Tu Cuenta y Eliminación de Datos</h3>
            <p>
              Cualquier usuario tiene derecho a solicitar la desvinculación de su cuenta o la eliminación completa de sus puntuaciones e historial en la plataforma enviando una solicitud mediante nuestros canales de contacto en Discord u oficiales.
            </p>
          </div>
        )}

        {/* TAB 3: POLITICA DMCA & REGLAMENTO DE RETIRO */}
        {activeTab === 'dmca' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ color: '#ff4d4d', fontSize: '1.8rem', margin: 0, fontWeight: 900 }}>
              3. Protocolo de Notificación DMCA y Retiro Expreso de Contenido
            </h2>

            <p>
              EvilTokkii respeta y promueve activamente los derechos de propiedad intelectual de los creadores, titulares y desarrolladores. Contamos con una política estricta de cooperación para la rápida remoción de cualquier contenido que infrinja derechos de autor legítimos.
            </p>

            <div style={{ background: 'rgba(255, 77, 77, 0.08)', border: '1px solid rgba(255, 77, 77, 0.3)', padding: '1.25rem', borderRadius: '16px' }}>
              <h3 style={{ color: '#ff4d4d', margin: '0 0 10px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} /> Procedimiento de Retiro Inmediato (Take-Down Notice)
              </h3>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                Si eres el titular legítimo de los derechos de autor (o representante legal autorizado) de alguna imagen, logotipo, carátula o fragmento presente en nuestras trivias o secciones, y deseas que sea eliminado, <strong>atenderemos y eliminaremos dicho material en un plazo máximo de 24 a 48 horas laborales</strong> sin necesidad de disputas ni trámites burocráticos.
              </p>
            </div>

            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '1rem' }}>3.1. Requisitos para enviar una Notificación de Infracción</h3>
            <p>Para procesar tu solicitud con celeridad, la notificación enviada debe incluir:</p>
            <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Identificación precisa de la obra protegida por derechos de autor que se alega infringida.</li>
              <li>Identificación del enlace exacto (URL o ID del minijuego/imagen) dentro de nuestra Plataforma donde reside el material.</li>
              <li>Información de contacto razonable (Dirección de correo electrónico, nombre o entidad).</li>
              <li>Una declaración de que se cree de buena fe que el uso del material no está autorizado por el titular de los derechos de autor o la ley.</li>
            </ol>

            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '1rem' }}>3.2. Canales Directos de Atención Legal / DMCA</h3>
            <p>Puedes enviar tus notificaciones directamente a cualquiera de nuestros canales oficiales:</p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '8px' }}>
              <a
                href="https://discord.com/invite/Kxvw4KfSBF"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'rgba(88, 101, 242, 0.2)',
                  border: '1px solid rgba(88, 101, 242, 0.4)',
                  color: '#5865F2',
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}
              >
                💬 Ticket en Servidor de Discord
              </a>

              <a
                href="https://x.com/EvilTokkii"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}
              >
                🌐 Mensaje Directo en X / Twitter (@EvilTokkii)
              </a>
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--muted)' }}>
              Última actualización de Términos, Privacidad y DMCA: Julio de 2026.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Legal;
