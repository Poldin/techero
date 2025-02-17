import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  price: string;
}

const SERVICES: Service[] = [
  {
    id: 'analysis',
    title: 'Analisi e Fattibilità',
    price: '€1.500 + IVA'
  },
  {
    id: 'suppliers',
    title: 'Selezione Fornitori',
    price: '€1.500 + IVA'
  },
  {
    id: 'monitoring',
    title: 'Esecuzione, sviluppo e delivery',
    price: '3% del valore totale'
  }
];

interface FormData {
  name: string;
  email: string;
  projectDescription: string;
  selectedServices: string[];
  priority: number;
}

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    projectDescription: '',
    selectedServices: [],
    priority: 5
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Errore nell\'invio');
      }

      setShowSuccess(true);
      
      setFormData({ 
        name: '', 
        email: '', 
        projectDescription: '',
        selectedServices: [],
        priority: 5
      });

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const getPriorityColor = (value: number): string => {
    if (value <= 3) return 'text-green-400';
    if (value <= 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-white/[.1] p-8 rounded text-center min-w-[60vw]">
          <h2 className="text-xl text-white font-medium mb-2">Top, ci sentiamo a breve.</h2>
          <p className="text-white/60">Stay tuned.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 rounded">
      <div className="bg-gray-900 border border-white/[.1] w-full max-w-md p-8 relative rounded min-w-[60vw] max-h-screen overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl text-white font-medium mb-6">Raccontaci.</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-white/60 mb-2">il tuo nome?</label>
            <input
              type="text"
              className="w-full p-2 bg-white/5 border border-white/[.1] text-white focus:outline-none focus:border-white/20 rounded"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">la tua email?</label>
            <input
              type="email"
              className="w-full p-2 bg-white/5 border border-white/[.1] text-white focus:outline-none focus:border-white/20 rounded"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-4">di quali servizi pensi di aver bisogno? [easy: non paghi nulla finché non firmiamo.]</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SERVICES.map(service => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={`p-4 border ${
                    formData.selectedServices.includes(service.id)
                      ? 'border-white/20 bg-white/10'
                      : 'border-white/[.1] bg-white/5'
                  } hover:border-white/20 transition-colors rounded group`}
                >
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <h3 className="text-white font-medium text-sm">{service.title}</h3>
                      <p className="text-sm text-white/40 mt-1">{service.price}</p>
                    </div>
                    <div className={`w-5 h-5 border ${
                      formData.selectedServices.includes(service.id)
                        ? 'border-white bg-white'
                        : 'border-white/20'
                    } rounded flex items-center justify-center transition-colors`}>
                      {formData.selectedServices.includes(service.id) && (
                        <Check size={14} className="text-black" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">raccontaci di più, che progetto hai in mente?</label>
            <textarea
              className="w-full p-2 bg-white/5 border border-white/[.1] text-white h-20 focus:outline-none focus:border-white/20 rounded"
              value={formData.projectDescription}
              onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">
              quanto è urgente?{' '}
              <span className={`${getPriorityColor(formData.priority)} font-medium`}>
                {formData.priority}
              </span>
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/40">Non urgente</span>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(90deg, 
                    white ${formData.priority * 10}%, 
                    rgba(255,255,255,0.1) ${formData.priority * 10}%)`
                }}
              />
              <span className="text-xs text-white/40">Molto urgente</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black px-6 py-2 text-sm hover:bg-white/90 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Invio in corso...' : 'Invia'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm border border-white/[.1] text-white hover:bg-white/5 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;