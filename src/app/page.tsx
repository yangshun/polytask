import { DataTable } from '~/components/data-table';
import { ThemeToggle } from '~/components/theme-toggle';
import { CommandPalette } from '~/components/command-palette';

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and view all users in your system
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CommandPalette />
          <ThemeToggle />
        </div>
      </div>
      <DataTable />
    </div>
  );
}
