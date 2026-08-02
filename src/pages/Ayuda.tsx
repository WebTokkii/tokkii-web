import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faGamepad, faEnvelope, faInfoCircle, faPaperPlane, faBug, faLightbulb, faExchangeAlt, faPaperclip, faTrash } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabase';
import './Home.css';

interface AccordionItemProps {
    title: string;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, isOpen, onClick, children }) => {
    return (
        <div style={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
            padding: '1.1rem 0',
            transition: 'all 0.3s ease'
        }}>
            <button 
                onClick={onClick}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    padding: '0.2rem 0',
                    outline: 'none'
                }}
            >
                <span style={{ transition: 'color 0.2s ease' }} className="accordion-title-hover">{title}</span>
                <span style={{ 
                    fontSize: '1.4rem', 
                    color: 'var(--secondary)', 
                    fontWeight: 'bold',
                    transition: 'transform 0.2s ease',
                    transform: isOpen ? 'rotate(90deg)' : 'none'
                }}>
                    {isOpen ? '−' : '+'}
                </span>
            </button>
            <div style={{ 
                maxHeight: isOpen ? '500px' : '0', 
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0, 1, 0, 1)',
                opacity: isOpen ? 1 : 0
            }}>
                <div style={{ padding: '0.75rem 0 0.5rem', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const Ayuda: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    
    // Estados para colapsables (normas, FAQs y políticas)
    const [openNormaIdx, setOpenNormaIdx] = useState<number | null>(null);
    const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
    const [openPolicyIdx, setOpenPolicyIdx] = useState<number | null>(null);

    // Estados del formulario de reporte
    const [reportType, setReportType] = useState<string>('bug');
    const [description, setDescription] = useState<string>('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null);
    const [username, setUsername] = useState<string>('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async (sessionUser: any) => {
            if (!sessionUser) {
                setUsername('');
                return;
            }
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', sessionUser.id)
                    .single();
                if (data?.username) {
                    setUsername(data.username);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        // Obtener sesión activa
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            fetchProfile(session?.user ?? null);
        });

        // Escuchar cambios de sesión
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            fetchProfile(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedImages(prev => [...prev, ...files]);
            
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!description.trim()) {
            setSubmitStatus({ success: false, message: 'Por favor, describe detalladamente tu reporte.' });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            let imageUrls: string[] = [];

            // 1. Subir imágenes a R2 mediante la Edge Function 'clever-api'
            if (selectedImages.length > 0) {
                for (const image of selectedImages) {
                    const { data, error: uploadErr } = await supabase.functions.invoke('clever-api', {
                        body: { fileName: image.name, fileType: image.type }
                    });

                    if (uploadErr || !data) {
                        throw new Error(uploadErr ? uploadErr.message : 'Error generando presigned URL');
                    }

                    const uploadRes = await fetch(data.presignedUrl, {
                        method: 'PUT',
                        body: image,
                        headers: { 'Content-Type': image.type }
                    });

                    if (!uploadRes.ok) {
                        throw new Error(`Mala conexión con R2: ${uploadRes.statusText}`);
                    }

                    imageUrls.push(data.finalPublicUrl);
                }
            }

            // 2. Guardar reporte en Supabase con los URLs de R2 y el username
            const { error } = await supabase
                .from('user_reports')
                .insert({
                    user_id: user.id,
                    username: username || user?.user_metadata?.name || user?.user_metadata?.full_name || 'Desconocido',
                    report_type: reportType,
                    description: description.trim(),
                    images: imageUrls
                });

            if (error) throw error;

            setShowSuccessModal(true);
            setSubmitStatus({ success: true, message: '¡Tu reporte ha sido enviado con éxito!' });
            setDescription('');
            setSelectedImages([]);
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            setImagePreviews([]);
        } catch (err: any) {
            setSubmitStatus({ success: false, message: 'Error al enviar reporte: ' + err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleNorma = (idx: number) => {
        setOpenNormaIdx(prev => (prev === idx ? null : idx));
    };

    const toggleFaq = (idx: number) => {
        setOpenFaqIdx(prev => (prev === idx ? null : idx));
    };

    const togglePolicy = (idx: number) => {
        setOpenPolicyIdx(prev => (prev === idx ? null : idx));
    };

    return (
        <div className="ayuda-page fade-in" style={{ width: '100%' }}>
            <section className="home-section juegos-section-gradient" style={{ minHeight: 'auto', padding: '5rem 0', position: 'relative' }}>
                <div className="section-overlay" style={{ background: 'radial-gradient(circle, rgba(15, 2, 26, 0.35) 0%, rgba(15, 2, 26, 0.85) 100%)' }}></div>
                
                <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        
                        {/* Cabecera idéntica al estilo de Minijuegos */}
                        <article className="hero-main glass" style={{ margin: '0', textAlign: 'center', padding: '40px 34px', width: '100%' }}>
                            <div className="eyebrow" style={{ display: 'inline-flex', margin: '0 auto 18px' }}>
                                <span className="dot"></span>Soporte
                            </div>
                            <h1 style={{ margin: '0 auto 16px', maxWidth: 'none', fontSize: '3rem', fontWeight: 900 }}>Centro de Ayuda</h1>
                            <p style={{ margin: '0 auto', maxWidth: '650px', color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                                Normas oficiales, preguntas frecuentes y buzón de reporte y sugerencias.
                            </p>
                        </article>

                        {/* SECCIÓN 1: NORMAS DE LOS MINIJUEGOS */}
                        <div className="glass" style={{ padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                <FontAwesomeIcon icon={faGamepad} style={{ color: 'var(--secondary)' }} /> Normas de los Minijuegos
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <AccordionItem 
                                    title="¿Debo logearme en la web para realizar los minijuegos?" 
                                    isOpen={openNormaIdx === 0} 
                                    onClick={() => toggleNorma(0)}
                                >
                                    Sí, es totalmente obligatorio iniciar sesión con tu cuenta de Twitch. Esto nos permite asociar tus puntos diarios a tu usuario único en nuestra base de datos, resguardar tus estadísticas de racha diaria y evitar vulnerabilidades o spam de puntajes.
                                </AccordionItem>

                                <AccordionItem 
                                    title="¿Cuántas veces puedo jugar y sumar puntos al día?" 
                                    isOpen={openNormaIdx === 1} 
                                    onClick={() => toggleNorma(1)}
                                >
                                    Cada minijuego o trivia diaria (como Overwatch Quiz o Word Scramble) otorga puntos **solo en tu primera resolución exitosa del día**. Si vuelves a ingresar después de completarlo, el juego estará bloqueado y no sumará más puntos hasta el reinicio diario del servidor (a las 00:00 UTC).
                                </AccordionItem>

                                <AccordionItem 
                                    title="¿Cuál es la escala de puntaje y el tiempo límite?" 
                                    isOpen={openNormaIdx === 2} 
                                    onClick={() => toggleNorma(2)}
                                >
                                    Cada respuesta correcta en cualquier trivia te otorga exactamente **+3 puntos**. Tienes un temporizador individual de exactamente **15 segundos** para responder a cada pregunta. Si el tiempo expira, la pregunta se contará automáticamente como incorrecta.
                                </AccordionItem>

                                <AccordionItem 
                                    title="¿Cómo funciona la Racha Diaria (Streak)?" 
                                    isOpen={openNormaIdx === 3} 
                                    onClick={() => toggleNorma(3)}
                                >
                                    Si completas y respondes de manera correcta preguntas en los minijuegos activos en el transcurso del día, mantendrás activa tu racha diaria en tu perfil. Faltar un solo día a los desafíos diarios reseteará tu racha a cero. ¡Mantén la constancia para conseguir medallas especiales!
                                </AccordionItem>
                            </div>
                        </div>

                        {/* SECCIÓN 2: PREGUNTAS FRECUENTES (FAQ NAVEGACIÓN Y WEB) */}
                        <div className="glass" style={{ padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'var(--secondary)' }} /> Preguntas Frecuentes (FAQ)
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <AccordionItem 
                                    title="¿Qué son las 'Dinámicas' y cómo participo?" 
                                    isOpen={openFaqIdx === 0} 
                                    onClick={() => toggleFaq(0)}
                                >
                                    Las Dinámicas corresponden a eventos especiales organizados por EvilTokkii en sus streams (como la Ruleta de la Suerte o Sorteos Especiales). En la pestaña Dinámicas verás el progreso, las metas y los requisitos en tiempo real. Algunas dinámicas te pedirán canjear puntos de la web para participar.
                                </AccordionItem>

                                <AccordionItem 
                                    title="¿Dónde puedo visualizar mis estadísticas y puntaje total?" 
                                    isOpen={openFaqIdx === 1} 
                                    onClick={() => toggleFaq(1)}
                                >
                                    Una vez logeado, verás tu avatar y puntos en la barra de navegación superior. Al hacer clic en tu perfil, accederás al panel personal con tu historial diario de quizzes resueltos, medallas de racha de días y los puntos mensuales conseguidos.
                                </AccordionItem>

                                <AccordionItem 
                                    title="¿Cómo funciona el ranking del Templo de la Fama?" 
                                    isOpen={openFaqIdx === 2} 
                                    onClick={() => toggleFaq(2)}
                                >
                                    El Templo de la Fama lista a los 10 usuarios con mayor puntaje acumulado en el mes. La tabla se reinicia a cero el día 30 de cada mes, o el último día si el mes no llega a 30 días. Los finalistas del ranking mensual suelen recibir recompensas directas y roles honorarios en Discord.
                                </AccordionItem>
                            </div>
                        </div>

                        {/* SECCIÓN 3: CASILLA DE REPORTE Y SUGERENCIAS */}
                        <div className="glass" style={{ padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>
                                Reportar un Bug o Sugerencia
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                                ¿Encontraste algún error de código, link caído o tienes una idea para mejorar la plataforma? Envíanos tu reporte y el equipo lo revisará de inmediato.
                            </p>

                            {user ? (
                                <form onSubmit={handleSubmitReport} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Tipo de Reporte</label>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {[
                                                { id: 'bug', label: 'Bug / Error', icon: faBug },
                                                { id: 'sugerencia', label: 'Sugerencia', icon: faLightbulb },
                                                { id: 'cambio', label: 'Cambio Propuesto', icon: faExchangeAlt }
                                            ].map(t => {
                                                const isActive = reportType === t.id;
                                                return (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        onClick={() => setReportType(t.id)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            padding: '0.6rem 1.2rem',
                                                            borderRadius: '10px',
                                                            background: isActive 
                                                                ? 'linear-gradient(180deg, rgba(255, 255, 255, .04), rgba(255, 255, 255, .01))' 
                                                                : 'linear-gradient(180deg, rgba(255, 255, 255, .02), rgba(255, 255, 255, .005))',
                                                            border: isActive 
                                                                ? '1px solid rgba(255, 0, 115, 0.45)' 
                                                                : '1px solid rgba(233, 176, 255, 0.15)',
                                                            boxShadow: isActive ? '0 0 14px rgba(255, 0, 115, 0.22)' : 'none',
                                                            backdropFilter: 'blur(12px)',
                                                            WebkitBackdropFilter: 'blur(12px)',
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                            fontWeight: 600,
                                                            transition: 'all 0.25s ease'
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={t.icon} style={{ color: isActive ? 'var(--secondary)' : '#fff' }} />
                                                        {t.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Descripción detallada</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Por favor, explica paso a paso el problema o detalla tu sugerencia..."
                                            rows={5}
                                            style={{
                                                background: 'rgba(0,0,0,0.25)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                padding: '1rem',
                                                fontSize: '0.95rem',
                                                fontFamily: 'inherit',
                                                outline: 'none',
                                                resize: 'vertical',
                                                lineHeight: 1.5,
                                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)'
                                            }}
                                        />
                                    </div>

                                    {submitStatus && (
                                        <div style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            background: submitStatus.success ? 'rgba(0, 210, 127, 0.15)' : 'rgba(255, 77, 77, 0.15)',
                                            color: submitStatus.success ? '#00d27f' : '#ff4d4d',
                                            border: submitStatus.success ? '1px solid #00d27f' : '1px solid #ff4d4d'
                                        }}>
                                            {submitStatus.message}
                                        </div>
                                    )}

                                    {imagePreviews.length > 0 && (
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                                            {imagePreviews.map((preview, idx) => (
                                                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                    <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(idx)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '2px',
                                                            right: '2px',
                                                            background: 'rgba(255, 77, 77, 0.85)',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '20px',
                                                            height: '20px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleImageChange} 
                                        multiple 
                                        accept="image/*" 
                                        style={{ display: 'none' }} 
                                    />

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isSubmitting}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                padding: '0.8rem',
                                                fontSize: '0.95rem',
                                                fontWeight: 'bold',
                                                cursor: isSubmitting ? 'default' : 'pointer',
                                                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
                                                border: '1px solid rgba(233, 176, 255, 0.15)',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                transition: 'all 0.25s ease',
                                                opacity: isSubmitting ? 0.6 : 1
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPaperclip} />
                                            {selectedImages.length > 0 ? `Adjuntadas (${selectedImages.length})` : 'Adjuntar Capturas'}
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn primary"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                padding: '0.8rem',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                cursor: isSubmitting ? 'default' : 'pointer',
                                                opacity: isSubmitting ? 0.6 : 1,
                                                margin: 0
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                            {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ 
                                    textAlign: 'center', 
                                    padding: '2rem', 
                                    background: 'rgba(255,255,255,0.01)', 
                                    border: '1px dashed rgba(255,255,255,0.1)', 
                                    borderRadius: '16px' 
                                }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
                                        Debes iniciar sesión con tu cuenta de Twitch para poder enviar un reporte o sugerencia.
                                    </p>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 'bold' }}>
                                        🔒 Inicio de Sesión Requerido
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* SECCIÓN 4: POLÍTICAS Y PRIVACIDAD */}
                        <div className="glass" style={{ padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'var(--secondary)' }} /> Políticas y Privacidad
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <AccordionItem 
                                    title="1. Política de Privacidad Detallada" 
                                    isOpen={openPolicyIdx === 0} 
                                    onClick={() => togglePolicy(0)}
                                >
                                    En <strong>EvilTokkii</strong>, la privacidad de nuestros usuarios es una prioridad absoluta. Recopilamos nombres de usuario de Twitch y datos necesarios para la gestión segura de puntajes y recompensas. A través de <strong>Supabase</strong>, garantizamos que tus datos personales están cifrados y protegidos. <strong>Jamás venderemos ni compartiremos tu información con anunciantes o terceros.</strong>
                                </AccordionItem>

                                <AccordionItem 
                                    title="2. Términos y Condiciones de Participación" 
                                    isOpen={openPolicyIdx === 1} 
                                    onClick={() => togglePolicy(1)}
                                >
                                    El uso de este sitio implica el respeto absoluto de las normas de convivencia de la comunidad. Queda estrictamente prohibida la manipulación de resultados, el spam o el uso de múltiples cuentas para inflar puntajes o probabilidades en los sorteos. Los premios ganados en las dinámicas tienen un plazo de vencimiento de **7 días naturales** para ser reclamados por los canales oficiales (Discord o Twitch).
                                </AccordionItem>

                                <AccordionItem 
                                    title="3. Política de Cookies y Rastreo" 
                                    isOpen={openPolicyIdx === 2} 
                                    onClick={() => togglePolicy(2)}
                                >
                                    Utilizamos cookies técnicas necesarias exclusivamente para mantener tu inicio de sesión de Twitch activo y seguro. El reproductor incrustado de Twitch.tv puede instalar cookies analíticas propias para medir la audiencia de la transmisión. Puedes borrar o bloquear el almacenamiento de cookies en cualquier momento a través de la configuración de tu navegador.
                                </AccordionItem>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Modal Emergente de Agradecimiento por Reporte */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(8, 4, 13, 0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    zIndex: 999999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    animation: 'fadeIn 0.25s ease-out'
                }}>
                    <div className="glass" style={{
                        maxWidth: '480px',
                        width: '100%',
                        borderRadius: '24px',
                        padding: '2.25rem 2rem',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 0, 115, 0.3)',
                        background: 'linear-gradient(180deg, rgba(20, 12, 35, 0.98) 0%, rgba(10, 5, 18, 0.98) 100%)',
                        boxShadow: '0 0 40px rgba(255, 0, 115, 0.25)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(255, 0, 115, 0.15)',
                            border: '1px solid rgba(255, 0, 115, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                            color: '#FF0073',
                            boxShadow: '0 0 20px rgba(255, 0, 115, 0.4)'
                        }}>
                            💌
                        </div>

                        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                            ¡Reporte Enviado con Éxito!
                        </h3>

                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
                            Muchas gracias por enviarnos tus comentarios y ayudarnos a mejorar <strong>EvilTokkii</strong>. Un miembro del equipo de soporte revisará tu mensaje y te brindará respuesta breve en tu buzón de mensajes personal.
                        </p>

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="btn primary"
                            style={{
                                width: '100%',
                                marginTop: '0.75rem',
                                padding: '0.8rem',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 800,
                                cursor: 'pointer'
                            }}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ayuda;
