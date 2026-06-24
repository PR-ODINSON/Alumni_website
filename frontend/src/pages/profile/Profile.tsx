import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import AlumniProfilePage from '../alumni/AlumniProfile';

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuthStore();
  const targetId = userId || user?._id;

  if (!targetId) return null;

  // Reuse alumni profile page with the user's own ID
  return <AlumniProfilePage userId={targetId} />;
}
