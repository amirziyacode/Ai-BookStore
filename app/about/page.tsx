import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">About Modern Bookstore</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          Connecting readers with great books since 2010
        </p>
      </div>

      {/* Our Story Section */}
      <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="mb-4 text-3xl font-bold">Our Story</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Modern Bookstore was founded with a simple mission: to create a space where book lovers could discover new
            worlds, ideas, and perspectives through the power of reading.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            What started as a small corner shop with a carefully curated collection has grown into a beloved community
            hub for readers of all ages and interests. Despite our growth, we've maintained our commitment to
            personalized service and our passion for connecting the right book with the right reader.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Today, Modern Bookstore offers an extensive collection of titles across all genres, from bestselling fiction
            to rare collectibles, educational resources to indie publications. We're proud to be a space where stories
            are shared, ideas are exchanged, and the love of reading is celebrated.
          </p>
        </div>
        <div className="relative h-[400px] overflow-hidden rounded-lg">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Our bookstore interior"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="mb-16 bg-slate-100 p-8 dark:bg-slate-800">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
          <p className="mb-6 text-xl text-gray-700 dark:text-gray-300">
            "To inspire, educate, and entertain through the transformative power of books, creating a community where
            diverse voices are celebrated and the joy of reading is accessible to all."
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md dark:bg-slate-700 md:w-1/3">
              <h3 className="mb-2 text-xl font-semibold">Curate</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Thoughtfully select books that inspire, challenge, and delight readers of all backgrounds.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md dark:bg-slate-700 md:w-1/3">
              <h3 className="mb-2 text-xl font-semibold">Connect</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Build meaningful relationships between authors, books, and readers through events and recommendations.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md dark:bg-slate-700 md:w-1/3">
              <h3 className="mb-2 text-xl font-semibold">Community</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Foster an inclusive space where diverse perspectives are valued and literary culture thrives.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Meet Our Team</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Sarah Johnson",
              role: "Founder & CEO",
              bio: "Book lover with 15+ years in publishing who founded Modern Bookstore to share her passion for literature.",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "David Chen",
              role: "Head of Curation",
              bio: "Former literature professor with a keen eye for emerging authors and underrepresented voices.",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Maya Patel",
              role: "Community Manager",
              bio: "Organizes our events, book clubs, and outreach programs with boundless enthusiasm.",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "James Wilson",
              role: "Tech Lead",
              bio: "Ensures our online experience matches the warmth and discovery of our physical store.",
              image: "/placeholder.svg?height=300&width=300",
            },
          ].map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
              <p className="mb-2 text-sm text-gray-500">{member.role}</p>
              <p className="text-gray-700 dark:text-gray-300">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-lg bg-slate-900 p-8 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">Join Our Community</h2>
        <p className="mb-6 text-lg">
          Visit our store, attend an event, or shop online to become part of the Modern Bookstore family.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
              Contact Us
            </Button>
          </Link>
          <Link href="/bookstore">
            <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
              Browse Books
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

