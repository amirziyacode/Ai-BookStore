"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold">About Modern Bookstore</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          Connecting readers with great books since 2010
        </p>
      </motion.div>

      {/* Our Story Section */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="mb-16 grid gap-8 md:grid-cols-2 md:items-center"
      >
        <motion.div variants={fadeInUp}>
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
        </motion.div>
        <motion.div 
          variants={fadeInUp}
          className="relative h-[400px] overflow-hidden rounded-lg"
        >
          <Image
            src="/about.png"
            alt="Our bookstore interior"
            fill
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Our Mission Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 bg-slate-100 p-8 dark:bg-slate-800"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold"
          >
            Our Mission
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-xl text-gray-700 dark:text-gray-300"
          >
            "To inspire, educate, and entertain through the transformative power of books, creating a community where
            diverse voices are celebrated and the joy of reading is accessible to all."
          </motion.p>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              {
                title: "Curate",
                description: "Thoughtfully select books that inspire, challenge, and delight readers of all backgrounds."
              },
              {
                title: "Connect",
                description: "Build meaningful relationships between authors, books, and readers through events and recommendations."
              },
              {
                title: "Community",
                description: "Foster an inclusive space where diverse perspectives are valued and literary culture thrives."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md dark:bg-slate-700 md:w-1/3"
              >
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-center text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-3xl font-bold"
        >
          Meet Our Team
        </motion.h2>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              name: "Amir Ali Ziyzadeh",
              role: "Backend Developer",
              bio: "Java developer with SpringBoot to build WebApp",
              image: "/profile.jpg",
            },
          ].map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="mb-4 h-40 w-40 overflow-hidden rounded-full"
              >
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
              <p className="mb-2 text-sm text-gray-500">{member.role}</p>
              <p className="text-gray-700 dark:text-gray-300">{member.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-lg bg-slate-900 p-8 text-center text-white"
      >
        <h2 className="mb-4 text-3xl font-bold">Join Our Community</h2>
        <p className="mb-6 text-lg">
          Visit our store, attend an event, or shop online to become part of the Modern Bookstore family.
        </p>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.div variants={cardVariants}>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                Contact Us
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Link href="/bookstore">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                Browse Books
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

