import { useEffect, useState } from "react";
import axiosI from "../../axiosInterceptor";
enum HealthState {
  ERROR = "Health check ne passe pas",
  OK = "Health check ok",
  ERROR_DB = "Heakth check ok mais problème de DB",
}
function HealthCheck() {
  const [healthCheckStatus, setHealthCheckStatus] = useState<HealthState>();
  useEffect(() => {
    healthCheck();
  }, []);
  const healthCheck = async () => {
    try {
      const healthCheckState = await axiosI.get(
        process.env.BACKEND_URL + "/health_check"
      );
      console.log(healthCheckState);
      setHealthCheckStatus(HealthState.OK);
    } catch (e:any) {
      console.log(e.status);
      if (e.status == 500) {
        setHealthCheckStatus(HealthState.ERROR_DB);
      } else {
        setHealthCheckStatus(HealthState.ERROR);
      }
    }
  };
  return <>{healthCheckStatus}</>;
}

export default HealthCheck;
