import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, ExternalLink } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import NavigationBar from '@/components/NavigationBar';

const Contact = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Envoi en cours...');

    const response = await fetch('http://localhost/XAMPP/api/send_contact.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, message })
    });

    const result = await response.text();
    setStatus(result);
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
            <h1 className="text-lg font-semibold">Contactez-nous</h1>
          </div>

          <div className="section-container">
            <div className="glass-panel p-6 space-y-6">
              {/* Informations de contact */}
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tram-light mb-4">
                    <Mail size={28} className="text-tram" />
                  </div>
                  <h2 className="text-xl font-semibold">Envoyez-nous un message</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Nous vous répondrons dans les plus brefs délais
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                  <textarea
                    placeholder="Votre message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg h-32"
                  />
                  <button type="submit" className="w-full bg-tram text-white py-2 rounded-lg">
                    Envoyer
                  </button>
                  {status && <p className="text-center text-sm text-gray-600 mt-2">{status}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
        <NavigationBar />
      </div>
    </PageTransition>
  );
};

export default Contact;
