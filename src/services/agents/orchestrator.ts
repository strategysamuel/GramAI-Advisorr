import { generateUnifiedPlan } from "../unifiedAgent";
import { generateReport } from "./documentAgent";
import { FarmerProfile, LandDetails, Preferences, FarmingPlan } from "../../types";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../../lib/firestoreUtils";

async function generateLocalPlan(
  profile: FarmerProfile,
  land: LandDetails,
  preferences: Preferences
): Promise<FarmingPlan> {
  console.log("Orchestrator: Starting unified plan generation...");

  // 1. Single AI Call
  const plan = await generateUnifiedPlan(profile, land, preferences);
  plan.farmer_uid = auth.currentUser?.uid || "anonymous";
  console.log("Orchestrator: Unified plan generated", plan);

  // 2. Generate Report
  const reportUrl = await generateReport(plan, profile);
  plan.report_url = reportUrl;

  // 3. Store in Firestore
  if (auth.currentUser) {
    const path = "plans";
    try {
      const { id, ...planData } = plan;
      const firestoreData = JSON.parse(JSON.stringify(planData));
      const finalData = {
        ...firestoreData,
        created_at: serverTimestamp(),
      };
      
      console.log("Orchestrator: Writing to Firestore at path:", path);
      await addDoc(collection(db, path), finalData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  return plan;
}

export async function generateFullPlan(
  profile: FarmerProfile,
  land: LandDetails,
  preferences: Preferences
): Promise<FarmingPlan> {
  // We prioritize the unified local plan for reliability and minimal API usage
  try {
    return await generateLocalPlan(profile, land, preferences);
  } catch (e) {
    console.error("Plan generation failed:", e);
    throw e;
  }
}
