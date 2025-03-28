"use client"

import { createContext, useContext, type ReactNode } from "react"

interface LanguageContextType {
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// German translations only
const translations = {
  // Navbar
  home: "Startseite",
  rooms: "Ferienhäuser",
  dining: "Restaurant",
  spa: "Wellness",
  meetings: "Tagungen & Events",
  about: "Über uns",
  contact: "Kontakt",
  signIn: "ANMELDEN",
  bookNow: "JETZT BUCHEN",

  // Hero
  heroTitle: "Urlaub an der Ostsee mit historischem Charme",
  heroSubtitle:
    "Erleben Sie die perfekte Mischung aus traditioneller Eleganz und zeitgemäßem Komfort in der Gronenberger Mühle",
  checkAvailability: "VERFÜGBARKEIT PRÜFEN",
  guests: "Gäste",
  person: "Person",
  persons: "Personen",
  checkIn: "Anreise",
  checkOut: "Abreise",
  selectCheckIn: "Wählen Sie das Anreisedatum",
  selectCheckOut: "Wählen Sie das Abreisedatum",

  // Rooms
  roomsTitle: "Ferienhäuser",
  roomsDescription:
    "Freuen Sie sich auf neu errichtete, modernste Ferienhäuser in einer märchenhaften Naturidylle, die schon jetzt für Sie buchbar ist. Herzstück des wundervoll ruhig gelegenen Hains ist die denkmalgeschützte Gronenberger Wassermühle aus dem 17. Jahrhundert, die in liebevoller Kleinarbeit saniert wurde.",
  discoverMore: "MEHR ENTDECKEN",

  // Dining
  diningTitle: "Restaurant",
  diningDescription:
    "In unserer historischen Wassermühle verbinden sich Tradition und Genuss: umgeben von altem Gemäuer und rustikalen Holzbalken können Sie unserem Küchenchef Konstantin direkt bei der Zubereitung unserer saisonalen Köstlichkeiten zusehen.",
  showAll: "ALLE ANZEIGEN",
  culinaryExcellence: "Kulinarische Exzellenz",
  viewDetails: "Details anzeigen",
  viewMenu: "Speisekarte ansehen",
  reserveTable: "Tisch reservieren",
  restaurantHours: "Öffnungszeiten",
  muhleRestaurant: "Mühlen Restaurant",
  theLounge: "Die Lounge",
  gardenTerrace: "Gartenterrasse",
  wineCellar: "Weinkeller",
  daily: "Täglich",
  wineTastings: "Weinverkostungen",
  byReservationOnly: "Nur mit Reservierung",
  summerSeason: "Sommersaison",

  // Restaurant Page
  menuHighlights: "Menü-Highlights",
  fullMenu: "Vollständige Speisekarte",
  openingHours: "Öffnungszeiten",
  monday: "Montag",
  tuesday: "Dienstag",
  wednesday: "Mittwoch",
  thursday: "Donnerstag",
  friday: "Freitag",
  saturday: "Samstag",
  sunday: "Sonntag",
  closed: "Geschlossen",
  breakfast: "Frühstück",
  lunch: "Mittagessen",
  dinner: "Abendessen",
  makeReservation: "Reservierung vornehmen",
  tableReservation: "Tischreservierung",
  yourName: "Ihr Name",
  contactInfo: "Kontaktinformation (E-Mail oder Telefon)",
  reservationDate: "Reservierungsdatum",
  reservationTime: "Reservierungszeit",
  numberOfGuests: "Anzahl der Gäste",
  specialRequests: "Besondere Wünsche (Optional)",
  submitReservation: "Reservierung absenden",
  reservationSuccess: "Ihre Reservierung wurde erfolgreich übermittelt!",
  reservationError:
    "Bei der Übermittlung Ihrer Reservierung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",

  // Spa
  spaTitle: "Wellness & Massage",
  spaDescription:
    "Das Spa ist der Ort, um sich nach einem Tag voller Outdoor-Abenteuer verwöhnen zu lassen. Für das ultimative Spa-Erlebnis tauchen Sie ein in ultimativen Luxus und Ruhe im Spa. Auf 1.200 qm bietet unser Wellnesscenter verschiedene Saunen, einen beheizten Innenpool, einen Garten und ein hochmodernes Fitnessstudio.",
  readMore: "WEITERLESEN",
  havenOfRelaxation: "Eine Oase der Entspannung",
  spaFacilities: "Spa-Einrichtungen",
  spaPackages: "Spa-Pakete",
  spaTreatments: "Spa-Behandlungen",
  bookTreatment: "Behandlung buchen",
  indoorHeatedPool: "Beheizter Innenpool",
  saunaLandscape: "Saunalandschaft",
  relaxationAreas: "Ruhebereiche",
  fitnessCenter: "Fitnesscenter",
  signatureMassage: "Signature Massage",
  alpineHerbalWrap: "Alpine Kräuterpackung",
  facialRenewal: "Gesichtserneuerung",
  couplesRetreat: "Paarbehandlung",
  duration: "Dauer",
  price: "Preis",
  relaxationJourney: "Entspannungsreise",
  completeWellness: "Komplettes Wellness",
  couplesEscape: "Paarauszeit",
  mostPopular: "Am beliebtesten",
  perPerson: "pro Person",
  perCouple: "pro Paar",
  hours: "Stunden",
  bookNowButton: "Jetzt buchen",

  // Meetings
  meetingsTitle: "Tagungen & Events",
  meetingsDescription:
    "Die Gronenberger Mühle ist nicht nur ein Ort der Erholung, sondern auch eine exklusive Location für unvergessliche Events. Ob Hochzeiten, Familienfeiern oder Firmenevents – in unserer Hofküche, im Weinkeller oder im stilvollen Seminarraum sowie auf dem gesamten Anwesen bieten wir Ihnen den perfekten Rahmen für ihre besonderen Anlässe. Feiern Sie in historischem Ambiente und lassen sich und ihre Gäste verzaubern!",
  exceptionalVenues: "Außergewöhnliche Veranstaltungsorte für jeden Anlass",
  eventVenues: "Veranstaltungsorte",
  corporateEvents: "Firmenveranstaltungen",
  weddingsCelebrations: "Hochzeiten & Feiern",
  planYourEvent: "Planen Sie Ihre Veranstaltung",
  requestProposal: "Angebot anfordern",
  downloadBrochure: "Broschüre herunterladen",
  contactEventTeam: "Eventteam kontaktieren",
  requestCallback: "Rückruf anfordern",
  capacity: "Kapazität",
  size: "Größe",
  grandBallroom: "Großer Ballsaal",
  gardenPavilion: "Gartenpavillon",
  executiveBoardroom: "Executive Boardroom",
  viewDetails: "Details anzeigen",

  // About
  aboutTitle: "Gronenberger Mühle",
  aboutDescription:
    "Dein exklusives Wohlfühlresort mit wunderschönen Ferienhäusern nahe der Ostsee, eingebettet in die atemberaubende Natur der Pönitzer Seenplatte.",
  hotelDetails: "HOTELDETAILS",
  ourStory: "Unsere Geschichte",
  ourHistory: "Unsere Historie",
  ourValues: "Unsere Werte",
  ourTeam: "Unser Team",
  foundation: "Gründung",
  transformation: "Umgestaltung",
  expansion: "Erweiterung",
  renovation: "Renovierung",
  modernEra: "Moderne Ära",
  hospitality: "Gastfreundschaft",
  excellence: "Exzellenz",
  sustainability: "Nachhaltigkeit",

  // Contact
  contactTitle: "Kontakt",
  contactDescription: "Wir sind für Sie da bei allen Anfragen",
  getInTouch: "Kontaktieren Sie uns",
  address: "Adresse",
  phone: "Telefon",
  email: "E-Mail",
  receptionHours: "Rezeptionszeiten",
  directions: "Anfahrt",
  viewOnMap: "Auf Karte anzeigen",
  sendMessage: "Senden Sie uns eine Nachricht",
  firstName: "Vorname",
  lastName: "Nachname",
  phoneOptional: "Telefon (optional)",
  subject: "Betreff",
  message: "Nachricht",
  sendMessageButton: "Nachricht senden",
  reservationInquiry: "Reservierungsanfrage",
  generalInformation: "Allgemeine Informationen",
  feedback: "Feedback",
  specialRequest: "Besondere Anfrage",
  other: "Sonstiges",

  // Footer
  aboutUs: "Über uns",
  services: "Dienstleistungen",
  newsletter: "Newsletter",
  emailPlaceholder: "Ihre E-Mail",
  subscribe: "Abonnieren",
  allRightsReserved: "Alle Rechte vorbehalten.",

  // Calendar and Booking
  selectDates: "Daten auswählen",
  selectDatesAlert: "Bitte wählen Sie An- und Abreisedaten",
  selectCheckInOut: "Wählen Sie An- und Abreisedaten",
  clickForCheckIn: "Einmal klicken für Anreise, zweimal für Abreise",
  resetToToday: "Auf heute zurücksetzen",
  apply: "Anwenden",
  availableRooms: "Verfügbare Zimmer",
  noRoomsAvailable: "Keine Zimmer für die ausgewählten Daten verfügbar",
  dateFilter: "Datumsfilter",
  clearFilter: "Filter löschen",

  // Super Menu
  explore: "Entdecken",
  featured: "Empfohlen",
  specialOffers: "Spezialangebote",
  viewAll: "Alle anzeigen",
  allOffers: "Alle Angebote",
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Translation function - now just returns the German translation
  const t = (key: string): string => {
    return translations[key as keyof typeof translations] || key
  }

  return <LanguageContext.Provider value={{ t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

