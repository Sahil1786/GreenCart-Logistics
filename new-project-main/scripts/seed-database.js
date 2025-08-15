// Script to fetch CSV data and seed the database
import { parse } from "csv-parse/sync"

const CSV_URLS = {
  orders: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orders-geFEpYuijmqB37Bth1tGO53UIo337j.csv",
  drivers: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drivers-bTX8hxyb7R1dM37nrMDpRSrjJ9L0Vu.csv",
  routes: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/routes-yaDcY3yrSNWr69CSfUmtpCv6iFAmOe.csv",
}

async function fetchCSVData(url) {
  try {
    console.log(`Fetching data from: ${url}`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()
    console.log(`Received ${csvText.length} characters`)

    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    console.log(`Parsed ${records.length} records`)
    return records
  } catch (error) {
    console.error(`Error fetching CSV from ${url}:`, error)
    return []
  }
}

async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Fetch all CSV data
    const [ordersData, driversData, routesData] = await Promise.all([
      fetchCSVData(CSV_URLS.orders),
      fetchCSVData(CSV_URLS.drivers),
      fetchCSVData(CSV_URLS.routes),
    ])

    console.log("Fetched data:")
    console.log(`- Orders: ${ordersData.length} records`)
    console.log(`- Drivers: ${driversData.length} records`)
    console.log(`- Routes: ${routesData.length} records`)

    // Sample the data structure
    if (ordersData.length > 0) {
      console.log("Sample order:", ordersData[0])
    }
    if (driversData.length > 0) {
      console.log("Sample driver:", driversData[0])
    }
    if (routesData.length > 0) {
      console.log("Sample route:", routesData[0])
    }

    return {
      orders: ordersData,
      drivers: driversData,
      routes: routesData,
    }
  } catch (error) {
    console.error("Database seeding failed:", error)
    throw error
  }
}

// Export for use in API routes
export { seedDatabase, fetchCSVData }

// Run if called directly
if (typeof window === "undefined" && import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then((data) => {
      console.log("Seeding completed successfully")
      console.log("Data summary:", {
        orders: data.orders.length,
        drivers: data.drivers.length,
        routes: data.routes.length,
      })
    })
    .catch((error) => {
      console.error("Seeding failed:", error)
      process.exit(1)
    })
}
