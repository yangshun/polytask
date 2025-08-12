'use client';

import { RiCheckboxBlankCircleLine } from 'react-icons/ri';

export function TaskEmptyState() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <RiCheckboxBlankCircleLine className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>No issues yet</p>
      <p className="text-sm">Create your first issue to get started</p>
    </div>
  );
}
