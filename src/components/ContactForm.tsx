"use client";

import React, { useState } from 'react';
import { Send, Mail, MessageCircle, CheckCircle, AlertCircle, Phone } from 'lucide-react';

interface ContactFormProps {
  recipientEmail: string;
  businessName: string;
}

interface FormData {
  email: string;
  phone: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function ContactForm({ recipientEmail, businessName }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    message: ''
  });
  
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.message) {
      setStatus({
        type: 'error',
        message: 'Per favore compila tutti i campi richiesti.'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: 'error',
        message: 'Per favore inserisci un indirizzo email valido.'
      });
      return;
    }

    setStatus({ type: 'loading' });

    try {
      const response = await fetch('/api/att/contactform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderEmail: formData.email,
          senderPhone: formData.phone,
          recipientEmail: recipientEmail,
          message: formData.message,
          businessName: businessName
        }),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Messaggio inviato con successo! Ti risponderemo al più presto.'
        });
        setFormData({ email: '', phone: '', message: '' });
      } else {
        throw new Error('Errore nell\'invio del messaggio');
      }
    } catch  {
      setStatus({
        type: 'error',
        message: 'Errore nell\'invio del messaggio. Riprova più tardi o contattaci direttamente.'
      });
    }
  };

  return (
    <div className="mt-6 rounded-2xl border bg-white p-5 shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="text-green-600" size={18} />
        <h3 className="font-semibold">Inviaci un messaggio</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Hai domande sui nostri prodotti o servizi? Compila il form qui sotto e ti risponderemo al più presto.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <Mail size={14} className="inline mr-1" />
            La tua email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="esempio@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            disabled={status.type === 'loading'}
            required
          />
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            <Phone size={14} className="inline mr-1" />
            Telefono (opzionale)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="es. 049 123 4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            disabled={status.type === 'loading'}
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            <MessageCircle size={14} className="inline mr-1" />
            Il tuo messaggio *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Scrivi qui la tua richiesta..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-vertical"
            disabled={status.type === 'loading'}
            required
          />
        </div>

        {/* Status Messages */}
        {status.message && (
          <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : status.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : ''
          }`}>
            {status.type === 'success' && <CheckCircle size={16} />}
            {status.type === 'error' && <AlertCircle size={16} />}
            {status.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status.type === 'loading' || !formData.email || !formData.message}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {status.type === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Invio in corso...
            </>
          ) : (
            <>
              <Send size={16} />
              Invia messaggio
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-3">
        * Campi obbligatori. I tuoi dati saranno trattati nel rispetto della privacy.
      </p>
    </div>
  );
}
