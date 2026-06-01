import React, { useState } from 'react';
import { Camera, Plus, Image as ImageIcon, Filter, Calendar } from 'lucide-react';

interface FotoItem {
  id: string;
  obraId: string;
  url: string;
  categoria: string;
  data: string;
  legenda: string;
}

interface GaleriaProps {
  fotos: FotoItem[];
  currentRole: string;
  onUpdateFotos: (updated: FotoItem[]) => void;
}

export function GaleriaView({ fotos, currentRole, onUpdateFotos }: GaleriaProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddFoto, setShowAddFoto] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newLegenda, setNewLegenda] = useState('');
  const [newCat, setNewCat] = useState('Alvenaria / Framing');

  const isReadOnly = currentRole === 'cliente';

  const categories = ['All', 'Projetos', 'Alvenaria / Framing', 'Instalações', 'Fundação', 'Pintura'];

  const filteredFotos = selectedCategory === 'All'
    ? fotos
    : fotos.filter(f => f.categoria === selectedCategory);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newLegenda) return;

    const nova: FotoItem = {
      id: `g-${Date.now()}`,
      obraId: fotos[0]?.obraId || 'sitta',
      url: newUrl,
      categoria: newCat,
      data: new Date().toISOString().split('T')[0],
      legenda: newLegenda
    };

    onUpdateFotos([nova, ...fotos]);
    setNewUrl('');
    setNewLegenda('');
    setShowAddFoto(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-slate-100' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'All' ? 'Todas' : cat}
            </button>
          ))}
        </div>

        {!isReadOnly && (
          <button
            onClick={() => setShowAddFoto(!showAddFoto)}
            className="sm:self-auto self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-slate-100 transition whitespace-nowrap cursor-pointer"
          >
            <Plus size={14} /> Anexar Evidência Visual
          </button>
        )}
      </div>

      {showAddFoto && (
        <form onSubmit={handleAddSubmit} className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Anexar Nova Fotografia de Campo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-[10px] text-slate-400 block mb-0.5">URL da Imagem (Ex. Unsplash)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={newUrl}
                required
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Categoria Técnica</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100"
              >
                <option value="Projetos">Projetos</option>
                <option value="Alvenaria / Framing">Alvenaria / Framing</option>
                <option value="Instalações">Instalações</option>
                <option value="Fundação">Fundação</option>
                <option value="Pintura">Pintura</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Legenda / Assinatura de Evidência</label>
            <input
              type="text"
              placeholder="e.g. Teste de estanqueidade no coletor master da ala leste"
              value={newLegenda}
              required
              onChange={(e) => setNewLegenda(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100"
            />
          </div>
          <div className="flex justify-end gap-1.5 text-xs">
            <button type="button" onClick={() => setShowAddFoto(false)} className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded">Cancelar</button>
            <button type="submit" className="px-3 py-1.5 bg-indigo-600 font-bold text-slate-100 rounded">Anexar Foto</button>
          </div>
        </form>
      )}

      {/* Grid gallery display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filteredFotos.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 italic">
            Nenhuma foto disponível nesta categoria técnica.
          </div>
        ) : (
          filteredFotos.map((f) => (
            <div key={f.id} className="group bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between">
              <div className="aspect-video relative overflow-hidden bg-slate-950">
                <img 
                  src={f.url} 
                  alt={f.legenda} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
                
                {/* Float category tag */}
                <span className="absolute left-3 bottom-3 text-[9px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-indigo-400 px-2 py-0.5 rounded border border-slate-800">
                  {f.categoria}
                </span>
              </div>
              
              <div className="p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-200 leading-relaxed line-clamp-2">
                  {f.legenda}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/40">
                  <Calendar size={11} /> {f.data}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
