
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, QrCode } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import NavigationBar from '@/components/NavigationBar';

const stations = [
  "Les Cascades",
  "Gare Routier Est",
  "Nouvelle Gare Ferroviaire",
  "Gare Routier Nord",
  "Gare Routier Sud"
];

const PaymentOptions = () => {
  const navigate = useNavigate();
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  return (
    <PageTransition>
      <div className="app-container">
        <div className="flex-1 overflow-auto">
          <div className="p-4 bg-white border-b border-gray-200 flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold">Options de paiement</h1>
          </div>

          <div className="section-container">
            <div className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-6">
                <Map size={20} className="text-tram" />
                <h2 className="text-lg font-semibold">Création des cartes</h2>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-6">
                {stations.map((station, index) => (
                  <button
                    key={index}
                    className={`p-4 border rounded-lg transition-all text-left ${
                      selectedStation === station
                        ? 'border-tram bg-tram-light'
                        : 'border-gray-200 hover:border-tram'
                    }`}
                    onClick={() => setSelectedStation(station)}
                  >
                    <p className="font-medium">{station}</p>
                  </button>
                ))}
              </div>

              {selectedStation && (
              

                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-sm text-center text-gray-600">
                      Le paiement en ligne est temporairement indisponible. 
                      Veuillez vous rendre à la station sélectionnée pour effectuer votre paiement.
                    </p>
                  </div>
                
              )}
            </div>
          </div>
        </div>
        <NavigationBar />
      </div>
    </PageTransition>
  );
};

export default PaymentOptions;
