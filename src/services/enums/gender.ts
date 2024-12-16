export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    
}

export const GenderLabel = {
    [Gender.FEMALE] : 'Nữ',
    [Gender.MALE] : 'Nam',
} as const;