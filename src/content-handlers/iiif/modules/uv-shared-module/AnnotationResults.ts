import { AnnotationGroup } from "@iiif/manifold";
import { SearchHit } from "./SearchHit";

export class AnnotationResults {
  terms?: string;
  annotations: AnnotationGroup[];
  searchHits?: SearchHit[];
}
