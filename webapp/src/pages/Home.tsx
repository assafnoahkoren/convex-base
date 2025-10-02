import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function Home() {
  const { signOut } = useAuthActions();
  const viewer = useQuery(api.users.currentUser);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Home</h1>
        <button onClick={() => signOut()}>Logout</button>
      </div>
      <p>Welcome, {viewer?.email || 'User'}!</p>
    </div>
  );
}
