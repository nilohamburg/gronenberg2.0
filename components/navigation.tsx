import Link from "next/link"

const Navigation = () => {
  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Zimmer", href: "/rooms" },
    { name: "Mühle Restaurant", href: "/dining/muhle-restaurant" },
    { name: "Fitnessstudio", href: "/fitness" },
    { name: "Events", href: "/events" },
    { name: "Kontakt", href: "/contact" },
  ]

  return (
    <nav>
      <ul>
        {navigationItems.map((item) => (
          <li key={item.name}>
            <Link href={item.href}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation

