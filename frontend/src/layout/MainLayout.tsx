import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Outlet } from 'react-router-dom';
import { AudioPlayer } from './components/AudioPlayer';
import { FriendsActivity } from './components/FriendsActivity';
import LeftSidebar from './components/LeftSidebar';
import PlaybackControls from './components/PlaybackControls';

const MainLayout = () => {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup orientation="horizontal" className="flex-1 p-2">
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

      <PlaybackControls />
    </div>
  );
};

export default MainLayout;
