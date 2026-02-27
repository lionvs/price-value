import usersData from "@/data/users.json";
import { User } from "@/types";

export function getAllUsers(): User[] {
  return usersData as User[];
}

export function getUserById(id: string): User | undefined {
  return (usersData as User[]).find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return (usersData as User[]).find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}
