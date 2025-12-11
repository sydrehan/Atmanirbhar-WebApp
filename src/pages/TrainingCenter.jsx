import React from 'react';
import { ResourceCard } from '../components/Training/ResourceCard';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MobileBottomNav } from '../components/Layout/MobileBottomNav';

const RESOURCES = [
  { id: 1, title: 'Earthquake Safety Protocol: Drop, Cover, Hold On', type: 'VIDEO', duration: '5:20', thumbnail: 'https://images.unsplash.com/photo-1584036561566-b93a90a6b98c?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: 'First Aid Basics for Trauma Injuries', type: 'VIDEO', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400' },
  { id: 3, title: 'Flood Evacuation Route Guide', type: 'PDF', duration: '2.4 MB', thumbnail: 'https://images.unsplash.com/photo-1469521669194-babb45f999f1?auto=format&fit=crop&q=80&w=400' },
  { id: 4, title: 'Fire Extinguisher Usage Drill', type: 'VIDEO', duration: '3:15', thumbnail: 'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&q=80&w=400' },
  { id: 5, title: 'Emergency Kit Checklist', type: 'PDF', duration: '1.1 MB', thumbnail: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=400' },
  { id: 6, title: 'CPR Certification Course', type: 'VIDEO', duration: '45:00', thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400' },
];

export const TrainingCenter = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <header className="mb-8">
           <div className="mb-6">
             <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl hover:border-slate-700">
                <ArrowLeft className="w-4 h-4" /> Back to Website
             </Link>
           </div>
           <div>
            <h2 className="text-3xl font-bold text-white flex items-center mb-2">
              <BookOpen className="w-8 h-8 mr-3 text-blue-500" />
              Safety Video Library
            </h2>
            <p className="text-slate-400">Essential training materials and safety protocols for disaster preparedness.</p>
           </div>
        </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
        {RESOURCES.map(resource => (
          <ResourceCard key={resource.id} {...resource} />
        ))}
      </div>
      <MobileBottomNav active="videos" />
      </div>
    </div>
  );
};
