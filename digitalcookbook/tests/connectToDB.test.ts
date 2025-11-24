import mongoose from 'mongoose';
import { connectToDB } from '../lib/connectToDB';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({
    connection: { readyState: 1 }
  }),
  connection: {
    readyState: 1,
  },
}));

// Test suite for connectToDB helper
describe('connectToDB helper', () => {
  // Test to check if mongoose.connect is called
  test('calls mongoose.connect', async () => {
    await connectToDB();
    expect(mongoose.connect).toHaveBeenCalled();
  });

  // Test to check if the connection object is returned
  test('returns the connection object', async () => {
    const connection = await connectToDB();
    expect(connection).toBeDefined();
    expect(connection.connection.readyState).toBe(1); // simulate readyState check
  });
});
