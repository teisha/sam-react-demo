/* eslint-disable camelcase */
import { number, object, string, date, TypeOf, nativeEnum } from "zod";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  DEACTIVATED = "DEACTIVATED",
}

export const UserSchema = object({
  username: string({
    required_error: "Username is required",
  }),
  status: nativeEnum(UserStatus, {
    required_error: "Status is required",
  }),
  firstname: string({
    required_error: "First Name is required",
  }).nonempty(),
  lastname: string({
    required_error: "Last Name is required",
  }).nonempty(),
  email: string({
    required_error: "Email is required",
  })
    .email({ message: "Invalid email address" })
    .min(8),
  dateCreated: date(),
});

export type UserType = TypeOf<typeof UserSchema>;
