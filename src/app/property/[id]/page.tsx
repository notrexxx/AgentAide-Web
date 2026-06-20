import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

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

  return {
    title: `${data.name} | AgentAide`,
    description: data.description || 'View this exclusive property dossier.',
    openGraph: {
      title: data.name,
      description: data.description || 'View this exclusive property dossier.',
      images: data.cover_image_url ? [data.cover_image_url] : [],
      type: 'website',
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
      
      {/* Edge-to-Edge Hero Banner with Soft Gradient Overlay */}
      {data.cover_image_url ? (
        <div className="w-full h-[45vh] md:h-[55vh] relative bg-slate-200">
          <img 
            src={data.cover_image_url} 
            alt={data.name} 
            className="w-full h-full object-cover"
          />
          {/* Subtle bottom gradient to blend the image into the background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        </div>
      ) : (
        <div className="w-full h-[35vh] bg-slate-200 flex items-center justify-center">
          <span className="text-muted font-medium">No cover image available</span>
        </div>
      )}

      {/* Floating Glassmorphism Content Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-surface rounded-3xl shadow-glass p-8 md:p-12 border border-slate-100">
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
                {data.name}
              </h1>
              <p className="text-muted flex items-center gap-2 text-lg font-medium">
                <span className="text-primary text-xl">📍</span> 
                {data.address || 'Exact address provided upon booking confirmation.'}
              </p>
            </div>
            
            {/* Optional Call to Action / Price placeholder if needed in the future */}
            <div className="hidden md:block">
               <div className="bg-primary/10 text-primary px-6 py-3 rounded-full font-bold tracking-wide">
                  Verified Property
               </div>
            </div>
          </div>

          {/* Premium Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-12">
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

          {/* Elegant Description Section */}
          <div className="pt-2 pb-8">
            <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              About this property
            </h2>
            <p className="text-muted leading-relaxed whitespace-pre-line text-lg font-medium">
              {data.description || 'No formal description has been provided for this property.'}
            </p>
          </div>

          {/* Modern Masonry-style Image Gallery */}
          {data.gallery_urls && data.gallery_urls.length > 0 && (
            <div className="border-t border-slate-100 pt-10 mt-4">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
                <span className="w-8 h-1 bg-secondary rounded-full"></span>
                Property Gallery
              </h2>
              {/* Using auto-rows-min and columns for a more dynamic look */}
              <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                {data.gallery_urls.map((url: string, index: number) => (
                  <div key={index} className="w-full relative bg-slate-100 rounded-2xl overflow-hidden group break-inside-avoid shadow-sm hover:shadow-md transition-shadow duration-300">
                    <img 
                      src={url} 
                      alt={`${data.name} Gallery Image ${index + 1}`} 
                      className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-in-out"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}