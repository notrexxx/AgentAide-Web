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
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg font-semibold text-slate-500">Property not found or access restricted.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* Edge-to-Edge Hero Banner */}
      {data.cover_image_url ? (
        <div className="w-full h-[40vh] md:h-[50vh] relative bg-slate-200">
          <img 
            src={data.cover_image_url} 
            alt={data.name} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-[30vh] bg-slate-200 flex items-center justify-center">
          <span className="text-slate-400">No cover image available</span>
        </div>
      )}

      {/* Floating Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100">
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {data.name}
          </h1>
          
          <p className="text-slate-500 mb-8 flex items-center gap-2">
            <span className="text-lg">📍</span> 
            {data.address || 'Exact address provided upon booking confirmation.'}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
              <div className="text-2xl mb-1">🛏️</div>
              <div className="text-xl font-bold text-slate-800">{data.rooms_count || 0}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-semibold">Rooms</div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-xl font-bold text-slate-800">{data.max_guests || 1}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-semibold">Capacity</div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
              <div className="text-2xl mb-1">{data.pets_allowed ? '🐾' : '🚫'}</div>
              <div className="text-xl font-bold text-slate-800">{data.pets_allowed ? 'Yes' : 'No'}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-semibold">Pets</div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About this property</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
              {data.description || 'No formal description has been provided for this property.'}
            </p>
          </div>

          {/* The Full Image Gallery Grid */}
          {data.gallery_urls && data.gallery_urls.length > 0 && (
            <div className="border-t border-slate-100 pt-8 mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Property Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.gallery_urls.map((url: string, index: number) => (
                  <div key={index} className="w-full h-64 relative bg-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <img 
                      src={url} 
                      alt={`${data.name} Gallery Image ${index + 1}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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