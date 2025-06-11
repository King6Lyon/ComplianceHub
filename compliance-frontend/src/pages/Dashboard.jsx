import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth-context';
import { useFramework } from '../hooks/useFramework';
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

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        
        <main className="flex-1 overflow-y-auto p-4">
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Framework Progress</h2>
              {currentFramework ? (
                <FrameworkProgress framework={currentFramework} />
              ) : (
                <p className="text-gray-500">No framework selected</p>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
              <TaskList tasks={tasks.slice(0, 5)} />
            </div>
          </div>
          
          {/* Additional dashboard widgets can be added here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;