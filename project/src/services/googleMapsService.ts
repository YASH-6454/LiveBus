declare global {
  interface Window {
    google: any;
  }
}

export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private isLoaded = false;

  public static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  async loadGoogleMaps(): Promise<void> {
    if (this.isLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCWJejcYj4bnYfjd6NSgO7pDcdmP5kxPDk`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };

      script.onerror = () => reject(new Error("Google Maps failed to load"));

      document.head.appendChild(script);
    });
  }

  async calculateETA(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
    await this.loadGoogleMaps();

    return new Promise((resolve, reject) => {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: new window.google.maps.LatLng(origin.lat, origin.lng),
          destination: new window.google.maps.LatLng(destination.lat, destination.lng),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result: any, status: string) => {
          if (status === "OK") {
            const leg = result.routes[0].legs[0];
            resolve({
              distance: leg.distance,
              duration: leg.duration,
              status: "success",
            });
          } else {
            reject(new Error("Failed to calculate ETA"));
          }
        }
      );
    });
  }
}
