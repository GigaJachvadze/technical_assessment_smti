import Header from '@/ui/layout/header';
import KanbanBoard from '@/ui/components/kanban/kanban'

export default function Home() {
  return (
    <div className='flex flex-col overflow-x-auto'>
      <Header/>
      <KanbanBoard/>
    </div>
  );
}
