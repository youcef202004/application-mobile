
import React from 'react';
import { Clock, Route, Calculator, Map, CreditCard, Mail } from 'lucide-react';
import Card from '@/components/Card';
import NavigationBar from '@/components/NavigationBar';
import PageTransition from '@/components/PageTransition';

const Index = () => {
  const cards = [
    { title: 'Horaire du Tramway', icon: Clock, path: '/schedule' },
    { title: 'Calculateur de Trijet', icon: Route, path: '/route' },
    { title: 'Ajouter du retard', icon: Calculator, path: '/delay' },
    { title: 'Statut Actuel', icon: Map, path: '/evaluation' },
    { title: 'Paiement en line', icon: CreditCard, path: '/payment' },
    { title: 'Contactez-nous', icon: Mail, path: '/contact' },
  ];

  return (
    <PageTransition>
      <div className="app-container">
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center mb-6">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-tram-dark">SETRAM</h1>
              <p className="text-sm text-gray-500">Bienvenu sur la plateforme du TRAMWAY</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-tram flex items-center justify-center text-white font-bold">
              SBA
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {cards.map((card, index) => (
              <div 
                key={index} 
                className="aspect-square"
                style={{ 
                  animation: `fade-in 0.3s ease-out forwards ${index * 0.1}s`,
                  opacity: 0
                }}
              >
                <Card {...card} />
              </div>
            ))}
          </div>
        </div>
        <NavigationBar />
      </div>
    </PageTransition>
  );
};

export default Index;
