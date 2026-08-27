import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  Download, 
  Trash2, 
  ShieldAlert, 
  Sparkles, 
  X, 
  Maximize2, 
  Check, 
  Send, 
  Lock,
  UserCheck,
  Flame,
  Clock
} from 'lucide-react';

interface CommunityTierlist {
  id: string;
  game_type: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_role?: string;
  title?: string;
  image_url: string;
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  created_at: string;
}

interface CommentItem {
  id: string;
  tierlist_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_role?: string;
  comment: string;
  created_at: string;
}

interface CommunityTierlistsSectionProps {
  gameType: string; // 'overwatch', 'genshin', 'wuwa', 'dbd', etc.
  gameTitle: string;
  user: any;
  profile: any;
  onOpenLogin: () => void;
  refreshTrigger?: number;
}

const renderRoleBadge = (role?: string) => {
  if (!role) return null;
  if (role === 'streamer') {
    return <span style={{ padding: '2px 6px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', color: '#c084fc', fontSize: '0.65rem', fontWeight: 800 }}>STREAMER</span>;
  }
  if (role === 'webmaster') {
    return <span style={{ padding: '2px 6px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#4ade80', fontSize: '0.65rem', fontWeight: 800 }}>WEB</span>;
  }
  if (role === 'vip') {
    return <span style={{ padding: '2px 6px', borderRadius: '6px', background: 'rgba(255, 0, 115, 0.2)', border: '1px solid #ff0073', color: '#ff0073', fontSize: '0.65rem', fontWeight: 800 }}>VIP</span>;
  }
  return null;
};

export const CommunityTierlistsSection: React.FC<CommunityTierlistsSectionProps> = ({
  gameType,
  gameTitle,
  user,
  profile,
  onOpenLogin,
  refreshTrigger = 0
}) => {
  const [tierlists, setTierlists] = useState<CommunityTierlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSort, setFilterSort] = useState<'recent' | 'top'>('recent');
  
  // User reactions state: { [tierlistId]: 'like' | 'dislike' }
  const [userReactions, setUserReactions] = useState<Record<string, 'like' | 'dislike'>>({});
  
  // Modal State for HD View and Comments
  const [selectedTierlist, setSelectedTierlist] = useState<CommunityTierlist | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isBannedUser, setIsBannedUser] = useState(false);

  const isAdmin = profile?.role === 'streamer' || profile?.role === 'webmaster' || user?.email === 'pamacheyt@gmail.com';

  // Check if current user is banned
  useEffect(() => {
    if (!user) {
      setIsBannedUser(false);
      return;
    }
    const checkBan = async () => {
      try {
        const { data } = await supabase
          .from('banned_community_users')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        setIsBannedUser(!!data);
      } catch (err) {
        console.warn("Check ban note:", err);
      }
    };
    checkBan();
  }, [user]);

  // Fetch Community Tierlists for this Game
  const fetchTierlists = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('community_tierlists')
        .select('*')
        .eq('game_type', gameType)
        .eq('is_banned', false);

      if (filterSort === 'top') {
        query = query.order('likes_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Table community_tierlists might not exist yet:", error.message);
        setTierlists([]);
      } else {
        setTierlists(data || []);
      }
    } catch (err) {
      console.error("Error fetching community tierlists:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch User Reactions
  const fetchUserReactions = async () => {
    if (!user) {
      setUserReactions({});
      return;
    }
    try {
      const { data, error } = await supabase
        .from('community_tierlist_reactions')
        .select('tierlist_id, reaction_type')
        .eq('user_id', user.id);

      if (!error && data) {
        const map: Record<string, 'like' | 'dislike'> = {};
        data.forEach(r => {
          map[r.tierlist_id] = r.reaction_type as 'like' | 'dislike';
        });
        setUserReactions(map);
      }
    } catch (e) {
      console.warn("Error fetching user reactions:", e);
    }
  };

  useEffect(() => {
    fetchTierlists();
  }, [gameType, filterSort, refreshTrigger]);

  useEffect(() => {
    fetchUserReactions();
  }, [user, gameType]);

  // Handle Like / Dislike reaction
  const handleReaction = async (tierlist: CommunityTierlist, type: 'like' | 'dislike', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user) {
      onOpenLogin();
      return;
    }
    if (isBannedUser) {
      alert("⚠️ Tu cuenta está suspendida de la comunidad por infracción de normas.");
      return;
    }

    const currentReaction = userReactions[tierlist.id];
    let newReaction: 'like' | 'dislike' | null = type;

    // If clicking the same, remove reaction
    if (currentReaction === type) {
      newReaction = null;
    }

    // Optimistic UI Update
    setTierlists(prev => prev.map(item => {
      if (item.id !== tierlist.id) return item;
      let likes = item.likes_count;
      let dislikes = item.dislikes_count;

      if (currentReaction === 'like') likes--;
      if (currentReaction === 'dislike') dislikes--;

      if (newReaction === 'like') likes++;
      if (newReaction === 'dislike') dislikes++;

      return {
        ...item,
        likes_count: Math.max(0, likes),
        dislikes_count: Math.max(0, dislikes)
      };
    }));

    setUserReactions(prev => {
      const copy = { ...prev };
      if (newReaction) {
        copy[tierlist.id] = newReaction;
      } else {
        delete copy[tierlist.id];
      }
      return copy;
    });

    try {
      if (newReaction) {
        await supabase
          .from('community_tierlist_reactions')
          .upsert({
            tierlist_id: tierlist.id,
            user_id: user.id,
            user_name: profile?.username || user.user_metadata?.full_name || 'Viewer',
            reaction_type: newReaction,
            created_at: new Date().toISOString()
          }, { onConflict: 'tierlist_id,user_id' });
      } else {
        await supabase
          .from('community_tierlist_reactions')
          .delete()
          .match({ tierlist_id: tierlist.id, user_id: user.id });
      }

      // Update total counts on tierlist
      const { count: likeCount } = await supabase
        .from('community_tierlist_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('tierlist_id', tierlist.id)
        .eq('reaction_type', 'like');

      const { count: dislikeCount } = await supabase
        .from('community_tierlist_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('tierlist_id', tierlist.id)
        .eq('reaction_type', 'dislike');

      await supabase
        .from('community_tierlists')
        .update({
          likes_count: likeCount || 0,
          dislikes_count: dislikeCount || 0
        })
        .eq('id', tierlist.id);

    } catch (err) {
      console.error("Error saving reaction:", err);
      fetchTierlists();
    }
  };

  // Fetch comments for selected tierlist
  const fetchComments = async (tierlistId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_tierlist_comments')
        .select('*')
        .eq('tierlist_id', tierlistId)
        .eq('is_banned', false)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setComments(data);
      }
    } catch (e) {
      console.warn("Error fetching comments:", e);
    }
  };

  const handleOpenModal = (tierlist: CommunityTierlist) => {
    setSelectedTierlist(tierlist);
    fetchComments(tierlist.id);
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenLogin();
      return;
    }
    if (isBannedUser) {
      alert("⚠️ Tu cuenta está suspendida de la comunidad.");
      return;
    }
    if (!newComment.trim() || !selectedTierlist) return;

    setSubmittingComment(true);
    const userName = profile?.username || user.user_metadata?.full_name || user.user_metadata?.name || 'Viewer';
    const userAvatar = profile?.avatar_url || user.user_metadata?.avatar_url || '';
    const userRole = profile?.role || 'usuario';

    try {
      const { data, error } = await supabase
        .from('community_tierlist_comments')
        .insert([{
          tierlist_id: selectedTierlist.id,
          user_id: user.id,
          user_name: userName,
          user_avatar: userAvatar,
          user_role: userRole,
          comment: newComment.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setComments(prev => [...prev, data]);
        setNewComment('');
        // Increment comment count
        await supabase
          .from('community_tierlists')
          .update({ comments_count: (selectedTierlist.comments_count || 0) + 1 })
          .eq('id', selectedTierlist.id);

        setTierlists(prev => prev.map(t => t.id === selectedTierlist.id ? { ...t, comments_count: (t.comments_count || 0) + 1 } : t));
      }
    } catch (err: any) {
      alert("Error al enviar comentario: " + err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Moderation: Delete Tierlist
  const handleDeleteTierlist = async (tierlistId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("¿Seguro que deseas eliminar permanentemente esta Tierlist de la comunidad?")) return;

    try {
      await supabase.from('community_tierlists').delete().eq('id', tierlistId);
      setTierlists(prev => prev.filter(t => t.id !== tierlistId));
      if (selectedTierlist?.id === tierlistId) setSelectedTierlist(null);
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  // Moderation: Delete Comment
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("¿Eliminar este comentario?")) return;
    try {
      await supabase.from('community_tierlist_comments').delete().eq('id', commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err: any) {
      alert("Error al eliminar comentario: " + err.message);
    }
  };

  // Moderation: Ban User
  const handleBanUser = async (targetUserId: string, targetUserName: string) => {
    const reason = window.prompt(`¿Razón del baneo a @${targetUserName}? (Se ocultarán sus comentarios y tierlists)`);
    if (reason === null) return;

    try {
      await supabase.from('banned_community_users').insert([{
        user_id: targetUserId,
        user_name: targetUserName,
        reason: reason || 'Infracción de normas de la comunidad',
        banned_by: profile?.username || 'Admin'
      }]);

      // Hide all content from banned user
      await supabase.from('community_tierlists').update({ is_banned: true }).eq('user_id', targetUserId);
      await supabase.from('community_tierlist_comments').update({ is_banned: true }).eq('user_id', targetUserId);

      setTierlists(prev => prev.filter(t => t.user_id !== targetUserId));
      setComments(prev => prev.filter(c => c.user_id !== targetUserId));
      alert(`🚫 Usuario @${targetUserName} baneado con éxito.`);
    } catch (err: any) {
      alert("Error al banear usuario: " + err.message);
    }
  };

  return (
    <section className="community-tierlists-container" style={{ marginTop: '50px', width: '100%' }}>
      
      {/* Header de la Sección */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(233, 176, 255, 0.15)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ padding: '4px 10px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Comunidad
            </span>
            <h3 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              Tierlists de la Comunidad ({gameTitle})
            </h3>
          </div>
          <p style={{ margin: '6px 0 0 0', color: '#cbd5e1', fontSize: '0.92rem' }}>
            Explora las tierlists creadas por la gente, comenta y deja tu <strong>like o dislike</strong> 👍👎
          </p>
        </div>

        {/* Filtros de Orden */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            type="button"
            onClick={() => setFilterSort('recent')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: filterSort === 'recent' ? 'var(--primary, #9146FF)' : 'transparent',
              color: filterSort === 'recent' ? '#fff' : 'var(--text-muted, #94a3b8)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <Clock size={14} /> Recientes
          </button>
          <button
            type="button"
            onClick={() => setFilterSort('top')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: filterSort === 'top' ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : 'transparent',
              color: filterSort === 'top' ? '#fff' : 'var(--text-muted, #94a3b8)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <Flame size={14} /> Más Votadas
          </button>
        </div>
      </div>

      {/* Grid de Tierlists de la Comunidad */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <Sparkles size={32} className="animate-spin" style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
          <p>Cargando tierlists de la comunidad...</p>
        </div>
      ) : tierlists.length === 0 ? (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(233, 176, 255, 0.2)',
          borderRadius: '20px'
        }}>
          <Sparkles size={40} color="#a855f7" style={{ marginBottom: '12px', opacity: 0.6 }} />
          <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '1.2rem' }}>¡Sé el primero en compartir su Tierlist de {gameTitle}!</h4>
          <p style={{ margin: '0 0 16px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
            Arma tu clasificación arriba y pulsa el botón <strong>"Publicar en la Comunidad"</strong> para que todos la vean.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {tierlists.map(tierlist => {
            const userReaction = userReactions[tierlist.id];
            return (
              <div 
                key={tierlist.id}
                className="community-tierlist-card"
                onClick={() => handleOpenModal(tierlist)}
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.7))',
                  border: '1px solid rgba(233, 176, 255, 0.15)',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                  e.currentTarget.style.boxShadow = '0 14px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(168, 85, 247, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(233, 176, 255, 0.15)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.35)';
                }}
              >
                {/* Imagen Preview de la Tierlist */}
                <div style={{ width: '100%', height: '180px', background: '#0a0512', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={tierlist.image_url} 
                    alt={tierlist.title || `Tierlist de ${tierlist.user_name}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.72rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Maximize2 size={12} /> Ver HD
                  </div>
                </div>

                {/* Info del Creador y Título */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tierlist.title || `Tierlist de ${gameTitle}`}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {tierlist.user_avatar ? (
                        <img src={tierlist.user_avatar} referrerPolicy="no-referrer" alt="" style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
                      ) : (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary)' }} />
                      )}
                      <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>
                        @{tierlist.user_name}
                      </span>
                      {renderRoleBadge(tierlist.user_role)}
                    </div>
                  </div>

                  {/* Barra de Reacciones: Like, Dislike, Comentarios */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {/* Botón Like */}
                      <button
                        type="button"
                        onClick={(e) => handleReaction(tierlist, 'like', e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          background: userReaction === 'like' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: userReaction === 'like' ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: userReaction === 'like' ? '#4ade80' : 'var(--text-muted, #94a3b8)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        title={user ? "Me gusta" : "Inicia sesión con Twitch para dar like"}
                      >
                        <ThumbsUp size={14} fill={userReaction === 'like' ? '#4ade80' : 'none'} />
                        <span>{tierlist.likes_count || 0}</span>
                      </button>

                      {/* Botón Dislike */}
                      <button
                        type="button"
                        onClick={(e) => handleReaction(tierlist, 'dislike', e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          background: userReaction === 'dislike' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: userReaction === 'dislike' ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: userReaction === 'dislike' ? '#f87171' : 'var(--text-muted, #94a3b8)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        title={user ? "No me gusta" : "Inicia sesión con Twitch para dar dislike"}
                      >
                        <ThumbsDown size={14} fill={userReaction === 'dislike' ? '#f87171' : 'none'} />
                        <span>{tierlist.dislikes_count || 0}</span>
                      </button>
                    </div>

                    {/* Botón Comentarios */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.82rem', fontWeight: 600 }}>
                      <MessageSquare size={14} />
                      <span>{tierlist.comments_count || 0}</span>
                    </div>

                    {/* Botón Eliminar si es Admin */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteTierlist(tierlist.id, e)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', opacity: 0.7 }}
                        title="Eliminar como Moderador"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal HD View + Panel de Comentarios */}
      {selectedTierlist && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}
          onClick={() => setSelectedTierlist(null)}
        >
          <div 
            style={{
              background: '#0d1117',
              border: '1px solid rgba(233, 176, 255, 0.3)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '1100px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'row',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
              flexWrap: 'wrap'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lado Izquierdo: Imagen en HD */}
            <div style={{
              flex: '1 1 580px',
              minWidth: '320px',
              background: '#05070a',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              position: 'relative'
            }}>
              <img 
                src={selectedTierlist.image_url} 
                alt={selectedTierlist.title || 'Tierlist'} 
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '12px' }}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <a 
                  href={selectedTierlist.image_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download={`tierlist_${gameType}.png`}
                  className="btn"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Descargar Imagen
                </a>
              </div>
            </div>

            {/* Lado Derecho: Comentarios y Detalles */}
            <div style={{
              flex: '1 1 380px',
              minWidth: '300px',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '85vh'
            }}>
              {/* Header Modal */}
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 800 }}>
                    {selectedTierlist.title || `Tierlist de ${gameTitle}`}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    {selectedTierlist.user_avatar ? (
                      <img src={selectedTierlist.user_avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)' }} />
                    )}
                    <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 700 }}>
                      @{selectedTierlist.user_name}
                    </span>
                    {renderRoleBadge(selectedTierlist.user_role)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTierlist(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Lista de Comentarios */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {comments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                    <MessageSquare size={32} opacity={0.3} style={{ margin: '0 auto 8px auto' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Aún no hay comentarios.</p>
                    <small>¡Sé el primero en dejar tu opinión sobre esta tierlist!</small>
                  </div>
                ) : (
                  comments.map(c => (
                    <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {c.user_avatar && <img src={c.user_avatar} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />}
                          <strong style={{ fontSize: '0.85rem', color: '#f1f5f9' }}>@{c.user_name}</strong>
                          {renderRoleBadge(c.user_role)}
                        </div>
                        
                        {/* Acciones de Moderador */}
                        {isAdmin && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(c.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                              title="Eliminar Comentario"
                            >
                              <Trash2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBanUser(c.user_id, c.user_name)}
                              style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', padding: '2px' }}
                              title="Banear a este usuario de la comunidad"
                            >
                              <ShieldAlert size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, wordBreak: 'break-word' }}>
                        {c.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Formulario para Comentar (Solo usuarios logueados con Twitch) */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
                {!user ? (
                  <div style={{ textAlign: 'center', padding: '6px 0' }}>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 8px 0' }}>
                      Debes iniciar sesión con Twitch para poder comentar y reaccionar.
                    </p>
                    <button
                      type="button"
                      className="btn primary"
                      onClick={onOpenLogin}
                      style={{ padding: '8px 16px', fontSize: '0.82rem', width: '100%', borderRadius: '8px' }}
                    >
                      <Lock size={14} style={{ marginRight: '6px' }} /> Iniciar Sesión con Twitch
                    </button>
                  </div>
                ) : isBannedUser ? (
                  <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
                    ⚠️ Tu cuenta ha sido bloqueada para comentar por infringir las normas.
                  </div>
                ) : (
                  <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="Escribe tu comentario respetuoso..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                    />
                    <button
                      type="submit"
                      className="btn primary"
                      disabled={submittingComment || !newComment.trim()}
                      style={{ padding: '0 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Send size={14} /> Enviar
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default CommunityTierlistsSection;
