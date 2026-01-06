// frontend/app/(protected)/dashboard/page.tsx
'use client'; // Ten komponent musi być Client Component
import { useAuth } from '@/hooks/auth';
import { useState } from 'react'; // Importujemy useState

export default function DashboardPage() {
  const { user } = useAuth({ middleware: 'auth' }); // Pobieramy usera z ochroną autoryzacji

  // Symulowane zadania dla sekcji My Day
  const [myDayTasks, setMyDayTasks] = useState([
    { id: 1, text: 'Zadanie testowe 1', isCompleted: false },
    { id: 2, text: 'Zadanie testowe 2 z dłuższą nazwą', isCompleted: true }, // To będzie przekreślone
    { id: 3, text: 'Kolejne ważne zadanie', isCompleted: false },
  ]);

  // Funkcja do przełączania stanu isCompleted
  const toggleTaskCompletion = (id: number) => {
    setMyDayTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Witaj {user ? user.name : 'ładowanie...'}!</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lewa Kolumna */}
        <div className="space-y-6">
          {/* Sekcja My Day */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">My Day</h2>
            <div className="space-y-3">
              {myDayTasks.map(task => (
                <div key={task.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="form-checkbox text-red-600 rounded focus:ring-red-500" // Czerwony checkbox
                  />
                  <span
                    className={`text-gray-900 ${task.isCompleted ? 'line-through text-gray-400' : ''}`}
                  >
                    {task.text}
                  </span>
                </div>
              ))}
              <button className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Dodaj zadanie
              </button>
            </div>
          </div>

          {/* Sekcja Goals */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Goals</h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-200 rounded p-4 flex flex-col items-center justify-center bg-gray-50">
                  <div className="font-medium text-gray-800">Cel {i}</div>
                  <div className="text-sm text-gray-500">3/4</div>
                </div>
              ))}
            </div>
             <button className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Dodaj cel
              </button>
          </div>
          
           {/* Sekcja Projects */}
           <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Projects</h2>
             <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-200 rounded p-4 flex flex-col items-center justify-center bg-gray-50">
                  <div className="font-medium text-gray-800">Projekt {i}</div>
                  <div className="text-sm text-gray-500">3/4</div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Dodaj projekt
              </button>
          </div>
        </div>

        {/* Prawa Kolumna - Statystyki */}
        <div className="space-y-6">
           <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics</h2>
            
            {/* Placeholder Kalendarza */}
            <div className="border border-gray-200 h-48 flex items-center justify-center bg-gray-50 mb-4">
              <span className="text-gray-400 text-center">Kalendarz z aktywnościami<br/>(na razie pusty)</span>
            </div>

            {/* Placeholder Wykresu */}
            <div className="border border-gray-200 h-48 flex items-center justify-center bg-gray-50">
               <span className="text-gray-400 text-center">Wykres Aktywności<br/>(na razie pusty)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
