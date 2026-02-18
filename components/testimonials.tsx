import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "AgriConnect helped me connect directly with exporters in Europe. My income increased by 40% in just 6 months!",
    author: "Rajesh Kumar",
    role: "Wheat Farmer, Punjab",
  },
  {
    quote: "The government schemes section is incredibly helpful. I found subsidies I never knew existed.",
    author: "Priya Sharma",
    role: "Organic Farmer, Maharashtra",
  },
  {
    quote: "As an exporter, AgriConnect gives me direct access to quality produce from verified farmers.",
    author: "Ahmed Hassan",
    role: "Agricultural Exporter, Delhi",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Community Voices</h2>
          <p className="text-xl text-muted-foreground">
            Hear from farmers and exporters who are already benefiting from AgriConnect
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <blockquote className="text-muted-foreground leading-relaxed mb-6">"{testimonial.quote}"</blockquote>
                <div className="space-y-1">
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
