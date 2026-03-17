import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
      <Stack.Screen name="location-search" options={{ presentation: 'modal' }} />
      <Stack.Screen name="fare-estimate" />
      <Stack.Screen name="confirm-booking" />
      <Stack.Screen name="searching-driver" />
      <Stack.Screen name="live-tracking" />
      <Stack.Screen name="trip-complete" />
    </Stack>

  );
}
