import React from 'react';
import Link from 'next/link';
import { 
  Download, 
  FileText, 
  BookOpen, 
  Calculator, 
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { BranchConfig } from '@/lib/branchConfig';

// Standardized interfaces
export interface ResourceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  downloadLink: string;
}

export interface ResourceData {
  pageTitle: string;
  description: string;
  resources: ResourceItem[];
}

interface ResourceListProps {
  data: ResourceData;
  config: BranchConfig;
  resourceType: string;
}

export default function ResourceList({ data, config, resourceType }: ResourceListProps) {
  
  // 1. Determine the header icon dynamically based on the URL parameter
  const getHeaderIcon = () => {
    if (resourceType.includes('pyq')) return FileText;
    if (resourceType.includes('note')) return BookOpen;
    if (resourceType.includes('formula')) return Calculator;
    return FolderOpen;
  };
  const HeaderIcon = getHeaderIcon();

  // 2. Generate a solid background class from the theme's text color (e.g., 'text-green-500' -> 'bg-green-500')
  const solidBgClass = config.theme.text.replace("text-", "bg-");

  return (
    <div className="w-full">
      
      {/* Dynamic Header */}
      <div className="mb-12 flex items-center gap-5">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg border ${config.theme.bgLight} ${config.theme.text} ${config.theme.border}`}>
          <HeaderIcon size={32} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {data.pageTitle}
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base max-w-2xl">
            {data.description}
          </p>
        </div>
      </div>

      {/* 3D Glassmorphism Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.resources.map((item) => (
          <div 
            key={item.id} 
            className={`group relative flex flex-col rounded-2xl border border-gray-800 bg-[#111216]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${config.theme.borderHover}`}
          >
            {/* Subtle top highlight for 3D depth */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex-grow">
              {/* Subtitle / Category Tag */}
              <span className={`inline-block mb-3 text-xs font-bold tracking-wider uppercase ${config.theme.text}`}>
                {item.subtitle}
              </span>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                {item.description}
              </p>
              
              {/* Dynamic Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {item.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase border ${config.theme.bgLight} ${config.theme.text} ${config.theme.border}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Dynamic Download Button */}
            <Link 
              href={item.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-auto inline-flex items-center justify-center w-full gap-2 rounded-xl py-3.5 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-[0.98] shadow-lg ${solidBgClass}`}
            >
              <Download size={18} className="transition-transform group-hover:-translate-y-0.5" />
              Download PDF
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}