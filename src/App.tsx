import { Empty } from './components/Empty';

import { useAppDataContext } from './context/AppContext';
import { Tab } from '@headlessui/react';
import { useState } from 'react';
import { priorities, statuses } from './lib/common';
import Search from './components/forms/Search';
import Header from './components/header/Header';
import KanbanView from './components/kanban/KanbanView';
import TableView from './components/TableView';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const [priorityFilter, setPriorityFilter] = useState(priorities[0]);
  const [statusFilter, setStatusFilter] = useState(statuses[0]);

  const {
    state: { tasks },
  } = useAppDataContext();

  const filteredTasks = tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priorityFilter.id
        ? task.priority === priorityFilter.id
        : true) &&
      (statusFilter.id ? task.status === statusFilter.id : true)
    );
  });

  return (
    <>
      <Header />

      {tasks.length === 0 ? (
        <Empty />
      ) : (
        <>
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <div className="mx-4 my-6">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                <Tab
                  className={({ selected }) =>
                    selected
                      ? 'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg bg-white shadow'
                      : 'w-full py-2.5 text-sm leading-5 font-medium text-blue-100 rounded-lg cursor-pointer'
                  }
                >
                  Table View
                </Tab>
                <Tab
                  className={({ selected }) =>
                    selected
                      ? 'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg bg-white shadow'
                      : 'w-full py-2.5 text-sm leading-5 font-medium text-blue-100 rounded-lg cursor-pointer'
                  }
                >
                  Kanban View
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel>
                  <TableView tasks={filteredTasks} />
                </Tab.Panel>
                <Tab.Panel>
                  <KanbanView tasks={filteredTasks} />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </>
      )}
    </>
  );
}

export default App;
