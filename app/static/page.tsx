import { configureServerSideGrowthBook } from "@/utils/growthbookServer";
import { GrowthBook } from "@growthbook/growthbook";
import RevalidateMessage from "../revalidate/RevalidateMessage";

export default async function ServerStatic() {
  // Helper to configure cache for next.js
  configureServerSideGrowthBook();

  // Create and initialize a GrowthBook instance
  const gb = new GrowthBook({
    apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
    clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
    decryptionKey: process.env.NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY,
  });
  await gb.init({ timeout: 1000 });

  // By not using cookies or headers, this page can be statically rendered
  // Note: This means you can't target individual users or run experiments

  // Evaluate any feature flags
  const feature1Enabled = gb.isOn("welcome-banner");
  const feature2Value = gb.getFeatureValue("welcome-banner", "widget2");

  // Cleanup your GrowthBook instance
  gb.destroy();

  return (
    <div>
      <h2>Static Pages</h2>
      <p>
        This page is fully statically rendered at build time. As a consequence,
        targeting rules and experiments will not work since they depend on
        user-specific attributes.
      </p>
      <ul>
        <li>
          feature1: <strong>{feature1Enabled ? "ON" : "OFF"}</strong>
        </li>
        <li>
          feature2: <strong>{feature2Value}</strong>
        </li>
      </ul>

      <RevalidateMessage />
    </div>
  );
}