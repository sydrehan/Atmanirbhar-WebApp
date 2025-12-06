import React from 'react';
import { ResourceCard } from '../components/Training/ResourceCard';
import { BookOpen } from 'lucide-react';

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
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-disaster-red" />
          Training & Awareness Center
        </h2>
        <p className="text-slate-400 mt-1">Educational materials and safety protocols for personnel</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {RESOURCES.map(resource => (
            <ResourceCard key={resource.id} {...resource} />
          ))}
        </div>
      </div>
    </div>
  );
};
