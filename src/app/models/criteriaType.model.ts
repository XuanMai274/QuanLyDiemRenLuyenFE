import { CriteriaDTO } from "./criteria.model";

export interface CriteriaTypeDTO {
    criteriaTypeId: number;
    criteriaTypeName?: string;
    maxScore?: number;
    criteriaEntityList: CriteriaDTO[]
}