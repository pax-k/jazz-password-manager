import { Account, CoList, CoMap } from "jazz-tools";

export interface PasswordItem extends CoMap {
  _id: string;
  name: string;
  username?: string;
  username_input_selector?: string;
  password: string;
  password_input_selector?: string;
  uri?: string;
  folder: string;
  deleted: boolean;
}

export interface Folder extends CoMap {
  _id: string;
  name: string;
  items: PasswordItem[];
}

export interface PasswordManagerRootAccount extends CoMap {
  folders: Folder[];
}

export type PasswordList = CoList<PasswordItem>;
export type FolderList = CoList<Folder>;
