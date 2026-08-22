import React, { useState, useEffect, useRef } from 'react';
import { 
  GENSHIN_CHARACTERS
} from '../data/GenshinDb';
import {
  WUTHERING_WAVES_CHARACTERS
} from '../data/WutheringWavesDb';
import {
  OVERWATCH_CHARACTERS
} from '../data/OverwatchDb';
import {
  DBD_CHARACTERS
} from '../data/DbdDb';
import './TierList.css';
interface Character {
  id: string;
  name: string;
  element: string;
  weapon: string;
  rarity: 4 | 5;
  imgUrl: string;
}
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Search, 
  Palette, 
  Info, 
  Layers, 
  Sparkles,
  HelpCircle,
  X,
  Maximize2
} from 'lucide-react';

interface Tier {
  id: string;
  label: string;
  color: string;
  characterIds: string[];
}

const PRESET_COLORS = [
  '#ff4b4b', // Crimson
  '#ff7f3f', // Orange
  '#ffc000', // Gold
  '#d2d200', // Lime Yellow
  '#00d27f', // Mint Green
  '#00b0f0', // Hydro Blue
  '#0070c0', // Deep Blue
  '#a256df', // Purple
  '#ff66cc', // Pink
  '#556677'  // Steel Grey
];

const INITIAL_TIERS: Tier[] = [
  { id: 'must-pull', label: 'Must Pull', color: '#ff4b4b', characterIds: [] },
  { id: 's', label: 'S', color: '#ff7f3f', characterIds: [] },
  { id: 'a', label: 'A', color: '#ffc000', characterIds: [] },
  { id: 'b', label: 'B', color: '#00d27f', characterIds: [] },
  { id: 'c', label: 'C', color: '#00b0f0', characterIds: [] }
];

// Map Element names to their corresponding icon colors/badges for Genshin
const GENSHIN_ELEMENT_COLORS: Record<string, string> = {
  Anemo: 'var(--color-anemo)',
  Geo: 'var(--color-geo)',
  Electro: 'var(--color-electro)',
  Dendro: 'var(--color-dendro)',
  Hydro: 'var(--color-hydro)',
  Pyro: 'var(--color-pyro)',
  Cryo: 'var(--color-cryo)',
};

// Map Element names to their corresponding icon colors/badges for Wuthering Waves
const WUWA_ELEMENT_COLORS: Record<string, string> = {
  Aero: 'var(--color-aero)',
  Glacio: 'var(--color-glacio)',
  Fusion: 'var(--color-fusion)',
  Electro: 'var(--color-electro)',
  Spectro: 'var(--color-spectro)',
  Havoc: 'var(--color-havoc)',
};

const GENSHIN_WEAPONS: Record<string, string> = {
  Sword: 'Espada',
  Claymore: 'Mandoble',
  Polearm: 'Lanza',
  Bow: 'Arco',
  Catalyst: 'Catalizador',
};

const WUWA_WEAPONS: Record<string, string> = {
  Sword: 'Espada',
  Broadblade: 'Espada Pesada',
  Pistols: 'Pistolas',
  Gauntlets: 'Guanteletes',
  Rectifier: 'Rectificador',
};

// Map Element names to their corresponding icon colors/badges for Overwatch (Roles)
const OVERWATCH_ELEMENT_COLORS: Record<string, string> = {
  Tank: 'var(--color-tank)',
  Damage: 'var(--color-damage)',
  Support: 'var(--color-support)',
};

const OVERWATCH_WEAPONS: Record<string, string> = {
  Overwatch: 'Overwatch',
  Talon: 'Talon',
  Neutral: 'Neutral/Otros',
};

// DBD specific elements and types mapping
const DBD_ELEMENT_COLORS: Record<string, string> = {
  Survivor: '#00d27f', // Green
  Killer: '#ff4b4b',    // Red
};

const DBD_WEAPONS: Record<string, string> = {
  Original: 'Original',
  Licenciado: 'Licenciado',
};

export default function TierList() {
  // Database map for quick lookups
  const charactersMap = useRef<Record<string, Character>>(
    GENSHIN_CHARACTERS.reduce((acc, char) => {
      acc[char.id] = char;
      return acc;
    }, {} as Record<string, Character>)
  );

  // States
  const [tiers, setTiers] = useState<Tier[]>(() => {
    const saved = localStorage.getItem('genshin_tierlist_tiers');
    return saved ? JSON.parse(saved) : INITIAL_TIERS;
  });

  const [pool, setPool] = useState<string[]>(() => {
    const savedTiers = localStorage.getItem('genshin_tierlist_tiers');
    if (savedTiers) {
      const parsedTiers: Tier[] = JSON.parse(savedTiers);
      const placedIds = new Set(parsedTiers.flatMap(t => t.characterIds));
      return GENSHIN_CHARACTERS.filter(c => !placedIds.has(c.id)).map(c => c.id);
    }
    return GENSHIN_CHARACTERS.map(c => c.id);
  });

  // Mobile / click accessibility selection
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);

  // Presentation fullscreen modal states
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);



  // Active view state ('home' menu of 4 cards, or 'editor')
  const [currentView, setCurrentView] = useState<'home' | 'editor'>('editor');

  // Active template state
  const [currentTemplateId, setCurrentTemplateId] = useState<'genshin' | 'wuwa' | 'overwatch' | 'dbd'>('genshin');

  // Dynamic values based on active template
  const elementColors = 
    currentTemplateId === 'genshin' ? GENSHIN_ELEMENT_COLORS : 
    currentTemplateId === 'wuwa' ? WUWA_ELEMENT_COLORS : 
    currentTemplateId === 'overwatch' ? OVERWATCH_ELEMENT_COLORS :
    DBD_ELEMENT_COLORS;

  const weaponsMap = 
    currentTemplateId === 'genshin' ? GENSHIN_WEAPONS : 
    currentTemplateId === 'wuwa' ? WUWA_WEAPONS : 
    currentTemplateId === 'overwatch' ? OVERWATCH_WEAPONS :
    DBD_WEAPONS;

  // Re-sync states when template ID changes
  useEffect(() => {
    const storageKey = 
      currentTemplateId === 'genshin' ? 'genshin_tierlist_tiers' : 
      currentTemplateId === 'wuwa' ? 'wuwa_tierlist_tiers' : 
      currentTemplateId === 'overwatch' ? 'overwatch_tierlist_tiers' :
      'dbd_tierlist_tiers';
      
    const characters = 
      currentTemplateId === 'genshin' ? GENSHIN_CHARACTERS : 
      currentTemplateId === 'wuwa' ? WUTHERING_WAVES_CHARACTERS : 
      currentTemplateId === 'overwatch' ? OVERWATCH_CHARACTERS :
      DBD_CHARACTERS;
    
    // Rebuild quick lookup map
    charactersMap.current = characters.reduce((acc, char) => {
      acc[char.id] = char as Character;
      return acc;
    }, {} as Record<string, Character>);
    
    const saved = localStorage.getItem(storageKey);
    let loadedTiers = INITIAL_TIERS;
    if (saved) {
      loadedTiers = JSON.parse(saved);
    } else {
      loadedTiers = INITIAL_TIERS.map(t => ({ ...t, characterIds: [] }));
    }
    
    setTiers(loadedTiers);
    
    const placedIds = new Set(loadedTiers.flatMap(t => t.characterIds));
    const loadedPool = characters.filter(c => !placedIds.has(c.id)).map(c => c.id);
    // Sort initial pool alphabetically
    loadedPool.sort((a, b) => {
      const nameA = charactersMap.current[a]?.name || '';
      const nameB = charactersMap.current[b]?.name || '';
      return nameA.localeCompare(nameB);
    });
    setPool(loadedPool);
    
    setSelectedCharId(null);
    setActiveDragCharId(null);
    setActiveElementFilter(null);
    setActiveWeaponFilter(null);
    setActiveRarityFilter(null);
    setSearchQuery('');
  }, [currentTemplateId]);

  // Dock auto-hide states
  const [isDockHidden, setIsDockHidden] = useState(false);
  const dockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pool.length === 0) {
      dockTimeoutRef.current = setTimeout(() => {
        setIsDockHidden(true);
      }, 2000);
    } else {
      if (dockTimeoutRef.current) {
        clearTimeout(dockTimeoutRef.current);
        dockTimeoutRef.current = null;
      }
      setIsDockHidden(false);
    }
    return () => {
      if (dockTimeoutRef.current) {
        clearTimeout(dockTimeoutRef.current);
      }
    };
  }, [pool.length]);

  // Mouse/Touch drag-to-scroll horizontal pool ref and states
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Pointer-drag state machine
  const [pressedCharId, setPressedCharId] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<'scroll' | 'drag' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, scrollLeft: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [hoveredTierId, setHoveredTierId] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  const [activeDragCharId, setActiveDragCharId] = useState<string | null>(null);
  const [hasPointerMoved, setHasPointerMoved] = useState(false);

  // Refs to read latest drag state inside event handlers (avoids stale closures)
  const hoveredTierIdRef = useRef<string | null>(null);
  const hoveredIndexRef = useRef<number | undefined>(undefined);

  const getDropTargetFromPoint = (x: number, y: number): { tierId: string | null; index: number | undefined } => {
    const element = document.elementFromPoint(x, y);
    if (!element) return { tierId: null, index: undefined };
    
    // Check if hovered element is a character card in a tier row
    const targetCard = element.closest('.tier-dropzone-normal .character-card, .tier-dropzone-fullscreen .character-card');
    if (targetCard) {
      const dropzone = targetCard.parentElement;
      const tierRow = targetCard.closest('.tier-row-normal, .tier-row-fullscreen');
      if (dropzone && tierRow) {
        const tierId = tierRow.getAttribute('data-tier-id');
        const cards = Array.from(dropzone.querySelectorAll('.character-card'));
        const rect = targetCard.getBoundingClientRect();
        const isAfter = x > rect.left + rect.width / 2;
        const index = cards.indexOf(targetCard);
        return { 
          tierId, 
          index: index !== -1 ? (isAfter ? index + 1 : index) : undefined 
        };
      }
    }
    
    const tierRow = element.closest('.tier-row');
    if (tierRow) {
      const tierId = tierRow.getAttribute('data-tier-id');
      const dropzone = tierRow.querySelector('.tier-dropzone-normal, .tier-dropzone-fullscreen');
      if (dropzone) {
        const cards = Array.from(dropzone.querySelectorAll('.character-card'));
        if (cards.length > 0) {
          let closestCard = cards[0];
          let minDistance = Math.abs(x - (cards[0].getBoundingClientRect().left + cards[0].getBoundingClientRect().width / 2));
          
          for (let i = 1; i < cards.length; i++) {
            const rect = cards[i].getBoundingClientRect();
            const distance = Math.abs(x - (rect.left + rect.width / 2));
            if (distance < minDistance) {
              minDistance = distance;
              closestCard = cards[i];
            }
          }
          
          const rect = closestCard.getBoundingClientRect();
          const isAfter = x > rect.left + rect.width / 2;
          const index = cards.indexOf(closestCard);
          return {
            tierId,
            index: index !== -1 ? (isAfter ? index + 1 : index) : undefined
          };
        }
      }
      return { tierId, index: undefined };
    }
    
    const poolSection = element.closest('.pool-section');
    if (poolSection) {
      return { tierId: 'pool', index: undefined };
    }
    
    return { tierId: null, index: undefined };
  };

  const handleCharCardPointerDown = (charId: string, e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    // Prevent default touch scroll and drag behaviors only for touch or pen
if (e.pointerType !== 'mouse') {
  e.preventDefault();
}
    
    const initialScroll = scrollContainerRef.current ? scrollContainerRef.current.scrollLeft : 0;
    setPressedCharId(charId);
    setDragStart({ x: e.clientX, y: e.clientY, scrollLeft: initialScroll });
    setDragPosition({ x: e.clientX, y: e.clientY }); // Initialize position immediately to prevent 1-frame ghost flash!
    setDragMode(null);
    setHasPointerMoved(false);
  };

  const handlePoolPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('.character-card') || target.closest('button')) return;
    
    const initialScroll = scrollContainerRef.current ? scrollContainerRef.current.scrollLeft : 0;
    setPressedCharId('pool-scroll');
    setDragStart({ x: e.clientX, y: e.clientY, scrollLeft: initialScroll });
    setDragMode('scroll'); // Scroll directly on container click
    setHasPointerMoved(false);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!pressedCharId) return;

      // Prevent default selection, scrolling and text drags
      if (e.cancelable) {
        e.preventDefault();
      }

      const diffX = e.clientX - dragStart.x;
      const diffY = e.clientY - dragStart.y;

      if (dragMode === null) {
        // Detect movement threshold (10px) to determine mode
        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
          setHasPointerMoved(true);
          if (pressedCharId === 'pool-scroll') {
            setDragMode('scroll');
          } else {
            // Drag character card in any direction!
            setDragMode('drag');
            setActiveDragCharId(pressedCharId);
            setSelectedCharId(null); // Clear click selection
            document.body.classList.add('dragging-active'); // Prevent text selection globally
          }
        }
      } else if (dragMode === 'scroll') {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = dragStart.scrollLeft - diffX;
        }
      } else if (dragMode === 'drag') {
        setDragPosition({ x: e.clientX, y: e.clientY });
        
        // Find hovered drop target and index dynamically
        const target = getDropTargetFromPoint(e.clientX, e.clientY);
        hoveredTierIdRef.current = target.tierId;
        hoveredIndexRef.current = target.index;
        setHoveredTierId(target.tierId);
        setHoveredIndex(target.index);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!pressedCharId) return;

      // Read from refs to avoid stale closure values
      const currentTierId = hoveredTierIdRef.current;
      const currentIndex = hoveredIndexRef.current;

      if (dragMode === 'drag' && activeDragCharId) {
        if (currentTierId && currentTierId !== 'pool') {
          moveCharacter(activeDragCharId, currentTierId, currentIndex);
        } else {
          moveToPool(activeDragCharId);
        }
      } else if (dragMode === null && !hasPointerMoved && pressedCharId !== 'pool-scroll') {
        // Treated as standard click selection
        handleCharCardClick(pressedCharId, e as any);
      }

      document.body.classList.remove('dragging-active');
      hoveredTierIdRef.current = null;
      hoveredIndexRef.current = undefined;
      setPressedCharId(null);
      setDragMode(null);
      setActiveDragCharId(null);
      setHoveredTierId(null);
      setHoveredIndex(undefined);
      setHasPointerMoved(false);
    };

    const handleGlobalDragStart = (e: DragEvent) => {
      if (pressedCharId) {
        e.preventDefault();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('dragstart', handleGlobalDragStart);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('dragstart', handleGlobalDragStart);
    };
  }, [pressedCharId, dragStart, dragMode, activeDragCharId, hoveredTierId, hasPointerMoved]);

  const scrollPool = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;
    const container = scrollContainerRef.current;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
      
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeElementFilter, setActiveElementFilter] = useState<string | null>(null);
  const [activeWeaponFilter, setActiveWeaponFilter] = useState<string | null>(null);
  const [activeRarityFilter, setActiveRarityFilter] = useState<number | null>(null);

  // Save state on change
  useEffect(() => {
    const storageKey = 
      currentTemplateId === 'genshin' ? 'genshin_tierlist_tiers' : 
      currentTemplateId === 'wuwa' ? 'wuwa_tierlist_tiers' : 
      currentTemplateId === 'overwatch' ? 'overwatch_tierlist_tiers' :
      'dbd_tierlist_tiers';
    localStorage.setItem(storageKey, JSON.stringify(tiers));
  }, [tiers, currentTemplateId]);

  // Drag and Drop helpers & handlers
  const calculateDropIndex = (e: React.DragEvent | React.MouseEvent, dropzone: HTMLElement): number => {
    const cards = Array.from(dropzone.querySelectorAll('.character-card, .fullscreen-char-card'));
    if (cards.length === 0) return 0;
    
    const x = e.clientX;
    const y = e.clientY;

    // Extract bounding boxes and indices
    const cardData = cards.map((card, index) => {
      const rect = card.getBoundingClientRect();
      return {
        index,
        rect,
        midX: rect.left + rect.width / 2,
        midY: rect.top + rect.height / 2,
      };
    });

    // Group cards into visual lines/rows based on top coordinate
    const lines: (typeof cardData)[] = [];
    let currentLine: typeof cardData = [];
    let currentTop = -Infinity;

    for (const item of cardData) {
      if (currentLine.length === 0 || Math.abs(item.rect.top - currentTop) < 20) {
        currentLine.push(item);
        currentTop = item.rect.top;
      } else {
        lines.push(currentLine);
        currentLine = [item];
        currentTop = item.rect.top;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    const firstLine = lines[0];
    const lastLine = lines[lines.length - 1];
    const firstCardOverall = firstLine[0];
    const lastCardOverall = lastLine[lastLine.length - 1];

    // 1. If cursor is below all lines -> ALWAYS APPEND TO END
    if (y > lastCardOverall.rect.bottom) {
      return cards.length;
    }

    // 2. If cursor is above all lines -> INSERT AT BEGINNING (0)
    if (y < firstCardOverall.rect.top) {
      return 0;
    }

    // 3. Find target visual line
    let targetLine = lines[0];
    let minVerticalDist = Infinity;
    for (const line of lines) {
      const lineTop = line[0].rect.top;
      const lineBottom = line[0].rect.bottom;
      if (y >= lineTop && y <= lineBottom) {
        targetLine = line;
        break;
      }
      const lineMidY = (lineTop + lineBottom) / 2;
      const dist = Math.abs(y - lineMidY);
      if (dist < minVerticalDist) {
        minVerticalDist = dist;
        targetLine = line;
      }
    }

    // 4. Horizontal position within that line
    const firstInLine = targetLine[0];
    const lastInLine = targetLine[targetLine.length - 1];

    // Left of line
    if (x < firstInLine.rect.left) {
      return firstInLine.index;
    }

    // Right of line
    if (x > lastInLine.rect.right || x > lastInLine.midX) {
      if (targetLine === lastLine) {
        return cards.length;
      }
      return lastInLine.index + 1;
    }

    // Over or between cards in line
    for (let i = 0; i < targetLine.length; i++) {
      const item = targetLine[i];
      if (x >= item.rect.left && x <= item.rect.right) {
        return x > item.midX ? item.index + 1 : item.index;
      }
      if (i < targetLine.length - 1) {
        const nextItem = targetLine[i + 1];
        if (x > item.rect.right && x < nextItem.rect.left) {
          return nextItem.index;
        }
      }
    }

    return targetLine === lastLine ? cards.length : lastInLine.index + 1;
  };

  const handleDragStart = (e: React.DragEvent, charId: string) => {
    setDragMode(null);
    e.dataTransfer.setData('text/plain', charId);
    e.dataTransfer.effectAllowed = 'move';
    setActiveDragCharId(charId);
  };

  const handleDragEnd = () => {
    setActiveDragCharId(null);
    setHoveredTierId(null);
    setHoveredIndex(undefined);
  };

  const handleDrop = (e: React.DragEvent, targetTierId: string, targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    const dataId = e.dataTransfer.getData('text/plain');
    const charId = dataId || activeDragCharId;
    if (!charId) return;

    moveCharacter(charId, targetTierId, targetIndex);
    setActiveDragCharId(null);
    setHoveredTierId(null);
    setHoveredIndex(undefined);
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dataId = e.dataTransfer.getData('text/plain');
    const charId = dataId || activeDragCharId;
    if (!charId) return;

    moveToPool(charId);
    setActiveDragCharId(null);
    setHoveredTierId(null);
    setHoveredIndex(undefined);
  };

  // Move character logic
  const moveCharacter = (charId: string, targetTierId: string, targetIndex?: number) => {
    setTiers(prevTiers => {
      // Find where the character currently lives
      const sourceTier = prevTiers.find(t => t.characterIds.includes(charId));
      const sourceIndex = sourceTier ? sourceTier.characterIds.indexOf(charId) : -1;

      // 1. Remove character from any previous tier
      const cleanedTiers = prevTiers.map(t => ({
        ...t,
        characterIds: t.characterIds.filter(id => id !== charId)
      }));

      // 2. Add character to target tier at the correct index
      return cleanedTiers.map(t => {
        if (t.id === targetTierId) {
          const list = [...t.characterIds];
          let insertAt: number;

          if (typeof targetIndex === 'number') {
            // If moving within the same tier and the original position was before
            // the target index, removal already shifted everything left by 1 —
            // so we must subtract 1 to land on the correct slot.
            const isSameTier = sourceTier?.id === targetTierId;
            if (isSameTier && sourceIndex !== -1 && sourceIndex < targetIndex) {
              insertAt = targetIndex - 1;
            } else {
              insertAt = targetIndex;
            }
            // Clamp to valid range
            insertAt = Math.max(0, Math.min(insertAt, list.length));
            list.splice(insertAt, 0, charId);
          } else {
            list.push(charId);
          }
          return { ...t, characterIds: list };
        }
        return t;
      });
    });

    // 3. Remove character from pool
    setPool(prevPool => prevPool.filter(id => id !== charId));
    setSelectedCharId(null);
    setActiveDragCharId(null);
  };

  const moveToPool = (charId: string) => {
    // 1. Remove from all tiers
    setTiers(prevTiers => prevTiers.map(t => ({
      ...t,
      characterIds: t.characterIds.filter(id => id !== charId)
    })));

    // 2. Append back to pool and sort alphabetically
    setPool(prevPool => {
      if (prevPool.includes(charId)) return prevPool;
      const newPool = [...prevPool, charId];
      return newPool.sort((a, b) => {
        const nameA = charactersMap.current[a]?.name || '';
        const nameB = charactersMap.current[b]?.name || '';
        return nameA.localeCompare(nameB);
      });
    });

    setSelectedCharId(null);
    setActiveDragCharId(null);
  };

  // Click-to-Move handler (touch and ease-of-use mobile support)
  const handleCharCardClick = (charId: string, e?: React.MouseEvent | PointerEvent) => {
    if (e) e.stopPropagation();
    if (selectedCharId === charId) {
      // Deselect
      setSelectedCharId(null);
    } else {
      setSelectedCharId(charId);
    }
  };

  const handleTierRowClick = (tierId: string) => {
    if (selectedCharId) {
      moveCharacter(selectedCharId, tierId);
    }
  };

  const handlePoolAreaClick = () => {
    if (selectedCharId) {
      moveToPool(selectedCharId);
    }
  };

  // Row Manipulation
  const handleUpdateLabel = (tierId: string, newLabel: string) => {
    setTiers(prev => prev.map(t => t.id === tierId ? { ...t, label: newLabel } : t));
  };

  const handleSetRowColor = (tierId: string, color: string) => {
    setTiers(prev => prev.map(t => t.id === tierId ? { ...t, color } : t));
  };

  const handleAddTier = () => {
    const newId = `tier-${Date.now()}`;
    const colors = PRESET_COLORS;
    const randomColor = colors[tiers.length % colors.length];
    
    setTiers(prev => [
      ...prev,
      {
        id: newId,
        label: 'Nuevo Tier',
        color: randomColor,
        characterIds: []
      }
    ]);
  };

  const handleRemoveTier = (tierId: string) => {
    const tierToRemove = tiers.find(t => t.id === tierId);
    if (!tierToRemove) return;

    // Return characters back to pool and sort alphabetically
    if (tierToRemove.characterIds.length > 0) {
      setPool(prev => {
        const newPool = [...prev, ...tierToRemove.characterIds];
        return newPool.sort((a, b) => {
          const nameA = charactersMap.current[a]?.name || '';
          const nameB = charactersMap.current[b]?.name || '';
          return nameA.localeCompare(nameB);
        });
      });
    }

    setTiers(prev => prev.filter(t => t.id !== tierId));
  };

  const handleMoveTier = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tiers.length) return;

    setTiers(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleReset = () => {
    if (window.confirm('¿Seguro que quieres restablecer la tier list? Se devolverán todos los personajes al pool.')) {
      const characters = 
        currentTemplateId === 'genshin' ? GENSHIN_CHARACTERS : 
        currentTemplateId === 'wuwa' ? WUTHERING_WAVES_CHARACTERS : 
        currentTemplateId === 'overwatch' ? OVERWATCH_CHARACTERS :
        DBD_CHARACTERS;
      setTiers(INITIAL_TIERS.map(t => ({ ...t, characterIds: [] })));
      // Reset pool and sort alphabetically
      const sortedIds = characters.map(c => c.id).sort((a, b) => {
        const nameA = charactersMap.current[a]?.name || '';
        const nameB = charactersMap.current[b]?.name || '';
        return nameA.localeCompare(nameB);
      });
      setPool(sortedIds);
      setSelectedCharId(null);
    }
  };

  // Filtering Pool
  const filteredPool = pool.filter(charId => {
    const char = charactersMap.current[charId];
    if (!char) return false;

    // Search query match
    if (searchQuery && !char.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Element match
    if (activeElementFilter && char.element !== activeElementFilter) {
      return false;
    }

    // Weapon match
    if (activeWeaponFilter && char.weapon !== activeWeaponFilter) {
      return false;
    }

    // Rarity match
    if (activeRarityFilter && char.rarity !== activeRarityFilter) {
      return false;
    }

    return true;
  });

  // Dynamic card size inside presentation modal based on viewport height and tiers configuration
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPresenterCardSize = () => {
    // Height of header + padding is approx 60px in presentation modal (no header, only padding)
    const availableHeight = windowHeight - 60;
    const numRows = tiers.length;
    
    // Theoretical max height per row
    const maxRowHeight = availableHeight / numRows;
    
    // Card height should be maxRowHeight - padding (approx 12px)
    let calculatedSize = maxRowHeight - 12;
    
    // Limit between a minimum of 36px and maximum of 90px
    calculatedSize = Math.max(36, Math.min(90, calculatedSize));
    
    // Also adjust if there are too many characters in a single row (to prevent horizontal overflow)
    const maxCharsInARow = Math.max(...tiers.map(t => t.characterIds.length), 1);
    if (maxCharsInARow > 12) {
      // Scale down card size horizontally if a row is very crowded
      const horizontalLimit = 1000 / maxCharsInARow; // 1000px available max width
      calculatedSize = Math.min(calculatedSize, horizontalLimit);
    }
    
    return Math.max(36, Math.floor(calculatedSize));
  };
  const presenterCardSize = getPresenterCardSize();

  return (
    <div className="app-container">
      <>
        {/* Title Header Banner */}
      {currentView === 'home' ? (
        <div className="home-dashboard" style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <article className="hero-main glass" style={{ margin: '0 auto', textAlign: 'center', padding: '40px 34px', width: '100%', maxWidth: '900px' }}>
            <div className="eyebrow" style={{ display: 'inline-flex', margin: '0 auto 18px' }}>
              <span className="dot"></span>Creador de Tierlists
            </div>
            <h1 style={{ margin: '0 auto 16px', maxWidth: 'none', fontSize: '3rem', fontWeight: 900 }}>Selecciona una Plantilla</h1>
            <p style={{ margin: '0 auto', maxWidth: '650px', color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Elige el juego que deseas clasificar y empieza a organizar tus personajes favoritos de inmediato.
            </p>
          </article>

          <div className="game-tabs-grid">
              {[
                { id: 'genshin', name: 'Genshin Impact', desc: 'Edita la tierlist de personajes oficiales del parche Snezhnaya, incluyendo a Odette y Alyosha.', color: '#33ecc0', bg: '/Imagenes/tierlist_genshin.png' },
                { id: 'wuwa', name: 'Wuthering Waves', desc: 'Clasifica a todos los Resonadores y formas de Rover jugables hasta la versión 3.5.', color: '#b874ec', bg: '/Imagenes/tierlist_wuwa.png' },
                { id: 'overwatch', name: 'Overwatch', desc: 'Crea la tierlist definitiva de héroes incluyendo a Anran, Domina, Hazard y Jetpack Cat.', color: '#f08226', bg: '/Imagenes/tierlist_overwatch.png' },
                { id: 'dbd', name: 'Dead by Daylight', desc: 'Clasifica supervivientes y asesinos oficiales más tus personajes personalizados.', color: '#00d27f', bg: '/Imagenes/tierlist_dbd.png' }
              ].map((g) => {
                  return (
                      <div
                          key={g.id}
                          onClick={() => {
                              setCurrentTemplateId(g.id as any);
                              setCurrentView('editor');
                          }}
                          className="glass"
                          style={{
                              position: 'relative',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              padding: '2rem 1.5rem',
                              borderRadius: '24px',
                              boxShadow: 'var(--shadow)',
                              transition: 'all 0.3s ease',
                              textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--accent)';
                              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 115, 0.15)';
                              e.currentTarget.style.transform = 'translateY(-4px)';
                              const bgImg = e.currentTarget.querySelector('.card-bg-img') as HTMLImageElement;
                              if (bgImg) bgImg.style.transform = 'scale(1.08)';
                          }}
                          onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(233, 176, 255, .08)';
                              e.currentTarget.style.boxShadow = 'var(--shadow)';
                              e.currentTarget.style.transform = 'none';
                              const bgImg = e.currentTarget.querySelector('.card-bg-img') as HTMLImageElement;
                              if (bgImg) bgImg.style.transform = 'scale(1)';
                          }}
                      >
                          {/* Background image underlay with 50% opacity */}
                          {g.bg && (
                              <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  zIndex: 0,
                                  opacity: 0.5,
                                  overflow: 'hidden'
                              }}>
                                  <img 
                                      src={g.bg} 
                                      alt="background" 
                                      className="card-bg-img"
                                      style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                          filter: 'brightness(0.3) contrast(1.15)',
                                          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                          pointerEvents: 'none'
                                      }}
                                  />
                              </div>
                          )}

                          <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
                              <h3 style={{
                                  color: '#fff',
                                  fontSize: '1.4rem',
                                  fontWeight: 800,
                                  marginBottom: '0.75rem',
                                  fontFamily: 'var(--font-primary)',
                                  textShadow: `0 0 10px ${g.color}33`
                              }}>
                                  {g.name}
                              </h3>
                              <p style={{
                                  color: 'var(--text-muted)',
                                  fontSize: '0.95rem',
                                  lineHeight: 1.5,
                                  margin: 0
                              }}>
                                  {g.desc}
                              </p>
                          </div>
                      </div>
                  );
              })}
          </div>
        </div>
      ) : (
        <>
          {/* Back button to Templates */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
            <button 
              onClick={() => setCurrentView('home')} 
              className="btn btn-secondary"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.08)',
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              &larr; Volver a Plantillas
            </button>
          </div>

          <header className="header-banner">
            <span className="header-tag">
              <Sparkles size={12} style={{ marginRight: 4, display: 'inline' }} />
              {currentTemplateId === 'genshin' ? 'Snezhnaya Update' : currentTemplateId === 'wuwa' ? 'Versión 3.5' : currentTemplateId === 'overwatch' ? 'Temporada 1 (2026)' : 'Dead by Daylight'}
            </span>
            <h1 className="header-title">
              {currentTemplateId === 'genshin' ? 'Genshin Impact Tier List Maker' : currentTemplateId === 'wuwa' ? 'Wuthering Waves Tier List Maker' : currentTemplateId === 'overwatch' ? 'Overwatch Tier List Maker' : 'Dead by Daylight Tier List Maker'}
            </h1>
            <p className="header-subtitle">
              {currentTemplateId === 'genshin' ? (
                <>
                  Crea tu tier list definitiva de Genshin Impact. Incluye a todos los personajes hasta la versión 6.7, 
                  además de los nuevos de la versión 7.0: <strong>Odette</strong> y <strong>Alyosha</strong>. Arrastra los iconos o selecciónalos para moverlos.
                </>
              ) : currentTemplateId === 'wuwa' ? (
                <>
                  Crea tu tier list definitiva de Wuthering Waves. Incluye a todos los personajes y formas de Rover de Spectro y Havoc hasta la versión 3.5. Arrastra los iconos o selecciónalos para moverlos.
                </>
              ) : currentTemplateId === 'overwatch' ? (
                <>
                  Crea tu tier list definitiva de Overwatch. Incluye a todos los héroes clásicos y los nuevos introducidos en el parche de la Temporada 1 de 2026 como <strong>Anran</strong>, <strong>Domina</strong>, <strong>Freja</strong>, <strong>Hazard</strong> y <strong>Jetpack Cat</strong>. Arrastra los iconos o selecciónalos para moverlos.
                </>
              ) : (
                <>
                  Crea tu tier list definitiva de Dead by Daylight. Incluye a todos los supervivientes y asesinos. Arrastra los iconos o selecciónalos para moverlos.
                </>
              )}
            </p>
          </header>

      {/* Control Buttons & Search Panel */}
      <section className="controls-bar">
        <div className="controls-left">
          <button onClick={handleAddTier} className="btn btn-primary">
            <Plus size={16} />
            Añadir Fila
          </button>
          <button onClick={handleReset} className="btn btn-danger">
            <RotateCcw size={16} />
            Reiniciar
          </button>
          <button onClick={() => setIsFullModalOpen(true)} className="btn btn-accent">
            <Maximize2 size={16} />
            Full Tierlist
          </button>
        </div>
        
        <div className="controls-right">
          <div className="search-container">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar personaje..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Mobile Guidance Notice */}
      {selectedCharId && (
        <div className="mobile-notice">
          <Info size={16} />
          <span>
            Has seleccionado a <strong>{charactersMap.current[selectedCharId]?.name}</strong>. Haz clic en la fila de destino o en el pool para moverlo.
          </span>
        </div>
      )}

      {/* The main Tier List Board */}
      <main className="tierlist-board">
        {tiers.map((tier, index) => (
          <div 
            key={tier.id} 
            className={`tier-row-normal ${hoveredTierId === tier.id ? 'drag-over' : ''}`}
            data-tier-id={tier.id}
            onClick={() => handleTierRowClick(tier.id)}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              setHoveredTierId(tier.id);
              const dropzone = e.currentTarget.querySelector('.tier-dropzone-normal') as HTMLElement;
              if (dropzone) {
                const targetIdx = calculateDropIndex(e, dropzone);
                setHoveredIndex(targetIdx);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              const dropzone = e.currentTarget.querySelector('.tier-dropzone-normal') as HTMLElement;
              const targetIdx = dropzone ? calculateDropIndex(e, dropzone) : undefined;
              handleDrop(e, tier.id, targetIdx);
            }}
          >
            {/* Tier Label (Left Sidebar) */}
            <div 
              className="tier-label-wrapper"
              style={{ 
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
                borderLeft: `5px solid ${tier.color}`,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
              onClick={(e) => {
                if (selectedCharId) {
                  e.stopPropagation();
                  handleTierRowClick(tier.id);
                }
              }}
            >
              <textarea
                value={tier.label}
                onChange={(e) => handleUpdateLabel(tier.id, e.target.value)}
                placeholder="TIER"
                className="tier-label-textarea"
                rows={1}
                spellCheck={false}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
              />
            </div>

            {/* Tier Dropzone (Center Content Area) */}
            <div 
              className="tier-dropzone-normal"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'move';
                e.currentTarget.classList.add('drag-over');
                setHoveredTierId(tier.id);
                const targetIdx = calculateDropIndex(e, e.currentTarget);
                setHoveredIndex(targetIdx);
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('drag-over');
                if (e.relatedTarget === null || !(e.relatedTarget as HTMLElement).closest('.tier-dropzone-normal, .tier-dropzone-fullscreen')) {
                  setHoveredTierId(null);
                  setHoveredIndex(undefined);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove('drag-over');
                const targetIdx = calculateDropIndex(e, e.currentTarget);
                handleDrop(e, tier.id, targetIdx);
              }}
            >
              {tier.characterIds.map((charId, idx) => {
                const char = charactersMap.current[charId];
                if (!char) return null;
                return (
                  <div
                    key={char.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, char.id)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => handleCharCardClick(char.id, e)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer.dropEffect = 'move';
                      const rect = e.currentTarget.getBoundingClientRect();
                      const isAfter = e.clientX > rect.left + rect.width / 2;
                      const targetIdx = isAfter ? idx + 1 : idx;
                      setHoveredTierId(tier.id);
                      setHoveredIndex(targetIdx);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const isAfter = e.clientX > rect.left + rect.width / 2;
                      const targetIdx = isAfter ? idx + 1 : idx;
                      handleDrop(e, tier.id, targetIdx);
                    }}
                    className={`character-card rarity-${char.rarity}-card element-${char.element.toLowerCase()}-glow ${selectedCharId === char.id ? 'selected' : ''}`}
                    style={{ backgroundImage: `url(${char.imgUrl})` }}
                  >
                    <div className="character-name-overlay">{char.name}</div>
                  </div>
                );
              })}
            </div>

            {/* Tier Controls (Right Sidebar) */}
            <div className="tier-actions" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => handleMoveTier(index, 'up')} 
                disabled={index === 0}
                className="action-btn"
                title="Mover fila arriba"
              >
                <ArrowUp size={14} />
              </button>
              <button 
                onClick={() => handleMoveTier(index, 'down')} 
                disabled={index === tiers.length - 1}
                className="action-btn"
                title="Mover fila abajo"
              >
                <ArrowDown size={14} />
              </button>
              <label 
                className="action-btn color-picker-action-btn" 
                title="Elegir color RGB"
                style={{ borderColor: tier.color }}
              >
                <input 
                  type="color" 
                  value={tier.color.startsWith('#') && (tier.color.length === 7 || tier.color.length === 4) ? tier.color : '#ff7f7f'}
                  onChange={(e) => handleSetRowColor(tier.id, e.target.value)}
                  className="tier-color-native-input"
                  onClick={(e) => e.stopPropagation()}
                />
                <Palette size={14} style={{ color: tier.color }} />
              </label>
              <button 
                onClick={() => handleRemoveTier(tier.id)} 
                className="action-btn delete"
                title="Eliminar fila"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Reserves Shelf / Character Pool */}
      <section 
        className="pool-section"
        onClick={handlePoolAreaClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropOnPool}
      >
        <div className="pool-header-row">
          <div className="pool-title-group">
            <Layers size={20} style={{ color: 'var(--color-geo)' }} />
            <h2 style={{ fontSize: '1.25rem' }}>
              {currentTemplateId === 'overwatch' ? 'Héroes Disponibles' : 'Personajes Disponibles'}
            </h2>
            <span className="pool-count">
              {filteredPool.length} / {
                currentTemplateId === 'genshin' ? GENSHIN_CHARACTERS.length : 
                currentTemplateId === 'wuwa' ? WUTHERING_WAVES_CHARACTERS.length : 
                currentTemplateId === 'overwatch' ? OVERWATCH_CHARACTERS.length :
                DBD_CHARACTERS.length
              }
            </span>
          </div>
        </div>

        {/* Filter System Shelf (placed underneath characters row) */}
        <div className="filters-container" onClick={(e) => e.stopPropagation()}>
          {/* Element Filter */}
          <div className="filter-row">
            <span className="filter-label">
              {currentTemplateId === 'overwatch' ? 'Rol:' : currentTemplateId === 'dbd' ? 'Bando:' : 'Elemento:'}
            </span>
            <div className="filter-group">
              <button 
                onClick={() => setActiveElementFilter(null)}
                className={`filter-tag ${activeElementFilter === null ? 'active' : ''}`}
              >
                Todos
              </button>
              {Object.keys(elementColors).map(el => (
                <button
                  key={el}
                  onClick={() => setActiveElementFilter(activeElementFilter === el ? null : el)}
                  className={`filter-tag ${activeElementFilter === el ? 'active' : ''} ${el.toLowerCase()}`}
                  style={activeElementFilter === el ? { borderColor: elementColors[el], color: elementColors[el] } : {}}
                >
                  {el}
                </button>
              ))}
            </div>
          </div>

          {/* Weapon Filter */}
          <div className="filter-row">
            <span className="filter-label">
              {currentTemplateId === 'overwatch' ? 'Facción:' : currentTemplateId === 'dbd' ? 'Origen:' : 'Arma:'}
            </span>
            <div className="filter-group">
              <button 
                onClick={() => setActiveWeaponFilter(null)}
                className={`filter-tag ${activeWeaponFilter === null ? 'active' : ''}`}
              >
                Todas
              </button>
              {Object.keys(weaponsMap).map(w => (
                <button
                  key={w}
                  onClick={() => setActiveWeaponFilter(activeWeaponFilter === w ? null : w)}
                  className={`filter-tag ${activeWeaponFilter === w ? 'active' : ''}`}
                >
                  {weaponsMap[w]}
                </button>
              ))}
            </div>
          </div>

          {/* Rarity Filter */}
          {currentTemplateId !== 'overwatch' && currentTemplateId !== 'dbd' && (
            <div className="filter-row">
              <span className="filter-label">Rareza:</span>
              <div className="filter-group">
                <button 
                  onClick={() => setActiveRarityFilter(null)}
                  className={`filter-tag ${activeRarityFilter === null ? 'active' : ''}`}
                >
                  Todas
                </button>
                <button 
                  onClick={() => setActiveRarityFilter(5)}
                  className={`filter-tag rarity-5 ${activeRarityFilter === 5 ? 'active' : ''}`}
                >
                  5 Estrellas
                </button>
                <button 
                  onClick={() => setActiveRarityFilter(4)}
                  className={`filter-tag rarity-4 ${activeRarityFilter === 4 ? 'active' : ''}`}
                >
                  4 Estrellas
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mobile-notice" style={{ marginTop: 0 }}>
          <Info size={14} />
          <span>
            <strong>Tip Móvil:</strong> Toca un personaje para seleccionarlo, luego toca cualquier fila arriba para asignarlo.
          </span>
        </div>
      </section>

      {/* Floating horizontal scroll pool ( macOS / iOS Dock style bubble ) */}
      <div 
        className={`pool-horizontal-wrapper ${currentTemplateId === 'dbd' ? 'dbd-pool-wrapper' : ''} ${isDockHidden && !activeDragCharId ? 'hidden-dock' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropOnPool}
      >
          {filteredPool.length > 0 && (
            <button 
              onClick={() => scrollPool('left')}
              className="pool-scroll-btn left"
              title="Desplazar izquierda"
            >
              &#8592;
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            className="pool-horizontal-scroll"
            onPointerDown={handlePoolPointerDown}
          >
            {filteredPool.length > 0 ? (
              filteredPool.map(charId => {
                const char = charactersMap.current[charId];
                if (!char) return null;
                return (
                  <div
                    key={char.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, char.id)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => handleCharCardClick(char.id, e)}
                    className={`character-card ${currentTemplateId === 'dbd' ? 'dbd-pool-card' : ''} rarity-${char.rarity}-card element-${char.element.toLowerCase()}-glow ${selectedCharId === char.id ? 'selected' : ''}`}
                    style={{ 
                      backgroundImage: `url(${char.imgUrl})`, 
                      flexShrink: 0,
                      opacity: activeDragCharId === char.id ? 0.35 : 1,
                      cursor: activeDragCharId === char.id ? 'grabbing' : 'grab'
                    }}
                    title={`${char.name} (${char.element} - ${char.weapon})`}
                  >
                    <div className="character-name-overlay">{char.name}</div>
                  </div>
                );
              })
            ) : pool.length > 0 ? (
              <div className="pool-grid-empty">
                <HelpCircle size={32} />
                <p>No se encontraron personajes con los filtros seleccionados.</p>
              </div>
            ) : null}
          </div>

          {filteredPool.length > 0 && (
            <button 
              onClick={() => scrollPool('right')}
              className="pool-scroll-btn right"
              title="Desplazar derecha"
            >
              &#8594;
            </button>
          )}
        </div>

      {/* Custom drag-and-drop overlay preview */}
      {activeDragCharId && dragMode === 'drag' && (
        <div 
          className="custom-drag-preview"
          style={{
            position: 'fixed',
            left: dragPosition.x - 43,
            top: dragPosition.y - 43, // Restored vertical offset to center under cursor
            pointerEvents: 'none',
            zIndex: 9999,
            transform: 'scale(1.05)',
            opacity: 0.95,
            transition: 'none',
          }}
        >
          <div 
            className={`character-card rarity-${charactersMap.current[activeDragCharId]?.rarity}-card element-${charactersMap.current[activeDragCharId]?.element.toLowerCase()}-glow`}
            style={{ 
              backgroundImage: `url(${charactersMap.current[activeDragCharId]?.imgUrl})`,
              transition: 'none',
              transform: 'none'
            }}
          />
        </div>
      )}

      {/* Presentation Fullscreen Modal */}
      {isFullModalOpen && (
        <div className="fullscreen-presenter-overlay" onDragOver={(e) => e.preventDefault()}>
          {/* Floating presentation controllers (saves vertical space) */}
          <div className="presenter-floating-actions">
            <button 
              onClick={() => setIsFullModalOpen(false)} 
              className="presenter-icon-btn close-btn"
              title="Cerrar presentación"
            >
              <X size={18} />
            </button>
          </div>

          <div className="presenter-board-container">
            <div className="tierlist-board clean-board">
              {tiers.map((tier) => (
                <div 
                  key={tier.id} 
                  className={`tier-row-fullscreen ${hoveredTierId === tier.id ? 'drag-over' : ''}`}
                  data-tier-id={tier.id}
                  onClick={() => handleTierRowClick(tier.id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    setHoveredTierId(tier.id);
                    const dropzone = e.currentTarget.querySelector('.tier-dropzone-fullscreen') as HTMLElement;
                    if (dropzone) {
                      const targetIdx = calculateDropIndex(e, dropzone);
                      setHoveredIndex(targetIdx);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dropzone = e.currentTarget.querySelector('.tier-dropzone-fullscreen') as HTMLElement;
                    const targetIdx = dropzone ? calculateDropIndex(e, dropzone) : undefined;
                    handleDrop(e, tier.id, targetIdx);
                  }}
                >
                  <div 
                    className="tier-label-wrapper"
                    style={{ 
                      background: tier.color,
                      borderLeft: `5px solid rgba(0,0,0,0.35)`,
                    }}
                    onClick={(e) => {
                      if (selectedCharId) {
                        e.stopPropagation();
                        handleTierRowClick(tier.id);
                      }
                    }}
                  >
                    <span className="tier-label-text">{tier.label || 'TIER'}</span>
                  </div>

                  <div 
                    className="tier-dropzone-fullscreen"
                    style={{ 
                      background: `${tier.color}28`,
                      border: `1px solid ${tier.color}45`
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer.dropEffect = 'move';
                      e.currentTarget.classList.add('drag-over');
                      setHoveredTierId(tier.id);
                      const targetIdx = calculateDropIndex(e, e.currentTarget);
                      setHoveredIndex(targetIdx);
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('drag-over');
                      if (e.relatedTarget === null || !(e.relatedTarget as HTMLElement).closest('.tier-dropzone-normal, .tier-dropzone-fullscreen')) {
                        setHoveredTierId(null);
                        setHoveredIndex(undefined);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('drag-over');
                      const targetIdx = calculateDropIndex(e, e.currentTarget);
                      handleDrop(e, tier.id, targetIdx);
                    }}
                  >
                      {tier.characterIds.map((charId, idx) => {
                        const char = charactersMap.current[charId];
                        if (!char) return null;
                        const charCount = tier.characterIds.length;
                        const cardWidthPercent = 100 / Math.max(charCount, 1);
                        return (
                          <div
                            key={char.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, char.id)}
                            onDragEnd={handleDragEnd}
                            onClick={(e) => handleCharCardClick(char.id, e)}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              e.dataTransfer.dropEffect = 'move';
                              const rect = e.currentTarget.getBoundingClientRect();
                              const isAfter = e.clientX > rect.left + rect.width / 2;
                              const targetIdx = isAfter ? idx + 1 : idx;
                              setHoveredTierId(tier.id);
                              setHoveredIndex(targetIdx);
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              const isAfter = e.clientX > rect.left + rect.width / 2;
                              const targetIdx = isAfter ? idx + 1 : idx;
                              handleDrop(e, tier.id, targetIdx);
                            }}
                            className={`fullscreen-char-card element-${char.element.toLowerCase()}-glow`}
                            style={{
                              backgroundImage: `url(${char.imgUrl})`,
                              height: '100%',
                              aspectRatio: '1 / 1',
                              width: 'auto',
                              maxWidth: `${cardWidthPercent}%`,
                              flexShrink: 1,
                              minWidth: 0,
                            }}
                            title={`${char.name} (${char.element})`}
                          >
                            <div className="character-name-overlay">{char.name}</div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
        </>
      )}


      </>
    </div>
  );
}
