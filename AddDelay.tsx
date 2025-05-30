import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import NavigationBar from '@/components/NavigationBar';
import { tramService } from '@/services/tramService';

const stationOptions = [
  "Gare Routière Sud", "Jardin Public", "Quatre Horloges", "Emir Abdelkader",
  "Adda Boudjalal", "Maternité", "La Radio", "Cite Hourie Boumediene", "La Daria", "La Place El Wiam",
  "Sidi Djilali", "Aadel", "Gare Routier Nord", "Nouvelle Gare Ferroviaire", "Compus Universitaire",
  "Centre El Niaama", "Faculté De Droit", "L'Environnement", "Abdelhak Ben Hamouda", "Les frere Adnane",
  "Gare Routier Est", "Les cascade"
];

const AddDelay = () => {
  const navigate = useNavigate();
  const [delayMinutes, setDelayMinutes] = useState(1);
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('v1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [nextTrams, setNextTrams] = useState<{ time: string; remaining_time: number }[]>([]);

  const delayOptions = Array.from({ length: 15 }, (_, i) => i + 1);

  const handleApplyDelay = async () => {
    setIsSubmitting(true);
    setResult(null);
    setNextTrams([]);

    try {
      const response = await tramService.applyDelay(
        selectedStation,
        selectedRoute,
        delayMinutes
      );

      if (!response.success) {
        setResult({ success: false, message: response.message });
      } else {
        setNextTrams(response.data || []);
        setResult({ success: true, message: response.message });
      }
    } catch (error) {
      setResult({ success: false, message: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-lg font-semibold">Ajouter un retard</h1>
          </div>

          <div className="section-container">
            <div className="glass-panel p-6 space-y-6">

              <div>
                <label className="block text-sm font-medium mb-1">Sélectionner une station:</label>
                <select
                  className="w-full p-3 rounded-lg border"
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                >
                  <option value="">-- Sélectionner une station --</option>
                  {stationOptions.map((station) => (
                    <option key={station} value={station}>{station}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sélectionner le sens :</label>
                <select
                  className="w-full p-3 rounded-lg border"
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                >
                  <option value="v1">L1: Gare Routière Sud → Les Cascades</option>
                  <option value="v2">L2: Les Cascades → Gare Routière Sud</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Retard (minutes)</label>
                <select
                  className="w-full p-3 rounded-lg border"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(parseInt(e.target.value))}
                >
                  {delayOptions.map((m) => (
                    <option key={m} value={m}>{m} {m === 1 ? "minute" : "minutes"}</option>
                  ))}
                </select>
              </div>

              <button
                className="button-tram w-full py-3"
                onClick={handleApplyDelay}
                disabled={isSubmitting || !selectedStation}
              >
                {isSubmitting ? "Application..." : "Appliquer le délai"}
              </button>

              {result && (
                <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  <div className="flex items-center">
                    {result.success ? <CheckCircle size={18} className="mr-2" /> : <AlertCircle size={18} className="mr-2" />}
                    <p>{result.message}</p>
                  </div>
                </div>
              )}

              {nextTrams.length > 0 && (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-sm font-semibold mb-2">Prochain tramway avec le retard:</h3>
                  {nextTrams.map((tram, index) => (
                    <p key={index} className="text-sm">
                      Tram "{index + 1}" : {tram.time} (Temps restant:{tram.remaining_time} min )
                    </p>
                  ))}
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

export default AddDelay;
