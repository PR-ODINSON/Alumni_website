import { useQuery } from '@tanstack/react-query';
import { alumniApi, analyticsApi, successStoryApi, eventApi } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

// Subcomponents
import Hero from './home/components/Hero';
import Features from './home/components/Features';
import StoriesPreview from './home/components/StoriesPreview';
import EventsPreview from './home/components/EventsPreview';
import AlumniPreview from './home/components/AlumniPreview';
import Cta from './home/components/Cta';
import Footer from './home/components/Footer';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  const { data: statsData } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsApi.getOverview(),
  });

  const { data: distinguishedData } = useQuery({
    queryKey: ['distinguished-alumni'],
    queryFn: () => alumniApi.getDistinguished(),
  });

  const { data: storiesData } = useQuery({
    queryKey: ['featured-stories'],
    queryFn: () => successStoryApi.getAll({ featured: true, limit: 3 }),
  });

  const { data: eventsData } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => eventApi.getAll({ upcoming: true, limit: 4 }),
  });

  const stats = statsData?.data?.data;
  const featured = distinguishedData?.data?.data?.slice(0, 3) || [];
  const stories = storiesData?.data?.data || [];
  const events = eventsData?.data?.data || [];

  return (
    <div className="overflow-x-hidden min-h-screen bg-transparent">
      {/* Hero Section */}
      <Hero stats={stats} isAuthenticated={isAuthenticated} />

      {/* Platform Features */}
      <Features />

      {/* Success Stories Preview */}
      <StoriesPreview stories={stories} />

      {/* Upcoming Events */}
      <EventsPreview events={events} />

      {/* Distinguished Alumni */}
      <AlumniPreview featured={featured} />

      {/* Call to Action */}
      <Cta />

      {/* Footer */}
      <Footer />
    </div>
  );
}
