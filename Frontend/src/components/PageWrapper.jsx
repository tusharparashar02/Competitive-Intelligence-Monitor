import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ConnectionStatus from './ui/ConnectionStatus';
import { useSignalR } from '../hooks/useSignalR';

export default function PageWrapper({ children }) {
  const { status } = useSignalR();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-slate-900 p-4 lg:p-6">
          {children}
        </main>
      </div>
      <ConnectionStatus status={status} />
    </div>
  );
}
