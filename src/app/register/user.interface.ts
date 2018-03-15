export interface User {
    username: string; // required, no blank space, only alphabets and number, 5-10 characters
    id: string; // required, no blank space, only alphabets and number, 5    characters
    age: number; // required, number, less than 2 characters
    password: string; // required, value must be equal to confirm password.
    confirmPassword: string; // required, value must be equal to password.
}