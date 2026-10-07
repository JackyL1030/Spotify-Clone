import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Outlet } from 'react-router-dom';
import { AudioPlayer } from './components/AudioPlayer';
import { FriendsActivity } from './components/FriendsActivity';
import LeftSidebar from './components/LeftSidebar';

const MainLayout = () => {
  return (
    <div className="h-screen bg-black text-white">
      <ResizablePanelGroup orientation="horizontal" className="h-full p-2">
        <AudioPlayer />
        <ResizablePanel defaultSize="20%" minSize="10%" maxSize="30%">
          <div className="h-full">
            <LeftSidebar />
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-transparent rounded-lg transition-colors" />

        <ResizablePanel defaultSize="60%">
          <Outlet />
        </ResizablePanel>

        <ResizableHandle className="bg-transparent rounded-lg transition-colors" />

        <ResizablePanel
          defaultSize="20%"
          minSize="10%"
          maxSize="25%"
          collapsedSize={0}
        >
          <FriendsActivity />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MainLayout;
