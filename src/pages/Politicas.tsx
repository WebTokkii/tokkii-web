import React from 'react';

const Politicas: React.FC = () => {
    return (
        <section className="section fade-in">
            <div className="container" style={{ maxWidth: '950px' }}>
                <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '3rem' }}>Textos Legales y Normativas</h1>

                {/* 1. POLÍTICA DE PRIVACIDAD */}
                <div className="glass" style={{ padding: '3.5rem', borderRadius: '32px', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ color: '#ff4d4d', marginBottom: '2rem', fontSize: '2.2rem' }}>1. Política de Privacidad Detallada</h2>

                    <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.9' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            En <strong>Tokkiixa</strong> (en adelante, "el Sitio"), la privacidad de nuestros usuarios es una prioridad absoluta. Esta Política de Privacidad explica detalladamente cómo recopilamos, procesamos y protegemos la información personal proporcionada voluntariamente por los usuarios a través de nuestras plataformas interactivas y formularios de participación.
                        </p>

                        <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem' }}>1.1. Recopilación de Información</h3>
                        <p style={{ marginBottom: '1rem' }}>Recopilamos información exclusivamente necesaria para el funcionamiento de nuestras actividades de comunidad:</p>
                        <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                            <li><strong>Identificadores Sociales:</strong> Nombres de usuario de Twitch, Discord, Instagram o X (Twitter) para verificar la identidad dentro de la comunidad.</li>
                            <li><strong>Datos de Localización (Solo para premios físicos):</strong> En casos estrictamente necesarios, se podrá solicitar ciudad o país para coordinar la logística de envíos.</li>
                            <li><strong>Información de Contacto:</strong> Direcciones de correo electrónico proporcionadas exclusivamente para comunicaciones directas sobre premios o soporte técnico.</li>
                        </ul>

                        <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem' }}>1.2. Uso de la Información</h3>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Cualquier dato recopilado se utiliza para: (a) Verificar la elegibilidad en sorteos y eventos en vivo; (b) Comunicar resultados de dinámicas ganadoras; (c) Mejorar la experiencia interactiva del Sitio; (d) Asegurar el cumplimiento de las normas de convivencia durante las transmisiones en Twitch.
                        </p>

                        <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem' }}>1.3. Seguridad y Protección</h3>
                        <p>
                            Implementamos medidas de seguridad técnicas avanzadas, incluyendo el uso de bases de datos seguras mediante <strong>Supabase</strong> y conexiones cifradas (SSL), para prevenir el acceso no autorizado, la alteración o la divulgación de tus datos personales. <strong>Jamás venderemos tus datos a empresas de terceros con fines publicitarios.</strong>
                        </p>
                    </div>
                </div>

                {/* 2. TÉRMINOS Y CONDICIONES */}
                <div className="glass" style={{ padding: '3.5rem', borderRadius: '32px', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ color: '#ff4d4d', marginBottom: '2rem', fontSize: '2.2rem' }}>2. Términos y Condiciones de Participación</h2>

                    <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.9' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            El acceso y uso de las herramientas de participación de Tokkiixa implica la aceptación total de los presentes términos. Si no estás de acuerdo con alguno de estos puntos, te pedimos que te abstengas de utilizar nuestros servicios de registro de eventos.
                        </p>

                        <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem' }}>2.1. Requisitos de Participación</h3>
                        <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                            <li>Los participantes deben cumplir con la edad mínima requerida por Twitch para el uso de su plataforma.</li>
                            <li>Es obligatorio mantener un comportamiento respetuoso; cualquier insulto o comportamiento tóxico anulará automáticamente cualquier derecho a reclamo de premios.</li>
                            <li>Está terminantemente prohibido el uso de múltiples cuentas ("bots") para inflar las probabilidades de ganar; el sistema cuenta con filtros de detección de IP y duplicados.</li>
                        </ul>

                        <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem' }}>2.2. Entrega de Premios y Plazos</h3>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Los premios ganados durante los streams o eventos especiales tienen un plazo de caducidad de <strong>7 días naturales</strong> para ser reclamados a través de los canales oficiales (Discord o formulario de contacto). Pasado este plazo, el premio se considerará desierto o se volverá a sortear.
                        </p>

                        <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem' }}>2.3. Limitación de Responsabilidad</h3>
                        <p>
                            Tokkiixa no se hace responsable por fallas técnicas ajenas (caídas de servidores de Twitch, problemas de conexión del usuario o errores en la infraestructura de Internet) que impidan la participación a tiempo en una dinámica activa.
                        </p>
                    </div>
                </div>

                {/* 3. POLÍTICA DE COOKIES */}
                <div className="glass" style={{ padding: '3.5rem', borderRadius: '32px', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ color: '#ff4d4d', marginBottom: '2rem', fontSize: '2.2rem' }}>3. Política de Cookies y Tecnologías de Rastreo</h2>

                    <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.9' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Para garantizar que el Sitio funcione correctamente, en ocasiones instalamos pequeños archivos de datos, conocidos como cookies, en tu dispositivo. La mayoría de los sitios web modernos hacen lo mismo.
                        </p>

                        <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem' }}>3.1. Cookies Técnicas (Necesarias)</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Son aquellas indispensables para que la web funcione. Incluyen cookies que te permiten iniciar sesión de forma segura y aquellas que guardan tu configuración de visualización o preferencias de reproductor de video.</p>

                        <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem' }}>3.2. Cookies de Terceros</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Al integrar reproductores externos como el de <strong>Twitch.tv</strong>, estas plataformas pueden instalar sus propias cookies para el análisis de audiencia y recordatorio de sesiones. Te sugerimos revisar las políticas de cookies de Twitch para más información.</p>

                        <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem' }}>3.3. Gestión del Consentimiento</h3>
                        <p>
                            Puedes borrar todas las cookies que ya están en tu ordenador y configurar la mayoría de los navegadores para que dejen de aceptarlas. Sin embargo, si lo haces, es posible que tengas que ajustar manualmente algunas preferencias cada vez que visites el Sitio y que algunos servicios no funcionen correctamente.
                        </p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '5rem', opacity: 0.4, fontSize: '0.8rem' }}>
                    <p>Tokkiixa Community © 2026 - Protegiendo la experiencia del usuario.</p>
                    <p>Este documento es vinculante y puede ser actualizado periódicamente para mejorar la transparencia.</p>
                </div>
            </div>
        </section>
    );
};

export default Politicas;
