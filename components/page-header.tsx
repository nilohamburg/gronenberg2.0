interface PageHeaderProps {
  title: string
  description?: string
  image?: string
}

export function PageHeader({ title, description, image = "/placeholder.svg?height=600&width=1920" }: PageHeaderProps) {
  return (
    <div className="relative">
      <div className="h-[30vh] sm:h-[40vh] md:h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 pt-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair text-center mb-2 sm:mb-4">{title}</h1>
        {description && <p className="text-base sm:text-lg md:text-xl text-center max-w-3xl">{description}</p>}
      </div>
    </div>
  )
}

