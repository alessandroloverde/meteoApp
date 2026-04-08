export function useLocation() {
   const getLocation = () =>
     new Promise((resolve, reject) => {
       navigator.geolocation.getCurrentPosition(
         (pos) => resolve(pos.coords),
         reject
       )
     })
 
   return { getLocation }
 }