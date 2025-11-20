import { CriteriaTypeDTO } from "./criteriaType.model";

export interface CriteriaDTO {
    criteriaId: number;
    criteriaName?: string;
    criteriaDetail?: string;
    maxScore?: number;
    criteriaTypeEntity?:CriteriaTypeDTO
}