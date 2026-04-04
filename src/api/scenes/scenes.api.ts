import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Scene, ScenePlacement, InteractionPoint, TeleportPoint } from '../../types/scene.types';

// Chunk array helper for Firestore 'in' queries
const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const getSceneById = async (sceneId: string): Promise<Scene | null> => {
  const docRef = doc(db, 'scenes', sceneId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  return { sceneId: snapshot.id, ...snapshot.data() } as Scene;
};

export const getScenePlacements = async (sceneId: string): Promise<ScenePlacement[]> => {
  const placementsRef = collection(db, 'scene_placements');
  const q = query(placementsRef, where('sceneId', '==', sceneId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    placementId: doc.id,
    ...doc.data()
  }) as ScenePlacement);
};

export const getTeleportPoints = async (sceneId: string): Promise<TeleportPoint[]> => {
  const teleportsRef = collection(db, 'teleport_points');
  const q = query(teleportsRef, where('sceneId', '==', sceneId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    teleportId: doc.id,
    ...doc.data()
  }) as TeleportPoint);
};

export const getInteractionPointsByPlacements = async (placementIds: string[]): Promise<InteractionPoint[]> => {
  if (!placementIds.length) return [];
  
  const interactionPointsRef = collection(db, 'interaction_points');
  const chunks = chunkArray(placementIds, 10);
  
  const queries = chunks.map(chunk => 
    getDocs(query(interactionPointsRef, where('placementId', 'in', chunk)))
  );
  
  const snapshots = await Promise.all(queries);
  return snapshots.flatMap(snapshot => 
    snapshot.docs.map(doc => ({
      pointId: doc.id,
      ...doc.data()
    }) as InteractionPoint)
  );
};
