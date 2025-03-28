import { AdminHeader } from "@/components/admin/admin-header"
import { TableReservationsManagement } from "@/components/admin/table-reservations-management"

export default function AdminTableReservationsPage() {
  return (
    <div className="flex-1">
      <AdminHeader title="Table Reservations" />
      <main className="p-6">
        <TableReservationsManagement />
      </main>
    </div>
  )
}

