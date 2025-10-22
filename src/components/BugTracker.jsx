import React, { useState, useEffect } from 'react';
import { Bug, Plus, X, Search } from 'lucide-react';

export default function BugTracker() {
  const [bugs, setBugs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    status: 'open',
    steps: ''
  });

  useEffect(() => {
    const sampleBugs = [
      {
        id: 1,
        title: 'Bouton de connexion ne répond pas',
        description: 'Le bouton de connexion ne réagit pas au clic sur la page d\'accueil',
        severity: 'high',
        status: 'open',
        steps: '1. Aller sur la page d\'accueil\n2. Remplir les identifiants\n3. Cliquer sur "Se connecter"\n4. Aucune action ne se produit',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Erreur 404 sur la page profil',
        description: 'La page de profil utilisateur retourne une erreur 404',
        severity: 'critical',
        status: 'in-progress',
        steps: '1. Se connecter\n2. Cliquer sur "Mon profil"\n3. Page 404 s\'affiche',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    // if there are saved bugs in localStorage, keep them; otherwise initialize sample
    const saved = localStorage.getItem('bugs');
    if (saved) {
      setBugs(JSON.parse(saved));
    } else {
      setBugs(sampleBugs);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bugs', JSON.stringify(bugs));
  }, [bugs]);

  const handleSubmit = () => {
    if (!formData.title || !formData.description) return;

    const newBug = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    setBugs([newBug, ...bugs]);
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      status: 'open',
      steps: ''
    });
    setShowForm(false);
  };

  const updateBugStatus = (id, newStatus) => {
    setBugs(bugs.map(bug =>
      bug.id === id ? { ...bug, status: newStatus } : bug
    ));
  };

  const deleteBug = (id) => {
    setBugs(bugs.filter(bug => bug.id !== id));
  };

  const filteredBugs = bugs.filter(bug => {
    const matchesFilter = filter === 'all' || bug.status === filter;
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const stats = {
    total: bugs.length,
    open: bugs.filter(b => b.status === 'open').length,
    inProgress: bugs.filter(b => b.status === 'in-progress').length,
    resolved: bugs.filter(b => b.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <Bug className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  My Bug Tracker
                </h1>
                <p className="text-gray-600 text-sm">Gérez vos bugs efficacement</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? 'Annuler' : 'Nouveau Bug'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-600">Total</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <div className="text-2xl font-bold text-red-600">{stats.open}</div>
              <div className="text-sm text-red-600">Ouverts</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-sm text-yellow-600">En cours</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-green-600">Résolus</div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Signaler un nouveau bug</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre du bug</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Bouton de connexion ne fonctionne pas"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                  placeholder="Décrivez le bug en détail..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Étapes pour reproduire</label>
                <textarea
                  value={formData.steps}
                  onChange={(e) => setFormData({...formData, steps: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                  placeholder={"1. Aller sur la page de connexion\n2. Cliquer sur le bouton...\n3. Observer l'erreur"}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sévérité</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="critical">Critique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="open">Ouvert</option>
                    <option value="in-progress">En cours</option>
                    <option value="resolved">Résolu</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Créer le ticket
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un bug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === 'all' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilter('open')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === 'open' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Ouverts
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === 'in-progress' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                En cours
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === 'resolved' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Résolus
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredBugs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun bug trouvé</p>
              <p className="text-gray-400 text-sm mt-2">
                {bugs.length === 0 ? 'Commencez par créer votre premier ticket !' : 'Essayez de modifier vos filtres'}
              </p>
            </div>
          ) : (
            filteredBugs.map(bug => (
              <div key={bug.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-800">{bug.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(bug.severity)}`}>
                        {bug.severity === 'critical' && 'Critique'}
                        {bug.severity === 'high' && 'Haute'}
                        {bug.severity === 'medium' && 'Moyenne'}
                        {bug.severity === 'low' && 'Faible'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{bug.description}</p>
                    {bug.steps && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Étapes pour reproduire:</p>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{bug.steps}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-sm text-gray-500">
                        {new Date(bug.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateBugStatus(bug.id, 'open')}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${bug.status === 'open' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          Ouvert
                        </button>
                        <button
                          onClick={() => updateBugStatus(bug.id, 'in-progress')}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${bug.status === 'in-progress' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          En cours
                        </button>
                        <button
                          onClick={() => updateBugStatus(bug.id, 'resolved')}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${bug.status === 'resolved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          Résolu
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteBug(bug.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
