import { Metadata } from 'next';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import PropertyGallery from '@/components/PropertyGallery';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  const { data } = await supabase
    .from('public_dossiers')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!data) {
    return { title: 'Property Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agent-aide-web.vercel.app';

  return {
    title: `${data.name} | AgentAide`,
    description: data.description || 'View this exclusive property dossier.',
    openGraph: {
      title: data.name,
      description: data.description || 'View this exclusive property dossier.',
      url: `${baseUrl}/property/${resolvedParams.id}`,
      siteName: 'AgentAide',
      images: data.og_thumbnail_url ? [
        {
          url: data.og_thumbnail_url,
          width: 1200, 
          height: 630, 
          alt: `Cover image for ${data.name}`,
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.name,
      description: data.description || 'View this exclusive property dossier.',
      images: data.og_thumbnail_url ? [data.og_thumbnail_url] : [],
    },
  };
}

export default async function PropertyDossier({ params }: Props) {
  const resolvedParams = await params;

  const { data, error } = await supabase
    .from('public_dossiers')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-lg font-medium text-muted">Property not found or access restricted.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      
      {/* Edge-to-Edge Hero Banner */}
      {data.cover_image_url ? (
        <div className="w-full h-[45vh] md:h-[55vh] relative bg-slate-200">
          <Image 
            src={data.cover_image_url} 
            alt={data.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-90" />
        </div>
      ) : (
        <div className="w-full h-[35vh] bg-slate-200 flex items-center justify-center">
          <span className="text-muted font-medium">No cover image available</span>
        </div>
      )}

      {/* Floating Glassmorphism Content Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-surface rounded-3xl shadow-glass p-8 md:p-12 border border-slate-100">
          
          {/* Header Section - Fades in first */}
          <div 
            className="opacity-0 animate-fade-in-up flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8"
            style={{ animationDelay: '150ms' }}
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
                {data.name}
              </h1>
              <p className="text-muted flex items-center gap-2 text-lg font-medium">
                <span className="text-primary text-xl">📍</span> 
                {data.address || 'Exact address provided upon booking confirmation.'}
              </p>
            </div>
            
            <div className="hidden md:block">
               <div className="bg-primary/10 text-primary px-6 py-3 rounded-full font-bold tracking-wide">
                  Verified Property
               </div>
            </div>
          </div>

          {/* Premium Quick Stats Grid - Fades in second */}
          <div 
            className="opacity-0 animate-fade-in-up grid grid-cols-3 gap-4 md:gap-6 mb-12"
            style={{ animationDelay: '300ms' }}
          >
            <div className="bg-background/50 p-6 rounded-2xl text-center border border-slate-100 hover:border-primary/20 hover:bg-white transition-all duration-300">
              <div className="text-3xl mb-2">🛏️</div>
              <div className="text-2xl font-bold text-foreground">{data.rooms_count || 0}</div>
              <div className="text-sm text-muted uppercase tracking-widest mt-1 font-semibold">Rooms</div>
            </div>
            
            <div className="bg-background/50 p-6 rounded-2xl text-center border border-slate-100 hover:border-primary/20 hover:bg-white transition-all duration-300">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-foreground">{data.max_guests || 1}</div>
              <div className="text-sm text-muted uppercase tracking-widest mt-1 font-semibold">Capacity</div>
            </div>
            
            <div className="bg-background/50 p-6 rounded-2xl text-center border border-slate-100 hover:border-primary/20 hover:bg-white transition-all duration-300">
              <div className="text-3xl mb-2">{data.pets_allowed ? '🐾' : '🚫'}</div>
              <div className="text-2xl font-bold text-foreground">{data.pets_allowed ? 'Yes' : 'No'}</div>
              <div className="text-sm text-muted uppercase tracking-widest mt-1 font-semibold">Pets</div>
            </div>
          </div>

          {/* Elegant Description Section - Fades in third */}
          <div 
            className="opacity-0 animate-fade-in-up pt-2 pb-8"
            style={{ animationDelay: '450ms' }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              About this property
            </h2>
            <p className="text-muted leading-relaxed whitespace-pre-line text-lg font-medium">
              {data.description || 'No formal description has been provided for this property.'}
            </p>
          </div>

          {/* The Interactive Client Component - Animation handled inside */}
          <PropertyGallery images={data.gallery_urls} propertyName={data.name} />

        </div>
      </div>
    </main>
  );
}