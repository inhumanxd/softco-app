import { isValidObjectId } from "mongoose";

export function getValidInvalidObjectIDs(objectIDs: string[]) {
  const validObjectIDs: string[] = [];
  const invalidObjectIDs: string[] = [];
  for (const objectID of objectIDs) {
    if (objectID === "all" || isValidObjectId(objectID)) {
      validObjectIDs.push(objectID);
      continue;
    }

    invalidObjectIDs.push(objectID);
  }

  return { validObjectIDs, invalidObjectIDs };
}
