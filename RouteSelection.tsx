import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Route } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import NavigationBar from '@/components/NavigationBar';
import StationSelector from '@/components/StationSelector';
import { toast } from '@/components/ui/use-toast';

const RouteSelection = () => {
  const navigate = useNavigate();
  const [departureStation, setDepartureStation] = useState('');
  const [arrivalStation, setArrivalStation] = useState('');
  const [travelTime, setTravelTime] = useState<number | null>(null);
  const [routeDetails, setRouteDetails] = useState<{ station: string; heure: string }[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateRoute = async () => {
    if (!departureStation || !arrivalStation) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner les stations de départ et d'arrivée.",
        variant: "destructive",
      });
      return;
    }

    if (departureStation === arrivalStation) {
      toast({
        title: "Sélection invalide",
        description: "Les stations de départ et d'arrivée doivent être différentes.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    try {
      // 🔗 Appel à l'API PHP
      const response = await fetch(
        `http://localhost/api/get_travel_time.php?departure=${departureStation}&arrival=${arrivalStation}`
      );

      const data = await response.json();
      console.log("🔍 Réponse API :", data); // Debugging

      if (!response.ok || data.error) {
        throw new Error(data.error || "Erreur inconnue lors du calcul du trajet.");
      }

      // 🕐 Arrondi du temps de trajet pour un affichage propre
      setTravelTime(Math.round(data.travelTime));

      // 🛤️ Ajout des détails du trajet
      setRouteDetails(data.details || []);

    } catch (error) {
      console.error("❌ Erreur lors de la récupération du temps de trajet :", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer le temps de trajet. Vérifiez votre connexion et réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <PageTransition>
      <div className="app-container">
        <div className="flex-1 overflow-auto">
          {/* 🔙 Bouton Retour */}
          <div className="p-4 bg-white border-b border-gray-200 flex items-center">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold">Calculateur de trajet</h1>
          </div>

          <div className="section-container">
            <div className="glass-panel p-6">
              {/* 🚆 Icône et titre */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tram-light mb-4">
                  <Route size={28} className="text-tram" />
                </div>
                <h2 className="text-xl font-semibold">Calculateur de trajet</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Sélectionnez vos stations de départ et d'arrivée
                </p>
              </div>

              <div className="space-y-6">
                {/* 📍 Sélection des stations */}
                <div className="space-y-4">
                  <StationSelector
                    label="Station de départ"
                    onChange={setDepartureStation}
                    value={departureStation}
                  />

                  <StationSelector
                    label="Station d'arrivée"
                    onChange={setArrivalStation}
                    value={arrivalStation}
                  />
                </div>

                {/* 🚀 Bouton Calculer */}
                <div className="pt-4">
                  <button
                    className={`button-tram w-full py-3 ${isCalculating ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={handleCalculateRoute}
                    disabled={isCalculating}
                  >
                    {isCalculating ? 'Calcul en cours...' : 'Calculer le trajet'}
                  </button>
                </div>

                {/* 🕒 Affichage du temps de trajet */}
                {travelTime !== null && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <Clock size={18} className="inline mr-2 text-tram" />
                      Résultat du calcul
                    </h3>
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temps de trajet :</span>
                        <span className="font-medium">{travelTime} minutes</span>
                      </div>
                    </div>

                    {/* 🛤️ Affichage des stations et heures */}
                    {routeDetails.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Détail du trajet :</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {routeDetails.map((item, index) => (
                            <li key={index} className="flex justify-between border-b border-gray-100 pb-1">
                              <span>{item.station}</span>
                              <span className="text-gray-500">{item.heure}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <NavigationBar />
      </div>
    </PageTransition>
  );
};

export default RouteSelection;
