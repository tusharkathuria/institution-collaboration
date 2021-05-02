export default {
  type: "object",
  properties: {
    visitor_name: { type: 'string' },
    phone_number: { type: 'string' },
    vehicle_number: { type: 'string' },
    purpose: { type: 'string' }
  }
} as const;
