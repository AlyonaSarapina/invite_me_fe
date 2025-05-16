// src/seeds/seedDatabase.ts
import { CUISINES } from '../enums/cuisinesEnum';
import { Restaurant } from '../db/entities/restaurant.entity';
import { User } from '../db/entities/user.entity';
import { UserRole } from '../enums/userRole.enum';
import AppDataSource from '../../data-source';
import { hash } from 'bcrypt';

async function seedDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Connected to the database.');
    const passwordHash = await hash('Password123!', 10);

    const userRepo = AppDataSource.getRepository(User);
    const restaurantRepo = AppDataSource.getRepository(Restaurant);

    const users = await userRepo.save([
      {
        name: 'Alice Johnson',
        email: 'alicejohnson@example.com',
        password: passwordHash,
        phone: '123456789',
        role: UserRole.OWNER,
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: passwordHash,
        phone: '987654321',
        role: UserRole.CLIENT,
      },
    ]);

    const restaurantsData = [
      {
        name: 'Sushi Paradise',
        description: 'A delightful sushi experience.',
        address: '123 Sushi St, Tokyo',
        email: 'sushi@example.com',
        operating_hours: {
          Monday: '10:00 - 22:00',
          Tuesday: '10:00 - 22:00',
          Wednesday: '10:00 - 22:00',
          Thursday: '10:00 - 22:00',
          Friday: '10:00 - 22:00',
          Saturday: '10:00 - 22:00',
          Sunday: '10:00 - 22:00',
        } as Record<string, string>,
        booking_duration: 60,
        tables_capacity: 20,
        cuisine: CUISINES[5],
        logo_url: 'https://greatwesternarcade.co.uk/wp-content/uploads/2021/01/sushi4.jpg',
        menu_url:
          'https://sushipassion.co.uk/wp-content/uploads/2019/12/Sushi_Passion_menu_wersja-cyfrowa_pojedyncze-strony2.pdf',
        phone: '123456789',
        inst_url: 'https://www.instagram.com/sushi_passion_birmingham',
        rating: 4.8,
        is_pet_friendly: true,
        owner: users[0],
      },
      {
        name: 'La Fiesta',
        description: 'A South American Grill Restaurant.',
        address: '235 Golders Green Rd London',
        email: 'fiesta@example.com',
        operating_hours: {
          Monday: '12:00 - 23:00',
          Tuesday: '12:00 - 23:00',
          Wednesday: '12:00 - 23:00',
          Thursday: '12:00 - 23:00',
          Friday: '12:00 - 23:00',
          Saturday: '12:00 - 23:00',
          Sunday: '12:00 - 23:00',
        } as Record<string, string>,
        booking_duration: 60,
        tables_capacity: 15,
        cuisine: CUISINES[3],
        logo_url: 'https://feedthelion.co.uk/wp-content/uploads/2013/11/20131030_224154.jpg',
        menu_url: 'https://lafiesta-uk.com/wp-content/uploads/2020/08/La-Fiesta-Main-Menu-august-2020-1.pdf',
        phone: '020 8458 0444',
        inst_url: 'https://www.instagram.com/lafiesta_uk/',
        rating: 4.5,
        is_pet_friendly: false,
        owner: users[0],
      },
    ];

    for (const restaurantData of restaurantsData) {
      const restaurant = restaurantRepo.create(restaurantData);
      await restaurantRepo.save(restaurant);
    }

    console.log('✅ Database seeding completed successfully.');
    await AppDataSource.destroy();
    console.log('✅ Database connection closed.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

if (require.main === module) {
  seedDatabase();
}
