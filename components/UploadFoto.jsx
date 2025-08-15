'use client';

import { UploadButton } from '@uploadthing/react';
import '@uploadthing/react/styles.css';

export default function UploadFoto() {
  return (
    <div>
      <UploadButton
        endpoint='imageUploader'
        onClientUploadComplete={(res) => {
          console.log('Upload completo:', res);
          alert('Upload feito com sucesso!');
        }}
        onUploadError={(error) => {
          alert(`Erro: ${error.message}`);
        }}
      />
    </div>
  );
}
