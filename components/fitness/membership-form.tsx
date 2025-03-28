"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { createFitnessMembership } from "@/actions/fitness-memberships"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name muss mindestens 2 Zeichen lang sein" }),
  email: z.string().email({ message: "Ungültige E-Mail-Adresse" }),
  phone: z.string().min(6, { message: "Telefonnummer muss mindestens 6 Zeichen lang sein" }),
  address: z.string().min(5, { message: "Adresse muss mindestens 5 Zeichen lang sein" }),
  membership_type: z.enum(["bestseller", "student", "switch"], {
    required_error: "Bitte wählen Sie einen Mitgliedschaftstyp",
  }),
  membership_duration: z.enum(["24", "12", "1"], {
    required_error: "Bitte wählen Sie eine Laufzeit",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function MembershipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      membership_type: "bestseller",
      membership_duration: "24",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await createFitnessMembership({
        ...data,
        status: "pending",
      })

      setIsSuccess(true)
      form.reset()

      toast({
        title: "Mitgliedschaft beantragt!",
        description: "Wir haben Ihren Antrag erhalten und werden uns in Kürze bei Ihnen melden.",
      })
    } catch (error) {
      console.error("Error creating membership:", error)
      toast({
        title: "Fehler",
        description:
          "Beim Beantragen der Mitgliedschaft ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-primary mb-4">Vielen Dank!</h3>
        <p className="mb-4">
          Ihr Mitgliedschaftsantrag wurde erfolgreich übermittelt. Wir werden uns in Kürze mit Ihnen in Verbindung
          setzen, um die nächsten Schritte zu besprechen.
        </p>
        <Button onClick={() => setIsSuccess(false)}>Neue Mitgliedschaft beantragen</Button>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-primary mb-6">Mitglied werden</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ihr vollständiger Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input placeholder="ihre-email@beispiel.de" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="Ihre Telefonnummer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ihre vollständige Adresse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="membership_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mitgliedschaftstyp</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Typ auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bestseller">Bestseller</SelectItem>
                      <SelectItem value="student">Studenten, Schüler & Azubis</SelectItem>
                      <SelectItem value="switch">Wechselangebot</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="membership_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Laufzeit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Laufzeit auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="24">24 Monate</SelectItem>
                      <SelectItem value="12">12 Monate</SelectItem>
                      <SelectItem value="1">1 Monat</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Wird gesendet..." : "Mitgliedschaft beantragen"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

