import MapView from '@/components/dashboard/map-view';

export default function MapViewPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-3xl">
        <MapView />
      </div>
    </div>
  );
} 