export interface IRole {
  name: string;
  hasAccessTo: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
