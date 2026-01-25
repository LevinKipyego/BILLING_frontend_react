// ===================== users.ts =====================
import type { User, CreateUserPayload } from '../types/user';
import { apiFetch } from './client';


export function fetchUsers(): Promise<User[]> {
return apiFetch('/users/');
}


export function createUser(payload: CreateUserPayload): Promise<User> {
return apiFetch('/users/', {
method: 'POST',
body: JSON.stringify(payload),
});
}


export function updateUser(
id: number,
payload: Partial<CreateUserPayload>
): Promise<User> {
return apiFetch(`/users/${id}/`, {
method: 'PUT',
body: JSON.stringify(payload),
});
}


export function deleteUser(id: number): Promise<void> {
return apiFetch(`/users/${id}/`, {
method: 'DELETE',
});
}
export function createPPPoE(userId: number): Promise<void> {
return apiFetch(`/users/${userId}/create-pppoe/`, {
method: 'POST',
});
}