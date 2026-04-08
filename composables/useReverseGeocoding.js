export async function reverseGeocode(lat, lon) {
   const res = await fetch(
     `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
   )
 
   const data = await res.json()
 
   return {
     city:
       data.address.city ||
       data.address.town ||
       data.address.village ||
       data.address.hamlet,
     country: data.address.country
   }
 }