const mongoose = require('mongoose');
const Route = require('./models/route');
const Bus = require('./models/bus');

const DBURL = "mongodb+srv://admin:admin@tedbus.vqk1yid.mongodb.net/?retryWrites=true&w=majority&appName=tedbus";

// Sample route data
const routeData = [
  {
    departureLocation: {
      name: "Delhi",
      subLocations: ["Connaught Place", "Chandni Chowk", "Lajpat Nagar"]
    },
    arrivalLocation: {
      name: "Jaipur",
      subLocations: ["Hawa Mahal", "Amer Fort", "Jantar Mantar"]
    },
    duration: 5
  },
  {
    departureLocation: {
      name: "Mumbai",
      subLocations: ["Gateway of India", "Marine Drive", "Bandra"]
    },
    arrivalLocation: {
      name: "Goa",
      subLocations: ["Calangute Beach", "Baga Beach", "Old Goa"]
    },
    duration: 10
  },
  {
    departureLocation: {
      name: "Kolkata",
      subLocations: ["Victoria Memorial", "Howrah Bridge", "Park Street"]
    },
    arrivalLocation: {
      name: "Darjeeling",
      subLocations: ["Tiger Hill", "Darjeeling Himalayan Railway", "Batasia Loop"]
    },
    duration: 8
  },
  {
    departureLocation: {
      name: "Bangalore",
      subLocations: ["MG Road", "Indiranagar", "Koramangala"]
    },
    arrivalLocation: {
      name: "Mysore",
      subLocations: ["Mysore Palace", "Chamundi Hill", "Brindavan Gardens"]
    },
    duration: 3
  },
  {
    departureLocation: {
      name: "Chennai",
      subLocations: ["Marina Beach", "Kapaleeshwarar Temple", "Elliots Beach"]
    },
    arrivalLocation: {
      name: "Pondicherry",
      subLocations: ["Auroville", "Paradise Beach", "French Colony"]
    },
    duration: 6
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(DBURL);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Route.deleteMany({});
    await Bus.deleteMany({});
    console.log('Cleared existing data');

    // Insert routes
    const insertedRoutes = await Route.insertMany(routeData);
    console.log('Routes inserted:', insertedRoutes.length);

    // Create bus data with route references
    const busData = [];
    
    // Delhi to Jaipur buses
    const delhiJaipurRoute = insertedRoutes.find(r => 
      r.departureLocation.name === 'Delhi' && r.arrivalLocation.name === 'Jaipur'
    );
    
    busData.push(
      {
        operatorName: "MetroBus",
        busType: "Standard",
        departureTime: "11",
        rating: [3.9, 3.8, 4.0],
        totalSeats: 40,
        routes: delhiJaipurRoute._id,
        images: "https://example.com/bus-image5.jpg",
        liveTracking: 0,
        reschedulable: 1
      },
      {
        operatorName: "TravelXpress",
        busType: "Sleeper",
        departureTime: "08",
        rating: [4, 4.5, 3.5],
        totalSeats: 40,
        routes: delhiJaipurRoute._id,
        images: "https://example.com/bus-image1.jpg",
        liveTracking: 1,
        reschedulable: 0
      }
    );

    // Mumbai to Goa buses
    const mumbaiGoaRoute = insertedRoutes.find(r => 
      r.departureLocation.name === 'Mumbai' && r.arrivalLocation.name === 'Goa'
    );
    
    busData.push(
      {
        operatorName: "FastTransit",
        busType: "A/C Seater",
        departureTime: "10",
        rating: [4.5, 4.0, 4.2],
        totalSeats: 30,
        routes: mumbaiGoaRoute._id,
        images: "https://example.com/bus-image2.jpg",
        liveTracking: 1,
        reschedulable: 1
      },
      {
        operatorName: "CityLink",
        busType: "Sleeper",
        departureTime: "12",
        rating: [4.2, 4.3, 4.1],
        totalSeats: 40,
        routes: mumbaiGoaRoute._id,
        images: "https://example.com/bus-image3.jpg",
        liveTracking: 1,
        reschedulable: 0
      }
    );

    // Bangalore to Mysore buses
    const bangaloreMysoreRoute = insertedRoutes.find(r => 
      r.departureLocation.name === 'Bangalore' && r.arrivalLocation.name === 'Mysore'
    );
    
    busData.push(
      {
        operatorName: "SwiftTrans",
        busType: "A/C Seater",
        departureTime: "09",
        rating: [4.8, 4.9, 4.7],
        totalSeats: 20,
        routes: bangaloreMysoreRoute._id,
        images: "https://example.com/bus-image4.jpg",
        liveTracking: 1,
        reschedulable: 1
      },
      {
        operatorName: "ExpressLine",
        busType: "AC Seater",
        departureTime: "02",
        rating: [4.4, 4.2, 4.5],
        totalSeats: 35,
        routes: bangaloreMysoreRoute._id,
        images: "https://example.com/bus-image6.jpg",
        liveTracking: 1,
        reschedulable: 0
      }
    );

    // Kolkata to Darjeeling buses
    const kolkataDarjeelingRoute = insertedRoutes.find(r => 
      r.departureLocation.name === 'Kolkata' && r.arrivalLocation.name === 'Darjeeling'
    );
    
    busData.push(
      {
        operatorName: "TransitHub",
        busType: "standard",
        departureTime: "03",
        rating: [4.6, 4.7, 4.8],
        totalSeats: 25,
        routes: kolkataDarjeelingRoute._id,
        images: "https://example.com/bus-image7.jpg",
        liveTracking: 0,
        reschedulable: 1
      },
      {
        operatorName: "EliteTravels",
        busType: "Sleeper",
        departureTime: "06",
        rating: [4.3, 4.4, 4.2],
        totalSeats: 40,
        routes: kolkataDarjeelingRoute._id,
        images: "https://example.com/bus-image8.jpg",
        liveTracking: 1,
        reschedulable: 0
      }
    );

    // Chennai to Pondicherry buses
    const chennaiPondicherryRoute = insertedRoutes.find(r => 
      r.departureLocation.name === 'Chennai' && r.arrivalLocation.name === 'Pondicherry'
    );
    
    busData.push(
      {
        operatorName: "TravelMax",
        busType: "AC Sleeper",
        departureTime: "08",
        rating: [4.5, 4.6, 4.7],
        totalSeats: 30,
        routes: chennaiPondicherryRoute._id,
        images: "https://example.com/bus-image9.jpg",
        liveTracking: 1,
        reschedulable: 1
      },
      {
        operatorName: "SunriseTransit",
        busType: "standard",
        departureTime: "05",
        rating: [4.7, 4.8, 4.6],
        totalSeats: 20,
        routes: chennaiPondicherryRoute._id,
        images: "https://example.com/bus-image10.jpg",
        liveTracking: 0,
        reschedulable: 0
      }
    );

    // Insert buses
    const insertedBuses = await Bus.insertMany(busData);
    console.log('Buses inserted:', insertedBuses.length);

    console.log('Database seeded successfully!');
    console.log('Routes:', insertedRoutes.length);
    console.log('Buses:', insertedBuses.length);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase();