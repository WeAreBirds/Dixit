export interface SetUserPasswordBySecretAnswerPayload {
    Username: string;
    SecretQuestionId: number;
    SecretAnswer: string;
    NewPassword: string;
}
