import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import PageTransition from "@/components/PageTransition";
import NavigationBar from "@/components/NavigationBar";

const Evaluation = () => {
  const navigate = useNavigate();
  const [statut, setStatut] = useState("Chargement...");
  const [imagePath, setImagePath] = useState("");

  // Fonction pour récupérer le statut et l'image depuis l'API
  const fetchStatut = async () => {
    try {
      const response = await axios.get("http://localhost/api/getStatut.php");
      setStatut(response.data.statut);
      setImagePath(response.data.image_path);
    } catch (error) {
      console.error("Erreur lors de la récupération du statut", error);
      setStatut("Erreur de connexion");
    }
  };

  useEffect(() => {
    fetchStatut();
    const interval = setInterval(fetchStatut, 60000); // Mise à jour toutes les minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition>
      <div className="app-container">
        <div className="flex-1 overflow-auto">
          {/* Barre de navigation */}
          <div className="p-4 bg-white border-b border-gray-200 flex items-center">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold">Statut Actuel</h1>
          </div>

          {/* Contenu principal */}
          <div className="section-container flex flex-col items-center justify-center h-full">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Statut Actuel</h2>
              <p className="text-sm px-4 py-2 rounded-md bg-gray-100 text-gray-700">
                {statut}
              </p>
            </div>

            {/* Affichage de l'image */}
            {imagePath && (
              <img 
                src={imagePath} 
                alt="Statut actuel"
                className="w-64 h-64 object-cover rounded-lg shadow-md"
              />
            )}
          </div>
        </div>
        <NavigationBar />
      </div>
    </PageTransition>
  );
};

export default Evaluation;
