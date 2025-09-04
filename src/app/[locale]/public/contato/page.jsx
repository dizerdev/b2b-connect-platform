// app/(dashboard)/lojista/contato/page.tsx
'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: '',
  });
  const [enviado, setEnviado] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Aqui você pode integrar com API de envio de email (Resend, SMTP etc.)
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className='flex flex-col items-center justify-center py-20 px-4 text-center'>
        <h2 className='text-2xl font-bold text-green-600 mb-4'>
          Mensagem enviada com sucesso!
        </h2>
        <p className='text-gray-700 max-w-lg'>
          Obrigado por entrar em contato. Nossa equipe retornará em breve.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center py-20 px-4'>
      <h1 className='text-3xl font-bold mb-6'>Fale Conosco</h1>
      <p className='text-gray-600 mb-10 max-w-xl text-center'>
        Preencha o formulário abaixo e nossa equipe entrará em contato o quanto
        antes.
      </p>

      <form
        onSubmit={handleSubmit}
        className='w-full max-w-lg bg-white p-6 rounded-2xl shadow-md space-y-4'
      >
        <div>
          <label className='block text-sm font-medium mb-1'>Nome</label>
          <input
            type='text'
            name='nome'
            value={formData.nome}
            onChange={handleChange}
            required
            className='w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>E-mail</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Mensagem</label>
          <textarea
            name='mensagem'
            value={formData.mensagem}
            onChange={handleChange}
            rows={4}
            required
            className='w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>

        <button
          type='submit'
          className='flex items-center justify-center gap-2 w-full rounded-lg bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 transition'
        >
          <Send size={16} /> Enviar
        </button>
      </form>
    </div>
  );
}
