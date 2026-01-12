import Header from '@/ui/layout/header';
import KanbanBoard from '@/ui/components/kanban/kanban'

export default function Home() {
  return (
    <div className='flex flex-col p-2 overflow-auto h-screen'>
      <Header/>
      <KanbanBoard/>
    </div>
  );
}
