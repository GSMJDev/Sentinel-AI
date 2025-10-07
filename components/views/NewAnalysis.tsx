
import React, { useState, useCallback } from 'react';
import { UploadIcon } from '../icons/UploadIcon';
import { GithubIcon } from '../icons/GithubIcon';
import type { AnalysisStatus } from '../../types';

interface NewAnalysisProps {
  onStartAnalysis: (files: FileList) => void;
  status: AnalysisStatus;
}

export const NewAnalysis: React.FC<NewAnalysisProps> = ({ onStartAnalysis, status }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleSubmit = () => {
    if (files) {
      onStartAnalysis(files);
    }
  };

  if (status === 'Analyzing') {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
             <div className="relative flex justify-center items-center">
                <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#8B5CF6]"></div>
                <svg className="h-16 w-16 text-[#8B5CF6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mt-8">Analisando seu código...</h2>
            <p className="text-[#9E9E9E] mt-2">A IA está procurando por vulnerabilidades. Isso pode levar alguns momentos.</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Nova Análise de Segurança</h1>
        <p className="text-[#9E9E9E] mt-2">Envie seu código-fonte ou conecte seu repositório para começar.</p>
      </div>

      <div className="bg-[#2C2C2C] p-8 rounded-lg">
        <label
          htmlFor="file-upload"
          onDragEnter={handleDragEvents}
          onDragOver={handleDragEvents}
          onDragLeave={handleDragEvents}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#9E9E9E] rounded-lg cursor-pointer transition-colors ${isDragging ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]' : 'hover:bg-[#1A1A1A]'}`}
        >
          <UploadIcon className="h-12 w-12 text-[#9E9E9E]" />
          <p className="mt-4 text-lg font-semibold text-white">Arraste e solte seus arquivos aqui</p>
          <p className="text-sm text-[#9E9E9E]">ou clique para selecionar</p>
          <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
        </label>
        {files && (
          <div className="mt-4 text-center text-[#66BB6A]">
            {files.length} arquivo(s) selecionado(s).
          </div>
        )}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-[#9E9E9E]"></div>
          <span className="flex-shrink mx-4 text-[#9E9E9E]">OU</span>
          <div className="flex-grow border-t border-[#9E9E9E]"></div>
        </div>
        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 bg-[#1A1A1A] px-6 py-3 rounded-lg hover:bg-[#383838] transition-colors">
            <GithubIcon className="h-6 w-6" />
            <span className="font-semibold">Conectar GitHub</span>
          </button>
        </div>
      </div>

      <div className="bg-[#2C2C2C] p-8 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Opções de Análise</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-4 bg-[#1A1A1A] rounded-md cursor-pointer">
            <input type="checkbox" className="h-5 w-5 rounded bg-[#2C2C2C] border-[#9E9E9E] text-[#8B5CF6] focus:ring-[#8B5CF6]" defaultChecked />
            <span>Análise Profunda</span>
          </label>
           <label className="flex items-center gap-3 p-4 bg-[#1A1A1A] rounded-md cursor-pointer">
            <input type="checkbox" className="h-5 w-5 rounded bg-[#2C2C2C] border-[#9E9E9E] text-[#8B5CF6] focus:ring-[#8B5CF6]" defaultChecked />
            <span>Dependências</span>
          </label>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!files}
          className="bg-[#8B5CF6] text-white font-bold py-4 px-12 rounded-lg text-lg hover:bg-opacity-80 transition-transform hover:scale-105 disabled:bg-[#9E9E9E] disabled:cursor-not-allowed disabled:scale-100"
        >
          Iniciar Análise
        </button>
      </div>
    </div>
  );
};
