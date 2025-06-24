import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth-context';
import { useFramework } from '../context/framework-state';
import { getFrameworks } from '../api/frameworks';
import { getTasks } from '../api/tasks';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import FrameworkProgress from '../components/frameworks/FrameworkProgress';
import TaskList from '../components/tasks/TaskList';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';

const DashboardPage = () => {
  const { user } = useAuth();
  const { currentFramework, setFrameworks } = useFramework();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [frameworksData, tasksData] = await Promise.all([
          getFrameworks(),
          getTasks()
        ]);

        setFrameworks(frameworksData);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setFrameworks]);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header pleine largeur */}
      <Header user={user} />

      {/* Zone principale : Sidebar + contenu à droite */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar gauche */}
        <Sidebar />

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6 space-y-6">
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}

          {/* FrameworkProgress en haut */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Framework Progress</h2>
            {currentFramework ? (
              <FrameworkProgress framework={currentFramework} />
            ) : (
              <p className="text-gray-500">No framework selected</p>
            )}
          </div>

          {/* TaskList en dessous */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Upcoming Tasks</h2>
            <TaskList tasks={tasks.slice(0, 5)} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
