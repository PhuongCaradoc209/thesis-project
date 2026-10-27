import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Artifact } from '../../types/scene.types';

export const getArtifactById = async (artifactId: string): Promise<Artifact | null> => {
  const docRef = doc(db, 'artifacts', artifactId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return { artifactId: snapshot.id, ...snapshot.data() } as Artifact;
};

// Lấy mọi hiện vật được trưng trong một phòng (document có sceneId trùng)
export const getArtifactsByScene = async (sceneId: string): Promise<Artifact[]> => {
  const q = query(collection(db, 'artifacts'), where('sceneId', '==', sceneId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((artifactDoc) => ({ artifactId: artifactDoc.id, ...artifactDoc.data() }) as Artifact);
};
