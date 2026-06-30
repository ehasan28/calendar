import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';

import { BottomBar, TabItem } from '@/components/bottom-tab-bar';

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <BottomBar>
          <TabTrigger name="calendar" href="/" asChild>
            <TabItem icon="calendar" label="Calendar" />
          </TabTrigger>
          <TabTrigger name="today" href="/today" asChild>
            <TabItem icon="today" label="Today" />
          </TabTrigger>
          <TabTrigger name="clock" href="/clock" asChild>
            <TabItem icon="time" label="Clock" />
          </TabTrigger>
          <TabTrigger name="tools" href="/tools" asChild>
            <TabItem icon="swap-horizontal" label="Tools" />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabItem icon="settings" label="Settings" />
          </TabTrigger>
        </BottomBar>
      </TabList>
    </Tabs>
  );
}
