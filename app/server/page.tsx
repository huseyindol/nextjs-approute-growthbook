import { cookies } from "next/headers";
import RevalidateMessage from "@/app/revalidate/RevalidateMessage";
import { GrowthBook } from "@growthbook/growthbook";
import { GrowthBookTracking } from "@/utils/GrowthBookTracking";
import { configureServerSideGrowthBook } from "@/utils/growthbookServer";
import { GB_UUID_COOKIE } from "@/app/middleware";

export default async function ServerDynamic() {
  const gb = new GrowthBook({
    apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
    clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
    decryptionKey: process.env.NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY,
  });
  await gb.init({ timeout: 1000 });
  await gb.setAttributes({
    id: (await cookies()).get(GB_UUID_COOKIE)?.value || "",
  });

  const featureWidget = gb.isOn("welcome-banner");
  const featureWidgetValue = gb.getFeatureValue("welcome-banner", "feature2");
  const featureWidget2 = gb.isOn("widget2");
  const featureWidget2Value = gb.getFeatureValue("widget2", "title");
  console.log('featureWidgetValue :>> ', featureWidgetValue);
  console.log('featureWidget2Value :>> ', featureWidget2Value);
  const trackingData = gb.getDeferredTrackingCalls();
  gb.destroy();
  return (
    <div className="container mx-auto">
      <h2>Dynamic Server Rendering</h2>
      <p>
        This page renders dynamically for every request. You can use feature
        flag targeting and run A/B experiments entirely server-side.
      </p>
      <p>
        featureWidget: {featureWidget ? "ON" : "OFF"}
      </p>
      <p>
        featureWidgetValue: {featureWidgetValue ? "ON" : "OFF"}
      </p>
      <p>
        featureWidget2: {featureWidget2 ? "ON" : "OFF"}
      </p>
      <p>
        featureWidget2Value: {Object.entries(featureWidget2Value || {}).map(([key, value]) => `${key}: ${value}`).join(", ")}
      </p>

      <RevalidateMessage />

      <GrowthBookTracking data={trackingData} />
    </div>
  );
}