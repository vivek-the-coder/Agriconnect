import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import ContactForm from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
