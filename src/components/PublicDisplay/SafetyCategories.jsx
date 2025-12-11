import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, Zap, Tornado, Milestone } from 'lucide-react';

export const SafetyCategories = () => {
  const categories = [
    {
      title: 'Flood',
      desc: 'Stay prepared for flood risks.',
      icon: Waves,
      color: 'bg-blue-900',
      iconColor: 'text-white',
      link: '/drills?type=flood'
    },
    {
      title: 'Earthquake',
      desc: 'Understand earthquake safety protocols.',
      icon: Zap,
      color: 'bg-orange-500',
      iconColor: 'text-white',
      link: '/drills?type=earthquake'
    },
    {
      title: 'Cyclone',
      desc: 'Track cyclone movement and alerts.',
      icon: Tornado,
      color: 'bg-red-500',
      iconColor: 'text-white',
      link: '/drills?type=cyclone'
    },
    {
      title: 'Evacuation Routes',
      desc: 'Find safe evacuation paths.',
      icon: Milestone,
      color: 'bg-orange-400',
      iconColor: 'text-white',
      link: '/routes'
    }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Safety Categories</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat, index) => (
          <Link 
            key={index} 
            to={cat.link}
            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group"
          >
            <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
              <cat.icon className={`w-6 h-6 ${cat.iconColor}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{cat.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
