import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { TableReservationForm } from "@/components/table-reservation-form"

export default function TableReservationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <PageHeader
          title="Reserve a Table"
          description="Book your dining experience at Mühle Restaurant"
          image="/placeholder.svg?height=600&width=1200&text=Restaurant+Reservation"
        />
        <section className="container mx-auto px-4 py-12">
          <TableReservationForm />
        </section>
      </main>
      <Footer />
    </>
  )
}

