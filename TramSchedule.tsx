import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import StationSelector from "@/components/StationSelector";
import NavigationBar from "@/components/NavigationBar";
import { tramService } from "@/services/tramService";
import { Skeleton } from "@/components/ui/skeleton";

interface TramScheduleData {
  station: string;
  route: string;
  nextTrams: { time: string }[];
}

const TramSchedule = () => {
  const navigate = useNavigate();
  const [station, setStation] = useState("");
  const [route, setRoute] = useState<"v1" | "v2" | "">("");
  const [isStationSelected, setIsStationSelected] = useState(false);
  const [scheduleData, setScheduleData] = useState<TramScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedTrams, setUpdatedTrams] = useState<{ time: string; remainingTime: number }[]>([]);

  const handleStationChange = (selectedStation: string) => {
    setStation(selectedStation);
    setIsStationSelected(true);
    setScheduleData(null);
  };

  const handleRouteSelect = (selectedRoute: "v1" | "v2") => {
    setRoute(selectedRoute);
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (!station || !route) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await tramService.getScheduleForStation(station, route);
        if (!response) {
          throw new Error("L'API a renvoyé une réponse vide.");
        }
        setScheduleData(response);
      } catch (err: any) {
        setError(`Impossible de récupérer les horaires. Détail : ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, [station, route]);

  // 🔄 Mise à jour des temps restants toutes les minutes
  useEffect(() => {
    const updateRemainingTimes = () => {
      if (!scheduleData || scheduleData.nextTrams.length === 0) return;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const updatedTimes = scheduleData.nextTrams.map((tram) => {
        const [hours, minutes] = tram.time.split(":").map(Number);
        const tramMinutes = hours * 60 + minutes;
        const remainingTime = tramMinutes - currentMinutes;

        return {
          time: tram.time,
          remainingTime: remainingTime > 0 ? remainingTime : 0, // 🔥 Évite les négatifs
        };
      });

      setUpdatedTrams(updatedTimes);
    };

    updateRemainingTimes();
    const interval = setInterval(updateRemainingTimes, 60000);

    return () => clearInterval(interval);
  }, [scheduleData]);

  return (
    <PageTransition>
      <div className="app-container">
        <div className="flex-1 overflow-auto">
          <div className="p-4 bg-white border-b border-gray-200 flex items-center">
            <button onClick={() => navigate("/")} className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold">Horaire du tramway</h1>
          </div>

          <div className="section-container">
            <div className="glass-panel p-4">
              <StationSelector label="Sélectionner une station" onChange={handleStationChange} value={station} />

              {isStationSelected && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <p className="text-sm font-medium text-gray-700">Sélectionner le sens :</p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleRouteSelect("v1")}
                      className={`p-3 border rounded-lg text-sm transition-all ${
                        route === "v1" ? "border-tram bg-tram-light text-tram-dark" : "border-gray-200 hover:border-tram hover:bg-tram-light"
                      }`}
                    >
                      L1: Gare Routière Sud → Les Cascades
                    </button>

                    <button
                      onClick={() => handleRouteSelect("v2")}
                      className={`p-3 border rounded-lg text-sm transition-all ${
                        route === "v2" ? "border-tram bg-tram-light text-tram-dark" : "border-gray-200 hover:border-tram hover:bg-tram-light"
                      }`}
                    >
                      L2: Les Cascades → Gare Routière Sud
                    </button>
                  </div>
                </div>
              )}

              {route && (
                <div className="mt-8 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Prochain tramway</h3>
                    <div className="flex items-center text-tram">
                      <Clock size={16} className="mr-1" />
                      <span className="text-sm">Temps restant</span>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="border border-gray-200 rounded-lg p-4 space-y-2 bg-white">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4 mt-4" />
                    </div>
                  ) : error ? (
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50 text-red-600">{error}</div>
                  ) : updatedTrams.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <ul className="space-y-2">
                        {updatedTrams.map((tram, index) => (
                          <li key={index} className="flex justify-between items-center">
                            <span className="text-gray-700">{tram.time}</span>
                            <span className="text-lg font-bold text-tram-dark">
                              {tram.remainingTime > 0 ? `${tram.remainingTime} min` : "En station"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Aucun tramway disponible</p>
                  )}
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

export default TramSchedule;
